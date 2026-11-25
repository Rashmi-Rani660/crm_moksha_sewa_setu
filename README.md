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
│   ├── (auth)/login/page.tsx   # /login route
│   ├── layout.tsx              # fonts, metadata, viewport, desktop scale helper
│   ├── page.tsx                # / → redirects to /login
│   ├── globals.css             # Tailwind + brand colour tokens
│   └── favicon.ico, icon.png, apple-icon.png   # generated, see `npm run images`
├── components/
│   ├── auth/                   # login feature
│   │   ├── AuthShell.tsx       #   page frame / responsive card
│   │   ├── LoginHero.tsx       #   brand panel (logo, tagline, photo)
│   │   ├── LoginForm.tsx       #   form (client component)
│   │   └── OtpInput.tsx        #   6-digit OTP boxes
│   └── ui/icons.tsx            # shared SVG icons
└── lib/
    ├── config/site.ts          # brand text + auth settings (OTP length, …)
    └── validation.ts           # mobile / login validation
public/images/                  # hero photo + transparent logo
scripts/                        # asset pipeline (logo source → PNG/favicons)
```

New screens: add a route under `src/app/(group)/…`, put feature components in
`src/components/<feature>/`, shared pieces in `src/components/ui/`, and
non-UI logic in `src/lib/`.

## Responsive behaviour

- **< 1024px (phones, tablets):** normal flow — brand block, photo, then the
  form, centred in a card (max 720px). Nothing is absolutely positioned over
  the photo's focus area, so nothing overlaps.
- **≥ 1024px (laptops, desktops):** the fixed 1320×794 split card from the
  design (hero 804 + form 516), scaled to fit the window (max 91% of the width,
  78% of the height — exactly 1:1 on a 1448×1086 window). The scale is clamped
  to 0.72–1.5, so very short windows scroll instead of shrinking the text
  further. The scale is computed in a tiny inline script in `app/layout.tsx`
  (runs before first paint, no flash).

## Still to wire up

`LoginForm.tsx` has two `TODO`s — the "Send OTP" and "Sign In" API calls.

## Assets

Replace the logo by dropping a new file at `scripts/images/logo-source.png`
(white background) and running `npm run images`. This regenerates
`public/images/moksha-sewa-logo.png` and the favicons.
