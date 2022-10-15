import { GetServerSideProps } from 'next';
import prisma from '../../../prisma/client';
import getSignedCfUrl from '../../../lib/apiHelpers/getSignedCfUrl';
import MainLayout from '../../../layouts/main';
import { SingleImage } from '../../../components';
import { ModdedImage } from '../../api/image';
import { Dislike, Like } from '@prisma/client';
import getSignedCloudfrontUrl from '../../../aws/getSignedCloudfrontUrl';

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
	res,
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
							username: true,
							profileImage: true,
						},
					},
					likes: true,
					dislikes: true,
				},
				orderBy: { createdAt: 'desc' },
			},
			likes: true,
			dislikes: true,
			flames: true,
			uploadedBy: {
				select: { id: true, alias: true, username: true, profileImage: true },
			},
			tags: true,
		},
	});

	if (image) {
		const userLike = image?.likes?.find((like) => like.userId === cookie);
		const userDislike = image?.dislikes?.find(
			(dislike) => dislike.userId === cookie
		);

		const cfUrl = `${process.env.CF_ROOT_URL}/${image.id}`;

		const url = await getSignedCloudfrontUrl(cfUrl);

		const imageWithUrl = {
			...image,
			url,
		};

		return {
			props: {
				image: JSON.parse(JSON.stringify(imageWithUrl)),
				cookie,
				userLike: userLike ? JSON.parse(JSON.stringify(userLike)) : null,
				userDislike: userDislike
					? JSON.parse(JSON.stringify(userDislike))
					: null,
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
