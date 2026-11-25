"use client";

import {
  useImperativeHandle,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type Ref,
} from "react";

export type OtpInputHandle = { focus: () => void };

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  ref?: Ref<OtpInputHandle>;
};

/** Row of single-digit boxes with auto-advance, backspace and paste support. */
export default function OtpInput({ value, onChange, ref }: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const length = value.length;

  useImperativeHandle(ref, () => ({ focus: () => inputs.current[0]?.focus() }));

  const focusAt = (i: number) => inputs.current[i]?.focus();

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) focusAt(index + 1);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[index] && index > 0) focusAt(index - 1);
    else if (e.key === "ArrowLeft" && index > 0) focusAt(index - 1);
    else if (e.key === "ArrowRight" && index < length - 1) focusAt(index + 1);
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    e.preventDefault();
    onChange(Array.from({ length }, (_, i) => digits[i] ?? ""));
    focusAt(Math.min(digits.length, length - 1));
  }

  return (
    <div className="flex gap-[6px] sm:gap-[6.6px]" role="group" aria-label="One-time password">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          aria-label={`OTP digit ${i + 1}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.currentTarget.select()}
          className="h-[36px] w-[32px] rounded-md border border-[#cfd4de] bg-white text-center text-[17px] font-semibold text-navy-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15 lg:h-[32px] lg:w-[29px] lg:text-[15px]"
        />
      ))}
    </div>
  );
}
