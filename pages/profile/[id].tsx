import { Follows, Image, User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import React from 'react';
import { Profile } from '../../components';
import ProfileImages from '../../components/profile/ProfileImages';
import MainLayout from '../../layouts/main';
import { UserWithFollowerCounts } from '../../lib/apiHelpers/updateUser';
import prisma from '../../prisma/client';

export interface UserWithFollowers extends User {
	followers: Follows[];
	following: Follows[];
	uploads: Image[];
}

type Props = {
	cookie: string;
	userProfile: UserWithFollowerCounts;
};

const ProfilePage: React.FC<Props> = ({ userProfile, cookie }) => {
	return (
		<MainLayout cookie={cookie}>
			<Profile userProfile={userProfile} cookie={cookie} />
			<ProfileImages />
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
		},
	});

	return {
		props: {
			cookie,
			userProfile: JSON.parse(JSON.stringify(userProfile)),
		},
	};
};

export default ProfilePage;
