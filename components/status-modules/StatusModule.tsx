import { ReactNode } from 'react';
import { ImSpinner6 } from 'react-icons/im';
import { FaCheckCircle } from 'react-icons/fa';
import styles from './Status.module.css';

type Props = {
	type: string;
};

function StatusModule({ type }: Props) {
	const dynamicStyles = {
		backgroundColor: type === 'loading' ? 'var(--bg-gray-400)' : 'limegreen',
	};

	return (
		<div className={styles.wrapper} style={dynamicStyles}>
			{type === 'loading' && <ImSpinner6 className={styles.loading} />}
			{type === 'success' && (
				<div className={styles.bannerContainer}>
					<p className={styles.successBanner}>Image uploaded successfully</p>
					<FaCheckCircle className={styles.checkmark} />
				</div>
			)}
		</div>
	);
}

export default StatusModule;
