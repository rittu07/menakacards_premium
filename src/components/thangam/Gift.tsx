"use client";

import { useEffect, useState } from "react";
import { Copy, Wallet } from "lucide-react";
import { m } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { GrowCorner, Heading, secondaryButton, smooth } from "./art";

export function Gift() {
  const { lang } = usePreferences();
  const { gift } = wedding.thangam;
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const upiLink = `upi://pay?pa=${encodeURIComponent(gift.upiId)}&pn=${encodeURIComponent(gift.payeeName)}&cu=INR`;

  // Only guests who reach this section download the QR library.
  useEffect(() => {
    let live = true;
    void import("qrcode")
      .then(({ toDataURL }) => toDataURL(upiLink, { width: 480, margin: 1, color: { dark: "#650f24", light: "#fffaf3" } }))
      .then((url) => {
        if (live) setQr(url);
      })
      .catch(() => {
        if (live) setQr(null);
      });
    return () => {
      live = false;
    };
  }, [upiLink]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(gift.upiId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="gift" className="thangam-lazy relative overflow-hidden px-4 py-14 [--lazy-size:800px]">
      <GrowCorner corner="bl" className="w-[28%] max-w-48" />
      <GrowCorner corner="br" className="w-[28%] max-w-48" delay={0.1} />
      <Heading>{gift.title[lang]}</Heading>
      {/* The card tips forward into place, like an envelope set on a table. */}
      <m.div
        className="thangam-card relative mx-auto mt-6 max-w-sm rounded-3xl px-5 py-6 text-center"
        style={{ transformPerspective: 900 }}
        initial={{ opacity: 0, rotateX: -32, y: 24 }}
        whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: smooth, delay: 0.1 }}
      >
        <p className="text-balance leading-relaxed">{gift.line[lang]}</p>
        <div className="mx-auto mt-4 aspect-square w-52 overflow-hidden rounded-xl border border-[var(--champagne)] bg-[#fffaf3] p-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- generated in the browser as a data URL */}
          {qr && <img src={qr} alt={gift.qrAlt[lang]} width={480} height={480} className="size-full" />}
        </div>
        {gift.sample && <p className="mt-2 text-[0.9rem] font-semibold text-[var(--rose)]">{gift.sampleNote[lang]}</p>}
        <p className="mt-2 font-medium">{gift.upiId}</p>
        <div className="mt-3 flex flex-col gap-2">
          <a href={upiLink} className={secondaryButton}>
            <Wallet className="size-5" aria-hidden="true" />
            {gift.pay[lang]}
          </a>
          <button type="button" onClick={copy} className={secondaryButton}>
            <Copy className="size-5" aria-hidden="true" />
            <span aria-live="polite">{copied ? gift.copied[lang] : gift.copy[lang]}</span>
          </button>
        </div>
      </m.div>
    </section>
  );
}
