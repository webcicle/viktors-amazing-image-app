import { User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { UserWithFollowers } from '../../pages/profile/[id]';
import styles from './Profile.module.css';
import { ImCheckmark2 } from 'react-icons/im';

type Props = {
	userProfile: UserWithFollowers;
	cookie: string;
};

const ProfileComponent: React.FC<Props> = ({ cookie, userProfile }) => {
	const regex =
		/[a-zA-Z0-9]{8}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{12}/;
	const isFollowing =
		userProfile?.id === cookie ||
		userProfile?.followers?.find(
			(follower) => follower?.followerId === userProfile?.id[0]
		);

	return (
		<div className={styles.profile}>
			<div className={styles.profileDetails}>
				<div className={styles.profileImgContainer}>
					<Image
						src={userProfile?.profileImage ?? '/profile-image-placeholder.png'}
						layout={'responsive'}
						width={100}
						height={100}
					/>
				</div>
				<div className={styles.profileInfo}>
					<p className={styles.profileName}>
						{regex.test(userProfile?.userName)
							? 'unknownuser' + userProfile?.userName.split('-').pop()
							: userProfile?.userName}
					</p>
					<p className={styles.profileUsername}>
						@
						{regex.test(userProfile?.userName)
							? 'unknownusername' + userProfile?.alias.split('-').pop()
							: userProfile?.alias}
					</p>
					<div className={styles.profileButtons}>
						{isFollowing ? (
							<button disabled={true} className={styles.followBtn}>
								Follow <ImCheckmark2 />
							</button>
						) : (
							<button className={styles.followBtn}>Follow</button>
						)}
						<button className={styles.claimProfile}>
							Claim your username!
						</button>
					</div>
					<div className={styles.statBoxes}>
						<div className={styles.statBox}>
							<p>{userProfile?.followers?.length.toString() ?? 0}</p>
							<p>{`Followers`}</p>
						</div>
						<div className={styles.statBox}>
							<p>{userProfile?.following?.length.toString() ?? 0}</p>
							<p>{`Following`}</p>
						</div>
						<div className={styles.statBox}>
							<p>{userProfile?.uploads?.length.toString() ?? 0}</p>
							<p>{userProfile?.uploads?.length === 1 ? `Post` : `Posts`}</p>
						</div>
					</div>
				</div>
			</div>
			<div></div>
		</div>
	);
};

export default ProfileComponent;
