"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { now } from "@/lib/clock";
import { formatDate, formatTime } from "@/lib/format";
import { Art, artFiles, GrowCorner, Heading, Lotus, ParallaxLayer, reveal, Rosette, smooth } from "./art";

const target = new Date(wedding.muhurtham.start).getTime();

const istDate = (time: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: wedding.timeZone }).format(new Date(time));

function remaining(current: number) {
  const left = Math.max(0, target - current);
  return {
    days: Math.floor(left / 86_400_000),
    hours: Math.floor(left / 3_600_000) % 24,
    minutes: Math.floor(left / 60_000) % 60,
    seconds: Math.floor(left / 1000) % 60,
  };
}

/** Each new number rises into place while the old one lifts away. */
function RollingNumber({ value }: { value: number }) {
  return (
    <span className="relative block h-[1.15em] overflow-hidden">
      <AnimatePresence initial={false} mode="popLayout">
        <m.span
          key={value}
          className="block tabular-nums lining-nums"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: smooth }}
        >
          {value}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown() {
  const { lang } = usePreferences();
  const { ui, thangam, muhurtham } = wedding;
  const copy = thangam.countdown;
  const [current, setCurrent] = useState(() => now());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrent(now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = remaining(current);
  const started = current >= target;
  const finalDay = !started && istDate(current) === istDate(target);
  const boxes = [
    { value: time.days, label: ui.days[lang] },
    { value: time.hours, label: ui.hours[lang] },
    { value: time.minutes, label: ui.minutes[lang] },
    { value: time.seconds, label: ui.seconds[lang] },
  ];

  return (
    <section className="thangam-lazy relative overflow-hidden px-4 py-14 [--lazy-size:520px]">
      <ParallaxLayer distance={28} className="absolute inset-0">
        <Art src={artFiles.palace} className="absolute bottom-0 left-1/2 h-auto w-[120%] max-w-2xl -translate-x-1/2 opacity-50" />
      </ParallaxLayer>
      <GrowCorner corner="bl" className="w-[19%] max-w-44" />
      <GrowCorner corner="br" className="w-[19%] max-w-44" delay={0.1} />
      <Rosette className="left-1/2 top-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 opacity-25" />
      <div className="relative">
        <Heading>{copy.title[lang]}</Heading>

        {!started && (
          <m.div
            {...reveal("zoom")}
            role="timer"
            className="thangam-card mx-auto mt-6 grid max-w-lg grid-cols-4 divide-x divide-[var(--champagne)] rounded-[2rem] px-1 py-4"
          >
            {boxes.map((box, index) => (
              <div key={box.label} className="flex flex-col items-center px-0.5 text-center">
                <span className="thangam-heading text-[clamp(1.6rem,7.5vw,2.25rem)] font-semibold leading-none text-[var(--burgundy)]">
                  <RollingNumber value={box.value} />
                </span>
                <span className="mt-1 text-[0.8rem] leading-none">{box.label}</span>
                {/* The last box's lotus gives a small pulse with every second. */}
                <m.span
                  className="mt-1.5 inline-flex"
                  animate={{ scale: index === 3 && box.value % 2 === 0 ? 1.35 : 1 }}
                  transition={{ duration: 0.5, ease: smooth }}
                >
                  <Lotus className="h-3 w-auto" />
                </m.span>
              </div>
            ))}
          </m.div>
        )}

        {(finalDay || started) && (
          <m.p
            {...reveal()}
            className="thangam-heading mx-auto mt-5 max-w-md text-balance text-center text-[1.3rem] italic leading-snug text-[var(--burgundy)]"
          >
            {started ? copy.married[lang] : copy.finalDay[lang]}
          </m.p>
        )}

        <m.p {...reveal("up", 0.15)} className="mt-4 text-center">
          <span className="font-semibold">{formatDate(muhurtham.start, lang)}</span>
          <br />
          {copy.untilMuhurtham[lang]}: {formatTime(muhurtham.start, lang)}
        </m.p>
      </div>
    </section>
  );
}
