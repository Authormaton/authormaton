import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/dashboard']
  const publicRoutes = ['/auth/signin', '/auth/signup', '/']
  
  const { pathname } = request.nextUrl

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname === route)

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      // Redirect to sign-in if no token
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    try {
      const payload = await verifyJWT(token)
      if (!payload) {
        // Redirect to sign-in if token is invalid
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }

      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-email', payload.email)
      requestHeaders.set('x-user-role', payload.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('Middleware auth error:', error)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isPublicRoute && pathname.startsWith('/auth')) {
    const token = request.cookies.get('auth-token')?.value
    
    if (token) {
      try {
        const payload = await verifyJWT(token)
        if (payload) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      } catch {
        // Token is invalid, let them proceed to auth pages
      }
    }
  }

  return NextResponse.next()
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
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
