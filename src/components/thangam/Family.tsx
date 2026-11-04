"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { Ganesha } from "@/components/shared/Ganesha";
import { telUrl } from "@/lib/format";
import { FloralDivider, GrowCorner, Heading, reveal, secondaryButton, smooth } from "./art";

type Side = "bride" | "groom";

export function Family() {
  const { lang } = usePreferences();
  const { families, thangam, ui } = wedding;
  const copy = thangam.family;
  const [side, setSide] = useState<Side>("bride");
  const family = families[side];
  const tabs: { key: Side; label: string }[] = [
    { key: "bride", label: copy.brideSide[lang] },
    { key: "groom", label: copy.groomSide[lang] },
  ];

  return (
    <section id="family" className="thangam-lazy thangam-blush relative overflow-hidden px-4 py-14 [--lazy-size:950px]">
      <GrowCorner corner="bl" className="w-[28%] max-w-52" />
      <GrowCorner corner="br" className="w-[28%] max-w-52" delay={0.1} />
      <div className="relative">
        <Heading>{copy.title[lang]}</Heading>
      </div>

      <m.div {...reveal("up", 0.1)} className="relative mx-auto mt-6 max-w-md">
        <div role="tablist" aria-label={copy.title[lang]} className="relative grid grid-cols-2 rounded-full border border-[var(--gold)] bg-[rgb(255_250_243/0.8)] p-1">
          <m.span
            className="thangam-button absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-full"
            animate={{ x: side === "bride" ? "0%" : "100%" }}
            transition={{ duration: 0.45, ease: smooth }}
            aria-hidden="true"
          />
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`family-tab-${tab.key}`}
              aria-selected={side === tab.key}
              aria-controls="family-panel"
              onClick={() => setSide(tab.key)}
              className={`relative min-h-11 rounded-full px-2 font-medium transition-colors duration-300 ${
                side === tab.key ? "text-[var(--ivory)]" : "text-[var(--burgundy)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="thangam-card mt-4 rounded-3xl px-5 py-6 text-center">
          <m.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: smooth, delay: 0.2 }}
          >
            <Ganesha className="mx-auto h-14 w-auto text-[var(--burgundy)]" />
          </m.div>
          <div style={{ perspective: "900px" }}>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={side}
              id="family-panel"
              role="tabpanel"
              aria-labelledby={`family-tab-${side}`}
              initial={{ opacity: 0, rotateY: side === "bride" ? -55 : 55 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: side === "bride" ? 55 : -55 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h3 className="thangam-heading mt-2 text-[1.35rem] font-semibold italic text-[var(--burgundy)]">{family.title[lang]}</h3>
              <p className="mt-3 text-[0.88rem] uppercase tracking-[0.14em] text-[var(--gold-deep)]">{copy.parents[lang]}</p>
              {family.parents.map((person) => (
                <p key={person.en} className="text-[1.1rem] font-medium">
                  {person[lang]}
                </p>
              ))}

              <div className="my-3">
                <FloralDivider />
              </div>

              <p className="thangam-heading italic text-[var(--burgundy)]">{copy.blessings[lang]}</p>
              {family.elders.map((person) => (
                <p key={person.en}>{person[lang]}</p>
              ))}

              <div className="mt-5 border-t border-[var(--champagne)] pt-4">
                <p className="text-[0.88rem] uppercase tracking-[0.14em] text-[var(--gold-deep)]">{copy.contact[lang]}</p>
                <p className="mb-3">{family.contact.name[lang]}</p>
                <a href={telUrl(family.contact.phone)} className={secondaryButton}>
                  <Phone className="size-5" aria-hidden="true" />
                  {ui.call[lang]}
                </a>
              </div>
            </m.div>
          </AnimatePresence>
          </div>
        </div>
      </m.div>
    </section>
  );
}
