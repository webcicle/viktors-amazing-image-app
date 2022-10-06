import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import prisma from '../prisma/client';
import styles from '../styles/Home.module.css';
import type { ModdedImage } from './api/image';
import { s3, envVars } from '../aws/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Header, ImageForm, ImagePost } from '../components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getSignedUrl as getSignedCloudFrontUrl } from '@aws-sdk/cloudfront-signer';
import fs from 'fs';
import path from 'path';
import MainLayout from '../layouts/main';

interface PageProps {
	images: ModdedImage[];
	cookie: string;
}

const Home: NextPage<PageProps> = ({ images, cookie }) => {
	const [isUploaded, setIsUploaded] = useState<boolean>(false);
	const [updatedImages, setUpdatedImages] = useState<ModdedImage[]>(images);

	console.log(images);

	useEffect(() => {
		if (isUploaded === true) {
			axios
				.get('/api/image')
				.then((data) => setUpdatedImages((prev) => [data.data, ...prev]));
			return;
		}
		return;
	}, [isUploaded]);

	return (
		<MainLayout page={'frontPage'} cookie={cookie}>
			<h1>Viktor&apos;s amazing image app</h1>

			<ImageForm isUploaded={isUploaded} setIsUploaded={setIsUploaded} />
			<div className={styles.imageContainer}>
				{updatedImages?.length > 0 ? (
					updatedImages.map((image, index) => {
						return (
							<ImagePost
								userId={cookie}
								// userLikes={}
								// userDislikes={}
								key={image.id}
								index={index}
								image={image}
							/>
						);
					})
				) : (
					<p>No images yet</p>
				)}
			</div>
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const cookie = req.cookies.vikAmazimg;

	const user = await prisma.user.findFirst({
		where: {
			id: cookie,
		},
	});

	if (!user) {
		await prisma.user.create({
			data: {
				id: cookie,
			},
		});
	}

	const images = (await prisma.image.findMany({
		include: {
			comments: true,
			likes: true,
			dislikes: true,
			uploadedBy: {
				select: { id: true, alias: true, userName: true, profileImage: true },
			},
			tags: true,
		},
		orderBy: { created: 'desc' },
	})) as ModdedImage[];

	if (images) {
		for (const image of images) {
			// REGULAR S3 FLOW
			// const getObjectParams = {
			// 	Bucket: envVars.bucketName,
			// 	Key: image.id,
			// };

			// const command = new GetObjectCommand(getObjectParams);
			// const url = await getSignedUrl(s3, command, {
			// 	expiresIn: 3600,
			// });

			const userLike = image?.likes?.find((like) => like.userId === cookie);
			const userDislike = image?.dislikes?.find(
				(dislike) => dislike.userId === cookie
			);

			image.userLike = userLike;
			image.userDislike = userDislike;

			const cfUrl = `https://d2d5ackrn9fpvj.cloudfront.net/${image.id}`;

			image.url = cfUrl;

			if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
				const privateKey: string =
					process.env.PUBLIC_CLOUDFRONT_PRIVATE_KEY!.replace(/\\n/g, '\n');

				const signedCfUrl = getSignedCloudFrontUrl({
					url: cfUrl,
					dateLessThan: new Date(Date.now() + 1000 * 60 * 60).toString(),
					privateKey: privateKey,
					keyPairId: process.env.PUBLIC_CLOUDFRONT_KEY_PAIR_ID!,
				});

				image.url = signedCfUrl;

				res.setHeader(
					'Cache-Control',
					'public, s-maxage=10, stale-while-revalidate=59'
				);

				return {
					props: {
						images: JSON.parse(JSON.stringify(images)),
						cookie,
					},
				};
			}

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

			const signedCfUrl = getSignedCloudFrontUrl({
				url: cfUrl,
				dateLessThan: new Date(Date.now() + 1000 * 60 * 60).toString(),
				privateKey: pemKey as string,
				keyPairId: process.env.PUBLIC_CLOUDFRONT_KEY_PAIR_ID!,
			});

			image.url = signedCfUrl;

			image.url =
				process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
					? cfUrl
					: signedCfUrl;
			// image.url = cfUrl;
		}

		res.setHeader(
			'Cache-Control',
			'public, s-maxage=10, stale-while-revalidate=59'
		);

		return {
			props: {
				images: JSON.parse(JSON.stringify(images)),
				cookie,
			},
		};
	}
	return {
		props: {
			cookie,
		},
	};
};

export default Home;
