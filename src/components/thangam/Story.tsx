"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useScroll, useTransform } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { Bloom, GrowCorner, Heading, reveal, smooth } from "./art";

export function Story() {
  const { lang } = usePreferences();
  const { story, thangam } = wedding;
  const track = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 75%", "end 60%"] });
  const threadHead = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="story" className="thangam-lazy relative overflow-hidden px-4 py-14 [--lazy-size:2000px]">
      <GrowCorner corner="tl" className="w-[24%] max-w-44 opacity-90" />
      <GrowCorner corner="tr" className="w-[24%] max-w-44 opacity-90" delay={0.1} />
      <Heading>{thangam.story.title[lang]}</Heading>

      <ol ref={track} className="relative mx-auto mt-8 max-w-3xl">
        {/* The gold thread fills as the guest reads down the story. */}
        <span className="absolute bottom-3 left-[1.15rem] top-3 w-px bg-[var(--champagne)] md:left-1/2" aria-hidden="true" />
        <m.span
          className="absolute bottom-3 left-[1.15rem] top-3 w-0.5 origin-top bg-[var(--gold)] md:left-1/2"
          style={{ scaleY: scrollYProgress }}
          aria-hidden="true"
        />
        {/* A small rose travels on the end of the thread. */}
        <span className="pointer-events-none absolute bottom-3 left-[1.15rem] top-3 w-0 md:left-1/2" aria-hidden="true">
          <m.span className="absolute left-0 z-[1] size-6 -translate-x-1/2 -translate-y-1/2" style={{ top: threadHead }}>
            <Bloom className="size-full" />
          </m.span>
        </span>

        {story.map((moment, index) => {
          const onRight = index % 2 === 1;
          return (
            <li key={moment.photo} className="relative pb-9 pl-11 last:pb-0 md:grid md:grid-cols-2 md:gap-10 md:pl-0">
              <span
                className="absolute left-[0.2rem] top-0 flex size-8 items-center justify-center rounded-full bg-[var(--ivory)] md:left-1/2 md:-translate-x-1/2"
                aria-hidden="true"
              >
                <Bloom className="size-7" />
              </span>
              <m.div {...reveal(onRight ? "right" : "left")} className={onRight ? "md:col-start-2" : ""}>
                <div className="thangam-card overflow-hidden rounded-2xl">
                  {/* The photo opens downward like a curtain, settling as it does. */}
                  <m.div
                    className="relative aspect-[16/10] overflow-hidden"
                    initial={{ clipPath: "inset(0 0 94% 0)" }}
                    whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: smooth, delay: 0.15 }}
                  >
                    <m.div
                      className="absolute inset-0"
                      initial={{ scale: 1.18 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: smooth, delay: 0.15 }}
                    >
                      <Image src={moment.photo} alt={moment.title[lang]} fill sizes="(min-width: 768px) 360px, 85vw" className="object-cover" />
                    </m.div>
                  </m.div>
                  <div className="px-4 py-3">
                    <p className="text-[0.9rem] font-medium text-[var(--rose)]">{moment.date[lang]}</p>
                    <h3 className="thangam-heading text-[1.3rem] font-semibold leading-tight text-[var(--burgundy)]">{moment.title[lang]}</h3>
                    <p className="mt-1 leading-snug">{moment.caption[lang]}</p>
                  </div>
                </div>
              </m.div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
