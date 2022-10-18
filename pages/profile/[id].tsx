import { Follows } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';
import getSignedCloudfrontUrl from '../../aws/getSignedCloudfrontUrl';
import { ImageDisplay, Profile } from '../../components';
import MainLayout from '../../layouts/main';
import prisma from '../../prisma/client';
import ProfileContextProvider from '../../components/profile/formContext';

interface UserOptional {
	id: string;
	username: string;
	alias: string;
	profileImage: string | null;
	createdAt: Date;
	updatedAt: Date;
	claimed: boolean;
	password?: string | null;
	uploads?: {
		id: string;
		created: Date;
		_count: { comments: number; dislikes: number; likes: number };
	}[];
}

export interface ProfileThumbnails {
	created: Date;
	id: string;
	url?: string;
	_count: { comments: number; dislikes: number; likes: number };
}

export interface UserWithFollowerCounts {
	alias: string;
	claimed: boolean;
	createdAt: Date | string;
	updatedAt: Date | string;
	id: string;
	profileImage: string | null;
	username: string;
	_count: { followers: number; following: number; uploads: number };
	password?: string | null;
	followers?: Follows[];
}

type Props = {
	cookie: string;
	userProfile: UserWithFollowerCounts;
	uploads: ProfileThumbnails[];
};

const ProfilePage: React.FC<Props> = ({ userProfile, uploads, cookie }) => {
	const isOwnProfile = userProfile.id === cookie;
	return (
		<ProfileContextProvider>
			<MainLayout page={'frontPage'} cookie={cookie}>
				<Profile userProfile={userProfile} cookie={cookie} />
				<ImageDisplay
					feedName={
						isOwnProfile ? 'Your uploads:' : `${userProfile.alias}'s uploads:`
					}
					images={uploads}
				/>
			</MainLayout>
		</ProfileContextProvider>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	const { id: profileId } = query;

	if (!profileId)
		return {
			redirect: { permanent: false, destination: '/' },
		};

	const cookie = req.cookies.vikAmazimg;

	const userProfile = await prisma.user.findFirst({
		where: { id: profileId as string },
		include: {
			_count: {
				select: {
					followers: true,
					following: true,
					uploads: true,
				},
			},
			followers: true,
			uploads: {
				select: {
					created: true,
					id: true,
					_count: {
						select: {
							comments: true,
							dislikes: true,
							likes: true,
						},
					},
				},

				orderBy: { created: 'desc' },
			},
		},
	});

	if (userProfile) {
		const images: ProfileThumbnails[] = userProfile?.uploads;

		for (const image of images) {
			const cfUrl = `${process.env.CF_ROOT_URL}/${image.id}`;

			image.url = await getSignedCloudfrontUrl(cfUrl);
		}

		const userProfileWOImages: UserOptional = { ...userProfile };
		delete userProfileWOImages.uploads;
		delete userProfileWOImages.password;

		return {
			props: {
				cookie,
				userProfile: JSON.parse(JSON.stringify(userProfileWOImages)),
				uploads: JSON.parse(JSON.stringify(images)),
			},
		};
	}
	return {
		props: {
			cookie,
		},
	};
};

export default ProfilePage;
