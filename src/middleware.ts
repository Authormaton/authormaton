import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/jwt';

export async function middleware(request: NextRequest) {
  // Skip authentication for Next.js internal paths and static assets
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.startsWith('/api/static')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (token) {
    try {
      await verifyJWT(token);
      // If JWT is valid, continue to the requested page
      return NextResponse.next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      // If JWT is invalid, redirect to sign-in page
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // If no token, redirect to sign-in page for protected routes
  // You might want to define which routes are protected
  if (request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)_protected', '/projects/:path*']
};
