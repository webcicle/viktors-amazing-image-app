import axios from 'axios';
import { useRouter } from 'next/router';
import React, {
	Dispatch,
	SetStateAction,
	createContext,
	ReactNode,
	useState,
	ChangeEvent,
	FormEvent,
} from 'react';

export interface FormContextProps {
	alias: string;
	username: string;
	password: string;
	passwordConfirm: string;
	formStatus: string;
	errors: { [key: string]: string };
	handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	setAlias: Dispatch<SetStateAction<string>>;
	setUsername: Dispatch<SetStateAction<string>>;
	setPassword: Dispatch<SetStateAction<string>>;
	setPasswordConfirm: Dispatch<SetStateAction<string>>;
	setFormStatus: Dispatch<SetStateAction<string>>;
	setErrors: Dispatch<
		SetStateAction<{
			[key: string]: string;
		}>
	>;
	reset: () => void;
	updateUserProfile: (e: FormEvent) => Promise<void>;
}

export const ProfileContext = createContext<FormContextProps | null>(null);

type ProviderProps = {
	children: ReactNode;
};

const FormContextProvider: React.FC<ProviderProps> = ({ children }) => {
	const router = useRouter();

	const [alias, setAlias] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
	const [formStatus, setFormStatus] = useState<string>('init');
	const errorDefaults = {
		username: '',
		alias: '',
		password: '',
		passwordTwo: '',
	};
	const [errors, setErrors] = useState<{ [key: string]: string }>(
		errorDefaults
	);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;
		if (name === 'username') return setUsername(value);
		if (name === 'password') return setPassword(value);
		if (name === 'passwordConfirm') return setPasswordConfirm(value);
		return setAlias(value);
	};

	const updateUserProfile = async (e: FormEvent) => {
		e.preventDefault();
		const data = {
			alias,
			username: username,
			password,
			passwordConfirm,
		};
		try {
			setFormStatus('loading');
			const updateRes = await axios.put('/api/user', data);

			if (updateRes.data.success === false && updateRes.data.error) {
				setFormStatus('form');
				setErrors(errorDefaults);
				updateRes.data.error.issues.forEach(
					(err: typeof updateRes.data.error.issues[0]) => {
						setErrors((prev) => ({ ...prev, [err.path[0]]: err.message }));
						return;
					}
				);
				return;
			}

			setFormStatus('success');

			router.reload();
			return;
		} catch (error) {
			if (error) {
			}
		}
	};

	const reset = () => {
		setAlias('');
		setUsername('');
		setPassword('');
		setPasswordConfirm('');
		setErrors(errorDefaults);
	};

	const contextProps = {
		alias,
		username,
		password,
		passwordConfirm,
		setAlias,
		setUsername,
		setPassword,
		setPasswordConfirm,
		handleInputChange,
		reset,
		errors,
		formStatus,
		setFormStatus,
		setErrors,
		updateUserProfile,
	};

	return (
		<ProfileContext.Provider value={contextProps}>
			{children}
		</ProfileContext.Provider>
	);
};

export default FormContextProvider;
