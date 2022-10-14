import { Comment } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

interface Data {
	message?: string;
	newComment?: Comment;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { body, cookies, method } = req;

	switch (method) {
		case 'PUT': {
			break;
		}
		case 'POST': {
			console.log({ body, cookies });

			try {
				const newComment = await prisma.comment.create({
					data: {
						imageId: body.imageId,
						userId: body.userId,
						comment: body.comment,
					},
					include: {
						user: {
							select: {
								id: true,
								alias: true,
								username: true,
								profileImage: true,
							},
						},
					},
				});
				res
					.status(201)
					.send({ message: 'Comment created successfully', newComment });
				return;
			} catch (error) {
				throw new Error(error as string);
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
