import { APP_ENV } from './env';

export type JWTPayload = {
  userId: string;
};

export type JWTParseResult =
  | { success: true; data: JWTPayload }
  | { success: false; error: string };

/**
 * Safely parses a JWT token without throwing errors.
 * Returns a typed result indicating success or failure.
 * @param token The JWT token string.
 * @returns A JWTParseResult object.
 */
export function safeParseJWT(token: string | null | undefined): JWTParseResult {
  if (!token || typeof token !== 'string') {
    return { success: false, error: 'Token is empty or not a string.' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { success: false, error: 'Malformed token: incorrect number of segments.' };
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    // Basic validation to ensure it looks like our JWTPayload
    if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
      return { success: true, data: payload as JWTPayload };
    } else {
      return { success: false, error: 'Malformed token: payload does not contain userId.' };
    }
  } catch (e) {
    return { success: false, error: 'Malformed token: invalid base64 or JSON in payload.' };
  }
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

  return mockPayload;
}