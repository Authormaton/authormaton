import { safeParseJWT, JWTPayload } from '../lib/jwt';

describe('safeParseJWT', () => {
  it('should successfully parse a valid JWT token', () => {
    const validPayload: JWTPayload = { userId: 'test-user-123' };
    const encodedPayload = btoa(JSON.stringify(validPayload));
    const validToken = `header.${encodedPayload}.signature`;
    const result = safeParseJWT(validToken);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it('should return an error for an empty token string', () => {
    const result = safeParseJWT('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Token is empty or not a string.');
    }
  });

  it('should return an error for a null token', () => {
    const result = safeParseJWT(null);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Token is empty or not a string.');
    }
  });

  it('should return an error for an undefined token', () => {
    const result = safeParseJWT(undefined);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Token is empty or not a string.');
    }
  });

  it('should return an error for a token with incorrect number of segments', () => {
    const malformedToken = 'header.payload'; // Missing signature
    const result = safeParseJWT(malformedToken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Malformed token: incorrect number of segments.');
    }
  });

  it('should return an error for a token with invalid base64 payload', () => {
    const invalidBase64Token = 'header.invalid-base64!.signature';
    const result = safeParseJWT(invalidBase64Token);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Malformed token: invalid base64 or JSON in payload.');
    }
  });

  it('should return an error for a token with non-JSON payload', () => {
    const nonJsonPayload = btoa('not-json');
    const nonJsonToken = `header.${nonJsonPayload}.signature`;
    const result = safeParseJWT(nonJsonToken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Malformed token: invalid base64 or JSON in payload.');
    }
  });

  it('should return an error for a token with a payload missing userId', () => {
    const invalidPayload = { someOtherField: 'value' };
    const encodedInvalidPayload = btoa(JSON.stringify(invalidPayload));
    const tokenWithInvalidPayload = `header.${encodedInvalidPayload}.signature`;
    const result = safeParseJWT(tokenWithInvalidPayload);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Malformed token: payload does not contain userId.');
    }
  });
});
