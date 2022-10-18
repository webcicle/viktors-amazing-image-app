import type { GetServerSideProps, NextPage } from 'next';
import prisma from '../prisma/client';
import styles from '../styles/Home.module.css';
import type { ModdedImage } from './api/image';
import { ImageForm, ImagePost } from '../components';
import getSignedCloudfrontUrl from '../aws/getSignedCloudfrontUrl';
import MainLayout from '../layouts/main';

interface PageProps {
	images: ModdedImage[];
	cookie: string;
}

const Home: NextPage<PageProps> = ({ images, cookie }) => {
	return (
		<MainLayout page={'frontPage'} cookie={cookie}>
			<ImageForm />
			<div className={styles.imageContainer}>
				{images?.length > 0 ? (
					images.map((image, index) => {
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
			flames: true,
			uploadedBy: {
				select: { id: true, alias: true, username: true, profileImage: true },
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
