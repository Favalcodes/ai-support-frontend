import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPassword, minLength, maxLength, isRequired } from '../validators';

describe('validators', () => {
  it('accepts ordinary addresses and rejects malformed ones', () => {
    expect(isValidEmail('jane@example.com')).toBe(true);
    expect(isValidEmail('jane.doe+tag@sub.example.co.uk')).toBe(true);
    expect(isValidEmail('jane@')).toBe(false);
    expect(isValidEmail('jane example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('mirrors the backend password policy', () => {
    // Backend IsStrongPassword: 8+ chars, upper, lower, number, special
    expect(isValidPassword('Str0ng!Pass')).toBe(true);
    expect(isValidPassword('short1!A')).toBe(true);
    expect(isValidPassword('alllowercase1!')).toBe(false);
    expect(isValidPassword('NOLOWERCASE1!')).toBe(false);
    expect(isValidPassword('NoNumbers!')).toBe(false);
    expect(isValidPassword('NoSpecial1')).toBe(false);
    expect(isValidPassword('Ab1!')).toBe(false);
  });

  it('checks lengths and required values', () => {
    expect(minLength('abcd', 4)).toBe(true);
    expect(minLength('abc', 4)).toBe(false);
    expect(maxLength('abc', 4)).toBe(true);
    expect(maxLength('abcde', 4)).toBe(false);
    expect(isRequired('  ')).toBe(false);
    expect(isRequired('x')).toBe(true);
  });
});
