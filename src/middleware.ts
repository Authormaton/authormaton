import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early return for static assets and Next.js internals
  // This improves performance by skipping unnecessary authentication checks
  // for publicly accessible files.
  if (
    pathname.startsWith('/_next') || // Next.js internal paths (e.g., /_next/static, /_next/image)
    pathname.startsWith('/favicon.ico') || // Favicon
    pathname.startsWith('/public') // Assets in the public directory
  ) {
    return NextResponse.next();
  }

  const token: string | undefined = request.cookies.get('auth_token')?.value;

  // If a token exists, attempt to verify it
  if (token) {
    try {
      await verifyJWT(token);
      // If JWT is valid, allow the request to proceed to the intended destination.
      // This means the user is authenticated and authorized for the requested resource.
      return NextResponse.next();
    } catch (error: unknown) { // Explicitly type error as unknown
      console.error('JWT verification failed:', error);
      // If JWT is invalid or expired, redirect the user to the sign-in page.
      // This ensures that users with invalid tokens cannot access protected content.
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // If no token is present, check if the requested path is a protected route.
  // Protected routes require authentication.
  if (pathname.startsWith('/protected')) {
    // If it's a protected route and no valid token is found, redirect to sign-in.
    // This enforces authentication for specific parts of the application.
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // For all other routes (e.g., public pages, sign-in/sign-up pages themselves),
  // allow the request to proceed without authentication.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)_protected', '/projects/:path*']
};
