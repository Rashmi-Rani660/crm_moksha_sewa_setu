# CRM — Moksha Sewa · Sewa Setu

Next.js (App Router) + Tailwind CSS v4. The first screen is the secure login
(mobile number + password + OTP).

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000  (/ redirects to /login)
```

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Development server                                        |
| `npm run build`     | Production build                                          |
| `npm run start`     | Serve the production build                                |
| `npm run lint`      | ESLint                                                    |
| `npm run typecheck` | TypeScript check                                          |
| `npm run images`    | Re-generate logo PNG + favicons from `scripts/images/`    |

## Project structure

```
src/
├── app/
│   ├── (auth)/login/page.tsx          # /login
│   ├── (auth)/verify-device/page.tsx  # /verify-device (new-device OTP)
│   ├── dashboard/page.tsx             # placeholder landing after login
│   ├── layout.tsx              # fonts, metadata, viewport, desktop scale helper
│   ├── page.tsx                # / → redirects to /login
│   ├── globals.css             # Tailwind + brand colour tokens
│   └── favicon.ico, icon.png, apple-icon.png   # generated, see `npm run images`
├── components/
│   ├── auth/                   # login feature
│   │   ├── AuthShell.tsx       #   page frame / responsive card (per-screen design size)
│   │   ├── AuthHero.tsx        #   brand panel (logo, tagline, photo), `variant` per screen
│   │   ├── AuthFooter.tsx      #   copyright + developer badge
│   │   ├── BrandTitle.tsx      #   "Sewa Setu" wordmark
│   │   ├── LoginForm.tsx       #   login form (client component)
│   │   ├── VerifyDeviceForm.tsx#   new-device verification form
│   │   └── OtpInput.tsx        #   6-digit OTP boxes
│   ├── dashboard/DashboardHome.tsx

│   └── ui/icons.tsx            # shared SVG icons
└── lib/
    ├── auth/session.ts         # sessionStorage flow state (pending verification, session)
    ├── config/site.ts          # brand text + auth settings (OTP length, …)
    └── validation.ts           # mobile / login validation
public/images/                  # hero photo + transparent logo
scripts/                        # asset pipeline (logo source → PNG/favicons)
```

New screens: add a route under `src/app/(group)/…`, put feature components in
`src/components/<feature>/`, shared pieces in `src/components/ui/`, and
non-UI logic in `src/lib/`.

## Auth flow

`/login` → **Sign In** → `/verify-device` (new device, OTP sent to e-mail) →
**Verify & Continue** → `/dashboard`.

- **This Wasn't Me** clears the attempt and returns to `/login` with a notice.
- **Back to Login** clears the attempt and returns to `/login`.
- Opening `/verify-device` or `/dashboard` without the previous step redirects
  to `/login`.

State lives in `sessionStorage` (`src/lib/auth/session.ts`) until a backend
exists. TODOs to wire to the API: Send OTP and Sign In (`LoginForm.tsx`),
Verify / Resend OTP (`VerifyDeviceForm.tsx`), and the e-mail + location shown
on the verification screen (`startVerification` in `session.ts`).

## Responsive behaviour

- **< 1024px (phones, tablets):** normal flow — brand block, photo, then the
  form, centred in a card (max 720px). Nothing is absolutely positioned over
  the photo's focus area, so nothing overlaps.
- **≥ 1024px (laptops, desktops):** a fixed-size split card per screen
  (login 1320×794, verification 1355×912 — see `authLayouts` in
  `AuthShell.tsx`), scaled to fit the window. The scale is derived in CSS from
  `--vw` / `--vh`, which a tiny inline script in `app/layout.tsx` publishes
  before first paint. It is clamped to 0.72–1.5, so very short windows scroll
  instead of shrinking the text further.

## Assets

Replace the logo by dropping a new file at `scripts/images/logo-source.png`
(white background) and running `npm run images`. This regenerates
`public/images/moksha-sewa-logo.png` and the favicons.
