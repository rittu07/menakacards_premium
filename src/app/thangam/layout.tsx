import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { wedding } from "@/data/wedding";
import "./thangam.css";

// Font files live in the project, so a build never depends on reaching Google Fonts.
const script = localFont({
  src: [
    { path: "../../fonts/alex-brush-latin-400-normal.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-thangam-script",
  display: "swap",
});

const heading = localFont({
  src: [
    { path: "../../fonts/playfair-display-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/playfair-display-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../../fonts/playfair-display-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/playfair-display-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-thangam-heading",
  display: "swap",
});

const body = localFont({
  src: [
    { path: "../../fonts/lora-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/lora-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../fonts/lora-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/lora-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../../fonts/lora-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/lora-latin-600-italic.woff2", weight: "600", style: "italic" },
  ],
  variable: "--font-thangam-body",
  display: "swap",
});

// The home page always carries one Tamil line, so this one loads for everyone.
const tamil = localFont({
  src: [
    { path: "../../fonts/noto-serif-tamil-tamil-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/noto-serif-tamil-tamil-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/noto-serif-tamil-tamil-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-thangam-tamil-letters",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

// The same design's numbers and symbols, used beside Tamil on every phone.
const tamilLatin = localFont({
  src: [
    { path: "../../fonts/noto-serif-tamil-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/noto-serif-tamil-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/noto-serif-tamil-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-thangam-tamil-latin",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: wedding.thangam.meta.title,
  description: wedding.thangam.meta.description,
  openGraph: {
    title: wedding.thangam.meta.title,
    description: wedding.thangam.meta.description,
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#fff6ec" };

export default function ThangamLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`thangam min-h-svh ${script.variable} ${heading.variable} ${body.variable} ${tamil.variable} ${tamilLatin.variable}`}>
      {children}
    </div>
  );
}
