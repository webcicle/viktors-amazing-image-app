import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '../../../prisma/client';
import { CgProfile } from 'react-icons/cg';
import styles from './Image.module.css';
import { getFormatDate } from '../../../lib/helpers/date';
import { nanoIdRegex } from '../../../lib/helpers/regex';
import getSignedCfUrl from '../../../lib/apiHelpers/getSignedCfUrl';

import { Tag } from '@prisma/client';
import MainLayout from '../../../layouts/main';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { ImageButtons } from '../../../components';
import Comment from './Comment';
import { ModdedImage } from '../../api/image';

type Props = {
	image: ModdedImage;
	cookie: string;
};

const ImagePage = ({ image, cookie }: Props) => {
	console.log(image);
	const isDesktop = useMediaQuery(700, true);

	return (
		<MainLayout cookie={cookie}>
			<div className={styles.mainContainer}>
				<div className={styles.imagePost} key={image.id}>
					<div className={styles.imageContainer}>
						<Image
							src={image.url}
							layout={'responsive'}
							height={500}
							width={500}
							priority={true}
						/>
					</div>
				</div>
				<aside className={styles.sidebar}>
					<div className={styles.profileBar}>
						<div className={styles.profileImageContainer}>
							<CgProfile />
						</div>
						<div className={styles.userNameContainer}>
							<Link href={`/profile/${image.uploadedBy.id}`}>
								<a>
									{nanoIdRegex.test(image.uploadedBy?.userName)
										? 'unknownuser' +
										  image.uploadedBy?.userName.split('-').pop()
										: image.uploadedBy?.userName}
								</a>
							</Link>
							<Link href={`/profile/${image.uploadedBy.id}`}>
								<a>
									@
									{nanoIdRegex.test(image.uploadedBy?.userName)
										? 'unknownusername' +
										  image.uploadedBy?.alias.split('-').pop()
										: image.uploadedBy?.alias}
								</a>
							</Link>
						</div>
					</div>
					<ImageButtons userId={cookie} imageId={image.id} />
					<p>{image.caption}</p>
					<div className={styles.tagContainer}>
						{image?.tags?.map((tag: Tag) => (
							<Link key={tag.id} href={`/tag/${tag.tagName}`}>
								<a className={styles.imageTag}>{`#${tag.tagName}`}</a>
							</Link>
						))}
					</div>
					{image?.comments?.length! >= 1 ? (
						image?.comments?.map((c) => <Comment />)
					) : (
						<p className={styles.commentLink}>No comments yet</p>
					)}
					<p className={styles.imageDate}>
						{getFormatDate(image.created.toString())}
					</p>
				</aside>
			</div>
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
			comments: true,
			likes: true,
			dislikes: true,
			uploadedBy: { select: { id: true, alias: true, userName: true } },
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
