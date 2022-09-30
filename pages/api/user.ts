// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';
import { ZodIssue } from 'zod';
import updateUser from '../../lib/apiHelpers/updateUser';

interface Data {
	newUser?: User;
	singleUser?: User;
	updatedUser?: User | { success: boolean; error: any };
	error?: ZodIssue[];
	user?: User;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
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
			console.log({ get: body });

			const user = await prisma.user.findUnique({ where: { id: req.body } });
			res.status(200).send({ user: user as User });

			break;
		}

		default:
			break;
	}
}
