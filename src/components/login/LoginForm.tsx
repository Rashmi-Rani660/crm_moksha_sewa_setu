"use client";

import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

/* ---------------------------------- icons --------------------------------- */

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const PhoneIcon = () => (
  <svg {...iconProps}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

const LockIcon = () => (
  <svg {...iconProps}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const EyeIcon = ({ off }: { off: boolean }) => (
  <svg {...iconProps}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

const ShieldCheckIcon = ({ size = 22 }: { size?: number }) => (
  <svg {...iconProps} width={size} height={size}>
    <path d="M12 3l7.5 2.6v5.7c0 4.6-3.1 8.2-7.5 9.7-4.4-1.5-7.5-5.1-7.5-9.7V5.6L12 3Z" />
    <path d="m8.8 11.8 2.2 2.2 4.2-4.4" />
  </svg>
);

const SendIcon = () => (
  <svg {...iconProps} width={15} height={15}>
    <path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z" />
    <path d="m10 13 4.5-4.5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg {...iconProps} width={20} height={20} strokeWidth={2}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

/* -------------------------------- component ------------------------------- */

export default function LoginForm() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [remember, setRemember] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  const mobileValid = /^[6-9]\d{9}$/.test(mobile);

  function sendOtp() {
    if (!mobileValid) {
      setError("Enter a valid 10-digit mobile number to receive the OTP.");
      return;
    }
    setError("");
    setOtpSent(true);
    setCountdown(RESEND_SECONDS);
    otpRefs.current[0]?.focus();
    // TODO: call the "send OTP" API here.
  }

  function setOtpAt(index: number, value: string) {
    setOtp((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function onOtpChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setOtpAt(index, digit);
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  }

  function onOtpKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function onOtpPaste(e: ClipboardEvent<HTMLInputElement>) {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!digits) return;
    e.preventDefault();
    setOtp(Array.from({ length: OTP_LENGTH }, (_, i) => digits[i] ?? ""));
    otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!mobileValid) return setError("Enter a valid 10-digit mobile number.");
    if (password.length < 6) return setError("Enter your password.");
    if (otp.join("").length !== OTP_LENGTH)
      return setError("Enter the 6-digit OTP sent to your mobile.");

    setError("");
    setSubmitting(true);
    // TODO: call the sign-in API here with { mobile, password, otp, remember }.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
  }

  const fieldBase =
    "h-[35px] w-full rounded-lg border-[1.5px] border-[#c6ccd9] bg-white pl-[55px] pr-3 text-[14px] font-medium shadow-[0_1px_3px_rgba(20,40,100,0.12)] text-navy-ink outline-none transition placeholder:text-muted focus:border-navy focus:ring-2 focus:ring-navy/15";

  return (
    <section className="flex flex-col bg-white">
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex flex-1 flex-col px-6 pb-4 pt-9 sm:px-12 lg:pl-[77px] lg:pr-[73px] lg:pt-[48px]"
      >
        {/* Title */}
        <div className="text-center lg:translate-x-[8px] lg:pt-[3px]">
          <h1 className="inline-block text-[42px] font-bold leading-none tracking-[-0.01em] text-navy">
            Sewa Setu
          </h1>
          <svg
            aria-hidden
            viewBox="0 0 220 22"
            className="mx-auto mt-0.5 block h-[22px] w-[220px]"
          >
            <path
              d="M1 5 C50 12 140 16 219 3 C150 21 56 22 1 5 Z"
              fill="#f6c21a"
            />
          </svg>
        </div>

        <div className="mt-9 lg:mt-[21px]">
          <h2 className="text-[22px] font-bold leading-tight text-navy-ink">
            Login
          </h2>
          <p className="mt-1 text-[14px] font-medium text-navy-ink">
            Access your account securely
          </p>
        </div>

        {/* Mobile */}
        <div className="mt-5">
          <label
            htmlFor="mobile"
            className="mb-1.5 block text-[14px] font-bold text-navy-ink"
          >
            Mobile Number
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-ink">
              <PhoneIcon />
            </span>
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
              className={fieldBase}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mt-3.5">
          <label
            htmlFor="password"
            className="mb-1.5 block text-[14px] font-bold text-navy-ink"
          >
            Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-ink">
              <LockIcon />
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${fieldBase} pr-11`}
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
        <div className="mt-4 rounded-xl bg-[#f1f3f7] py-3.5 pl-[15px] pr-3 lg:mt-[23px] lg:py-[12.5px]">
          <div className="flex items-start gap-[14px]">
            <span className="mt-0.5 text-navy-ink">
              <ShieldCheckIcon size={25} />
            </span>
            <div>
              <p className="text-[14px] font-bold leading-tight text-navy-ink">
                Verification (OTP)
              </p>
              <p className="mt-0.5 text-[12px] font-medium text-navy-ink">
                {otpSent
                  ? `OTP sent to +91 ${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`
                  : "Enter the 6-digit OTP"}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-3 pl-[3px]">
            <div className="flex gap-[6.6px]">
              {otp.map((value, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={value}
                  aria-label={`OTP digit ${i + 1}`}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => onOtpKeyDown(i, e)}
                  onPaste={onOtpPaste}
                  onFocus={(e) => e.currentTarget.select()}
                  className="h-[32px] w-[29px] rounded-md border border-[#cfd4de] bg-white text-center text-[15px] font-semibold text-navy-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15 "
                />
              ))}
            </div>
            <button
              type="button"
              onClick={sendOtp}
              disabled={countdown > 0}
              className="ml-auto inline-flex h-[36px] items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-navy-ink bg-white px-3.5 text-[12px] font-bold text-navy-ink transition hover:bg-navy-ink hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-white disabled:hover:text-muted"
            >
              <SendIcon />
              {countdown > 0 ? `Resend ${countdown}s` : "Send OTP"}
            </button>
          </div>
        </div>

        {/* Remember / forgot */}
        <div className="mt-5 flex items-center justify-between">
          <label className="flex cursor-pointer select-none items-center gap-2.5 text-[13px] font-medium text-navy-ink">
            <span className="relative inline-flex h-[20px] w-[20px]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="peer h-[20px] w-[20px] cursor-pointer appearance-none rounded-[5px] border border-[#8a93a8] bg-white transition checked:border-[#1a56c4] checked:bg-[#1a56c4] focus-visible:ring-2 focus-visible:ring-navy/30"
              />
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="pointer-events-none absolute inset-0 m-auto h-[14px] w-[14px] text-white opacity-0 peer-checked:opacity-100"
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
            className="text-[14px] font-bold text-navy-ink hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        {/* Error */}
        <p
          role="alert"
          aria-live="polite"
          className={`mt-3 text-center text-[13px] font-semibold text-[#c0262d] ${error ? "" : "hidden"}`}
        >
          {error}
        </p>

        {/* Sign in */}
        <button
          type="submit"
          disabled={submitting}
          className="mx-auto mt-5 inline-flex lg:mt-[30px] h-[46px] w-[186px] items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#143c93_0%,#0a2268_100%)] text-[17px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(10,34,104,0.55)] transition hover:brightness-110 active:translate-y-px disabled:opacity-70"
        >
          {submitting ? "Signing in…" : "Sign In"}
          {!submitting && <ArrowRightIcon />}
        </button>

        <div className="mt-5 flex items-center gap-3 text-[13.5px] font-medium text-navy-ink lg:-mx-[19px] lg:mt-[21px]">
          <span className="h-px flex-1 bg-line" />
          <span className="inline-flex items-center gap-2 whitespace-nowrap">
            <ShieldCheckIcon size={22} />
            Secured Login with <b className="font-bold">Password + OTP</b>
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
      </form>

      {/* Footer */}
      <footer className="mx-4 mb-6 mt-2 border-t border-[#b9bfd6] pt-5 sm:mx-6 lg:ml-[23px] lg:mr-[18px] lg:mb-[38px] lg:pt-[22px]">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[11px] font-medium text-navy-ink lg:-mx-[6px] lg:text-[10.6px] lg:flex-nowrap">
          <p className="leading-snug lg:whitespace-nowrap">
            <b className="font-bold">© 2026 Namo Gange Trust</b> | Designed,
            Developed &amp; Maintained by
          </p>
          <span
            className="inline-flex h-[32px] min-w-[123px] flex-col items-center justify-center rounded-[5px] bg-[#e3141b] px-2.5 leading-none text-white shadow-sm"
            aria-label="enCodency Pvt. Ltd. — Raise the Bar"
          >
            <span className="text-[14px] font-semibold tracking-tight">
              enCodency
              <span className="ml-0.5 text-[6px] font-bold">Pvt. Ltd.</span>
            </span>
            <span className="mt-0.5 text-[5px] font-semibold italic">
              Raise the Bar
            </span>
          </span>
        </div>
      </footer>
    </section>
  );
}
