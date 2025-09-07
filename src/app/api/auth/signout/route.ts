import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Sign-out successful'
    })

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    })

    return response

  } catch (error) {
    console.error('Sign-out error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
