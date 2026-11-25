import type { Metadata, Viewport } from "next";
import { Poppins, Source_Serif_4 } from "next/font/google";
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
  weight: ["700", "800"],
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
 * Desktop (>= lg) layout helper. The login card is a fixed 1320x794 design
 * (hero 804 + form 516, exactly like the reference mock-up) that is scaled to
 * fit the window: at most 91% of the width and 78% of the height, so on a
 * 1448x1086 window it renders at exactly 1:1. The scale is clamped to
 * 0.72–1.5 (very short windows scroll instead of shrinking the text further).
 * Runs before first paint, so there is no flash of unscaled UI.
 */
const stageScript = `(function(){var d=document.documentElement;function f(){var s=Math.min(innerWidth*0.912/1320,innerHeight*0.78/794);s=Math.max(0.72,Math.min(1.5,s));d.style.setProperty('--stage-scale',s.toFixed(4))}f();addEventListener('resize',f)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: stageScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
