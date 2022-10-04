import { Comment, Tag } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import useMediaQuery from '../../hooks/useMediaQuery';
import { getFormatDate } from '../../lib/helpers/date';
import { nanoIdRegex } from '../../lib/helpers/regex';
import { ModdedImage } from '../../pages/api/image';
import ImageButtons from '../image-post/ImageButtons';
import CommentComponent from './Comment';
import styles from './Image.module.css';

type Props = {
	image: ModdedImage;
	cookie: string;
};

const SingleImage = ({ cookie, image }: Props) => {
	const [comments, setComments] = useState<Comment[]>(image?.comments!);
	const isDesktop = useMediaQuery(700, true);

	return (
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
									? 'unknownuser' + image.uploadedBy?.userName.split('-').pop()
									: image.uploadedBy?.userName}
							</a>
						</Link>
						<Link href={`/profile/${image.uploadedBy.id}`}>
							<a>
								@
								{nanoIdRegex.test(image.uploadedBy?.userName)
									? 'unknownusername' + image.uploadedBy?.alias.split('-').pop()
									: image.uploadedBy?.alias}
							</a>
						</Link>
					</div>
				</div>
				<ImageButtons
					userId={cookie}
					imageId={image.id}
					setComment={setComments}
				/>
				<p>{image.caption}</p>
				<div className={styles.tagContainer}>
					{image?.tags?.map((tag: Tag) => (
						<Link key={tag.id} href={`/tag/${tag.tagName}`}>
							<a className={styles.imageTag}>{`#${tag.tagName}`}</a>
						</Link>
					))}
				</div>
				{comments.length! >= 1 ? (
					comments.map((c) => <CommentComponent key={c.id} comment={c} />)
				) : (
					<p className={styles.commentLink}>No comments yet</p>
				)}
				<p className={styles.imageDate}>
					{getFormatDate(image.created.toString())}
				</p>
			</aside>
		</div>
	);
};

export default SingleImage;
