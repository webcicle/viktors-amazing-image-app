import React from 'react';
import { AiFillDislike, AiFillFire, AiFillLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { ImShare } from 'react-icons/im';
import styles from './ImagePost.module.css';

type Props = {
	userId: string;
	imageId: string;
};

const ImageButtons = ({ userId, imageId }: Props) => {
	return (
		<div className={styles.imageButtons}>
			<div className={styles.buttonSeparators}>
				<button className={styles.imageButton}>
					<AiFillLike />
				</button>
				<button className={styles.imageButton}>
					<AiFillDislike />
				</button>

				<button className={styles.imageButton}>
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
