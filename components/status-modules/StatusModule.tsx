import { Dispatch, SetStateAction } from 'react';
import { ImSpinner6 } from 'react-icons/im';
import { FaCheckCircle } from 'react-icons/fa';
import styles from './Status.module.css';

type Props = {
	type: string;
	minHeight: string;
	minWidth: string;
	setStatus?: Dispatch<SetStateAction<boolean>>;
};

function StatusModule({ type, minHeight, minWidth, setStatus }: Props) {
	const dynamicStyles = {
		backgroundColor: type === 'loading' ? 'var(--bg-gray-400)' : 'limegreen',
		minHeight: minHeight,
		minWidth: minWidth,
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
			{type === 'updateProfile' && (
				<div className={styles.bannerContainer}>
					<p className={styles.successBanner}>Profile updated</p>
					<button
						className={styles.closeBtn}
						onClick={(e) => setStatus!(false)}>
						<FaCheckCircle className={styles.checkmark} />
					</button>
				</div>
			)}
		</div>
	);
}

export default StatusModule;
