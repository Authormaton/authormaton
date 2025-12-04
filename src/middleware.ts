import { NextRequest, NextResponse } from 'next/server';
import { safeParseJWT } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early return for static assets and Next.js internals
  // This improves performance by skipping unnecessary authentication checks
  // for publicly accessible files.
  if (
    pathname.startsWith('/_next') || // Exclude Next.js internal paths (e.g., /_next/static, /_next/image)
    pathname.startsWith('/favicon.ico') || // Exclude favicon requests
    pathname.startsWith('/signin') || // Exclude sign-in page
    pathname.startsWith('/signup') // Exclude sign-up page
  ) {
    return NextResponse.next();
  }

  // Safely retrieve the authentication token from cookies.
  const token = request.cookies.get('auth_token')?.value;

  // If a token is present, attempt to verify it.
  if (typeof token === 'string' && token.length > 0) {
    const result = safeParseJWT(token);
    // If the token is valid, allow the request to proceed.
    if (result.success) {
      return NextResponse.next();
    } else {
      // If token verification fails, log the error and redirect to the sign-in page.
      // This catches expired or malformed tokens.
      console.error('JWT verification failed:', result.error);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // If no valid token is found, check if the requested path is a protected route.
  // Protected routes require active authentication.
  if (pathname.startsWith('/protected') || pathname.startsWith('/projects')) {
    // For protected routes without a valid token, redirect the user to the sign-in page.
    // This enforces access control for sensitive areas of the application.
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // For all other public routes or routes not explicitly protected,
  // allow the request to proceed without requiring authentication.
  return NextResponse.next();
}

export const config = {
  // Apply the middleware to all routes except those explicitly excluded.
  // This ensures that authentication logic runs only where necessary, improving performance.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)']
};
