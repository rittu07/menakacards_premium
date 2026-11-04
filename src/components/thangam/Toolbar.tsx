"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AArrowUp, Check, ListMusic, Pause, Speech, Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, m, useScroll } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { readAloudScript } from "./script";
import { smooth, WaxSeal } from "./art";

const iconButton =
  "thangam-press flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--burgundy)] hover:bg-[var(--peach)] aria-pressed:bg-[var(--burgundy)] aria-pressed:text-[var(--ivory)]";

const sections = ["home", "events", "story", "family", "gallery", "venue", "rsvp"] as const;

/**
 * Sections off screen only have an estimated height until they are first drawn,
 * so the page can shift under a jump. This settles on the section once it has.
 */
function goToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "auto" });
  [150, 400, 800].forEach((delay) => window.setTimeout(() => target.scrollIntoView({ behavior: "auto" }), delay));
}

export function Toolbar() {
  const { lang, toggleLang, elder, toggleElder, speak, speaking, musicOn, toggleMusic, currentTrack, playTrack } =
    usePreferences();
  const { ui, couple, thangam } = wedding;
  const [listOpen, setListOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (!listOpen) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !box.current?.contains(event.target as Node)) {
        setListOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [listOpen]);

  return (
    <m.header
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: smooth }}
      className="thangam-paper sticky top-0 z-40 border-b border-[var(--champagne)] bg-[var(--ivory)] shadow-[0_6px_16px_-12px_rgb(101_15_36/0.5)]"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-1 px-2 sm:px-4">
        <a href="#home" onClick={(event) => goToSection(event, "home")} aria-label={thangam.nav.home[lang]} className="block size-11 shrink-0">
          <WaxSeal initials={couple.initials[lang]} lang={lang} className="size-full" />
        </a>
        <nav className="hidden items-center gap-5 lg:flex" aria-label={thangam.nav.home[lang]}>
          {sections.map((id) => (
            <a key={id} href={`#${id}`} onClick={(event) => goToSection(event, id)} className="py-2 text-[var(--ink)] hover:text-[var(--burgundy)]">
              {thangam.nav[id][lang]}
            </a>
          ))}
        </nav>
        <div className="relative flex items-center" ref={box}>
          <button
            type="button"
            onClick={toggleLang}
            aria-label={ui.switchLanguageLabel[lang]}
            className="thangam-press flex h-11 shrink-0 items-center rounded-full px-2 text-base font-medium text-[var(--burgundy)] hover:bg-[var(--peach)]"
          >
            {ui.switchLanguage[lang]}
          </button>
          <button
            type="button"
            onClick={toggleElder}
            aria-pressed={elder}
            aria-label={elder ? ui.elderOff[lang] : ui.elderOn[lang]}
            title={elder ? ui.elderOff[lang] : ui.elderOn[lang]}
            className={iconButton}
          >
            <AArrowUp className="size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => speak(readAloudScript(lang))}
            aria-pressed={speaking}
            aria-label={speaking ? ui.stopReading[lang] : ui.readAloud[lang]}
            title={speaking ? ui.stopReading[lang] : ui.readAloud[lang]}
            className={iconButton}
          >
            {speaking ? <Pause className="size-5" aria-hidden="true" /> : <Speech className="size-5" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={musicOn ? ui.musicOff[lang] : ui.musicOn[lang]}
            title={musicOn ? ui.musicOff[lang] : ui.musicOn[lang]}
            className={iconButton}
          >
            {musicOn ? <Volume2 className="size-5" aria-hidden="true" /> : <VolumeX className="size-5" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            aria-expanded={listOpen}
            aria-label={thangam.music.title[lang]}
            title={thangam.music.title[lang]}
            className={iconButton}
          >
            <ListMusic className="size-5" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {listOpen && (
              <m.div
                className="thangam-card absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1rem)] rounded-xl p-2"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: smooth }}
              >
                <p className="px-3 py-1 text-[0.9rem] font-medium text-[var(--burgundy)]">{thangam.music.title[lang]}</p>
                {thangam.music.tracks.map((track) => {
                  const active = track.src === currentTrack;
                  return (
                    <button
                      key={track.src}
                      type="button"
                      onClick={() => {
                        playTrack(track.src);
                        setListOpen(false);
                      }}
                      className="thangam-press flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left hover:bg-[var(--peach)]"
                    >
                      {track.name[lang]}
                      {active && <Check className="size-4 shrink-0 text-[var(--burgundy)]" aria-hidden="true" />}
                    </button>
                  );
                })}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* A fine gold thread shows how far through the invitation the guest has read. */}
      <m.div
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[linear-gradient(90deg,var(--rose),var(--gold))]"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
    </m.header>
  );
}
