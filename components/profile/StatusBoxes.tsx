import { UserWithFollowerCounts } from '../../pages/profile/[id]';
import styles from './Profile.module.css';

interface StatusProps {
	userProfile: UserWithFollowerCounts;
}

const StatusBoxes: React.FC<StatusProps> = ({ userProfile }) => {
	return (
		<div className={styles.statBoxes}>
			<div className={styles.statBox}>
				<p>{userProfile?._count.followers ?? 0}</p>
				<p>{`Followers`}</p>
			</div>
			<div className={styles.statBox}>
				<p>{userProfile?._count.following ?? 0}</p>
				<p>{`Following`}</p>
			</div>
			<div className={styles.statBox}>
				<p>{userProfile?._count.uploads ?? 0}</p>
				<p>{userProfile?._count.uploads === 1 ? `Post` : `Posts`}</p>
			</div>
		</div>
	);
};

export default StatusBoxes;
