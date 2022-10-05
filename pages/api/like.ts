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
				const deleteLike = await prisma.like.delete({
					where: { id: body.id },
				});
				res.status(204);
			} catch (error) {
				throw new Error(error as string);
			}
			break;
		}
		case 'POST': {
			try {
				const newLike = await prisma.like.create({
					data: {
						userId: body.userId,
						type: body.type,
						imageId: body.type === 'image' ? body.imageId : body.commentId,
					},
				});
				res.status(201).send({ message: 'Like created', newLike });
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
