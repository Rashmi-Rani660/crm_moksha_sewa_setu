/** Brand + copy used across the app. Change text here, not in components. */
export const siteConfig = {
  name: "Sewa Setu",
  brand: "Moksha Sewa",
  trust: "Namo Gange Trust",
  initiative: "An Initiative of Namo Gange Trust",
  description:
    "Sewa Setu — secure login for Moksha Sewa, an initiative of Namo Gange Trust.",
  copyrightYear: 2026,
  tagline: {
    title: ["Dignity in Every", "Final Journey"],
    text: ["Serving with compassion, care", "and responsibility."],
  },
  developer: {
    name: "enCodency",
    legal: "Pvt. Ltd.",
    slogan: "Raise the Bar",
  },
} as const;

export const authConfig = {
  otpLength: 6,
  otpResendSeconds: 30,
  minPasswordLength: 6,
  maxPasswordLength: 20,
} as const;
