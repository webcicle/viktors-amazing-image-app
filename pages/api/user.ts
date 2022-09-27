// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

interface Data {
	newUser?: User;
	singleUser?: User;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { method } = req;
	switch (method) {
		case 'POST':
			const newUser = await prisma.user.create({ data: {} });
			res.status(201).send({ newUser: newUser });

			break;

		default:
			break;
	}
}
