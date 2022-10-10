import React, { ChangeEvent, useImperativeHandle } from 'react';
import { UserWithFollowerCounts } from '../../pages/profile/[id]';
import styles from './Profile.module.css';

interface InputProps {
	name: string; //input name
	handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	updatedUserProfile: { [key: string]: string };
	errors: { [key: string]: string };
	value: string;
	type: string;
}

const FormInput = React.forwardRef<HTMLInputElement, InputProps>(
	(props, ref) => {
		const { errors, value, type, handleInputChange, name, updatedUserProfile } =
			props;
		const placeholder = updatedUserProfile[name];

		const isPassword = name === 'password' || name === 'passwordTwo';

		const regex =
			/[a-zA-Z0-9]{8}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{12}/;

		return (
			<div className={styles.inputContainer}>
				<label className={styles.inputLabel} htmlFor={name}>
					{name}
				</label>
				<input
					ref={ref}
					className={styles.profileInput}
					name={name}
					type={type}
					onChange={handleInputChange}
					value={value}
					id={name}
					placeholder={`Enter your ${name}`}
				/>
				<p className={styles.errorOutput}>{errors.alias}</p>
			</div>
		);
	}
);

FormInput.displayName = 'FormInput';

export default FormInput;
