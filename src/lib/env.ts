import 'server-only';

const APP_ENV = (process.env.APP_ENV as 'development' | 'production') ?? 'production';
const IS_PRODUCTION = APP_ENV === 'production';

const AUTH_SECRET = process.env.AUTH_SECRET as string;

if (!AUTH_SECRET || AUTH_SECRET.length < 32) {
  throw new Error('AUTH_SECRET must be set and at least 32 characters long');
}

function getPublicEnv() {
  return {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  };
}

export { APP_ENV, IS_PRODUCTION, AUTH_SECRET, getPublicEnv };
