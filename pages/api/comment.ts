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
							userName: true,
							profileImage: true,
						},
					},
				},
			});
			res
				.status(201)
				.send({ message: 'Comment created successfully', newComment });
			break;
		}
		case 'GET': {
			break;
		}

		default:
			break;
	}
}
