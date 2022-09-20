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

const Home: NextPage<{ images: ModdedImage[] }> = ({ images }) => {
	const [isUploaded, setIsUploaded] = useState<boolean>(false);
	const [updatedImages, setUpdatedImages] = useState<ModdedImage[]>(images);

	console.log(isUploaded);

	useEffect(() => {
		if (isUploaded === true) {
			axios
				.get('/api/image')
				.then((data) => setUpdatedImages((prev) => [data.data, ...prev]));
			return;
		}
		return;
	}, [isUploaded]);

	console.log(updatedImages);

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

		const command = new GetObjectCommand(getObjectParams);
		const url = await getSignedUrl(s3, command, {
			expiresIn: 3600,
		});
		image.url = url;
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
