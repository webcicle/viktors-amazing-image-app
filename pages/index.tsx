import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import prisma from '../prisma/client';
import styles from '../styles/Home.module.css';
import type { ModdedImage } from './api/image';
import { s3, envVars } from '../aws/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ImageForm, ImagePost } from '../components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getSignedUrl as getSignedCloudFrontUrl } from '@aws-sdk/cloudfront-signer';
import fs from 'fs';
import path from 'path';

const Home: NextPage<{ images: ModdedImage[] }> = ({ images }) => {
	const [isUploaded, setIsUploaded] = useState<boolean>(false);
	const [updatedImages, setUpdatedImages] = useState<ModdedImage[]>(images);

	// useEffect(() => {
	// 	if (isUploaded === true) {
	// 		axios
	// 			.get('/api/image')
	// 			.then((data) => setUpdatedImages((prev) => [data.data, ...prev]));
	// 		return;
	// 	}
	// 	return;
	// }, [isUploaded]);

	return (
		<div className={styles.container}>
			<Head>
				<title>Viktor&apos;s Amazing Image App</title>
				<meta
					name='description'
					content='Upload your amazzzzzing images for the world to see!'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<h1>Viktor&apos;s amazing image app</h1>

			<ImageForm isUploaded={isUploaded} setIsUploaded={setIsUploaded} />
			<div className={styles.imageContainer}>
				{updatedImages?.length > 0 ? (
					updatedImages.map((image, index) => {
						return <ImagePost key={image.id} index={index} image={image} />;
					})
				) : (
					<p>No images yet</p>
				)}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	const images = (await prisma.image.findMany({
		orderBy: { created: 'desc' },
	})) as ModdedImage[];

	for (const image of images) {
		const getObjectParams = {
			Bucket: envVars.bucketName,
			Key: image.id,
		};

		// const command = new GetObjectCommand(getObjectParams);
		// const url = await getSignedUrl(s3, command, {
		// 	expiresIn: 3600,
		// });

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

		const cfUrl = `https://d2d5ackrn9fpvj.cloudfront.net/${image.id}`;

		// console.log(
		// 	'PRIVATEKEY',
		// 	Buffer.from(process.env.PUBLIC_CLOUDFRONT_PRIVATE_KEY!, 'base64')
		// );

		const url = getSignedCloudFrontUrl({
			url: cfUrl,
			dateLessThan: '2022-12-31',
			privateKey:
				process.env.NODE_ENV === 'production'
					? process.env.PUBLIC_CLOUDFRONT_PRIVATE_KEY!
					: (pemKey as string),
			keyPairId: process.env.PUBLIC_CLOUDFRONT_KEY_PAIR_ID!,
		});

		image.url = url;
		// image.url =
		// 	'https://d2d5ackrn9fpvj.cloudfront.net/cl88t16cr0014xzvzzim1oiio';
	}

	res.setHeader(
		'Cache-Control',
		'public, s-maxage=10, stale-while-revalidate=59'
	);

	return {
		props: {
			images: JSON.parse(JSON.stringify(images)),
		},
	};
};

export default Home;
