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
  usePendingVerification,
} from "@/lib/auth/session";
import { authConfig } from "@/lib/config/site";

const outlineBtn =
  "inline-flex h-[46px] min-w-[160px] flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-full border-[1.5px] border-navy-ink bg-white px-4 text-[15px] font-semibold text-navy-ink transition hover:bg-navy-ink hover:text-white lg:h-[45px] lg:min-w-0 lg:flex-none lg:text-[16.5px]";

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

  // No sign-in attempt to verify (e.g. page opened directly) → back to login.
  useEffect(() => {
    if (ready && !pending && !leaving.current) router.replace("/login");
  }, [ready, pending, router]);

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
    if (otp.length !== authConfig.otpLength) {
      setError(`Enter the ${authConfig.otpLength}-digit code sent to your email.`);
      return;
    }
    setError("");
    setSubmitting(true);
    // TODO: call the "verify device" API here with { otp }.
    await new Promise((r) => setTimeout(r, 600));
    leaving.current = true;
    if (pending) signIn(pending.mobile);
    clearVerification();
    router.push("/dashboard");
  }

  function notMe() {
    leaving.current = true;
    clearVerification();
    setFlash(
      "Thanks for letting us know. This sign-in was blocked — if you did not try to log in, please change your password.",
    );
    router.push("/login");
  }

  function backToLogin() {
    leaving.current = true;
    clearVerification();
    router.push("/login");
  }

  const labelBold = "font-semibold lg:font-semibold";

  return (
    <section className="flex min-w-0 flex-col bg-white">
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto flex w-full max-w-[560px] flex-col px-6 pt-8 sm:px-0 lg:mx-0 lg:max-w-none lg:pl-[52px] lg:pr-[40px] lg:pt-[20px]"
      >
        {/* Title */}
        <div className="text-center lg:translate-x-[0px]">
          <BrandTitle className="text-[32px] sm:text-[34px] lg:text-[29.5px]" />
        </div>

        <h2 className="mt-6 text-[26px] font-bold leading-[1.2] text-navy-ink sm:text-[30px] lg:mt-[27px] lg:text-[32px]">
          New Device Verification
        </h2>
        <p className="mt-2 text-[15px] leading-[1.45] text-navy-ink sm:text-[16px] lg:mt-[9px] lg:text-[16.7px] lg:leading-[23px]">
          We detected a sign-in attempt from a new device.
          <br className="hidden sm:inline" /> To protect your account, please
          verify your identity.
        </p>

        {/* Device details */}
        <div className="mt-5 flex items-center rounded-xl bg-[#e9effb] py-3 pr-4 lg:mt-[22px] lg:h-[89px] lg:py-0">
          <div className="flex shrink-0 items-center justify-center px-3 sm:px-4 lg:w-[118px] lg:px-0">
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-navy-ink shadow-sm lg:h-[70px] lg:w-[70px]">
              <LaptopIcon size={30} className="lg:h-[40px] lg:w-[40px]" />
            </span>
          </div>
          <span aria-hidden className="mr-4 h-[58px] w-px shrink-0 bg-[#b4c0da] lg:mr-[27px]" />
          <dl className="min-w-0 text-[14px] leading-[1.55] text-navy-ink lg:text-[16.5px] lg:leading-[23px]">
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
        <div className="mt-3 flex items-center rounded-xl bg-[#e9effb] py-3 pr-4 lg:mt-[15px] lg:h-[62px] lg:py-0">
          <div className="flex shrink-0 items-center justify-center px-5 text-navy-ink sm:px-6 lg:w-[118px] lg:pl-[22px] lg:pr-0">
            <MailIcon size={32} className="lg:h-[40px] lg:w-[40px]" />
          </div>
          <div className="min-w-0 text-navy-ink lg:ml-[27px] lg:-translate-y-[2px] lg:pl-[1px]">
            <p className="text-[13px] leading-[1.4] lg:text-[14.5px] lg:leading-[23px]">
              OTP sent to your registered email:
            </p>
            <p className="break-all text-[15px] font-bold leading-[1.4] text-[#0c2f94] lg:text-[16.8px] lg:leading-[23px]">
              {pending?.email ?? " "}
            </p>
          </div>
        </div>

        {/* OTP */}
        <label
          htmlFor="device-otp"
          className="mt-5 block text-[16px] font-bold leading-[1.3] text-navy-ink lg:mt-[24px] lg:text-[18.7px]"
        >
          Enter Email Verification Code (OTP)
        </label>
        <div className="relative mt-3 lg:mt-[9px]">
          <LockIcon
            size={24}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-ink lg:left-[21px]"
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
            className="h-[48px] w-full rounded-xl border-[1.5px] border-[#c6ccd9] bg-white pl-[52px] pr-3 text-[15px] font-medium tracking-normal text-navy-ink shadow-[0_1px_3px_rgba(20,40,100,0.12)] outline-none transition placeholder:font-normal placeholder:text-muted focus:border-navy focus:ring-2 focus:ring-navy/15 lg:h-[47px] lg:pl-[64px] lg:text-[15.3px]"
          />
        </div>

        <p
          role="alert"
          aria-live="polite"
          className={`mt-2 text-center text-[13px] font-semibold text-[#c0262d] ${error ? "" : "hidden"}`}
        >
          {error}
        </p>

        <p className="mt-3 text-balance text-center text-[14px] text-navy-ink lg:mt-[16px] lg:text-[16.3px] lg:leading-[24px]">
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
          className="mx-auto mt-5 inline-flex h-[52px] w-full max-w-[336px] items-center justify-center gap-3 rounded-full bg-[linear-gradient(180deg,#143c93_0%,#0a2268_100%)] text-[17px] font-semibold text-white shadow-[0_10px_20px_-6px_rgba(10,34,104,0.55)] transition hover:brightness-110 active:translate-y-px disabled:opacity-70 lg:mt-[27px] lg:h-[57px] lg:text-[20px]"
        >
          {submitting ? "Verifying…" : "Verify & Continue"}
          {!submitting && <ArrowRightIcon size={26} />}
        </button>

        {/* or */}
        <div className="mt-5 flex items-center gap-3 lg:mt-[24px]" role="separator">
          <span className="h-px flex-1 bg-[#d3d9e6]" />
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#d3d9e6] bg-white text-[15px] font-bold text-navy-ink lg:h-[31px] lg:w-[31px]">
            or
          </span>
          <span className="h-px flex-1 bg-[#d3d9e6]" />
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3 lg:mt-[17px] lg:flex-nowrap lg:gap-[30px]">
          <button type="button" onClick={notMe} className={`${outlineBtn} lg:w-[228px]`}>
            <ShieldCheckIcon size={24} />
            This Wasn&apos;t Me
          </button>
          <button type="button" onClick={backToLogin} className={`${outlineBtn} lg:w-[232px]`}>
            <ArrowLeftIcon size={22} />
            Back to Login
          </button>
        </div>

        <p className="mt-5 flex items-center justify-center gap-3 rounded-lg bg-[#fbf1cf] px-3 py-3 text-center text-[14px] font-medium text-navy-ink lg:mt-[28px] lg:h-[42px] lg:gap-3 lg:py-0 lg:text-[15.6px]">
          <InfoIcon size={24} className="shrink-0" />
          Never share your OTP with anyone.
        </p>
      </form>

      <AuthFooter variant="verify" />
    </section>
  );
}
