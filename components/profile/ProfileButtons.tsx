import styles from './Profile.module.css';
import axios from 'axios';
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import { UserWithFollowerCounts } from '../../pages/profile/[id]';
import { Follows } from '@prisma/client';
import { ImCheckmark2 } from 'react-icons/im';
import { FormContextProps, ProfileContext } from './formContext';
import { useRouter } from 'next/router';

interface ProfileButtonsProps {
	cookie: string;
	isOwnProfile: boolean;
	updatedUserProfile: UserWithFollowerCounts;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({
	cookie,
	isOwnProfile,
	updatedUserProfile,
}) => {
	const followers = updatedUserProfile.followers as Follows[];
	const getIsFollowing =
		followers?.filter((f) => f.followerId === cookie).length > 0 ? true : false;
	const [isFollowing, setIsFollowing] = useState<boolean>(getIsFollowing);

	const { formStatus, setFormStatus, updateUserProfile } = useContext(
		ProfileContext
	) as FormContextProps;

	const getClaimButtonFace = () => {
		if (formStatus === 'form') return 'Cancel';
		if (formStatus === 'init' && !updatedUserProfile.claimed)
			return 'Claim your user profile!';
		if (formStatus === 'init' && updatedUserProfile.claimed)
			return 'Update your user profile';
	};

	const clickToFollowUser = async () => {
		if (isFollowing) {
			try {
				setIsFollowing(false);
				const unfollow = await axios.put('/api/follow', {
					followerId: cookie,
					followingId: updatedUserProfile.id,
				});
				if (unfollow.status !== 204) return setIsFollowing(true);
				return;
			} catch (error) {
				return console.error(error);
			}
		}
		try {
			setIsFollowing(true);
			const follow = await axios.post('/api/follow', {
				followerId: cookie,
				followingId: updatedUserProfile.id,
			});
			if (follow.status !== 201) return setIsFollowing(false);
		} catch (error) {}
	};

	return (
		<div className={styles.profileButtons}>
			{isOwnProfile ? (
				<button
					type='button'
					disabled={isOwnProfile as boolean}
					className={styles.followBtn}>
					Follow <ImCheckmark2 />
				</button>
			) : (
				<button
					type='button'
					onClick={clickToFollowUser}
					className={styles.followBtn}>
					{isFollowing ? 'Unfollow' : 'Follow'}
				</button>
			)}

			{isOwnProfile && (
				<button
					type='button'
					onClick={
						formStatus === 'init'
							? (_) => setFormStatus('form')
							: (_) => setFormStatus('init')
					}
					className={styles.claimProfile}>
					{getClaimButtonFace()}
				</button>
			)}

			{formStatus === 'form' && (
				<button
					onClick={updateUserProfile}
					type='submit'
					className={styles.claimProfile}>
					{!updatedUserProfile.claimed ? 'Claim' : 'Update'}
				</button>
			)}
		</div>
	);
};

export default ProfileButtons;
