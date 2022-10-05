import { GetServerSideProps } from 'next';
import prisma from '../../../prisma/client';
import getSignedCfUrl from '../../../lib/apiHelpers/getSignedCfUrl';
import MainLayout from '../../../layouts/main';
import { SingleImage } from '../../../components';
import { ModdedImage } from '../../api/image';
import { Dislike, Like } from '@prisma/client';

type Props = {
	image: ModdedImage;
	cookie: string;
	userLike: Like | null;
	userDislike: Dislike | null;
};

const ImagePage = ({ image, cookie, userLike, userDislike }: Props) => {
	// console.log(image);

	return (
		<MainLayout cookie={cookie}>
			<SingleImage
				image={image}
				cookie={cookie}
				userLike={userLike}
				userDislike={userDislike}
			/>
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const cookie = req.cookies.vikAmazimg;
	const imageId = query.id;
	const image = await prisma.image.findFirst({
		where: { id: { equals: imageId as string } },
		include: {
			comments: {
				include: {
					user: {
						select: {
							id: true,
							alias: true,
							userName: true,
							profileImage: true,
						},
					},
				},
				orderBy: { createdAt: 'desc' },
			},
			likes: true,
			dislikes: true,
			uploadedBy: {
				select: { id: true, alias: true, userName: true, profileImage: true },
			},
			tags: true,
		},
	});

	if (image) {
		const userLike = image?.likes?.find((like) => like.userId === cookie);
		const userDislike = image?.dislikes?.find(
			(dislike) => dislike.userId === cookie
		);

		console.log({ userDislike, userLike });

		const urls = await getSignedCfUrl([
			{ id: image?.id, created: image?.created },
		]);

		const imageWithUrl = {
			...image,
			url: urls[0].url,
		};

		return {
			props: {
				image: JSON.parse(JSON.stringify(imageWithUrl)),
				cookie,
				userLike: userLike ? userLike : null,
				userDislike: userDislike ? userDislike : null,
			},
		};
	}

	return {
		props: {
			cookie,
		},
	};
};

export default ImagePage;
