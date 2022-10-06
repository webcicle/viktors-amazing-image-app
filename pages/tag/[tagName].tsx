import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import prisma from '../../prisma/client';
import MainLayout from '../../layouts/main';
import getSignedCfUrl, {
	ImageIdsForSignedUrl,
} from '../../lib/apiHelpers/getSignedCfUrl';
import { ImageDisplay } from '../../components';
import { ProfileThumbnails } from '../profile/[id]';
import getSignedCloudfrontUrl from '../../aws/getSignedCloudfrontUrl';

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
	res,
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
		let images: ProfileThumbnails[] = tagImages.images;
		for (const image of images) {
			const cfUrl = `${process.env.CF_ROOT_URL}/${image.id}`;

			image.url = await getSignedCloudfrontUrl(cfUrl);
		}
		res.setHeader(
			'Cache-Control',
			'public, s-maxage=10, stale-while-revalidate=59'
		);
		return {
			props: {
				cookie,
				images: JSON.parse(JSON.stringify(images)),
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
