import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { Comment, Dislike, Image, Like, Tag, User } from '@prisma/client';
import prisma from '../../prisma/client';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getSignedCloudFrontUrl } from '@aws-sdk/cloudfront-signer';
import { s3, envVars } from '../../aws/s3';
import fs from 'fs';
import path from 'path';
import { CommentWithUserAndLikes } from '../../components/single-image';

type Data = {
	message: string;
};

// interface ImageTageExt extends ImageTag {
// 	tag?: { tagName: string };
// }

interface ImageUser {
	id: string;
	alias: string;
	userName: string;
	profileImage: string;
}

export interface ModdedImage extends Image {
	url: string;
	uploadedBy: ImageUser;
	comments: Comment[] | CommentWithUserAndLikes[] | undefined;
	likes: Like[] | undefined;
	dislikes: Dislike[] | undefined;
	tags: Tag[];
	userLike?: Like | null | undefined;
	userDislike?: Dislike | null | undefined;
}

export interface TagWithImageIds extends Tag {
	imageId: string;
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

			const bodyTags: Tag[] = JSON.parse(req.body.tags);

			const { vikAmazimg } = req.cookies;

			const dbEntry = await prisma.image.create({
				data: {
					caption: req.body.caption,
					userId: vikAmazimg.toString(),
					tags: {
						connectOrCreate: bodyTags.map((tag) => {
							return {
								where: { tagName: tag.tagName },
								create: { id: tag.id, tagName: tag.tagName },
							};
						}),
					},
				},
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
				include: {
					comments: true,
					likes: true,
					uploadedBy: {
						select: {
							id: true,
							alias: true,
							userName: true,
							profileImage: true,
						},
					},
					tags: true,
				},
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
