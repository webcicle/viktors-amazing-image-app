import Image from 'next/image';
import { ModdedImage } from '../../pages/api/image';
import styles from './ImagePost.module.css';

type Props = {
	image: ModdedImage;
	index: number;
};

export default function ImagePost({ image, index }: Props) {
	return (
		<div className={styles.imagePost} key={image.id}>
			<p>
				{image.created.toString().split('T').shift()} {'@ '}
				{image.created.toString().split('T').pop()?.split(':')[0]}:
				{image.created.toString().split('T').pop()?.split(':')[1]}
			</p>
			<div>
				<Image
					src={image.url}
					layout={'responsive'}
					height={500}
					width={500}
					priority={index === 0}
				/>
			</div>
			<p>{image.caption}</p>
		</div>
	);
}
