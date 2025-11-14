'use server';

import { getIronSession, unsealData } from 'iron-session';
import { cookies } from 'next/headers';
import { cookieName, IS_PRODUCTION } from './constants';
import { getPublicEnv } from './env';
import { NextRequest } from 'next/server';

export type SessionData = {
  user?: {
    id: string;
  };
};

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not set.');
  }
  return secret;
}

const sessionOptions = {
  password: getAuthSecret(),
  cookieName: cookieName,
  cookieOptions: {
    secure: IS_PRODUCTION,
    httpOnly: true
  }
};

const API_URL = getPublicEnv().NEXT_PUBLIC_API_URL;
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
      password: getAuthSecret()
    });

    if (!sessionData) {
      throw new Error('Malformed session data: unable to unseal.');
    }

    return sessionData;
  } catch (error) {
    console.error('Error getting edge session:', error);
    // Depending on the desired behavior, you might re-throw or return a more specific error.
    // For now, returning an empty session on error.
    return {};
  }
}
