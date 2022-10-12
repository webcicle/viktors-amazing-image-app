import axios from 'axios';
import { ImCheckmark2 } from 'react-icons/im';
import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
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

interface UserWithFollowersAndCount extends UserWithFollowerCounts {
	followers: Follows[];
}

type Props = {
	setIsLoading: Dispatch<SetStateAction<boolean>>;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
	cookie: string;
	updatedUserProfile:
		| { [key: string]: string & { [key: string]: Follows[] } }
		| UserWithFollowerCounts;
	setUpdatedUserProfile: Dispatch<SetStateAction<UserWithFollowerCounts>>;
	id: string;
};

type UserWithFollowers = { [key: string]: string };

const UpdateForm = ({
	setIsLoading,
	setIsSuccess,
	cookie,
	updatedUserProfile,
	setUpdatedUserProfile,
	id,
}: Props) => {
	const [isClaimProfile, setIsClaimProfile] = useState<boolean>(false);
	const [alias, setAlias] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordTwo, setPasswordTwo] = useState<string>('');
	const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
	const [errors, setErrors] = useState<{ [key: string]: string }>({
		userName: '',
		alias: '',
		password: '',
		passwordConfirm: '',
	});

	const followers = updatedUserProfile.followers as Follows[];
	const getIsFollowing =
		followers?.filter((f) => f.followerId === cookie).length > 0 ? true : false;
	const [isFollowing, setIsFollowing] = useState<boolean>(getIsFollowing);

	const unRef = useRef<HTMLInputElement | null>(null);
	const aliRef = useRef<HTMLInputElement | null>(null);
	const pwRef = useRef<HTMLInputElement | null>(null);
	const pw2Ref = useRef<HTMLInputElement | null>(null);

	const getClaimButtonFace = () => {
		if (isClaimProfile) return 'Cancel';
		if (!isClaimProfile && !updatedUserProfile.claimed)
			return 'Claim your user profile!';
		if (!isClaimProfile && updatedUserProfile.claimed)
			return 'Update your user profile';
	};

	const regex =
		/[a-zA-Z0-9]{8}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{4}\b-[a-zA-Z0-9]{12}/;

	const claimUserProfile = async (e: FormEvent) => {
		e.preventDefault();
		const data = {
			alias,
			userName: username,
			password,
			passwordConfirm: passwordTwo,
		};
		try {
			setIsLoading(true);
			const updateRes = await axios.put('/api/user', data);

			if (updateRes.data.success === false && updateRes.data.error) {
				setIsLoading(false);
				console.log('error', updateRes);
				setErrors({
					userName: '',
					alias: '',
					password: '',
					passwordConfirm: '',
				});
				updateRes.data.error.issues.forEach(
					(err: typeof updateRes.data.error.issues[0]) => {
						setErrors((prev) => ({ ...prev, [err.path[0]]: err.message }));
						return;
					}
				);
				return;
			}

			setIsLoading(false);
			setIsSuccess(true);

			setUploadSuccess(true);
			setUpdatedUserProfile(
				updateRes.data.updatedUser as UserWithFollowerCounts
			);
			Router.reload();
			return;
		} catch (error) {
			if (error) {
			}
		}
	};

	const isMobile = useMediaQuery(450, false);
	const dynamic = isMobile ? '245px' : '155px';
	const topInfoDynamicStyles = {
		minHeight: isClaimProfile ? dynamic : '0px',
	};
	const infoRows = {
		display: isClaimProfile && !isMobile ? 'flex' : 'block',
		gap: '0.3em',
	};

	const isOwnProfile = updatedUserProfile?.id === cookie;

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.currentTarget;
		if (name === 'userName') return setUsername(value);
		if (name === 'password') return setPassword(value);
		if (name === 'passwordConfirm') return setPasswordTwo(value);
		return setAlias(value);
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

	useEffect(() => {
		if (uploadSuccess === true) {
			const reset = setTimeout(() => {
				setAlias('');
				setUsername('');
				setPassword('');
				setPasswordTwo('');
				setUploadSuccess(false);
				setErrors({
					userName: '',
					alias: '',
					password: '',
					passwordTwo: '',
				});
			}, 2000);
			return () => {
				clearTimeout(reset);
			};
		}
	}, [uploadSuccess]);

	return (
		<form onSubmit={(e) => claimUserProfile(e)} className={styles.profileInfo}>
			<div className={styles.topInfo} style={topInfoDynamicStyles}>
				<div style={infoRows}>
					{isClaimProfile ? (
						<FormInput
							ref={unRef}
							errors={errors}
							type={'text'}
							value={alias}
							handleInputChange={handleInputChange}
							name={'alias'}
							updatedUserProfile={
								updatedUserProfile as { [key: string]: string }
							}
						/>
					) : (
						<p className={styles.profileName}>
							{regex.test(updatedUserProfile?.alias)
								? 'unknownuser' + updatedUserProfile?.alias.split('-').pop()
								: updatedUserProfile?.alias}
						</p>
					)}
					{isClaimProfile ? (
						<FormInput
							ref={aliRef}
							errors={errors}
							type={'text'}
							value={username}
							handleInputChange={handleInputChange}
							name={'userName'}
							updatedUserProfile={
								updatedUserProfile as { [key: string]: string }
							}
						/>
					) : (
						<p className={styles.profileUsername}>
							@
							{regex.test(updatedUserProfile?.userName)
								? 'unknownusername' +
								  updatedUserProfile?.userName.split('-').pop()
								: updatedUserProfile?.userName}
						</p>
					)}
				</div>
				{!isClaimProfile && (
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
						{id === cookie && (
							<button
								type='button'
								onClick={(e) => setIsClaimProfile((prev) => !prev)}
								className={styles.claimProfile}>
								{getClaimButtonFace()}
							</button>
						)}
						{isClaimProfile && (
							<button type='submit' className={styles.claimProfile}>
								Claim
							</button>
						)}
					</div>
				)}
				{isClaimProfile && (
					<div style={infoRows}>
						<FormInput
							ref={pwRef}
							type={'password'}
							errors={errors}
							value={password}
							handleInputChange={handleInputChange}
							name={'password'}
							updatedUserProfile={
								updatedUserProfile as { [key: string]: string }
							}
						/>

						<FormInput
							ref={pw2Ref}
							type={'password'}
							errors={errors}
							value={passwordTwo}
							handleInputChange={handleInputChange}
							name={'passwordConfirm'}
							updatedUserProfile={
								updatedUserProfile as { [key: string]: string }
							}
						/>
					</div>
				)}
			</div>
			{isClaimProfile && (
				<div className={styles.profileButtons}>
					{isOwnProfile ? (
						<button
							type='button'
							disabled={isOwnProfile as boolean}
							className={styles.followBtn}>
							Follow <ImCheckmark2 />
						</button>
					) : (
						<button type='button' className={styles.followBtn}>
							Follow
						</button>
					)}
					{id === cookie && (
						<button
							type='button'
							onClick={(e) => setIsClaimProfile((prev) => !prev)}
							className={styles.claimProfile}>
							{getClaimButtonFace()}
						</button>
					)}
					{isClaimProfile && (
						<button type='submit' className={styles.claimProfile}>
							{updatedUserProfile.claimed ? 'Update' : 'Claim'}
						</button>
					)}
				</div>
			)}
		</form>
	);
};

export default UpdateForm;
