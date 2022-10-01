import { ProfileThumbnails } from '../../pages/profile/[id]';
import styles from './ImageDisplay.module.css';
import { AiFillDislike, AiFillLike, AiFillFire } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { BsImage } from 'react-icons/bs';
import Image from 'next/image';
import Link from 'next/link';

interface ThumbnailProps {
	image: ProfileThumbnails;
}

const ImageThumbnail = ({ image }: ThumbnailProps) => {
	const likeDislikeRatio = Math.floor(
		image._count.likes - image._count.dislikes
	);

	return (
		<div className={styles.thumbnailContainer}>
			<Image src={image.url!} layout={'responsive'} width={100} height={100} />
			<div className={styles.overlay}>
				<Link href={`/image/${image.id}`}>
					<a className={styles.imageLink}>
						<BsImage />
					</a>
				</Link>
				<div className={styles.statsOverlay}>
					<div className={styles.likesContainer}>
						<AiFillDislike /> <AiFillLike />
						<p className={styles.ratioInfo}>{likeDislikeRatio}</p>
					</div>
					<div className={styles.commentsContainer}>
						<p className={styles.ratioInfo}>{image._count.comments}</p>
						<FaRegComment />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageThumbnail;
