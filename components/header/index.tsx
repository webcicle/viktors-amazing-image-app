import Link from 'next/link';
import styles from './Header.module.css';

type Props = {
	cookie: string;
};

const Header = ({ cookie }: Props) => {
	return (
		<header className={styles.header}>
			<Link href={`./profile/${cookie}`} className={`${styles.headerBtn}`}>
				My Profile
			</Link>
			<Link href={`/`} className={`${styles.headerBtn}`}>
				Home
			</Link>
		</header>
	);
};

export default Header;
