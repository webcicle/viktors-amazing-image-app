import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Image } from '@prisma/client';
import prisma from '../../prisma/client';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getSignedCloudFrontUrl } from '@aws-sdk/cloudfront-signer';
import { s3, envVars } from '../../aws/s3';
import fs from 'fs';
import path from 'path';

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
		case 'POST': {
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
					fit: req.body.fit,
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
		}
		case 'GET':
			// GET ALL IMAGES FLOW
			// GET ALL IMAGES FLOW
			// GET ALL IMAGES FLOW
			// const images = (await prisma.image.findMany()) as ModdedImage[];

			// for (const image of images) {
			// 	const getObjectParams = {
			// 		Bucket: envVars.bucketName,
			// 		Key: image.id,
			// 	};

			// 	const command = new GetObjectCommand(getObjectParams);
			// 	const url = await getSignedUrl(s3, command, {
			// 		expiresIn: 3600,
			// 	});
			// 	image.url = url;
			// }

			// res.status(200).send(images);

			// GET ALL IMAGES FLOW
			// GET ALL IMAGES FLOW
			// GET ALL IMAGES FLOW

			const newImage = (await prisma.image.findFirstOrThrow({
				orderBy: { created: 'desc' },
			})) as ModdedImage;

			const getFileInfo = (filePath: string) => {
				let pemKey: string = '';
				return new Promise((resolve, reject) => {
					const reader = fs.createReadStream(filePath);
					reader.on('error', (error) => {
						reject('There was an error');
					});
					reader.on('data', (chunk) => {
						pemKey = chunk.toString();
						resolve(pemKey);
					});
				});
			};

			const pemKey = await getFileInfo('private_key.pem');

			const cfUrl = `https://d2d5ackrn9fpvj.cloudfront.net/${newImage.id}`;

			const url = getSignedCloudFrontUrl({
				url: cfUrl,
				dateLessThan: '2022-12-31',
				privateKey:
					process.env.NODE_ENV === 'production'
						? process.env.PUBLIC_CLOUDFRONT_PRIVATE_KEY!
						: (pemKey as string),
				keyPairId: process.env.PUBLIC_CLOUDFRONT_KEY_PAIR_ID!,
			});

			// GET STRAIGHT FROM S3
			// GET STRAIGHT FROM S3
			// GET STRAIGHT FROM S3

			// const getObjectParams = {
			// 	Bucket: envVars.bucketName,
			// 	Key: newImage.id,
			// };

			// const command = new GetObjectCommand(getObjectParams);
			// const url = await getSignedUrl(s3, command, {
			// 	expiresIn: 3600,
			// });
			// newImage.url = url;

			// GET STRAIGHT FROM S3
			// GET STRAIGHT FROM S3
			// GET STRAIGHT FROM S3

			newImage.url = url;

			res.status(200).send(newImage);
	}
}
