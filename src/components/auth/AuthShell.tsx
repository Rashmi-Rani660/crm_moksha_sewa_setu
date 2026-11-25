import type { CSSProperties, ReactNode } from "react";

/**
 * Design sizes (px) of the desktop card. Login, forgot / reset password and
 * new-device verification all use the same card.
 * `fw` / `fh` = how much of the window width / height the card may fill.
 */
export const authLayouts = {
  login: { w: 1400, h: 794, hero: 844, fw: 0.965, fh: 0.84 },
} as const;

export type AuthVariant = keyof typeof authLayouts;

/** CSS expression for a card's scale factor (unitless) at the current window size. */
const scaleFor = ({ w, h, fw, fh }: { w: number; h: number; fw: number; fh: number }) =>
  `clamp(0.55, min(calc(var(--vw, 1448) * ${fw} / ${w}), calc(var(--vh, 1086) * ${fh} / ${h})), 1.35)`;

/**
 * Page frame for authentication screens.
 *
 * - Below `lg`: a normal responsive card (hero stacked above the form).
 * - `lg` and up: the fixed-size split card from the design, scaled to fit the
 *   window. `--vw` / `--vh` (window size, unitless) are set by the inline
 *   script in `app/layout.tsx`; the scale is computed in CSS so it also works
 *   after client-side navigation. It is clamped to 0.72–1.5 — very short
 *   windows scroll instead of shrinking the text further.
 */
export default function AuthShell({
  variant,
  children,
}: {
  variant: AuthVariant;
  children: ReactNode;
}) {
  const l = authLayouts[variant];
  const style = {
    "--cw": l.w,
    "--ch": l.h,
    "--hero-w": `${l.hero}px`,
    "--s": scaleFor(l),
  } as CSSProperties;

  return (
    <main
      style={style}
      className="flex min-h-dvh items-center justify-center bg-[linear-gradient(95deg,#dcedfd_0%,#cfe8fd_55%,#c9e5fd_100%)] p-3 sm:p-6 lg:p-4"
    >
      <div className="w-full max-w-[720px] lg:max-w-none lg:[height:calc(var(--ch)*1px*var(--s))] lg:[width:calc(var(--cw)*1px*var(--s))]">
        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(20,70,150,0.35)] lg:origin-top-left lg:[height:calc(var(--ch)*1px)] lg:[width:calc(var(--cw)*1px)] lg:[grid-template-columns:var(--hero-w)_1fr] lg:[transform:scale(var(--s))]">
          {children}
        </div>
      </div>
    </main>
  );
}
