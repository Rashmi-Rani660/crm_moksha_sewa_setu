"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import AuthFooter from "@/components/auth/AuthFooter";
import BrandTitle from "@/components/auth/BrandTitle";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  InfoIcon,
  LaptopIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
} from "@/components/ui/icons";
import {
  clearVerification,
  setFlash,
  signIn,
  useAuthSession,
  usePendingVerification,
} from "@/lib/auth/session";
import { authConfig } from "@/lib/config/site";
import { OTP_CHECK_ENABLED, deviceOtpAccepted, otpError } from "@/lib/auth/test-otp";

const outlineBtn =
  "inline-flex h-[46px] min-w-[160px] flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-full border-[1.5px] border-navy-ink bg-white px-4 text-[15px] font-semibold text-navy-ink transition hover:bg-navy-ink hover:text-white lg:h-[38px] lg:min-w-0 lg:flex-none lg:gap-2 lg:text-[14px]";

export default function VerifyDeviceForm() {
  const router = useRouter();
  const { pending, ready } = usePendingVerification();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState<number>(authConfig.otpResendSeconds);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Set once we navigate away on purpose, so the "no pending sign-in" guard
  // below does not redirect to /login while clearing the pending state.
  const leaving = useRef(false);

  // Next keeps hidden screens alive, so reset when this one is hidden: the next
  // sign-in attempt gets an empty code, a new 30s timer and an enabled button.
  useEffect(
    () => () => {
      leaving.current = false;
      setOtp("");
      setError("");
      setSubmitting(false);
      setCountdown(authConfig.otpResendSeconds);
    },
    [],
  );

  const { session, ready: sessionReady } = useAuthSession();

  // Already signed in → dashboard; no sign-in attempt to verify (e.g. page
  // opened directly or reached with Back) → login. Both replace this entry.
  useEffect(() => {
    if (!ready || !sessionReady || leaving.current) return;
    if (session) router.replace(`/dashboard/${session.role}`);
    else if (!pending) router.replace("/login");
  }, [ready, sessionReady, session, pending, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  function resend() {
    if (countdown > 0) return;
    setError("");
    setOtp("");
    setCountdown(authConfig.otpResendSeconds);
    // TODO: call the "resend verification OTP" API here.
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (OTP_CHECK_ENABLED && otp.length !== authConfig.otpLength) {
      setError(`Enter the ${authConfig.otpLength}-digit code sent to your email.`);
      return;
    }
    // TODO: call the "verify device" API here with { otp }. Until then the
    // static test OTP of the role being signed in is accepted.
    if (!pending || !deviceOtpAccepted(otp, pending.role)) {
      setError(otpError());
      return;
    }
    setError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    leaving.current = true;
    const role = pending.role;
    signIn(pending.mobile, role);
    clearVerification();
    // replace: Back from the dashboard must not return to the sign-in steps
    router.replace(`/dashboard/${role}`);
  }

  function notMe() {
    leaving.current = true;
    clearVerification();
    setFlash(
      "Thanks for letting us know. This sign-in was blocked — if you did not try to log in, please change your password.",
    );
    router.replace("/login");
  }

  function backToLogin() {
    leaving.current = true;
    clearVerification();
    router.replace("/login");
  }

  const labelBold = "font-semibold lg:font-semibold";

  return (
    <section className="flex min-w-0 flex-col bg-white">
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto flex w-full max-w-[560px] flex-1 flex-col px-6 pb-4 pt-8 sm:px-0 lg:mx-0 lg:max-w-none lg:pl-[77px] lg:pr-[73px] lg:pt-[51px]"
      >
        {/* Title */}
        <div className="text-center lg:translate-x-[8px] lg:pt-[3px]">
          <BrandTitle />
        </div>

        <h2 className="mt-8 text-[25px] font-bold leading-tight text-navy-ink lg:mt-[21px] lg:text-[22.7px]">
          New Device Verification
        </h2>
        <p className="mt-1 text-[15px] font-medium leading-[1.45] text-navy-ink lg:text-[14px] lg:leading-[20px]">
          We detected a sign-in attempt from a new device.
          <br className="hidden sm:inline" /> To protect your account, please
          verify your identity.
        </p>

        {/* Device details */}
        <div className="mt-5 flex items-center rounded-xl bg-[#e9effb] py-3 pr-4 lg:mt-[14px] lg:h-[66px] lg:py-0">
          <div className="flex shrink-0 items-center justify-center px-3 sm:px-4 lg:w-[84px] lg:px-0">
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-navy-ink shadow-sm lg:h-[50px] lg:w-[50px]">
              <LaptopIcon size={30} className="lg:h-[30px] lg:w-[30px]" />
            </span>
          </div>
          <span aria-hidden className="mr-4 h-[58px] w-px shrink-0 bg-[#b4c0da] lg:mr-[18px] lg:h-[46px]" />
          <dl className="min-w-0 text-[14px] leading-[1.55] text-navy-ink lg:text-[13.6px] lg:leading-[20px]">
            <div>
              <dt className={`inline ${labelBold}`}>Device:</dt>{" "}
              <dd className="inline">{pending?.device ?? " "}</dd>
              <span className="mx-2 hidden sm:inline lg:mx-2.5">|</span>
              <br className="sm:hidden" />
              <dt className={`inline ${labelBold}`}>Browser:</dt>{" "}
              <dd className="inline">{pending?.browser ?? " "}</dd>
            </div>
            <div>
              <dt className={`inline ${labelBold}`}>Location:</dt>{" "}
              <dd className="inline">{pending?.location ?? " "}</dd>
            </div>
            <div>
              <dt className={`inline ${labelBold}`}>Time:</dt>{" "}
              <dd className="inline">{pending?.time ?? " "}</dd>
            </div>
          </dl>
        </div>

        {/* Email notice */}
        <div className="mt-3 flex items-center rounded-xl bg-[#e9effb] py-3 pr-4 lg:mt-[8px] lg:h-[48px] lg:py-0">
          <div className="flex shrink-0 items-center justify-center px-5 text-navy-ink sm:px-6 lg:w-[84px] lg:px-0">
            <MailIcon size={32} className="lg:h-[30px] lg:w-[30px]" />
          </div>
          <div className="min-w-0 text-navy-ink lg:ml-[19px] lg:pl-[1px]">
            <p className="text-[13px] leading-[1.4] lg:text-[12.5px] lg:leading-[18px]">
              OTP sent to your registered email:
            </p>
            <p className="break-all text-[15px] font-bold leading-[1.4] text-[#0c2f94] lg:text-[14.5px] lg:leading-[20px]">
              {pending?.email ?? " "}
            </p>
          </div>
        </div>

        {/* OTP */}
        <label
          htmlFor="device-otp"
          className="mt-5 block text-[16px] font-bold leading-[1.3] text-navy-ink lg:mt-[14px] lg:text-[14.4px]"
        >
          Enter Email Verification Code (OTP)
        </label>
        <div className="relative mt-3 lg:mt-[6px]">
          <LockIcon
            size={24}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-ink lg:h-5 lg:w-5"
          />
          <input
            id="device-otp"
            name="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={authConfig.otpLength}
            placeholder={`Enter ${authConfig.otpLength}-digit OTP`}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="h-[48px] w-full rounded-xl border-[1.5px] border-[#c6ccd9] bg-white pl-[52px] pr-3 text-[15px] font-medium tracking-normal text-navy-ink shadow-[0_1px_3px_rgba(20,40,100,0.12)] outline-none transition placeholder:font-normal placeholder:text-muted focus:border-navy focus:ring-2 focus:ring-navy/15 lg:h-[38px] lg:rounded-lg lg:pl-[52px] lg:text-[13.6px]"
          />
        </div>

        <p
          role="alert"
          aria-live="polite"
          className={`mt-2 text-center text-[13px] font-semibold text-[#c0262d] ${error ? "" : "hidden"}`}
        >
          {error}
        </p>

        <p className="mt-3 text-balance text-center text-[14px] text-navy-ink lg:mt-[8px] lg:text-[13.6px] lg:leading-[20px]">
          Didn&apos;t receive the OTP?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={countdown > 0}
            className="font-bold text-[#1a56c4] enabled:cursor-pointer enabled:hover:underline disabled:cursor-default"
          >
            Resend OTP
          </button>
          {countdown > 0 && <> in {countdown} sec</>}
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="mx-auto mt-5 inline-flex h-[52px] w-full max-w-[336px] items-center justify-center gap-3 rounded-full bg-[linear-gradient(180deg,#143c93_0%,#0a2268_100%)] text-[17px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(10,34,104,0.55)] transition hover:brightness-110 active:translate-y-px disabled:opacity-70 lg:mt-[14px] lg:h-[46px] lg:max-w-[260px] lg:gap-2 lg:text-[17px]"
        >
          {submitting ? "Verifying…" : "Verify & Continue"}
          {!submitting && <ArrowRightIcon size={22} />}
        </button>

        {/* or */}
        <div className="mt-5 flex items-center gap-3 lg:mt-[12px]" role="separator">
          <span className="h-px flex-1 bg-[#d3d9e6]" />
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#d3d9e6] bg-white text-[15px] font-bold text-navy-ink lg:h-[26px] lg:w-[26px] lg:text-[13px]">
            or
          </span>
          <span className="h-px flex-1 bg-[#d3d9e6]" />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3 lg:mt-[10px] lg:flex-nowrap lg:gap-[18px]">
          <button type="button" onClick={notMe} className={`${outlineBtn} lg:w-[194px]`}>
            <ShieldCheckIcon size={20} />
            This Wasn&apos;t Me
          </button>
          <button type="button" onClick={backToLogin} className={`${outlineBtn} lg:w-[194px]`}>
            <ArrowLeftIcon size={19} />
            Back to Login
          </button>
        </div>

        <p className="mt-5 flex items-center justify-center gap-3 rounded-lg bg-[#fbf1cf] px-3 py-3 text-center text-[14px] font-medium text-navy-ink lg:mt-[12px] lg:h-[34px] lg:gap-2.5 lg:py-0 lg:text-[13.6px]">
          <InfoIcon size={20} className="shrink-0" />
          Never share your OTP with anyone.
        </p>
      </form>

      <AuthFooter variant="login" />
    </section>
  );
}
