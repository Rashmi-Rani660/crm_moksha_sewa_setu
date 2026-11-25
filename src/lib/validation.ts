import { authConfig } from "@/lib/config/site";

/** Indian mobile number: 10 digits, starting with 6-9. */
export const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export const isValidMobile = (value: string) => MOBILE_PATTERN.test(value);

/**
 * Strip whitespace from password input. Length limits are not enforced while
 * typing (nothing is cut off); they are checked by the validators below.
 */
export const sanitizePasswordInput = (value: string) => value.replace(/\s/g, "");

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
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}
