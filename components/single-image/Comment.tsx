import { AiFillDislike, AiFillLike } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { CommentWithUserAndLikes } from '.';
import { nanoIdRegex } from '../../lib/helpers/regex';
import styles from './Image.module.css';
import { FaRegComment } from 'react-icons/fa';
import useLikeDislike from '../../hooks/useLikeDislike';
import { Dislike, Like } from '@prisma/client';

type Props = {
	comment: CommentWithUserAndLikes;
	loggedInUser: string;
};

const CommentComponent = ({ comment, loggedInUser }: Props) => {
	const { comment: commentText, user, likes, dislikes } = comment;

	const userLike = likes?.find((like) => like.userId === loggedInUser);
	const userDislike = dislikes?.find(
		(dislike) => dislike.userId === loggedInUser
	);

	const userHasLiked = userLike === undefined ? false : true;
	const userHasDisliked = userDislike === undefined ? false : true;

	const [
		createLike,
		deleteLike,
		createDislike,
		deleteDislike,
		liked,
		disliked,
	] = useLikeDislike({ userHasLiked, userHasDisliked, userLike, userDislike });

	return (
		<div className={styles.commentWrapper}>
			<div className={styles.commentProfileImage}>
				{user.profileImage ? (
					<Image src={user.profileImage as string} width={25} height={25} />
				) : (
					<CgProfile />
				)}
			</div>
			<div className={styles.commentHeader}>
				<div className={styles.commentUser}>
					<Link href={`/profile/${user.id}`}>
						<a className={styles.commentAlias}>
							{nanoIdRegex.test(user?.alias)
								? 'unknownuser' + user?.alias.split('-').pop()
								: user?.alias}
						</a>
					</Link>
					<Link href={`/profile/${user.id}`}>
						<a className={styles.commentUsername}>
							@
							{nanoIdRegex.test(user?.username)
								? 'unknownuser' + user?.username.split('-').pop()
								: user?.username}
						</a>
					</Link>
				</div>
			</div>
			<p className={styles.commentText}>{commentText}</p>
			<div className={styles.commentButtons}>
				<button
					type='button'
					className={liked ? styles.commentButtonClicked : styles.commentButton}
					onClick={
						liked === false
							? () =>
									createLike({
										userId: loggedInUser,
										commentId: comment.id,
										type: 'comment',
									})
							: () => deleteLike()
					}>
					<AiFillLike />
				</button>
				<button
					onClick={
						disliked === false
							? () =>
									createDislike({
										userId: loggedInUser,
										commentId: comment.id,
										type: 'comment',
									})
							: () => deleteDislike()
					}
					type='button'
					className={
						disliked ? styles.commentButtonClicked : styles.commentButton
					}>
					<AiFillDislike />
				</button>
				<button type='button' className={styles.commentButton}>
					<FaRegComment />
				</button>
			</div>
		</div>
	);
};

export default CommentComponent;
