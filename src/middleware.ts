import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/session';

const authPaths = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const path = request.nextUrl.pathname;

  if (!session.user?.id && !authPaths.includes(path)) {
    const url = new URL('/signin', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)'
  ]
};
