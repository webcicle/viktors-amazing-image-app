import React, { ChangeEvent } from 'react';
import { UserWithFollowerCounts } from '../../lib/apiHelpers/updateUser';
import styles from './Profile.module.css';

interface InputProps {
	name: string; //input name
	handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	updatedUserProfile: { [key: string]: string };
	errors: { [key: string]: string };
	value: string;
	type: string;
}

const FormInput: React.FC<InputProps> = ({
	errors,
	value,
	type,
	handleInputChange,
	name,
	updatedUserProfile,
}) => {
	const placeholder = updatedUserProfile[name];

	const regex =
		/[a-zA-Z0-9]{8}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{12}/;

	return (
		<div className={styles.inputContainer}>
			<label className={styles.inputLabel} htmlFor={name}>
				{name}
			</label>
			<input
				className={styles.profileInput}
				name={name}
				type={type}
				onChange={handleInputChange}
				value={value}
				id={name}
				placeholder={
					name !== 'password' && regex.test(placeholder)
						? 'unknownuser' + placeholder.split('-').pop()
						: placeholder
				}
			/>
			<p className={styles.errorOutput}>{errors.alias}</p>
		</div>
	);
};

export default FormInput;
