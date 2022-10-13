import Image from 'next/image';
import styles from './Profile.module.css';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import UpdateForm from './UpdateForm';
import StatusModule from '../status-modules/StatusModule';
import { UserWithFollowerCounts } from '../../pages/profile/[id]';
import ProfileInfo from './ProfileInfo';
import StatusBoxes from './StatusBoxes';
import ProfileButtons from './ProfileButtons';
import { FormContextProps, ProfileContext } from './formContext';

type UpdatedUserProfile = { [key: string]: string | { [key: string]: string } };

type Props = {
	userProfile: UserWithFollowerCounts;
	cookie: string;
};

const ProfileComponent: React.FC<Props> = ({ cookie, userProfile }) => {
	const [isClaimProfile, setIsClaimProfile] = useState<boolean>(false);
	const [updatedUserProfile, setUpdatedUserProfile] =
		useState<UserWithFollowerCounts>(userProfile);

	const { formStatus } = useContext(ProfileContext) as FormContextProps;

	const isOwnProfile = updatedUserProfile?.id === cookie;

	const {
		query: { id },
	} = useRouter();

	const getFormMarkup = () => {
		switch (formStatus) {
			case 'init':
				return <ProfileInfo updatedUserProfile={updatedUserProfile} />;
				break;
			case 'form':
				return (
					<UpdateForm
						updatedUserProfile={updatedUserProfile as UserWithFollowerCounts}
					/>
				);
				break;
			case 'loading':
				return (
					<StatusModule
						type={'loading'}
						minHeight={'155px'}
						minWidth={'100%'}
					/>
				);
				break;
			case 'success':
				return (
					<StatusModule
						type={'updateProfile'}
						minHeight={'155px'}
						minWidth={'100%'}
					/>
				);
				break;
			default:
				return <p>There was an error</p>;
				break;
		}
	};

	return (
		<>
			<div className={styles.profileMain}>
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
				<div
					data-height={formStatus === 'form'}
					className={styles.formContainer}>
					{getFormMarkup()}
				</div>
				<ProfileButtons
					cookie={cookie}
					updatedUserProfile={updatedUserProfile}
					isOwnProfile={isOwnProfile}
				/>
				<StatusBoxes userProfile={updatedUserProfile} />
			</div>
		</>
	);
};

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
// 	);
// };

export default ProfileComponent;
