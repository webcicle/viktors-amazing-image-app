import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}

const prisma =
	global.prisma ||
	new PrismaClient({
		log: [
			{ emit: 'event', level: 'query' },
			{ emit: 'event', level: 'info' },
			{ emit: 'event', level: 'error' },
			{ emit: 'event', level: 'warn' },
		],
	});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
