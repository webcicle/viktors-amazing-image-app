import { Comment } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

interface Data {}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data | string>
) {
	const { body, method } = req;

	switch (method) {
		case 'PUT': {
			break;
		}
		case 'POST': {
			try {
				const newFlame = await prisma.flame.create({
					data: {
						flamerId: body.flamerId,
						imageId: body.imageId,
					},
				});
				res.status(201).send({ message: 'Flame created', newFlame });
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
