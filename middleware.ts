import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import cuid from 'cuid';

export function middleware(request: NextRequest) {
	const cookie = request.cookies.get('vikAmazimg');
	if (!cookie) {
		const response = NextResponse.next();
		const cookieValue = cuid();
		response.cookies.set('vikAmazimg', cookieValue);

		return response;
	}
}
