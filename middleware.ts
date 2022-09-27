import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import prisma from './prisma/client';
import axios from 'axios';

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const cookie = request.cookies.get('vikAmazimg');
	if (!cookie) {
		const cookie = nanoid();
		response.cookies.set('vikAmazimg', cookie);
	}

	return response;
}

export const config = {
	matcher: '/',
};
