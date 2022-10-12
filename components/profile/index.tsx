import Image from 'next/image';
import styles from './Profile.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

import UpdateForm from './UpdateForm';
import StatusModule from '../status-modules/StatusModule';
import { UserWithFollowerCounts } from '../../pages/profile/[id]';

type UpdatedUserProfile = { [key: string]: string | { [key: string]: string } };

type Props = {
	userProfile: UserWithFollowerCounts;
	cookie: string;
};

const ProfileComponent: React.FC<Props> = ({ cookie, userProfile }) => {
	const [updatedUserProfile, setUpdatedUserProfile] =
		useState<UserWithFollowerCounts>(userProfile);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	console.log({ isLoading, isSuccess });

	const {
		query: { id },
	} = useRouter();

	return (
		<div className={styles.profile}>
			<div className={styles.profileDetails}>
				<div className={styles.topBit}>
					{isLoading && (
						<StatusModule
							type={'loading'}
							minHeight={'155px'}
							minWidth={'100%'}
						/>
					)}
					{isSuccess && (
						<StatusModule
							type={'updateProfile'}
							minHeight={'155px'}
							minWidth={'100%'}
							setStatus={setIsSuccess}
						/>
					)}
					<UpdateForm
						setIsLoading={setIsLoading}
						setIsSuccess={setIsSuccess}
						cookie={cookie}
						updatedUserProfile={updatedUserProfile as UserWithFollowerCounts}
						setUpdatedUserProfile={setUpdatedUserProfile}
						id={id as string}
					/>
				</div>
				<StatusBoxes userProfile={updatedUserProfile} />
			</div>
		</div>
		// <div className={styles.profile}>
		// 	<div className={styles.profileDetails}>
		// 		<div className={styles.topBit}>
		// 			<div className={styles.profileImgContainer}>
		// 				<Image
		// 					src={
		// 						updatedUserProfile?.profileImage ??
		// 						'/profile-image-placeholder.png'
		// 					}
		// 					layout={'responsive'}
		// 					width={100}
		// 					height={100}
		// 				/>
		// 			</div>
		// 			{isLoading && (
		// 				<StatusModule
		// 					type={'loading'}
		// 					minHeight={'155px'}
		// 					minWidth={'100%'}
		// 				/>
		// 			)}
		// 			{isSuccess && (
		// 				<StatusModule
		// 					type={'updateProfile'}
		// 					minHeight={'155px'}
		// 					minWidth={'100%'}
		// 					setStatus={setIsSuccess}
		// 				/>
		// 			)}
		// 			<UpdateForm
		// 				setIsLoading={setIsLoading}
		// 				setIsSuccess={setIsSuccess}
		// 				cookie={cookie}
		// 				updatedUserProfile={updatedUserProfile as UserWithFollowerCounts}
		// 				setUpdatedUserProfile={setUpdatedUserProfile}
		// 				id={id as string}
		// 			/>
		// 		</div>
		// 		<StatusBoxes userProfile={updatedUserProfile} />
		// 	</div>
		// </div>
	);
};

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

export default ProfileComponent;
