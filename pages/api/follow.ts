import { Comment } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

interface Data {}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data | string>
) {
	const { body, cookies, method } = req;

	switch (method) {
		case 'PUT': {
			try {
				const deleteFollow = await prisma.follows.delete({
					where: {
						followerId_followingId: {
							followerId: body.followerId,
							followingId: body.followingId,
						},
					},
				});
				res.status(204).end();
			} catch (error) {
				throw new Error(error as string);
			}
			break;
		}
		case 'POST': {
			try {
				const newFollower = await prisma.follows.create({
					data: {
						followerId: body.followerId,
						followingId: body.followingId,
					},
				});
				res.status(201).send({ message: 'User followed', newFollower });
			} catch (error) {
				console.error(error as string);
			}
			break;
		}
		case 'GET': {
			break;
		}

		default:
			break;
	}
}
