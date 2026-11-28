import { request } from "@/lib/api/client";

/** Typed calls for the CRM sign-in screens (backend: moksha-backend src/modules/crm/auth). */

export type AccessLevel = "USER" | "ADMIN" | "SUPER_ADMIN";
export type DashboardSlug = "user" | "admin" | "super-admin";

export type AuthTokens = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  sessionId: string;
};

export type CrmProfile = {
  id: string;
  crmId: string;
  name: string;
  mobile: string;
  email?: string;
  designation?: string;
  department?: { id: string; name: string };
  accessLevel: AccessLevel;
  dashboard: DashboardSlug;
  role: { id: string; name: string; slug: string } | null;
  centres: { id: string; code: string; name: string }[];
  passwordMode: "OWN" | "CMS";
  linkedToCms: boolean;
  lastLoginAt?: string;
  permissions: { key: string; scope: string; requiresApproval: boolean }[];
};

export type SignedIn = { status: "SIGNED_IN"; tokens: AuthTokens; profile: CrmProfile };

export type DeviceChallenge = {
  status: "DEVICE_VERIFICATION_REQUIRED";
  challengeId: string;
  channel: "EMAIL" | "SMS";
  sentTo: string;
  device: string;
  browser: string;
  ip: string;
  requestedAt: string;
  resendAfterSeconds: number;
};

export type LoginResult = SignedIn | DeviceChallenge;

type OtpSent = { message: string; resendAfterSeconds: number };

export const authApi = {
  sendLoginOtp: (mobile: string) => request<OtpSent>("/auth/login/otp", { body: { mobile } }).then((r) => r.data),

  login: (input: { mobile: string; password: string; otp: string; deviceId: string; remember: boolean }) =>
    request<LoginResult>("/auth/login", { body: input }).then((r) => r.data),

  verifyDevice: (input: { challengeId: string; deviceId: string; otp: string }) =>
    request<SignedIn>("/auth/device/verify", { body: input }).then((r) => r.data),

  resendDeviceCode: (input: { challengeId: string; deviceId: string }) =>
    request<{ resendAfterSeconds: number }>("/auth/device/resend", { body: input }).then((r) => r.data),

  denyDevice: (input: { challengeId: string; deviceId: string }) => request<null>("/auth/device/deny", { body: input }),

  forgotPassword: (mobile: string) => request<OtpSent>("/auth/password/forgot", { body: { mobile } }).then((r) => r.data),

  resetPassword: (input: { mobile: string; otp: string; password: string; confirmPassword: string }) =>
    request<null>("/auth/password/reset", { body: input }),

  refresh: (refreshToken: string) => request<AuthTokens>("/auth/refresh", { body: { refreshToken } }).then((r) => r.data),

  logout: (refreshToken: string) => request<null>("/auth/logout", { body: { refreshToken } }),

  me: (token: string) => request<CrmProfile>("/auth/me", { token }).then((r) => r.data),
};
