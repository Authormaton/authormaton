import { NextRequest, NextResponse } from 'next/server';
import { getEdgeSession } from './lib/session';

const authPaths = ['/signin', '/signup'];

export async function middleware(request: NextRequest) {
  const session = await getEdgeSession(request);
  const path = request.nextUrl.pathname;

  const userId = session.user?.id;

  if (!userId && !authPaths.includes(path)) {
    const url = new URL('/signin', request.url);
    return NextResponse.redirect(url);
  } else if (userId && authPaths.includes(path)) {
    const url = new URL('/', request.url);
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
    
    // '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)'
  ]
};
