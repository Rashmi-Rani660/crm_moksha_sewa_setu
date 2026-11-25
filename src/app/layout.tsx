import type { Metadata } from "next";
import { Poppins, Source_Serif_4 } from "next/font/google";
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
  title: "Sewa Setu | Moksha Sewa",
  description:
    "Sewa Setu — secure login for Moksha Sewa, an initiative of Namo Gange Trust.",
};

// The desktop design is a fixed 1320x794 card that is scaled to fit the
// viewport (with a small margin), so the whole screen is always visible in a
// single view. This runs before first paint to avoid a flash of unscaled content.
const stageScaleScript = `(function(){var d=document.documentElement;function f(){d.style.setProperty('--stage-scale',String(Math.min(innerWidth*0.95/1320,innerHeight*0.92/794)))}f();addEventListener('resize',f)})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: stageScaleScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
