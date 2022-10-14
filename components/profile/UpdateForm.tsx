import { useContext, useEffect, useRef, useState } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import { UserWithFollowerCounts } from '../../pages/profile/[id]';
import styles from './Profile.module.css';
import FormInput from './FormInput';
import { Follows } from '@prisma/client';
import { FormContextProps, ProfileContext } from './formContext';

type Props = {};

const UpdateForm = ({}: Props) => {
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
				/>
				<FormInput
					ref={aliRef}
					errors={errors}
					type={'text'}
					value={username}
					handleInputChange={handleInputChange}
					name={'username'}
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
				/>

				<FormInput
					ref={pw2Ref}
					type={'password'}
					errors={errors}
					value={passwordConfirm}
					handleInputChange={handleInputChange}
					name={'passwordConfirm'}
				/>
			</div>
		</form>
	);
};

export default UpdateForm;
