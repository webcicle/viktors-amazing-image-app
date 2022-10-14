import { UserWithFollowerCounts } from '../../pages/profile/[id]';
import styles from './Profile.module.css';

interface InfoProps {
	updatedUserProfile: UserWithFollowerCounts;
}

const ProfileInfo: React.FC<InfoProps> = ({ updatedUserProfile }) => {
	const regex =
		/[a-zA-Z0-9]{8}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{12}/;
	return (
		<div>
			<p className={styles.profileName}>
				{regex.test(updatedUserProfile?.alias)
					? 'unknownuser' + updatedUserProfile?.alias.split('-').pop()
					: updatedUserProfile?.alias}
			</p>
			<p className={styles.profileUsername}>
				@
				{regex.test(updatedUserProfile?.username)
					? 'unknownusername' + updatedUserProfile?.username.split('-').pop()
					: updatedUserProfile?.username}
			</p>
		</div>
	);
};

export default ProfileInfo;
