import type { ReactNode } from "react";

/**
 * Page frame for authentication screens.
 *
 * - Below `lg`: a normal responsive card (hero stacked above the form).
 * - `lg` and up: the fixed 1320x794 split card from the design, scaled by
 *   `--stage-scale` (set in `app/layout.tsx`). The layout box is sized to the
 *   scaled card, so short windows scroll instead of clipping.
 */
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[linear-gradient(95deg,#dcedfd_0%,#cfe8fd_55%,#c9e5fd_100%)] p-3 sm:p-6 lg:p-4">
      <div className="w-full max-w-[720px] lg:max-w-none lg:[height:calc(794px*var(--stage-scale,1))] lg:[width:calc(1320px*var(--stage-scale,1))]">
        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(20,70,150,0.35)] lg:h-[794px] lg:w-[1320px] lg:origin-top-left lg:grid-cols-[804px_516px] lg:[transform:scale(var(--stage-scale,1))]">
          {children}
        </div>
      </div>
    </main>
  );
}
