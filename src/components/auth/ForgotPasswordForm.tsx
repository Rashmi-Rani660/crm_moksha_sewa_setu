"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import AuthFooter from "@/components/auth/AuthFooter";
import BrandTitle from "@/components/auth/BrandTitle";
import OtpInput, { type OtpInputHandle } from "@/components/auth/OtpInput";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  LockIcon,
  PhoneIcon,
  SendIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import { clearFlash, setFlash } from "@/lib/auth/session";
import { authConfig } from "@/lib/config/site";
import {
  isValidMobile,
  sanitizePasswordInput,
  validatePasswordReset,
} from "@/lib/validation";

const fieldClass =
  "h-[44px] w-full rounded-lg border-[1.5px] border-[#c6ccd9] bg-white pl-[48px] pr-3 text-[15px] font-medium text-navy-ink shadow-[0_1px_3px_rgba(20,40,100,0.12)] outline-none transition placeholder:text-muted focus:border-navy focus:ring-2 focus:ring-navy/15 lg:h-[44px] lg:pl-[55px] lg:text-[13.6px]";

const compactFieldClass =
  "h-[42px] w-full rounded-lg border-[1.5px] border-[#c6ccd9] bg-white pl-[48px] pr-11 text-[15px] font-medium text-navy-ink shadow-[0_1px_3px_rgba(20,40,100,0.12)] outline-none transition placeholder:text-muted focus:border-navy focus:ring-2 focus:ring-navy/15 lg:h-[35px] lg:pl-[55px] lg:text-[13.6px]";

const labelClass =
  "mb-1.5 block text-[15.5px] font-bold text-navy-ink lg:mb-[6px] lg:text-[14.4px]";

const compactLabelClass =
  "mb-1.5 block text-[15.5px] font-bold text-navy-ink lg:mb-[3px] lg:text-[14.4px]";

type Step = "request" | "reset";

