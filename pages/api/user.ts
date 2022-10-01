// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';
import { ZodIssue } from 'zod';
import updateUser, {
	UpdateUserResponse,
} from '../../lib/apiHelpers/updateUser';
import { UserWithFollowerCounts } from '../profile/[id]';

interface Data {
	newUser?: User;
	singleUser?: User;
	updatedUser?: {
		success: boolean;
		error: any;
		updatedUser?: UserWithFollowerCounts;
	};
	error?: ZodIssue[];
	user?: User;
}

type UpdatedUser = UpdateUserResponse;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data | UpdatedUser>
) {
	const { body, cookies, method } = req;

	switch (method) {
		case 'PUT': {
			const updatedUser = await updateUser({
				...body,
				cookie: cookies.vikAmazimg,
			});

			res.status(200).send(updatedUser);
			break;
		}
		case 'POST': {
			const newUser = await prisma.user.create({ data: {} });
			res.status(201).send({ newUser: newUser });

			break;
		}
		case 'GET': {
			const user = await prisma.user.findUnique({ where: { id: req.body } });
			res.status(200).send({ user: user as User });

			break;
		}

		default:
			break;
	}
}
