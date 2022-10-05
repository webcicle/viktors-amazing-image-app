import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import prisma from '../../prisma/client';
import MainLayout from '../../layouts/main';
import getSignedCfUrl, {
	ImageIdsForSignedUrl,
} from '../../lib/apiHelpers/getSignedCfUrl';
import { ImageDisplay } from '../../components';
import { ProfileThumbnails } from '../profile/[id]';

type Props = {
	images: ProfileThumbnails[];
	cookie: string;
};

const TagPage = ({ images, cookie }: Props) => {
	const {
		query: { tagName },
	} = useRouter();
	return (
		<MainLayout cookie={cookie}>
			<h1 style={{ textAlign: 'center' }}>#{tagName}</h1>
			<ImageDisplay feedName='Images for this tag:' images={images} />
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const cookie = req.cookies.vikAmazimg;
	const { tagName } = query;

	const tagImages = await prisma.tag.findFirst({
		where: {
			tagName: { equals: tagName as string },
		},
		include: {
			images: {
				select: {
					created: true,
					id: true,
					_count: {
						select: {
							comments: true,
							dislikes: true,
							likes: true,
						},
					},
				},
			},
		},
	});

	if (tagImages) {
		const imagesWithUrls = await getSignedCfUrl(tagImages?.images);
		return {
			props: {
				cookie,
				images: JSON.parse(JSON.stringify(imagesWithUrls)),
			},
		};
	}

	return {
		props: {
			cookie,
		},
	};
};

export default TagPage;
