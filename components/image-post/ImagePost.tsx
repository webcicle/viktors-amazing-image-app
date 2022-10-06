import Image from 'next/image';
import { ModdedImage } from '../../pages/api/image';
import styles from './ImagePost.module.css';
import { CgProfile } from 'react-icons/cg';
import Link from 'next/link';
import { getFormatDate } from '../../lib/helpers/date';
import { nanoIdRegex } from '../../lib/helpers/regex';
import ImageButtons from './ImageButtons';

type Props = {
	image: ModdedImage;
	index: number;
	userId: string;
};

export default function ImagePost({ userId, image, index }: Props) {
	const { uploadedBy } = image;

	return (
		<>
			<div className={styles.imagePost} key={image.id}>
				<div className={styles.profileBar}>
					<div className={styles.profileImageContainer}>
						<CgProfile />
					</div>
					<div className={styles.userNameContainer}>
						<p>
							{nanoIdRegex.test(uploadedBy?.userName)
								? 'unknownusername' + uploadedBy?.alias.split('-').pop()
								: uploadedBy?.alias}
						</p>
						<Link href={`/profile/${uploadedBy?.id}`}>
							<a>
								@
								{nanoIdRegex.test(uploadedBy?.userName)
									? 'unknownuser' + uploadedBy?.userName.split('-').pop()
									: uploadedBy?.userName}
							</a>
						</Link>
					</div>
				</div>
				<Link href={`/image/${image.id}`}>
					<div className={styles.imageContainer}>
						<Image
							src={image.url}
							layout={'responsive'}
							height={500}
							width={500}
							priority={index === 0}
						/>
					</div>
				</Link>
				<ImageButtons
					userId={userId}
					imageId={image.id}
					userLike={image.userLike}
					userDislike={image.userDislike}>
					<p className={styles.caption}>{image.caption}</p>
					<div className={styles.tagContainer}>
						{image?.tags?.map((tag) => (
							<Link key={tag.id} href={`/tag/${tag.tagName}`}>
								<a className={styles.imageTag}>{`#${tag.tagName}`}</a>
							</Link>
						))}
					</div>
					<Link href={`/image/${image.id}`}>
						<a className={styles.commentLink}>
							{image?.comments?.length! >= 1
								? `View ${image?.comments?.length} comments`
								: `No comments yet`}
						</a>
					</Link>
					<p className={styles.imageDate}>
						{getFormatDate(image.created.toString())}
					</p>
				</ImageButtons>
			</div>
		</>
	);
}
