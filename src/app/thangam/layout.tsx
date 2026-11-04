import type { Metadata, Viewport } from "next";
import { Alex_Brush, Lora, Noto_Serif_Tamil, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { wedding } from "@/data/wedding";
import "./thangam.css";

const script = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-thangam-script",
  display: "swap",
});

const heading = Playfair_Display({
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-thangam-heading",
  display: "swap",
});

const body = Lora({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-thangam-body",
  display: "swap",
});

// The home page always carries one Tamil line, so this one loads for everyone.
const tamil = Noto_Serif_Tamil({
  weight: ["400", "600", "700"],
  subsets: ["tamil"],
  variable: "--font-thangam-tamil",
  display: "swap",
  preload: false,
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
    <div className={`thangam min-h-svh ${script.variable} ${heading.variable} ${body.variable} ${tamil.variable}`}>
      {children}
    </div>
  );
}
