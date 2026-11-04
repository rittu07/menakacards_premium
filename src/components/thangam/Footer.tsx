"use client";

import { useState } from "react";
import { Download, Image as ImageIcon, LoaderCircle, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { m } from "motion/react";
import { wedding } from "@/data/wedding";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { usePreferences } from "@/components/shared/Preferences";
import { coupleNames, mapsUrl, telUrl, whatsappUrl } from "@/lib/format";
import { downloadBlob } from "@/lib/pdf";
import { Flourish, Lotus, namesSize, reveal, Rosette, unveil, WaxSeal } from "./art";

const iconLink =
  "thangam-press inline-flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border border-[var(--champagne)] px-1 py-2 text-center text-[0.95rem] font-medium leading-tight text-[var(--ivory)] hover:bg-[rgb(255_255_255/0.08)]";

const wideButton =
  "thangam-press inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--ivory)] px-4 py-2 text-center font-medium text-[var(--burgundy)] hover:bg-[var(--peach)] disabled:opacity-80";

type Job = "pdf" | "status";

export function Footer() {
  const { lang } = usePreferences();
  const { contact, venue, ui, thangam, brand, couple } = wedding;
  const copy = thangam.footer;
  const [busy, setBusy] = useState<Job | null>(null);
  const [failed, setFailed] = useState<Job | null>(null);

  const make = async (job: Job) => {
    setBusy(job);
    setFailed(null);
    try {
      // Only guests who ask for a download pay for the code that draws it.
      const { renderPdf, renderStatus } = await import("./renderCard");
      if (job === "pdf") downloadBlob(await renderPdf(lang), thangam.files.pdf);
      else downloadBlob(await renderStatus(lang), thangam.files.status);
    } catch {
      setFailed(job);
    } finally {
      setBusy(null);
    }
  };

  const shareLink = () => {
    const address = typeof window === "undefined" ? "" : `${window.location.origin}/thangam`;
    return `https://wa.me/?text=${encodeURIComponent(`${copy.shareMessage[lang]} ${address}`)}`;
  };

  return (
    <footer className="thangam-lazy thangam-wine relative overflow-hidden px-5 pb-8 pt-10 text-center [--lazy-size:720px]">
      <Rosette color="var(--champagne)" className="left-1/2 top-24 size-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-20" />
      <div className="relative mx-auto max-w-md">
        <m.div {...reveal()} className="flex flex-col items-center">
          <Lotus className="h-8 w-auto" color="var(--champagne)" />
          <m.p {...unveil(0.25)} className={`thangam-names mt-1 !text-[var(--ivory)] ${namesSize(lang, "text-[2.8rem]")}`}>{coupleNames(lang)}</m.p>
          <Flourish light className="h-4 w-44" />
          <p className="mt-2 italic">{copy.thanks[lang]}</p>
        </m.div>

        <m.div {...reveal("up", 0.1)} className="mt-6 grid grid-cols-3 gap-2">
          <a href={telUrl(contact.phone)} className={iconLink}>
            <Phone className="size-5 shrink-0" aria-hidden="true" />
            {ui.call[lang]}
          </a>
          <a href={whatsappUrl(contact.phone, contact.whatsappMessage[lang])} target="_blank" rel="noreferrer" className={iconLink}>
            <MessageCircle className="size-5 shrink-0" aria-hidden="true" />
            {ui.whatsapp[lang]}
          </a>
          <a href={mapsUrl(venue.mapQuery)} target="_blank" rel="noreferrer" className={iconLink}>
            <MapPin className="size-5 shrink-0" aria-hidden="true" />
            {ui.map[lang]}
          </a>
        </m.div>

        <m.div {...reveal("up", 0.15)} className="mt-3 flex flex-col gap-2">
          <a href={shareLink()} target="_blank" rel="noreferrer" className={wideButton}>
            <Share2 className="size-5" aria-hidden="true" />
            {copy.share[lang]}
          </a>
          <button type="button" onClick={() => make("status")} disabled={busy !== null} className={wideButton}>
            {busy === "status" ? (
              <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <ImageIcon className="size-5" aria-hidden="true" />
            )}
            {busy === "status" ? copy.preparingStatus[lang] : copy.status[lang]}
          </button>
          <button type="button" onClick={() => make("pdf")} disabled={busy !== null} className={wideButton}>
            {busy === "pdf" ? (
              <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <Download className="size-5" aria-hidden="true" />
            )}
            {busy === "pdf" ? ui.preparingPdf[lang] : ui.downloadPdf[lang]}
          </button>
          {failed && (
            <p role="alert">{failed === "pdf" ? ui.pdfFailed[lang] : copy.statusFailed[lang]}</p>
          )}
        </m.div>

        <div className="mt-8 flex flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)] bg-[rgb(0_0_0/0.14)] py-1 pl-1 pr-4">
            {/* The seal is pressed down onto the badge. */}
            <m.span
              className="inline-flex"
              initial={{ scale: 2.2, opacity: 0, rotate: -18 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 320, damping: 17, delay: 0.25 }}
            >
              <WaxSeal initials={couple.initials[lang]} lang={lang} className="size-9" />
            </m.span>
            <span className="font-semibold text-[var(--champagne)]">{thangam.badge[lang]}</span>
          </span>
          <BrandLogo lang={lang} className="mt-4" />
          <p className="mt-2 text-[0.95rem]">{thangam.collection[lang]}</p>
          <a href={brand.orderUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center px-2 underline underline-offset-4">
            {ui.orderInvitation[lang]}
          </a>
        </div>
      </div>
    </footer>
  );
}
