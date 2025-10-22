'use server';

import { getIronSession, unsealData } from 'iron-session';
import { cookies } from 'next/headers';
import { cookieName, IS_PRODUCTION } from './constants';
import { AUTH_SECRET } from './env';
import { NextRequest } from 'next/server';

export type SessionData = {
  user?: {
    id: string;
  };
};

const sessionOptions = {
  password: AUTH_SECRET,
  cookieName: cookieName,
  cookieOptions: {
    secure: IS_PRODUCTION,
    httpOnly: true
  }
};

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}

// Edge-safe session retrieval for middleware
export async function getEdgeSession(request: NextRequest): Promise<SessionData> {
  try {
    const cookie = request.cookies.get(cookieName);

    if (!cookie?.value) {
      return {};
    }

    const sessionData = await unsealData<SessionData>(cookie.value, {
      password: AUTH_SECRET
    });

    return sessionData || {};
  } catch (error) {
    console.error('Error getting edge session:', error);
    return {};
  }
}
