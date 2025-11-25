import { extractToken, verifyToken } from '../utils/jwt';

describe('JWT Utils', () => {
  describe('extractToken', () => {
    test('should extract token from Bearer header', () => {
      const token = 'valid-token-string';
      const header = `Bearer ${token}`;
      expect(extractToken(header)).toBe(token);
    });

    test('should return null for invalid header format', () => {
      expect(extractToken('InvalidFormat token')).toBeNull();
      expect(extractToken('Bearer')).toBeNull();
      expect(extractToken('Bearer token extra')).toBeNull();
      expect(extractToken('')).toBeNull();
    });
  });

  describe('verifyToken', () => {
    test('should return null for invalid token', () => {
      expect(verifyToken('invalid-token')).toBeNull();
      expect(verifyToken('')).toBeNull();
      expect(verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')).toBeNull();
    });
  });
});
