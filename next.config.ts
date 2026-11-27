import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Hide the Next.js dev-mode "N" badge.
  devIndicators: false,
  images: {
    qualities: [75, 90],
  },
  partialPrefetching: true,
  // "/" has no page of its own — send visitors straight to the login screen.
  // Done here (routing level) instead of redirect() inside a page, because
  // with Cache Components a page that only redirects fails prerender
  // validation ("Could not validate `instant`").
  async redirects() {
    return [{ source: "/", destination: "/login", permanent: false }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
