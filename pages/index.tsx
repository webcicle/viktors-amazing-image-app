import type { GetServerSideProps, NextPage } from 'next';
import prisma from '../prisma/client';
import styles from '../styles/Home.module.css';
import type { ModdedImage } from './api/image';
import { ImageForm, ImagePost } from '../components';
import { useEffect, useState } from 'react';
import axios from 'axios';
import getSignedCloudfrontUrl from '../aws/getSignedCloudfrontUrl';
import MainLayout from '../layouts/main';

interface PageProps {
	images: ModdedImage[];
	cookie: string;
}

const Home: NextPage<PageProps> = ({ images, cookie }) => {
	const [isUploaded, setIsUploaded] = useState<boolean>(false);
	const [updatedImages, setUpdatedImages] = useState<ModdedImage[]>(images);

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
			<h1 style={{ color: 'var(--text-color-contrast)' }}>
				Viktor&apos;s amazing image app
			</h1>

			<ImageForm isUploaded={isUploaded} setIsUploaded={setIsUploaded} />
			<div className={styles.imageContainer}>
				{updatedImages?.length > 0 ? (
					updatedImages.map((image, index) => {
						return (
							<ImagePost
								userId={cookie}
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
			const userLike = image?.likes?.find((like) => like.userId === cookie);
			const userDislike = image?.dislikes?.find(
				(dislike) => dislike.userId === cookie
			);

			image.userLike = userLike;
			image.userDislike = userDislike;

			const cfUrl = `${process.env.CF_ROOT_URL}/${image.id}`;

			image.url = await getSignedCloudfrontUrl(cfUrl);
		}

		return {
			props: {
				images: JSON.parse(JSON.stringify(images)),
				cookie,
			},
		};
	}
	return {
		props: {
			cookie: cookie ?? null,
		},
	};
};

export default Home;
