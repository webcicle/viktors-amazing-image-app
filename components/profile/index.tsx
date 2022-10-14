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
	const { formStatus } = useContext(ProfileContext) as FormContextProps;

	const isOwnProfile = userProfile?.id === cookie;

	const {
		query: { id },
	} = useRouter();

	const getFormMarkup = () => {
		switch (formStatus) {
			case 'init':
				return <ProfileInfo updatedUserProfile={userProfile} />;
				break;
			case 'form':
				return <UpdateForm />;
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
						src={userProfile?.profileImage ?? '/profile-image-placeholder.png'}
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
					updatedUserProfile={userProfile}
					isOwnProfile={isOwnProfile}
				/>
				<StatusBoxes userProfile={userProfile} />
			</div>
		</>
	);
};

export default ProfileComponent;
