import { Comment, Dislike, Like } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, {
	ChangeEvent,
	Dispatch,
	FormEvent,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';
import { AiFillDislike, AiFillFire, AiFillLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { ImShare } from 'react-icons/im';
import useLikeDislike from '../../hooks/useLikeDislike';
import { CommentWithUserAndLikes } from '../single-image';
import styles from './ImagePost.module.css';

type Props = {
	userId: string;
	imageId: string;
	userLike: Like | null | undefined;
	userDislike: Dislike | null | undefined;
	children: ReactNode;
	setComments?: Dispatch<React.SetStateAction<CommentWithUserAndLikes[]>>;
};

const ImageButtons = ({
	userId,
	userLike,
	userDislike,
	imageId,
	setComments,
	children,
}: Props) => {
	const userHasLiked =
		userLike === null || userLike === undefined ? false : true;
	const userHasDisliked =
		userDislike === null || userDislike === undefined ? false : true;

	const [newComment, setNewComment] = useState<string>('');
	const [commentFocus, setCommentFocus] = useState<boolean>(false);
	const { pathname, push } = useRouter();
	const [
		createLike,
		deleteLike,
		createDislike,
		deleteDislike,
		liked,
		disliked,
	] = useLikeDislike({ userHasLiked, userHasDisliked, userLike, userDislike });

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget;
		setNewComment(value);
	};

	const focusComment = () => {
		if (!pathname.startsWith('/image')) return push(`/image/${imageId}`);
		setCommentFocus((prev) => !prev);
	};

	const commentInputRef = useRef<HTMLInputElement | null>(null);

	const commentClick = async (e: FormEvent) => {
		if (newComment === '') return;
		e.preventDefault();
		const axiosResponse = await axios.post('/api/comment', {
			userId,
			imageId,
			comment: newComment,
		});
		const { data } = axiosResponse;
		if (data.newComment && setComments) {
			setComments((prev) => [data.newComment, ...prev]);
			setNewComment('');
		}
		return;
	};

	useEffect(() => {
		commentInputRef?.current?.focus();
	}, [commentFocus, liked, disliked]);

	return (
		<div className={styles.imageButtons}>
			<div className={styles.imageButtons}>
				<div className={styles.buttonSeparators}>
					<button
						onClick={
							liked === false
								? () => createLike({ userId, imageId, type: 'image' })
								: () => deleteLike()
						}
						className={liked ? styles.imageButtonClicked : styles.imageButton}>
						<AiFillLike />
					</button>
					<button
						className={
							disliked ? styles.imageButtonClicked : styles.imageButton
						}
						onClick={
							disliked === false
								? () => createDislike({ userId, imageId, type: 'image' })
								: () => deleteDislike()
						}>
						<AiFillDislike />
					</button>

					<button onClick={focusComment} className={styles.imageButton}>
						<FaRegComment />
					</button>
				</div>
				<div className={styles.buttonSeparators}>
					<button className={styles.imageButton}>
						<ImShare />
					</button>
					<button className={styles.imageButton}>
						<AiFillFire />
					</button>
				</div>
			</div>
			<div className={styles.imageButtonsMain}>
				{children ?? ''}
				{pathname.startsWith('/image') && (
					<form onSubmit={commentClick} className={styles.commentForm}>
						<div className={styles.commentInput}>
							<label htmlFor='commentInput'></label>
							<input
								ref={commentInputRef}
								onChange={handleChange}
								placeholder={`Type your comment here...`}
								value={newComment}
								required
								title='Please enter your comment'
							/>
						</div>
						<button type='submit' className={styles.submitCommentButton}>
							Comment
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default ImageButtons;