function PasswordField({
  id,
  label,
  placeholder,
  value,
  show,
  onChange,
  onToggleShow,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggleShow: () => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between lg:mb-[3px]">
        <label htmlFor={id} className={`${compactLabelClass} mb-0 lg:mb-0`}>
          {label}
        </label>
      </div>
      <div className="relative">
        <LockIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-ink" />
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(sanitizePasswordInput(e.target.value))}
          className={compactFieldClass}
        />
        <button
          type="button"
          onClick={onToggleShow}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-ink transition hover:text-navy"
        >
          <EyeIcon off={!show} />
        </button>
      </div>
    </div>
  );
}

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>(() =>
    Array(authConfig.otpLength).fill(""),
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const otpRef = useRef<OtpInputHandle>(null);

  // Reset form state when Next hides/unmounts this route so returning later
  // starts on a clean "request OTP" screen.
  useEffect(
    () => () => {
      setStep("request");
      setOtp(Array(authConfig.otpLength).fill(""));
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirm(false);
      setCountdown(0);
      setError("");
      setSubmitting(false);
    },
    [],
  );

  useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  async function handleSendOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    clearFlash();
    setSubmitting(true);
    // TODO: call the "forgot password / send OTP" API here with { mobile }.
    await new Promise((r) => setTimeout(r, 400));
    setSubmitting(false);
    setOtp(Array(authConfig.otpLength).fill(""));
    setCountdown(authConfig.otpResendSeconds);
    setStep("reset");
    window.setTimeout(() => otpRef.current?.focus(), 0);
  }

  function handleResendOtp() {
    if (countdown > 0) return;
    setError("");
    setOtp(Array(authConfig.otpLength).fill(""));
    setCountdown(authConfig.otpResendSeconds);
    otpRef.current?.focus();
    // TODO: call the "resend reset OTP" API here with { mobile }.
  }

  async function handleResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const problem = validatePasswordReset({
      mobile,
      otp: otp.join(""),
      password,
      confirmPassword,
    });
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setSubmitting(true);
    // TODO: call the "reset password" API here with { mobile, otp, password }.
    await new Promise((r) => setTimeout(r, 600));
    setFlash(
      "Password reset successfully. Please sign in with your new password.",
    );
    router.push("/login");
  }

  function handleChangeMobile() {
    setError("");
    setOtp(Array(authConfig.otpLength).fill(""));
    setPassword("");
    setConfirmPassword("");
    setCountdown(0);
    setStep("request");
  }

  const maskedMobile = `+91 ${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`;

  return (
    <section className="flex min-w-0 flex-col bg-white">
      {step === "request" ? (
        <form
          onSubmit={handleSendOtp}
          noValidate
          className="mx-auto flex w-full max-w-[460px] flex-1 flex-col px-6 pb-4 pt-9 sm:px-0 lg:max-w-none lg:pl-[46px] lg:pr-[40px] lg:pt-[51px]"
        >
          {/* Title */}
          <div className="text-center lg:pt-[3px]">
            <BrandTitle />
          </div>

          <div className="mt-8 lg:mt-[48px]">
            <h2 className="text-[25px] font-bold leading-tight text-navy-ink lg:text-[22.7px]">
              Reset Password
            </h2>
            <p className="mt-2 text-[15px] font-medium leading-[1.45] text-navy-ink lg:mt-[12px] lg:text-[14px]">
              No worries! Enter your registered mobile number
              <br className="hidden lg:inline" /> and we&apos;ll send a
              verification OTP to reset your password.
            </p>
          </div>

          {/* Registered Mobile Number */}
          <div className="mt-6 lg:mt-[34px]">
            <label htmlFor="reset-mobile" className={labelClass}>
              Registered Mobile Number
            </label>
            <div className="relative">
              <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-ink" />
              <input
                id="reset-mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value.replace(/\D/g, ""));
                  if (error) setError("");
                }}
                className={fieldClass}
              />
            </div>
          </div>

          {/* Error */}
          <p
            role="alert"
            aria-live="polite"
            className={`mt-3 text-center text-[14px] font-semibold text-[#c0262d] ${error ? "" : "hidden"}`}
          >
            {error}
          </p>

          {/* Send OTP */}
          <button
            type="submit"
            disabled={submitting}
            className="mx-auto mt-6 inline-flex h-[50px] w-full max-w-[260px] items-center justify-center gap-2.5 rounded-full bg-[linear-gradient(180deg,#143c93_0%,#0a2268_100%)] text-[18px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(10,34,104,0.55)] transition hover:brightness-110 active:translate-y-px disabled:opacity-70 lg:mt-[36px] lg:h-[50px] lg:max-w-[264px] lg:text-[17px]"
          >
            {submitting ? "Sending…" : "Send OTP"}
            {!submitting && <ArrowRightIcon />}
          </button>

          {/* Divider notice */}
          <div className="mt-6 flex items-center justify-center gap-3 text-[14.5px] font-medium text-navy-ink lg:-mx-[10px] lg:mt-[34px] lg:text-[13.8px]">
            <span className="h-px min-w-4 flex-1 bg-line" />
            <span className="inline-flex items-center gap-2 text-center lg:whitespace-nowrap">
              <ShieldCheckIcon size={22} className="shrink-0" />
              <span>OTP will be sent to your registered mobile number</span>
            </span>
            <span className="h-px min-w-4 flex-1 bg-line" />
          </div>

          {/* Back to Login */}
          <Link
            href="/login"
            className="mx-auto mt-6 inline-flex h-[50px] w-full max-w-[260px] items-center justify-center gap-2.5 rounded-full border-[1.5px] border-navy-ink bg-white text-[18px] font-semibold text-navy-ink transition hover:bg-navy-ink hover:text-white lg:mt-[32px] lg:h-[48px] lg:max-w-[264px] lg:text-[17px]"
          >
            <ArrowLeftIcon />
            Back to Login
          </Link>
        </form>
      ) : (
        <form
          onSubmit={handleResetPassword}
          noValidate
          className="mx-auto flex w-full max-w-[460px] flex-1 flex-col px-6 pb-4 pt-9 sm:px-0 lg:max-w-none lg:pl-[77px] lg:pr-[73px] lg:pt-[51px]"
        >
          {/* Title */}
          <div className="text-center lg:translate-x-[8px] lg:pt-[3px]">
            <BrandTitle />
          </div>

          <div className="mt-8 lg:mt-[21px]">
            <h2 className="text-[25px] font-bold leading-tight text-navy-ink lg:text-[22.7px]">
              Create New Password
            </h2>
            <p className="mt-1 text-[15px] font-medium text-navy-ink lg:text-[14px]">
              OTP sent to <b className="font-bold">{maskedMobile}</b>{" "}
              <button
                type="button"
                onClick={handleChangeMobile}
                className="ml-1 font-bold text-[#1a56c4] hover:underline"
              >
                Change
              </button>
            </p>
          </div>

          {/* OTP */}
          <div className="mt-5 rounded-xl bg-[#f1f3f7] py-3.5 pl-4 pr-3 lg:mt-[22px] lg:py-[12.5px] lg:pl-[15px]">
            <div className="flex items-start gap-3.5">
              <ShieldCheckIcon
                size={25}
                className="mt-0.5 shrink-0 text-navy-ink"
              />
              <div className="min-w-0">
                <p className="text-[15.5px] font-bold leading-tight text-navy-ink lg:text-[14.7px]">
                  Verification (OTP)
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-navy-ink lg:text-[11.2px]">
                  Enter the {authConfig.otpLength}-digit OTP
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 pl-[3px]">
              <OtpInput ref={otpRef} value={otp} onChange={setOtp} />
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className="inline-flex h-[38px] items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-navy-ink bg-white px-3.5 text-[13px] font-bold text-navy-ink transition hover:bg-navy-ink hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-white disabled:hover:text-muted lg:h-[36px] lg:text-[12px]"
              >
                <SendIcon />
                {countdown > 0 ? `Resend ${countdown}s` : "Resend OTP"}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mt-4 lg:mt-[15px]">
            <PasswordField
              id="new-password"
              label="New Password"
              placeholder="Enter new password"
              value={password}
              show={showPassword}
              onChange={setPassword}
              onToggleShow={() => setShowPassword((s) => !s)}
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-4 lg:mt-[15px]">
            <PasswordField
              id="confirm-password"
              label="Confirm Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              show={showConfirm}
              onChange={setConfirmPassword}
              onToggleShow={() => setShowConfirm((s) => !s)}
            />
          </div>

          {/* Error */}
          <p
            role="alert"
            aria-live="polite"
            className={`mt-3 text-center text-[14px] font-semibold text-[#c0262d] ${error ? "" : "hidden"}`}
          >
            {error}
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-[24px]">
            <Link
              href="/login"
              className="inline-flex h-[50px] flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-navy-ink bg-white px-4 text-[16px] font-semibold text-navy-ink transition hover:bg-navy-ink hover:text-white lg:h-[46px] lg:text-[15.5px]"
            >
              <ArrowLeftIcon />
              Back to Login
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-[50px] flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#143c93_0%,#0a2268_100%)] px-4 text-[16px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(10,34,104,0.55)] transition hover:brightness-110 active:translate-y-px disabled:opacity-70 lg:h-[46px] lg:text-[15.5px]"
            >
              {submitting ? "Updating…" : "Reset Password"}
              {!submitting && <ArrowRightIcon />}
            </button>
          </div>
        </form>
      )}

      <AuthFooter variant="login" />
    </section>
  );
}
