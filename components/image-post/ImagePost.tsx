import Image from 'next/image';
import { ModdedImage } from '../../pages/api/image';
import styles from './ImagePost.module.css';
import { AiFillDislike, AiFillLike, AiFillFire } from 'react-icons/ai';
import { ImShare } from 'react-icons/im';
import { CgProfile } from 'react-icons/cg';

type Props = {
	image: ModdedImage;
	index: number;
};

export default function ImagePost({ image, index }: Props) {
	const getFormatDate = (date: string) => {
		const dateString = date.toString().split('T').shift();
		const hours = date.toString().split('T').pop()?.split(':')[0];
		const minutes = date.toString().split('T').pop()?.split(':')[1];
		return `${dateString}, ${hours}:${minutes}`;
	};

	return (
		<div className={styles.imagePost} key={image.id}>
			<div className={styles.profileBar}>
				<div className={styles.profileImageContainer}>
					<CgProfile />
				</div>
				<div className={styles.userNameContainer}>
					<p>{`user${image.userId}`}</p>
					<p>viktoruneland</p>
				</div>
			</div>
			<div className={styles.imageContainer}>
				<Image
					src={image.url}
					layout={'responsive'}
					height={500}
					width={500}
					priority={index === 0}
				/>
			</div>
			<div className={styles.imageButtons}>
				<button className={styles.imageButton}>
					<AiFillLike />
				</button>
				<button className={styles.imageButton}>
					<AiFillDislike />
				</button>
				<button className={styles.imageButton}>
					<ImShare />
				</button>
				<button className={styles.imageButton}>
					<AiFillFire />
				</button>
			</div>
			<p>{image.caption}</p>
			<p className={styles.imageDate}>
				{getFormatDate(image.created.toString())}
			</p>
		</div>
	);
}
