import { Follows, Image, User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ImageDisplay, Profile } from '../../components';
import MainLayout from '../../layouts/main';
import getSignedCfUrl from '../../lib/apiHelpers/getSignedCfUrl';
import prisma from '../../prisma/client';
import { ModdedImage } from '../api/image';

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
	userName: string;
	_count: { followers: number; following: number; uploads: number };
	password?: string | null;
}

type Props = {
	cookie: string;
	userProfile: UserWithFollowerCounts;
	uploads: ProfileThumbnails[];
};

const ProfilePage: React.FC<Props> = ({ userProfile, uploads, cookie }) => {
	console.log(userProfile);

	return (
		<MainLayout cookie={cookie}>
			<Profile userProfile={userProfile} cookie={cookie} />
			<ImageDisplay feedName={'Your uploads'} images={uploads} />
		</MainLayout>
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

	const uploadsWithUrls = await getSignedCfUrl(userProfile?.uploads!);

	const userProfileWOImages = { ...userProfile };
	delete userProfileWOImages.uploads;
	delete userProfileWOImages.password;

	return {
		props: {
			cookie,
			userProfile: JSON.parse(JSON.stringify(userProfileWOImages)),
			uploads: JSON.parse(JSON.stringify(uploadsWithUrls)),
		},
	};
};

export default ProfilePage;
