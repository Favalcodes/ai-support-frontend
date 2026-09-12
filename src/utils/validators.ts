// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
/**
 * The single client-side password rule, kept in step with the backend's
 * IsStrongPassword validator.
 *
 * There were three different rules in the frontend: this one (no special
 * character), an inline copy in Register that did require one, and
 * FirstLoginSetup which only checked the length. Anything the looser checks let
 * through was rejected by the API with a 422 the user could not act on.
 */
const PASSWORD_SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  if (!PASSWORD_SPECIAL.test(password)) errors.push('One special character');
  return errors;
};

export const isValidPassword = (password: string): boolean =>
  getPasswordErrors(password).length === 0;

// Get password strength
export const getPasswordStrength = (password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} => {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z\d]/.test(password)) score++;
  
  if (score <= 2) return { strength: 'weak', score };
  if (score <= 4) return { strength: 'medium', score };
  return { strength: 'strong', score };
};

// Required field validation
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Min length validation
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Max length validation
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// Form validation helper
export const validateForm = (
  fields: Record<string, string>,
  rules: Record<string, ((value: string) => boolean)[]>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach((fieldName) => {
    const value = fields[fieldName] || '';
    const fieldRules = rules[fieldName];
    
    for (const rule of fieldRules) {
      if (!rule(value)) {
        errors[fieldName] = `${fieldName} is invalid`;
        break;
      }
    }
  });
  
  return errors;
};