"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { m } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { coupleNames, formatDate, formatTimeRange } from "@/lib/format";
import {
  ArchPanel,
  Art,
  artFiles,
  Bloom,
  entrance,
  entranceItem,
  Flourish,
  FloralDivider,
  GrowCorner,
  Lotus,
  MehrabFrame,
  namesSize,
  ParallaxLayer,
  Rosette,
  unveil,
} from "./art";

export function Home() {
  const { lang } = usePreferences();
  const { thangam, muhurtham, venue } = wedding;
  const copy = thangam.home;

  return (
    <section id="home" className="thangam-blush relative overflow-hidden px-4 pb-16 pt-6 md:pt-10">
      {/* Back layer: the palace and florals drift slower than the card in front. */}
      <ParallaxLayer distance={48} className="absolute inset-0">
        <Art src={artFiles.palace} className="absolute bottom-[7%] left-1/2 h-auto w-[130%] max-w-3xl -translate-x-1/2" />
      </ParallaxLayer>
      {/* On wider screens a second depth of roses fills the space beside the card. */}
      <ParallaxLayer distance={80} className="absolute inset-0 hidden md:block">
        <Art src={artFiles.bottomLeft} className="absolute left-0 top-[34%] h-auto w-52 opacity-90 [mask-image:linear-gradient(to_top,transparent,black_30%)]" />
        <Art src={artFiles.bottomRight} className="absolute right-0 top-[34%] h-auto w-52 opacity-90 [mask-image:linear-gradient(to_top,transparent,black_30%)]" />
      </ParallaxLayer>
      <GrowCorner corner="tl" className="z-[2] w-[25%] max-w-60" />
      <GrowCorner corner="tr" className="z-[2] w-[25%] max-w-60" delay={0.08} />
      <GrowCorner corner="bl" className="z-[2] w-[30%] max-w-56" delay={0.16} />
      <GrowCorner corner="br" className="z-[2] w-[30%] max-w-56" delay={0.24} />

      <m.div className="relative z-[1] mx-auto max-w-md md:max-w-xl" variants={entrance} initial="hidden" animate="show">
        <ArchPanel>
          <div className="flex flex-col items-center px-4 pb-8 text-center">
            <m.p variants={entranceItem} className="text-[0.82rem] uppercase tracking-[0.24em]">
              {copy.eyebrow[lang]}
            </m.p>
            <m.h1 {...unveil(0.3)} className={`thangam-names mt-1 ${namesSize(lang, "text-[clamp(2.7rem,13.5vw,4.25rem)]")}`}>
              {coupleNames(lang)}
            </m.h1>
            <m.div variants={entranceItem}>
              <Flourish />
            </m.div>
            <m.div variants={entranceItem} className="relative mt-4 w-full">
              <Rosette className="left-1/2 top-1/2 size-[105%] -translate-x-1/2 -translate-y-1/2 opacity-30" />
              <MehrabFrame
                src={thangam.couplePhoto}
                alt={copy.photoAlt[lang]}
                sizes="(min-width: 768px) 420px, 75vw"
                className="mx-auto aspect-[1.2/1] w-[80%]"
                priority
              />
            </m.div>
            <m.p variants={entranceItem} className="mt-10 text-balance leading-relaxed">
              {copy.message[lang]}
            </m.p>
            <m.p variants={entranceItem} className="thangam-tamil mt-2 text-balance text-[1.1rem] font-semibold text-[var(--burgundy)]">
              {copy.tamilLine}
            </m.p>
            <m.div variants={entranceItem} className="mt-3">
              <FloralDivider />
            </m.div>
            <m.div variants={entranceItem} className="mt-4 space-y-3 text-left">
              <div className="flex gap-3">
                <CalendarDays className="mt-1 size-6 shrink-0 text-[var(--burgundy)]" aria-hidden="true" />
                <p className="leading-snug">
                  <span className="font-semibold">{formatDate(muhurtham.start, lang)}</span>
                  <br />
                  {formatTimeRange(muhurtham.start, muhurtham.end, lang)}
                </p>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-1 size-6 shrink-0 text-[var(--burgundy)]" aria-hidden="true" />
                <p className="leading-snug">
                  <span className="font-semibold">{venue.name[lang]}</span>
                  <br />
                  {venue.address[lang]}
                </p>
              </div>
            </m.div>
            <m.div variants={entranceItem} className="mt-4 flex items-center gap-2">
              <Bloom className="size-5" />
              <Lotus className="h-8 w-auto" />
              <Bloom className="size-5" />
            </m.div>
          </div>
        </ArchPanel>
      </m.div>
    </section>
  );
}
