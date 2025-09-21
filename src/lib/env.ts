import 'server-only';

const APP_ENV = (process.env.APP_ENV as 'development' | 'production') ?? 'production';

const AUTH_SECRET = process.env.AUTH_SECRET as string;

if (!AUTH_SECRET || AUTH_SECRET.length < 32) {
  throw new Error('AUTH_SECRET must be set and at least 32 characters long');
}

export { APP_ENV, AUTH_SECRET };
