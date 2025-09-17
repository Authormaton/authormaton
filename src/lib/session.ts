import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { cookieName, IS_PRODUCTION } from './constants';
import { AUTH_SECRET } from './env';

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
