import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Image } from '@prisma/client';
import prisma from '../../prisma/client';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, envVars } from '../../aws/s3';

type Data = {
	message: string;
};

export interface ModdedImage extends Image {
	url: string;
}

interface ImageResponse {}

export const config = {
	api: { bodyParser: false },
};

interface ModifiedApiRequest extends NextApiRequest {
	file: {
		fieldname: string;
		originalname: string;
		encoding: string;
		mimetype: string;
		buffer: Buffer;
		size: number;
	};
}

export default async function handler(
	req: ModifiedApiRequest | any,
	res: NextApiResponse<Data | ImageResponse> | any
) {
	switch (req.method) {
		case 'POST':
			await new Promise((resolve) => {
				const storage = multer.memoryStorage();
				const upload = multer({ storage: storage });
				const parsedBody = upload.single('image');

				parsedBody(req, res, resolve);
			});

			const dbEntry = await prisma.image.create({
				data: { caption: req.body.caption },
			});

			const buffer = await sharp(req.file.buffer)
				.resize({
					height: 500,
					width: 500,
					fit: 'cover',
				})
				.toBuffer();

			const params = {
				Bucket: envVars.bucketName,
				Key: dbEntry.id,
				Body: buffer,
				ContentType: req.file.mimetype,
			};

			const command = new PutObjectCommand(params);

			const newImage = await s3.send(command);

			res.status(201).send({ data: newImage });
			break;
		case 'GET':
			const images = (await prisma.image.findMany()) as ModdedImage[];

			for (const image of images) {
				const getObjectParams = {
					Bucket: envVars.bucketName,
					Key: image.id,
				};

				const command = new GetObjectCommand(getObjectParams);
				const url = await getSignedUrl(s3, command, {
					expiresIn: 3600,
				});
				image.url = url;
			}

			res.status(200).send(images);
	}
}
