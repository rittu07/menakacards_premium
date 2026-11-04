"use client";

import { ArrowRight } from "lucide-react";
import { m } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { coupleNames } from "@/lib/format";
import { entrance, entranceItem, FallingPetals, FloralDivider, GrowCorner, MehrabFrame, namesSize, PetalBurst, primaryButton, unveil } from "./art";

/** After the wedding, this takes the envelope's place as the first screen. */
export function ThankYouCover({ onOpen }: { onOpen: () => void }) {
  const { lang, toggleLang } = usePreferences();
  const { thangam, ui } = wedding;
  const copy = thangam.thanks;

  return (
    <div className="thangam-blush relative flex min-h-svh flex-col items-center overflow-hidden px-6 pb-8 pt-3 text-center">
      <GrowCorner corner="tl" className="w-[34%] max-w-56" />
      <GrowCorner corner="tr" className="w-[34%] max-w-56" />
      <FallingPetals count={6} />
      <PetalBurst className="left-1/2 top-[38%] z-10" />

      <button
        type="button"
        onClick={toggleLang}
        aria-label={ui.switchLanguageLabel[lang]}
        className="thangam-press relative z-10 min-h-11 min-w-20 rounded-full border border-[var(--gold)] bg-[rgb(255_250_243/0.85)] px-4 text-base font-medium text-[var(--burgundy)]"
      >
        {ui.switchLanguage[lang]}
      </button>

      <m.div
        className="relative flex w-full max-w-sm flex-1 flex-col items-center justify-center pt-12"
        variants={entrance}
        initial="hidden"
        animate="show"
      >
        <m.div variants={entranceItem} className="w-full">
          <MehrabFrame
            src={thangam.couplePhoto}
            alt={copy.photoAlt[lang]}
            sizes="(min-width: 480px) 340px, 80vw"
            className="mx-auto aspect-[1.2/1] w-[82%]"
            priority
          />
        </m.div>
        <m.h1 variants={entranceItem} className="thangam-heading mt-9 text-balance text-[1.85rem] font-medium italic leading-tight text-[var(--burgundy)]">
          {copy.title[lang]}
        </m.h1>
        <m.div variants={entranceItem} className="mt-2">
          <FloralDivider />
        </m.div>
        <m.p variants={entranceItem} className="mt-3 text-balance">
          {copy.message[lang]}
        </m.p>
        <m.p {...unveil(0.6)} className={`thangam-names mt-2 ${namesSize(lang, "text-[2.5rem]")}`}>
          {coupleNames(lang)}
        </m.p>
        <m.div variants={entranceItem} className="mt-4">
          <button type="button" onClick={onOpen} className={primaryButton}>
            {copy.view[lang]}
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </m.div>
      </m.div>
    </div>
  );
}
