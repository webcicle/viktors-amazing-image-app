import Image from 'next/image';
import Link from 'next/link';
import useMediaQuery from '../../hooks/useMediaQuery';
import styles from './Header.module.css';

type Props = {
	cookie: string;
};

const Header = ({ cookie }: Props) => {
	const isMobile = useMediaQuery(560, false);

	return (
		<header className={styles.header}>
			<div className={styles.leftLinks}>
				{isMobile ? (
					<Link href={`/profile/${cookie}`} className={`${styles.headerBtn}`}>
						<div className={styles.profileImgContainer}>
							<Image
								src={'/profile-image-placeholder.png'}
								layout={'responsive'}
								width={100}
								height={100}
							/>
						</div>
					</Link>
				) : (
					<Link href={`/profile/${cookie}`} className={`${styles.headerBtn}`}>
						My Profile
					</Link>
				)}
				<Link href={`/explore`} className={`${styles.headerBtn}`}>
					Explore
				</Link>
			</div>
			<div className={styles.logoContainer}>
				<Image
					src={`/viktors-amazing-image-app-logo.png`}
					width={100}
					height={100}
					layout={`responsive`}
				/>
			</div>
			<Link href={`/`} className={`${styles.headerBtn}`}>
				Home
			</Link>
		</header>
	);
};

export default Header;
