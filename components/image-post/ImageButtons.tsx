import { Comment } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AiFillDislike, AiFillFire, AiFillLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { ImShare } from 'react-icons/im';
import styles from './ImagePost.module.css';

type Props = {
	userId: string;
	imageId: string;
	setComment: Dispatch<React.SetStateAction<Comment[]>>;
};

const ImageButtons = ({ userId, imageId, setComment }: Props) => {
	const { pathname, push } = useRouter();
	console.log(pathname);

	const commentClick = async () => {
		if (!pathname.startsWith('/image')) return push(`/image/${imageId}`);
		const axiosResponse = await axios.post('/api/comment', { userId, imageId });
		const { data } = axiosResponse;
		if (data.newComment && data.newComment === Comment) {
			setComment((prev) => [data.newComment, ...prev]);
		}
		return;
	};

	return (
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
	);
};

export default ImageButtons;
