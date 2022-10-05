import { AiFillDislike, AiFillFire, AiFillLike } from 'react-icons/ai';
import { Comment } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { CommentWithUser } from '.';
import { nanoIdRegex } from '../../lib/helpers/regex';
import styles from './Image.module.css';
import { FaRegComment } from 'react-icons/fa';

type Props = {
	comment: CommentWithUser;
};

const CommentComponent = ({ comment }: Props) => {
	const { comment: commentText, user } = comment;
	// console.log(comment);

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
							{nanoIdRegex.test(user?.userName)
								? 'unknownuser' + user?.userName.split('-').pop()
								: user?.userName}
						</a>
					</Link>
				</div>
			</div>
			<p className={styles.commentText}>{commentText}</p>
			<div className={styles.commentButtons}>
				<button type='button' className={styles.commentButton}>
					<AiFillLike />
				</button>
				<button type='button' className={styles.commentButton}>
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
