import type { Metadata, Viewport } from "next";
import { Hind, Poppins, Source_Serif_4 } from "next/font/google";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const hind = Hind({
  variable: "--font-hind-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.brand}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d3e8fc",
};

/**
 * Publishes the window size as unitless CSS variables (--vw / --vh). The auth
 * card scale is derived from them in CSS (see AuthShell), so the layout is
 * right on first paint and after client-side navigation. Runs before paint.
 */
const viewportScript = `(function(){var d=document.documentElement;function f(){d.style.setProperty('--vw',innerWidth);d.style.setProperty('--vh',innerHeight)}f();addEventListener('resize',f)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${sourceSerif.variable} ${hind.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: viewportScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
