"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import AuthFooter from "@/components/auth/AuthFooter";
import BrandTitle from "@/components/auth/BrandTitle";
import OtpInput, { type OtpInputHandle } from "@/components/auth/OtpInput";
import {
  ArrowRightIcon,
  EyeIcon,
  LockIcon,
  PhoneIcon,
  SendIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import { authConfig } from "@/lib/config/site";
import { clearFlash, startVerification, useFlash } from "@/lib/auth/session";
import { isValidMobile, validateLogin } from "@/lib/validation";

const fieldClass =
  "h-[42px] w-full rounded-lg border-[1.5px] border-[#c6ccd9] bg-white pl-[48px] pr-3 text-[15px] font-medium text-navy-ink shadow-[0_1px_3px_rgba(20,40,100,0.12)] outline-none transition placeholder:text-muted focus:border-navy focus:ring-2 focus:ring-navy/15 lg:h-[35px] lg:pl-[55px] lg:text-[13.6px]";

const labelClass = "mb-1.5 block text-[15.5px] font-bold text-navy-ink lg:mb-[3px] lg:text-[14.4px]";

export default function LoginForm() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState<string[]>(() =>
    Array(authConfig.otpLength).fill(""),
  );
  const [remember, setRemember] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const otpRef = useRef<OtpInputHandle>(null);
  const router = useRouter();
  const flash = useFlash();

  useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  function sendOtp() {
    if (!isValidMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number to receive the OTP.");
      return;
    }
    setError("");
    setOtpSent(true);
    setCountdown(authConfig.otpResendSeconds);
    otpRef.current?.focus();
    // TODO: call the "send OTP" API here.
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problem = validateLogin({ mobile, password, otp: otp.join("") });
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    clearFlash();
    setSubmitting(true);
    // TODO: call the sign-in API here with { mobile, password, otp, remember }.
    await new Promise((r) => setTimeout(r, 600));
    // The API reports this as a new device, so the user must verify it next.
    startVerification(mobile);
    router.push("/verify-device");
  }

  return (
    <section className="flex min-w-0 flex-col bg-white">
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto flex w-full max-w-[460px] flex-1 flex-col px-6 pb-4 pt-9 sm:px-0 lg:max-w-none lg:pl-[77px] lg:pr-[73px] lg:pt-[51px]"
      >
        {/* Title */}
        <div className="text-center lg:translate-x-[8px] lg:pt-[3px]">
          <BrandTitle />
        </div>

        <div className="mt-8 lg:mt-[21px]">
          <h2 className="text-[25px] font-bold leading-tight text-navy-ink lg:text-[22.7px]">
            Login
          </h2>
          <p className="mt-1 text-[15px] font-medium text-navy-ink lg:text-[14px]">
            Access your account securely
          </p>
        </div>

        {/* Mobile */}
        <div className="mt-5 lg:mt-[22px]">
          <label htmlFor="mobile" className={labelClass}>
            Mobile Number
          </label>
          <div className="relative">
            <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-ink" />
            <input
              id="mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              className={fieldClass}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-4 lg:mt-[15px]">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <div className="relative">
            <LockIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-ink" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${fieldClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-ink transition hover:text-navy"
            >
              <EyeIcon off={!showPassword} />
            </button>
          </div>
        </div>

        {/* OTP */}
        <div className="mt-5 rounded-xl bg-[#f1f3f7] py-3.5 pl-4 pr-3 lg:mt-[22px] lg:py-[12.5px] lg:pl-[15px]">
          <div className="flex items-start gap-3.5">
            <ShieldCheckIcon size={25} className="mt-0.5 shrink-0 text-navy-ink" />
            <div className="min-w-0">
              <p className="text-[15.5px] font-bold leading-tight text-navy-ink lg:text-[14.7px]">
                Verification (OTP)
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-navy-ink lg:text-[11.2px]">
                {otpSent
                  ? `OTP sent to +91 ${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`
                  : `Enter the ${authConfig.otpLength}-digit OTP`}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 pl-[3px]">
            <OtpInput ref={otpRef} value={otp} onChange={setOtp} />
            <button
              type="button"
              onClick={sendOtp}
              disabled={countdown > 0}
              className="inline-flex h-[38px] items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-navy-ink bg-white px-3.5 text-[13px] font-bold lg:h-[36px] lg:text-[12px] text-navy-ink transition hover:bg-navy-ink hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-white disabled:hover:text-muted"
            >
              <SendIcon />
              {countdown > 0 ? `Resend ${countdown}s` : "Send OTP"}
            </button>
          </div>
        </div>

        {/* Remember / forgot */}
        <div className="mt-5 flex flex-wrap items-center justify-between lg:mt-[22px] gap-x-4 gap-y-2">
          <label className="flex cursor-pointer select-none items-center gap-2.5 text-[14.5px] font-medium text-navy-ink lg:text-[13px]">
            <span className="relative inline-flex h-[22px] w-[22px] shrink-0 lg:h-[20px] lg:w-[20px]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer h-[22px] w-[22px] lg:h-[20px] lg:w-[20px] cursor-pointer appearance-none rounded-[5px] border border-[#8a93a8] bg-white transition checked:border-[#1a56c4] checked:bg-[#1a56c4] focus-visible:ring-2 focus-visible:ring-navy/30"
              />
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="pointer-events-none absolute inset-0 m-auto h-[15px] w-[15px] lg:h-[14px] lg:w-[14px] text-white opacity-0 peer-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 8.5 3.2 3.2L13 4.8" />
              </svg>
            </span>
            Remember me
          </label>
          <a
            href="#"
            className="text-[15px] font-bold text-navy-ink hover:underline lg:text-[14.1px]"
          >
            Forgot Password?
          </a>
        </div>

        {flash && (
          <p
            role="status"
            className="mt-3 rounded-lg bg-[#fbf1cf] px-3 py-2 text-center text-[13px] font-medium text-navy-ink"
          >
            {flash}
          </p>
        )}

        {/* Error */}
        <p
          role="alert"
          aria-live="polite"
          className={`mt-3 text-center text-[14px] font-semibold text-[#c0262d] ${error ? "" : "hidden"}`}
        >
          {error}
        </p>

        {/* Sign in */}
        <button
          type="submit"
          disabled={submitting}
          className="mx-auto mt-6 inline-flex h-[50px] w-full max-w-[200px] lg:h-[46px] lg:max-w-[186px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#143c93_0%,#0a2268_100%)] text-[18px] lg:text-[17px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(10,34,104,0.55)] transition hover:brightness-110 active:translate-y-px disabled:opacity-70 lg:mt-[31px]"
        >
          {submitting ? "Signing in…" : "Sign In"}
          {!submitting && <ArrowRightIcon />}
        </button>

        <div className="mt-5 flex items-center justify-center gap-3 text-[14.5px] font-medium text-navy-ink lg:-mx-[19px] lg:mt-[22px] lg:text-[13.8px]">
          <span className="hidden h-px flex-1 bg-line sm:block" />
          <span className="inline-flex items-center gap-2 text-center">
            <ShieldCheckIcon size={22} className="shrink-0" />
            <span className="text-balance">
              Secured Login with <b className="font-bold">Password + OTP</b>
            </span>
          </span>
          <span className="hidden h-px flex-1 bg-line sm:block" />
        </div>
      </form>

      <AuthFooter variant="login" />
    </section>
  );
}
