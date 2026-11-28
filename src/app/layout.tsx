import type { Metadata } from "next";
import { Hind, Poppins, Source_Serif_4 } from "next/font/google";
import ViewportVars from "@/components/ui/ViewportVars";
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
  weight: ["400", "500", "700", "800"],
});

const hind = Hind({
  variable: "--font-hind-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.brand}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d3e8fc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${sourceSerif.variable} ${hind.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ViewportVars />
        {children}
      </body>
    </html>
  );
}
