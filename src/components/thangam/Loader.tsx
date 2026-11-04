"use client";

import { useEffect, useId, useState } from "react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { coupleNames } from "@/lib/format";
import { Art, artFiles, FallingPetals, namesSize } from "./art";

const MIN_DURATION = 1600;
const MAX_WAIT = 3500;
const SHAPE = "M50 4C70 22 88 44 80 74 75 92 60 100 50 100S25 92 20 74C12 44 30 22 50 4Z";
const RING = 10;

export function Loader({ onDone }: { onDone: () => void }) {
  const { lang } = usePreferences();
  const [progress, setProgress] = useState(0.08);
  const clip = useId().replace(/:/g, "");

  useEffect(() => {
    let finished = false;
    let loaded = 0;
    const started = performance.now();
    const files = [artFiles.topLeft, artFiles.topRight, artFiles.bottomLeft, artFiles.bottomRight, artFiles.linen];
    const total = files.length + 1;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(1);
      const wait = Math.max(0, MIN_DURATION - (performance.now() - started));
      window.setTimeout(onDone, wait + 250);
    };
    const step = () => {
      loaded += 1;
      setProgress(Math.max(0.08, loaded / total));
      if (loaded >= total) finish();
    };

    files.forEach((src) => {
      const image = new Image();
      image.onload = step;
      image.onerror = step;
      image.src = src;
    });
    void document.fonts.ready.then(step, step);

    const giveUp = window.setTimeout(finish, MAX_WAIT);
    return () => {
      finished = true;
      window.clearTimeout(giveUp);
    };
  }, [onDone]);

  const percent = Math.round(progress * 100);

  return (
    <div className="thangam-blush relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-8 py-16 text-center">
      <Art src={artFiles.topLeft} className="thangam-sway thangam-sway-tl absolute left-0 top-0 h-auto w-[44%] max-w-64" />
      <Art src={artFiles.topRight} className="thangam-sway thangam-sway-tr absolute right-0 top-0 h-auto w-[44%] max-w-64" />
      <Art src={artFiles.bottomLeft} className="thangam-sway thangam-sway-bl absolute bottom-0 left-0 h-auto w-[42%] max-w-60" />
      <Art src={artFiles.bottomRight} className="thangam-sway thangam-sway-br absolute bottom-0 right-0 h-auto w-[42%] max-w-60" />
      <FallingPetals count={4} />
      <Art src={artFiles.palace} className="absolute bottom-[14%] left-1/2 h-auto w-[86%] max-w-md -translate-x-1/2" />

      <div className="relative flex flex-col items-center">
        <h1 className={`thangam-enter thangam-names ${namesSize(lang, "text-[clamp(2.75rem,14vw,3.75rem)]")}`}>{coupleNames(lang)}</h1>

        {/* Progress: a rose petal slowly filling with colour from its base. */}
        <div
          className="thangam-enter relative mt-5 size-40 [--d:120ms]"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={wedding.thangam.loader.opening[lang]}
        >
          {/* A ring of smaller petals opens around it, one for each step of progress. */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" aria-hidden="true">
            {Array.from({ length: RING }, (_, index) => {
              const open = progress >= (index + 1) / RING;
              return (
                <g key={index} transform={`rotate(${(index * 360) / RING} 100 100)`}>
                  <path
                    d="M100 8C112 22 116 36 100 54 84 36 88 22 100 8Z"
                    fill={index % 2 ? "var(--burgundy)" : "var(--rose)"}
                    stroke="var(--gold)"
                    strokeWidth="0.8"
                    className="transition-[opacity,transform] duration-500 ease-out [transform-box:fill-box] [transform-origin:50%_100%]"
                    style={{ opacity: open ? 0.9 : 0.12, transform: `scale(${open ? 1 : 0.6})` }}
                  />
                </g>
              );
            })}
          </svg>
          <svg viewBox="0 0 100 104" className="absolute inset-[25%] size-1/2" aria-hidden="true">
            <clipPath id={clip}>
              <path d={SHAPE} />
            </clipPath>
            <path d={SHAPE} fill="rgb(255 250 243 / 0.9)" />
            <g clipPath={`url(#${clip})`}>
              <rect
                x="0"
                y="0"
                width="100"
                height="104"
                fill="var(--rose)"
                className="origin-bottom transition-transform duration-500 ease-out [transform-box:fill-box]"
                style={{ transform: `scaleY(${progress})` }}
              />
              <rect
                x="0"
                y="0"
                width="100"
                height="104"
                fill="var(--burgundy)"
                opacity="0.45"
                className="origin-bottom transition-transform duration-700 ease-out [transform-box:fill-box]"
                style={{ transform: `scaleY(${progress * 0.55})` }}
              />
            </g>
            <path d={SHAPE} fill="none" stroke="var(--gold)" strokeWidth="2" />
            <path d="M50 18V92" stroke="var(--ivory)" strokeOpacity="0.5" strokeWidth="1.2" />
          </svg>
        </div>

        <p className="thangam-enter mt-3 font-medium text-[var(--burgundy)] [--d:200ms]">{percent}%</p>
        <p className="thangam-enter mt-1 italic text-[var(--ink)] [--d:280ms]" role="status">
          {wedding.thangam.loader.opening[lang]}
        </p>
      </div>
    </div>
  );
}
