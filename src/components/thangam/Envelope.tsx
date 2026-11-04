"use client";

import { useEffect, useRef, useState } from "react";
import { Hand, Volume2, VolumeX } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { coupleNames, formatDate } from "@/lib/format";
import { Art, artFiles, FallingPetals, Flourish, FloralDivider, GrowCorner, Lotus, PetalBurst, smooth, WaxSeal } from "./art";

/**
 * The opening, in order: the ribbon and seal lift away, the flap folds up and
 * behind, the card rises out, then the invitation takes over the screen.
 */
const steps = { seal: 450, flap: 750, card: 800, settle: 650 };
const FLAP_TIP = 62; // Where the flap's point lands, as a percent of the envelope's height.

type Stage = "closed" | "seal" | "flap" | "card" | "done";

export function Envelope({ onOpen }: { onOpen: () => void }) {
  const { lang, toggleLang, musicOn, toggleMusic, startMusicSoftly } = usePreferences();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("closed");
  const [flapBehind, setFlapBehind] = useState(false);
  const timers = useRef<number[]>([]);
  const { thangam, couple, ui, muhurtham } = wedding;
  const copy = thangam.cover;

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const open = () => {
    if (stage !== "closed") return;
    if (thangam.music.defaultTrack && !musicOn) startMusicSoftly();

    if (reduced) {
      setStage("done");
      timers.current.push(window.setTimeout(onOpen, 300));
      return;
    }
    const at = (delay: number, action: () => void) => timers.current.push(window.setTimeout(action, delay));
    setStage("seal");
    at(steps.seal, () => setStage("flap"));
    // The flap passes behind the card halfway through its fold.
    at(steps.seal + steps.flap / 2, () => setFlapBehind(true));
    at(steps.seal + steps.flap, () => setStage("card"));
    at(steps.seal + steps.flap + steps.card, () => setStage("done"));
    at(steps.seal + steps.flap + steps.card + steps.settle, onOpen);
  };

  const sealed = stage === "closed";
  // With reduced motion the closed envelope simply fades, with nothing folding.
  const flapOpen = !reduced && (stage === "flap" || stage === "card" || stage === "done");
  const cardOut = !reduced && (stage === "card" || stage === "done");

  return (
    <div className="thangam-blush relative flex min-h-svh flex-col items-center overflow-hidden px-4 pb-6 pt-3 text-center">
      <GrowCorner corner="tl" className="w-[30%] max-w-52 opacity-80" />
      <GrowCorner corner="tr" className="w-[30%] max-w-52 opacity-80" />
      <GrowCorner corner="bl" className="w-[30%] max-w-52 opacity-80" />
      <GrowCorner corner="br" className="w-[30%] max-w-52 opacity-80" />
      <FallingPetals count={5} />

      <div className="relative z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleLang}
          aria-label={ui.switchLanguageLabel[lang]}
          className="thangam-press min-h-11 min-w-20 rounded-full border border-[var(--gold)] bg-[rgb(255_250_243/0.85)] px-4 text-base font-medium text-[var(--burgundy)]"
        >
          {ui.switchLanguage[lang]}
        </button>
        {/* Always on screen, so music can be silenced the moment it starts. */}
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={musicOn ? ui.musicOff[lang] : ui.musicOn[lang]}
          className="thangam-press flex size-11 items-center justify-center rounded-full border border-[var(--gold)] bg-[rgb(255_250_243/0.85)] text-[var(--burgundy)]"
        >
          {musicOn ? <Volume2 className="size-5" aria-hidden="true" /> : <VolumeX className="size-5" aria-hidden="true" />}
        </button>
      </div>

      <m.div
        className="relative flex w-full flex-1 flex-col items-center justify-center"
        animate={{ opacity: stage === "done" ? 0 : 1, scale: stage === "done" ? 1.04 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* A warm light rises from inside as the envelope opens. */}
        <m.span
          className="pointer-events-none absolute left-1/2 top-1/2 size-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_233_190/0.95),rgb(255_233_190/0)_62%)]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: flapOpen ? 1 : 0, scale: flapOpen ? 1 : 0.6 }}
          transition={{ duration: 0.8, ease: smooth }}
          aria-hidden="true"
        />
        <div className={`relative ${sealed ? "thangam-float" : ""}`}>
        <m.button
          type="button"
          onClick={open}
          disabled={!sealed}
          aria-label={copy.openLabel[lang]}
          className="relative block aspect-[1/0.92] w-[min(86vw,23rem,48svh)] cursor-pointer disabled:cursor-default"
          style={{ perspective: "1100px" }}
          animate={{ y: flapOpen ? "24%" : "0%" }}
          transition={{ duration: 0.7, ease: smooth }}
        >
          {/* The envelope's inside, seen once the flap has lifted. */}
          <span className="absolute inset-0 rounded-md bg-[linear-gradient(180deg,#a31a3f,#6f0d26)] shadow-[0_18px_30px_-16px_rgb(74_12_32/0.6)]" />

          {/* The card, between the lining and the pocket. */}
          <m.span
            className="thangam-card absolute inset-x-[5%] top-[5%] z-[2] flex h-[90%] flex-col items-center justify-start rounded-sm px-2 pt-[7%]"
            style={{ background: "#fffaf3" }}
            animate={{ y: cardOut ? "-62%" : "0%" }}
            transition={{ duration: 0.75, ease: smooth }}
          >
            <span className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--ink)]">{copy.cardEyebrow[lang]}</span>
            <span className={`thangam-names mt-1 ${lang === "ta" ? "whitespace-nowrap text-[clamp(1.05rem,5.4vw,1.75rem)]" : "whitespace-nowrap text-[clamp(1.9rem,9.6vw,2.75rem)]"}`}>{coupleNames(lang)}</span>
            <FloralDivider />
            <span className="mt-1 text-[0.8rem]">{formatDate(muhurtham.start, lang)}</span>
          </m.span>

          {/* The pocket: the envelope's front folds, which hide the card. */}
          <span className="absolute inset-0 z-[3]">
            <svg viewBox="0 0 100 92" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
              <path d="M0 26 50 58 100 26V92H0Z" fill="#fbf0dd" />
              <path d="M0 92 50 58 100 92" fill="none" stroke="var(--gold)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              <path d="M0 26V92H100V26" fill="none" stroke="var(--gold)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="thangam-paper absolute inset-0 [clip-path:polygon(0_28%,50%_63%,100%_28%,100%_100%,0_100%)]" />
            <Art src={artFiles.bottomRight} className="thangam-sway thangam-sway-br absolute bottom-0 right-0 h-auto w-[40%]" />
          </span>

          {/* The flap. */}
          <m.span
            className="absolute inset-x-0 top-0 block origin-top"
            style={{
              height: `${FLAP_TIP}%`,
              zIndex: flapBehind ? 1 : 4,
              transformStyle: "preserve-3d",
            }}
            animate={{ rotateX: flapOpen ? 178 : 0 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
          >
            {/* Outside of the flap, carrying the names. */}
            <span className="absolute inset-0 [backface-visibility:hidden]">
              <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
                <path d="M2 0H98Q100 0 100 2V32L52 61Q50 62 48 61L0 32V2Q0 0 2 0Z" fill="#fdf4e4" stroke="var(--gold)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="thangam-paper absolute inset-0 [clip-path:polygon(0_0,100%_0,100%_50%,50%_100%,0_50%)]" />
              <Art src={artFiles.bottomRight} className="absolute left-0 top-0 h-auto w-[25%] rotate-180" />
              <span className="absolute inset-x-0 top-[24%] flex flex-col items-center">
                <Lotus className="h-5 w-auto" color="var(--burgundy)" />
                <span className={`thangam-names mt-0.5 ${lang === "ta" ? "whitespace-nowrap text-[clamp(1.05rem,5.4vw,1.75rem)]" : "whitespace-nowrap text-[clamp(1.9rem,9.6vw,2.75rem)]"}`}>{coupleNames(lang)}</span>
                <Flourish className="h-3 w-32" />
              </span>
            </span>
            {/* Inside of the flap, seen when it stands open. */}
            <span className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
              <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
                <path d="M0 0H100V30L50 0Z" fill="none" />
                <path d="M0 62H100V30L52 1Q50 0 48 1L0 30Z" fill="#8d1231" stroke="var(--gold)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
          </m.span>

          {/* The ribbon crosses the envelope at the flap's point. */}
          <m.span
            className="absolute inset-x-0 z-[5] h-[11%] bg-[linear-gradient(180deg,#a51a43,#8d1231_55%,#74102b)] shadow-[0_3px_5px_-2px_rgb(74_12_32/0.5)]"
            style={{ top: `${FLAP_TIP - 5.5}%` }}
            animate={{ opacity: sealed ? 1 : 0, scaleX: sealed ? 1 : 0.82 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <m.span
            className="absolute left-1/2 z-[6] block aspect-square w-[27%] -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${FLAP_TIP}%` }}
            animate={{ opacity: sealed ? 1 : 0, scale: sealed ? 1 : 1.25 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className={`block size-full ${sealed ? "thangam-breathe" : ""}`}>
              <WaxSeal initials={couple.initials[lang]} lang={lang} className="size-full drop-shadow-[0_4px_5px_rgb(74_12_32/0.5)]" />
            </span>
          </m.span>
        </m.button>
        {stage !== "closed" && <PetalBurst className="left-1/2 top-[62%] z-10" />}
        </div>

        <m.div
          className="relative mt-5 flex flex-col items-center"
          animate={{ opacity: sealed ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="thangam-heading max-w-64 text-balance text-[1.25rem] italic leading-snug text-[var(--burgundy)]">{copy.special[lang]}</p>
          <span className="relative mt-3 flex size-11 items-center justify-center text-[var(--burgundy)]" aria-hidden="true">
            <span className="thangam-tap-ring absolute inset-0 rounded-full border border-[var(--burgundy)]" />
            <Hand className="size-6" />
          </span>
          <p className="mt-1 font-medium text-[var(--ink)]">{copy.tap[lang]}</p>
        </m.div>
      </m.div>
    </div>
  );
}
