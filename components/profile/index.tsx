import Image from 'next/image';
import styles from './Profile.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { UserWithFollowerCounts } from '../../lib/apiHelpers/updateUser';
import UpdateForm from './UpdateForm';
import StatusModule from '../status-modules/StatusModule';

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

	const {
		query: { id },
	} = useRouter();
	console.log({ isLoading, isSuccess });

	return (
		<div className={styles.profile}>
			<div className={styles.profileDetails}>
				<div className={styles.topBit}>
					<div className={styles.profileImgContainer}>
						<Image
							src={
								updatedUserProfile?.profileImage ??
								'/profile-image-placeholder.png'
							}
							layout={'responsive'}
							width={100}
							height={100}
						/>
					</div>
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
					{!isLoading && !isSuccess && (
						<UpdateForm
							setIsLoading={setIsLoading}
							setIsSuccess={setIsSuccess}
							cookie={cookie}
							updatedUserProfile={updatedUserProfile as UserWithFollowerCounts}
							setUpdatedUserProfile={setUpdatedUserProfile}
							id={id as string}
						/>
					)}
				</div>
				<div className={styles.statBoxes}>
					<div className={styles.statBox}>
						<p>{updatedUserProfile?._count.followers ?? 0}</p>
						<p>{`Followers`}</p>
					</div>
					<div className={styles.statBox}>
						<p>{updatedUserProfile?._count.following ?? 0}</p>
						<p>{`Following`}</p>
					</div>
					<div className={styles.statBox}>
						<p>{updatedUserProfile?._count.uploads ?? 0}</p>
						<p>{updatedUserProfile?._count.uploads === 1 ? `Post` : `Posts`}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileComponent;
