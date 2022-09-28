import Image from 'next/image';
import { ModdedImage } from '../../pages/api/image';
import styles from './ImagePost.module.css';
import { AiFillDislike, AiFillLike, AiFillFire } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { ImShare } from 'react-icons/im';
import { CgProfile } from 'react-icons/cg';
import Link from 'next/link';

type Props = {
	image: ModdedImage;
	index: number;
};

export default function ImagePost({ image, index }: Props) {
	const { uploadedBy } = image;
	const nanoIdRegex =
		/[a-zA-Z0-9]{8}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{12}/;

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
					<Link href={`/profile/${uploadedBy?.id}`}>
						<a>
							{nanoIdRegex.test(uploadedBy?.userName)
								? 'unknownuser' + uploadedBy?.userName.split('-').pop()
								: uploadedBy?.userName}
						</a>
					</Link>
					<p>
						@
						{nanoIdRegex.test(uploadedBy?.userName)
							? 'unknownusername' + uploadedBy?.alias.split('-').pop()
							: uploadedBy?.alias}
					</p>
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
					<FaRegComment />
				</button>
				<button className={styles.imageButton}>
					<ImShare />
				</button>
				<button className={styles.imageButton}>
					<AiFillFire />
				</button>
			</div>
			<p>{image.caption}</p>
			<div className={styles.tagContainer}>
				{image?.tags?.map((tag) => (
					<Link key={tag.id} href={`/tag/${tag.tagName}`}>
						<a className={styles.imageTag}>{`#${tag.tagName}`}</a>
					</Link>
				))}
			</div>
			<Link href={`/post/${image.id}`}>
				<a className={styles.commentLink}>
					{image?.comments?.length! >= 1
						? `View ${image?.comments?.length} comments`
						: `No comments yet`}
				</a>
			</Link>
			<p className={styles.imageDate}>
				{getFormatDate(image.created.toString())}
			</p>
		</div>
	);
}
