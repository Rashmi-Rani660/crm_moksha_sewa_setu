import type { Role } from "@/lib/auth/session";

/**
 * TEMPORARY — OTPs are not verified until the real OTP API is connected:
 * any code (or none) is accepted, and the dashboard is picked by the mobile
 * number (TEST_MOBILES). Set to `true` to require the static test OTPs instead.
 */
export const OTP_CHECK_ENABLED = false;

/**
 * TESTING ONLY — mobile numbers that open each dashboard while the OTP check
 * is off. Any other 10-digit number opens DEFAULT_ROLE.
 */
const TEST_MOBILES: Readonly<Record<string, Role>> = {
  "7777777777": "user",
  "8888888888": "admin",
  "9999999999": "super-admin",
};

/** Role opened by any number that is not in TEST_MOBILES. */
const DEFAULT_ROLE: Role = "super-admin";

/**
 * TESTING ONLY — static OTPs, enforced only when OTP_CHECK_ENABLED is on, and
 * then only in `next dev` or a test deployment with NEXT_PUBLIC_ENABLE_TEST_OTP=true.
 *
 *   777777 → User   ·   888888 → Admin   ·   999999 → Super Admin
 */
export const testOtpEnabled =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_ENABLE_TEST_OTP === "true";

const TEST_OTPS: Readonly<Record<string, Role>> = {
  "777777": "user",
  "888888": "admin",
  "999999": "super-admin",
};

/** Role a strict-mode test OTP signs in as, or `null`. */
function roleForOtp(otp: string): Role | null {
  if (!testOtpEnabled) return null;
  return TEST_OTPS[otp] ?? null;
}

/**
 * Dashboard role for a sign-in, or `null` when the OTP is rejected.
 * OTP check off → decided by the mobile number only; on → by the OTP.
 */
export function roleForLogin(mobile: string, otp: string): Role | null {
  if (!OTP_CHECK_ENABLED) return TEST_MOBILES[mobile] ?? DEFAULT_ROLE;
  return roleForOtp(otp);
}

/** Whether the device-verification code is accepted for this sign-in. */
export const deviceOtpAccepted = (otp: string, role: Role) => !OTP_CHECK_ENABLED || roleForOtp(otp) === role;

/** Error shown when an OTP is not accepted. */
export const otpError = () =>
  testOtpEnabled
    ? "Invalid OTP. Please check the code and try again."
    : "OTP verification is not connected yet in this build.";
