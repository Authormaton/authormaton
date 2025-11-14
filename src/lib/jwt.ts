import { APP_ENV } from './env';

export type JWTPayload = {
  userId: string;
};



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


  return mockPayload;
}
