import { Comment } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, {
	ChangeEvent,
	Dispatch,
	FormEvent,
	ReactNode,
	useState,
} from 'react';
import { AiFillDislike, AiFillFire, AiFillLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { ImShare } from 'react-icons/im';
import { CommentWithUser } from '../single-image';
import styles from './ImagePost.module.css';

type Props = {
	userId: string;
	imageId: string;
	setComment: Dispatch<React.SetStateAction<CommentWithUser[]>>;
	children: ReactNode;
};

const ImageButtons = ({ userId, imageId, setComment, children }: Props) => {
	const [newComment, setNewComment] = useState<string>('');
	const { pathname, push } = useRouter();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.currentTarget;
		setNewComment(value);
	};

	const commentClick = async (e: FormEvent) => {
		if (newComment === '') return;
		if (!pathname.startsWith('/image')) return push(`/image/${imageId}`);
		e.preventDefault();
		const axiosResponse = await axios.post('/api/comment', {
			userId,
			imageId,
			comment: newComment,
		});
		const { data } = axiosResponse;
		if (data.newComment) {
			setComment((prev) => [data.newComment, ...prev]);
			setNewComment('');
		}
		return;
	};

	return (
		<div className={styles.imageButtonMain}>
			<div className={styles.imageButtons}>
				<div className={styles.buttonSeparators}>
					<button className={styles.imageButton}>
						<AiFillLike />
					</button>
					<button className={styles.imageButton}>
						<AiFillDislike />
					</button>

					<button onClick={commentClick} className={styles.imageButton}>
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
			{children ?? ''}
			<form onSubmit={commentClick} className={styles.commentForm}>
				<div className={styles.commentInput}>
					<label htmlFor='commentInput'></label>
					<input
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
		</div>
	);
};

export default ImageButtons;
