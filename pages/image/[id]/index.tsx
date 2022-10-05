import { GetServerSideProps } from 'next';
import prisma from '../../../prisma/client';
import getSignedCfUrl from '../../../lib/apiHelpers/getSignedCfUrl';
import MainLayout from '../../../layouts/main';
import { SingleImage } from '../../../components';
import { ModdedImage } from '../../api/image';

type Props = {
	image: ModdedImage;
	cookie: string;
};

const ImagePage = ({ image, cookie }: Props) => {
	// console.log(image);

	return (
		<MainLayout cookie={cookie}>
			<SingleImage image={image} cookie={cookie} />
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
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
				cookie: req.cookies.vikAmazimg,
			},
		};
	}

	return {
		props: {
			cookie: req.cookies.vikAmazimg,
		},
	};
};

export default ImagePage;
