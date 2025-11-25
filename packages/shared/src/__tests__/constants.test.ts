import { validateEmail, validateAmount, getMonthKey } from '../constants';

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    test('should validate correct email format', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email format', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });
  });

  describe('validateAmount', () => {
    test('should validate positive amounts', () => {
      expect(validateAmount(10)).toBe(true);
      expect(validateAmount(0.01)).toBe(true);
      expect(validateAmount(1000.99)).toBe(true);
    });

    test('should reject invalid amounts', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-10)).toBe(false);
      expect(validateAmount(NaN)).toBe(false);
    });
  });

  describe('getMonthKey', () => {
    test('should return correct month key', () => {
      expect(getMonthKey('2024-01-15')).toBe('2024-01');
      expect(getMonthKey('2024-12-31')).toBe('2024-12');
      expect(getMonthKey('2023-06-01')).toBe('2023-06');
    });

    test('should pad month with leading zero', () => {
      const key = getMonthKey('2024-05-10');
      expect(key).toBe('2024-05');
    });
  });
});
