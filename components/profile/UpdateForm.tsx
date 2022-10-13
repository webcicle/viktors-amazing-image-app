import axios from 'axios';
import { ImCheckmark2 } from 'react-icons/im';
import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useContext,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { UserWithFollowerCounts } from '../../pages/profile/[id]';
import styles from './Profile.module.css';
import FormInput from './FormInput';
import { Follows } from '@prisma/client';
import Router from 'next/router';
import { FormContextProps, ProfileContext } from './formContext';

interface UserWithFollowersAndCount extends UserWithFollowerCounts {
	followers: Follows[];
}

type Props = {
	updatedUserProfile:
		| { [key: string]: string & { [key: string]: Follows[] } }
		| UserWithFollowerCounts;
};

type UserWithFollowers = { [key: string]: string };

const UpdateForm = ({ updatedUserProfile }: Props) => {
	const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

	const unRef = useRef<HTMLInputElement | null>(null);
	const aliRef = useRef<HTMLInputElement | null>(null);
	const pwRef = useRef<HTMLInputElement | null>(null);
	const pw2Ref = useRef<HTMLInputElement | null>(null);

	const {
		alias,
		errors,
		handleInputChange,
		password,
		passwordConfirm,
		reset,
		username,
		updateUserProfile,
	} = useContext(ProfileContext) as FormContextProps;

	const isMobile = useMediaQuery(450, false);

	useEffect(() => {
		if (uploadSuccess === true) {
			const resetTimer = setTimeout(reset, 2000);
			return () => {
				clearTimeout(resetTimer);
			};
		}
	}, [uploadSuccess]);

	return (
		<form
			onSubmit={(e) => updateUserProfile(e)}
			className={styles.updateProfileForm}>
			<div className={styles.inputRow}>
				<FormInput
					ref={unRef}
					errors={errors}
					type={'text'}
					value={alias}
					handleInputChange={handleInputChange}
					name={'alias'}
					updatedUserProfile={updatedUserProfile as { [key: string]: string }}
				/>
				<FormInput
					ref={aliRef}
					errors={errors}
					type={'text'}
					value={username}
					handleInputChange={handleInputChange}
					name={'userName'}
					updatedUserProfile={updatedUserProfile as { [key: string]: string }}
				/>
			</div>

			<div className={styles.inputRow}>
				<FormInput
					ref={pwRef}
					type={'password'}
					errors={errors}
					value={password}
					handleInputChange={handleInputChange}
					name={'password'}
					updatedUserProfile={updatedUserProfile as { [key: string]: string }}
				/>

				<FormInput
					ref={pw2Ref}
					type={'password'}
					errors={errors}
					value={passwordConfirm}
					handleInputChange={handleInputChange}
					name={'passwordConfirm'}
					updatedUserProfile={updatedUserProfile as { [key: string]: string }}
				/>
			</div>
		</form>
	);
};

export default UpdateForm;
