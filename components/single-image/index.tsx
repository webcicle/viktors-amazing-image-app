import { Comment, Dislike, Like, Tag } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { getFormatDate } from '../../lib/helpers/date';
import { nanoIdRegex } from '../../lib/helpers/regex';
import { ModdedImage } from '../../pages/api/image';
import ImageButtons from '../image-post/ImageButtons';
import CommentComponent from './Comment';
import styles from './Image.module.css';

export interface CommentWithUserAndLikes extends Comment {
	user: {
		id: string;
		alias: string;
		username: string;
		profileImage: string | null;
	};
	likes?: Like[];
	dislikes?: Dislike[];
}

type Props = {
	image: ModdedImage;
	cookie: string;
	userLike: Like | null;
	userDislike: Dislike | null;
};

const SingleImage = ({ cookie, image, userLike, userDislike }: Props) => {
	const [comments, setComments] = useState<CommentWithUserAndLikes[]>(
		image?.comments! as CommentWithUserAndLikes[]
	);

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
								{nanoIdRegex.test(image.uploadedBy?.username)
									? 'unknownusername' + image.uploadedBy?.alias.split('-').pop()
									: image.uploadedBy?.alias}
							</a>
						</Link>
						<Link href={`/profile/${image.uploadedBy.id}`}>
							<a>
								@
								{nanoIdRegex.test(image.uploadedBy?.username)
									? 'unknownuser' + image.uploadedBy?.username.split('-').pop()
									: image.uploadedBy?.username}
							</a>
						</Link>
					</div>
				</div>

				<ImageButtons
					flames={image.flames}
					userId={cookie}
					imageId={image.id}
					setComments={setComments}
					userLike={userLike as Like}
					userDislike={userDislike as Like}>
					<div className={styles.commentsContainer}>
						<div className={styles.captionContainer}>
							<p className={styles.caption}>{image.caption}</p>
						</div>
						<div className={styles.tagContainer}>
							{image?.tags?.map((tag: Tag) => (
								<Link key={tag.id} href={`/tag/${tag.tagName}`}>
									<a className={styles.imageTag}>{`#${tag.tagName}`}</a>
								</Link>
							))}
						</div>
						{comments.length! >= 1 ? (
							comments.map((c) => (
								<CommentComponent
									loggedInUser={cookie}
									key={c.id}
									comment={c}
								/>
							))
						) : (
							<p className={styles.commentLink}>No comments yet</p>
						)}
					</div>
					<p className={styles.imageDate}>
						{getFormatDate(image.created.toString())}
					</p>
				</ImageButtons>
			</aside>
		</div>
	);
};

export default SingleImage;
