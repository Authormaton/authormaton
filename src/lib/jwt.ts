import { APP_ENV } from './env';

export type JWTPayload = {
  userId: string;
};

export async function verifyJWT(_token: string): Promise<JWTPayload> {
  if (APP_ENV === 'production') {
    throw new Error('verifyJWT should not be called in production in an Edge environment');
  }
  // This is a mock implementation for development and test environments
  // In a real application, you would verify the JWT signature and decode its payload
  return {
    userId: 'mock-user-id'
  };
}
