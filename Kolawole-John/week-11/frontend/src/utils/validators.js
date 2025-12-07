/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumber,
    errors: {
      minLength: !minLength ? 'Password must be at least 8 characters' : null,
      hasUpperCase: !hasUpperCase ? 'Password must contain an uppercase letter' : null,
      hasLowerCase: !hasLowerCase ? 'Password must contain a lowercase letter' : null,
      hasNumber: !hasNumber ? 'Password must contain a number' : null,
    },
  };
};

/**
 * Validate amount
 */
export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};