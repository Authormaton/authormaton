
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { cookieName, IS_PRODUCTION } from './constants';
import { AUTH_SECRET } from './env';

// Mock verifyJWT implementation for middleware usage
export async function verifyJWT(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  // TODO: Replace with real JWT verification logic
  if (!token || token === "invalid") return null;
  // Example payload
  return {
    userId: "example-id",
    email: "user@example.com",
    role: "user"
  };
}

export type SessionData = {
  user?: {
    id: string;
  };
};

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), {
    password: AUTH_SECRET,
    cookieName: cookieName,
    cookieOptions: {
      secure: IS_PRODUCTION,
      httpOnly: true
    }
  });

  return session;
}
