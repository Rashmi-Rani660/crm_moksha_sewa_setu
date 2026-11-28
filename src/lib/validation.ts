import { authConfig } from "@/lib/config/site";

/** Mobile number: any 10 digits. */
export const MOBILE_PATTERN = /^\d{10}$/;

export const isValidMobile = (value: string) => MOBILE_PATTERN.test(value);

/**
 * Strip whitespace and stop password input at the max length (also covers
 * paste). The minimum length is checked by the validators below.
 */
export const sanitizePasswordInput = (value: string) =>
  value.replace(/\s/g, "").slice(0, authConfig.maxPasswordLength);

export type LoginValues = {
  mobile: string;
  password: string;
  otp: string;
};

/** Returns the first validation error, or `null` when the values are valid. */
export function validateLogin({ mobile, password, otp }: LoginValues) {
  if (!isValidMobile(mobile)) return "Enter a valid 10-digit mobile number.";
  if (!password) return "Enter your password.";
  if (password.length < authConfig.minPasswordLength)
    return `Password must be at least ${authConfig.minPasswordLength} characters.`;
  if (password.length > authConfig.maxPasswordLength)
    return `Password must not exceed ${authConfig.maxPasswordLength} characters.`;
  if (otp.length !== authConfig.otpLength)
    return `Enter the ${authConfig.otpLength}-digit OTP sent to your mobile.`;
  return null;
}

export type PasswordResetValues = {
  mobile: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

/** Returns the first validation error for password reset, or `null` when valid. */
export function validatePasswordReset({
  mobile,
  otp,
  password,
  confirmPassword,
}: PasswordResetValues) {
  if (!isValidMobile(mobile)) return "Enter a valid 10-digit mobile number.";
  if (otp.length !== authConfig.otpLength)
    return `Enter the ${authConfig.otpLength}-digit OTP sent to your mobile.`;
  if (password.length < authConfig.minPasswordLength)
    return `Password must be at least ${authConfig.minPasswordLength} characters.`;
  if (password.length > authConfig.maxPasswordLength)
    return `Password must not exceed ${authConfig.maxPasswordLength} characters.`;
  // Same rule as the server's password policy (letters and digits).
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Password must contain at least one letter and one number.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}
