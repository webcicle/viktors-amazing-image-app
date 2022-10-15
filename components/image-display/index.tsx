import { ProfileThumbnails } from '../../pages/profile/[id]';
import styles from './ImageDisplay.module.css';
import ImageThumbnail from './ImageThumbnail';

type Props = {
	images: ProfileThumbnails[];
	feedName?: string;
};

const ImageDisplay = ({ feedName, images }: Props) => {
	return (
		<>
			<p
				style={{
					color: 'var(--text-color-contrast)',
					fontFamily: 'var(--main-font)',
				}}>
				{feedName}
			</p>
			<div className={styles.imagesGrid}>
				{images.map((image) => {
					return <ImageThumbnail key={image.id} image={image} />;
				})}
			</div>
		</>
	);
};

export default ImageDisplay;
