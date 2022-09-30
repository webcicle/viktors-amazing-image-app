import { User } from '@prisma/client';
import { m } from 'framer-motion';
import { z, ZodError } from 'zod';
import { UserWithFollowers } from '../../pages/profile/[id]';
import prisma from '../../prisma/client';
import bcrypt from 'bcrypt';

export interface UserWithFollowerCounts extends User {
	_count: { followers: number; following: number; uploads: number };
}

const userUpdateReqValidated = z
	.object({
		alias: z
			.string()
			.min(2, { message: 'Alias must be at least 2 characters long' })
			.max(50, {
				message: 'Alias needs to be less than 50 characters long',
			})
			.trim(),
		userName: z
			.string()
			.min(2, {
				message: 'Username must be at least 2 character long',
			})
			.max(50, {
				message: 'Username needs to be less than 50 characters long',
			})
			.trim(),
		password: z
			.string()
			.min(2, { message: 'Password must be at least 2 characters long' })
			.max(50, {
				message: 'Password needs to be less than 50 characters long',
			})
			.trim(),
		passwordConfirm: z
			.string()
			.min(1, { message: 'Password must be at least 2 characters long' })
			.max(50, {
				message: 'Password needs to be less than 50 characters long',
			})
			.trim(),
		cookie: z.string().trim(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: `Passwords don't match, son`,
		path: ['passwordTwo'],
	});

const Count = z.object({
	followers: z.number(),
	following: z.number(),
	uploads: z.number(),
});

const userUpdateResValidated = z.object({
	id: z.string(),
	alias: z.string().trim(),
	userName: z.string().trim(),
	profileImage: z.string().nullable(),
	_count: Count,
});

export default async function updateUser(requestData: any): Promise<{
	success: boolean;
	error: any;
	updatedUser?: UserWithFollowerCounts;
}> {
	let updatedUser = {} as UserWithFollowerCounts;

	try {
		const data = userUpdateReqValidated.parse(requestData);

		const hash = await bcrypt.hash(data.password, 14);

		updatedUser = await prisma.user.update({
			data: {
				userName: data.userName,
				alias: data.alias,
				password: hash,
			},
			include: {
				_count: {
					select: {
						followers: true,
						following: true,
						uploads: true,
					},
				},
			},
			where: { id: requestData.cookie },
		});
	} catch (error) {
		if (error instanceof ZodError) {
			return { success: false, error };
		}
	}
	return {
		success: true,
		error: null,
		// updatedUser,
		updatedUser: userUpdateResValidated.parse(
			updatedUser
		) as UserWithFollowerCounts,
	};
}
