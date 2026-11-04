"use client";

import { useState, type ReactNode } from "react";
import { CalendarPlus, ChevronDown, MapPin } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { wedding, type FunctionKey } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { googleCalendarUrl } from "@/lib/calendar";
import { formatDate, formatTimeRange, mapsUrl } from "@/lib/format";
import { Bloom, GrowCorner, Heading, reveal, secondaryButton, smooth } from "./art";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

// Each function has its own emblem and colour, taken from the card design.
const themes: Record<FunctionKey, { card: string; text: string; icon: ReactNode }> = {
  mehendi: {
    card: "bg-[#e9efd6]",
    text: "text-[#3f5417]",
    icon: (
      <Icon>
        <path d="M16 29V10" />
        <path d="M16 13c-3-1-6-1-8-4 3-2 7-1 8 4zM16 13c3-1 6-1 8-4-3-2-7-1-8 4zM16 20c-3-1-7-1-9-4 3-2 8-1 9 4zM16 20c3-1 7-1 9-4-3-2-8-1-9 4zM16 10c-2-2-2-5 0-8 2 3 2 6 0 8z" />
      </Icon>
    ),
  },
  haldi: {
    card: "bg-[#fbe8ad]",
    text: "text-[#6f4c06]",
    icon: (
      <Icon>
        <path d="M4 15h24c0 7-5 12-12 12S4 22 4 15z" />
        <path d="M9 15c1-4 4-6 7-6s6 2 7 6" />
        <path d="M11 27h10M16 5v2M11 6l1 2M21 6l-1 2" />
      </Icon>
    ),
  },
  nalangu: {
    card: "bg-[#fbdccb]",
    text: "text-[#7a2a14]",
    icon: (
      <Icon>
        <path d="M11 11h10l-1 3c4 2 6 5 6 8 0 4-4 7-10 7S6 26 6 22c0-3 2-6 6-8z" />
        <path d="M16 11V8M16 8c-2-1-4-1-5-3 2-1 4 0 5 3zM16 8c2-1 4-1 5-3-2-1-4 0-5 3z" />
        <path d="M7 21h18" />
      </Icon>
    ),
  },
  muhurtham: {
    card: "bg-[linear-gradient(160deg,#a3173d,#6f0d26)] border-[var(--gold)]",
    text: "text-[var(--ivory)]",
    icon: (
      <Icon>
        <circle cx="12" cy="20" r="8" />
        <circle cx="20" cy="20" r="8" />
        <path d="M18 6h4l2 3-4 3-4-3z" />
      </Icon>
    ),
  },
  reception: {
    card: "bg-[#dee6f3]",
    text: "text-[#23365f]",
    icon: (
      <Icon>
        <path d="M6 5h8l-1 8c0 2-1 4-3 4s-3-2-3-4zM10 17v9M7 27h6" />
        <path d="M18 5h8l-1 8c0 2-1 4-3 4s-3-2-3-4zM22 17v9M19 27h6" />
      </Icon>
    ),
  },
};

export function Schedule() {
  const { lang } = usePreferences();
  const { functions, thangam, ui } = wedding;
  const [open, setOpen] = useState<FunctionKey | null>(null);

  return (
    <section id="events" className="thangam-lazy thangam-blush relative overflow-hidden px-4 py-14 [--lazy-size:760px]">
      <GrowCorner corner="bl" className="w-[28%] max-w-48" />
      <GrowCorner corner="br" className="w-[28%] max-w-48" delay={0.1} />
      <div className="relative">
        <Heading>{thangam.events.title[lang]}</Heading>
        <m.p {...reveal("up", 0.1)} className="mt-2 text-center text-[0.92rem]">
          {thangam.events.hint[lang]}
        </m.p>
      </div>

      <ul className="relative mx-auto mt-6 grid max-w-3xl items-start gap-3 md:grid-cols-2">
        {functions.map((fn, index) => {
          const theme = themes[fn.key];
          const isOpen = open === fn.key;
          return (
            <m.li
              {...reveal(index % 2 ? "right" : "left", index * 0.08)}
              key={fn.key}
              className={`overflow-hidden rounded-2xl border border-[var(--champagne)] shadow-[inset_0_0_0_3px_rgb(255_255_255/0.35),0_10px_20px_-16px_rgb(74_12_32/0.6)] ${theme.card} ${theme.text}`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : fn.key)}
                aria-expanded={isOpen}
                aria-controls={`event-${fn.key}`}
                className="flex min-h-20 w-full items-center gap-4 px-4 py-3 text-left"
              >
                {/* The emblem sits in a rose that opens behind it, and gives a little turn when tapped. */}
                <m.span
                  className="relative flex size-12 shrink-0 items-center justify-center"
                  initial={{ scale: 0.4, rotate: -30, opacity: 0 }}
                  whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: smooth, delay: 0.15 + index * 0.08 }}
                >
                  <Bloom
                    className="absolute inset-0 size-full opacity-25"
                    outer={fn.key === "muhurtham" ? "var(--champagne)" : "currentColor"}
                    inner={fn.key === "muhurtham" ? "var(--ivory)" : "currentColor"}
                  />
                  <m.span
                    className="relative inline-flex"
                    animate={{ rotate: isOpen ? [0, -14, 10, 0] : 0, scale: isOpen ? [1, 1.18, 1] : 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {theme.icon}
                  </m.span>
                </m.span>
                <span className="min-w-0 flex-1">
                  <span className="thangam-heading block text-[1.3rem] font-semibold leading-tight">{fn.name[lang]}</span>
                  <span className="block text-[0.95rem] leading-snug">{formatDate(fn.start, lang)}</span>
                </span>
                <m.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.35, ease: smooth }} className="shrink-0">
                  <ChevronDown className="size-5" aria-hidden="true" />
                </m.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    id={`event-${fn.key}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: smooth }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p className="font-medium">{formatTimeRange(fn.start, fn.end, lang)}</p>
                      <p>{fn.venue[lang]}</p>
                      <div className="mt-3 flex flex-col gap-2 text-[var(--burgundy)] sm:flex-row sm:flex-wrap">
                        <a href={mapsUrl(fn.mapQuery)} target="_blank" rel="noreferrer" className={secondaryButton}>
                          <MapPin className="size-5" aria-hidden="true" />
                          {ui.map[lang]}
                        </a>
                        <a href={googleCalendarUrl(lang, fn.key)} target="_blank" rel="noreferrer" className={secondaryButton}>
                          <CalendarPlus className="size-5" aria-hidden="true" />
                          {ui.googleCalendar[lang]}
                        </a>
                        <a href={`/calendar?lang=${lang}&event=${fn.key}`} className={secondaryButton}>
                          <CalendarPlus className="size-5" aria-hidden="true" />
                          {ui.phoneCalendar[lang]}
                        </a>
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.li>
          );
        })}
      </ul>
    </section>
  );
}
