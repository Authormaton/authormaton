import { APP_ENV } from './env';

export type JWTPayload = {
  userId: string;
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }
  return secret;
}

export async function verifyJWT(_token: string): Promise<JWTPayload> {
  if (APP_ENV === 'production') {
    throw new Error('JWT verification is not supported in production in an Edge environment. Use a proper JWT library for verification.');
  }

  // This is a mock implementation for development and test environments.
  // In a real application, you would verify the JWT signature and decode its payload.
  // For now, we'll simulate a valid payload.
  const mockPayload: JWTPayload = {
    userId: 'mock-user-id'
  };

  if (!mockPayload.userId) {
    throw new Error('Malformed mock JWT payload: userId is missing.');
  }

  return mockPayload;
}
