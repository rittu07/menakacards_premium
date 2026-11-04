"use client";

import Image from "next/image";
import { useId, useRef, type ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Lang } from "@/data/wedding";

export const artFiles = {
  topLeft: "/thangam/corner-top-left.webp",
  topRight: "/thangam/corner-top-right.webp",
  bottomLeft: "/thangam/corner-bottom-left.webp",
  bottomRight: "/thangam/corner-bottom-right.webp",
  palace: "/thangam/palace.webp",
  linen: "/thangam/linen.webp",
};

/* eslint-disable @next/next/no-img-element -- transparent art sized by CSS; these files are already compressed */
export function Art({ src, className }: { src: string; className?: string }) {
  return <img src={src} alt="" aria-hidden="true" draggable={false} decoding="async" className={className} />;
}

/** Thangam's motion: smooth and unhurried, mostly 300 to 800ms. */
export const smooth = [0.22, 1, 0.36, 1] as const;

const offsets = {
  up: { y: 30 },
  left: { x: -34 },
  right: { x: 34 },
  zoom: { scale: 0.88 },
};

export function reveal(from: keyof typeof offsets = "up", delay = 0) {
  return {
    initial: { opacity: 0, ...offsets[from] },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, ease: smooth, delay },
  };
}

/**
 * The couple's names are unveiled from left to right, in one soft pass. A sliver
 * stays uncovered at the start: a browser never reports a fully clipped element
 * as on screen, and the reveal would never begin.
 */
export function unveil(delay = 0.15) {
  return {
    initial: { clipPath: "inset(-30% 96% -30% -6%)", opacity: 0.2 },
    whileInView: { clipPath: "inset(-30% -6% -30% -6%)", opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeInOut" as const, delay },
  };
}

export const entrance = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};

export const entranceItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: smooth } },
};

/**
 * Two layers on scroll: this one drifts behind the content, which moves normally.
 * The ref goes on the section so the drift follows that section's own progress.
 */
export function ParallaxLayer({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-distance, distance]);
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <m.div style={{ y }} className={className}>
        {children}
      </m.div>
    </div>
  );
}

export function namesSize(lang: Lang, english: string) {
  return lang === "ta" ? "whitespace-nowrap text-[clamp(1.4rem,7.2vw,2.5rem)]" : `whitespace-nowrap ${english}`;
}

/** The calligraphy's flourish: it draws itself under the couple's names. */
export function Flourish({ className = "h-5 w-52", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 300 30" className={className} fill="none" aria-hidden="true">
      <m.path
        d="M6 20C40 4 70 4 96 14c14 5 26 8 40 2 9-4 10-13 2-13-7 0-9 9-1 13 8 4 22 2 34-3 26-10 56-13 90-2 10 3 20 4 33-1"
        stroke={light ? "var(--champagne)" : "var(--gold)"}
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

function Sprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 70 18"
      className={`h-3.5 w-16 ${flip ? "-scale-x-100" : ""}`}
      fill="var(--gold)"
      aria-hidden="true"
    >
      <path d="M0 9h60" stroke="var(--gold)" strokeWidth="1" fill="none" />
      <path d="M58 9c-5-5-10-5-14-3 3 4 9 5 14 3zM58 9c-5 5-10 5-14 3 3-4 9-5 14-3zM44 9c-5-5-9-5-13-3 3 4 8 5 13 3zM44 9c-5 5-9 5-13 3 3-4 8-5 13-3zM30 9c-4-4-8-4-11-2 3 3 7 4 11 2zM30 9c-4 4-8 4-11 2 3-3 7-4 11-2z" />
      <circle cx="65" cy="9" r="2.4" />
    </svg>
  );
}

/** A rose that opens between two gold sprigs growing outward: Thangam's divider. */
export function FloralDivider() {
  const sprig = (flip: boolean) => (
    <m.span
      className={`inline-flex ${flip ? "origin-left" : "origin-right"}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: smooth, delay: 0.25 }}
    >
      <Sprig flip={flip} />
    </m.span>
  );
  return (
    <div className="flex items-center justify-center gap-1.5" aria-hidden="true">
      {sprig(false)}
      <Bloom className="size-6" />
      {sprig(true)}
    </div>
  );
}

const lotusPaths = [
  "M32 3c7 8 7 19 0 30-7-11-7-22 0-30z",
  "M32 33c-2-11-8-19-17-22 0 11 6 19 17 22z",
  "M32 33c2-11 8-19 17-22 0 11-6 19-17 22z",
  "M32 33C25 24 15 20 4 21c5 8 15 13 28 12z",
  "M32 33c7-9 17-13 28-12-5 8-15 13-28 12z",
  "M10 37c8-2 14-2 22-2s14 0 22 2",
];

/** The lotus redrawn from the card's foot. Its petals draw themselves, one by one. */
export function Lotus({ className = "h-7 w-auto", color = "var(--gold)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      {lotusPaths.map((d, index) => (
        <m.path
          key={d}
          d={d}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeInOut", delay: index * 0.09 }}
        />
      ))}
    </svg>
  );
}

const petalGrow = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: smooth } },
};
const growFromCentre = { originX: "50%", originY: "100%" };

/** A rose in a 24 unit box. Its petals open under whichever parent sets the timing. */
function RosePetals({ outer = "var(--rose)", inner = "var(--burgundy)" }: { outer?: string; inner?: string }) {
  return (
    <>
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 12 12)`}>
          <m.ellipse variants={petalGrow} style={growFromCentre} cx="12" cy="6.2" rx="4.6" ry="5.8" fill={outer} opacity="0.75" />
        </g>
      ))}
      {[36, 108, 180, 252, 324].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 12 12)`}>
          <m.ellipse variants={petalGrow} style={growFromCentre} cx="12" cy="8.2" rx="2.9" ry="3.8" fill={inner} />
        </g>
      ))}
      <m.circle variants={petalGrow} cx="12" cy="12" r="2.1" fill="var(--gold)" />
    </>
  );
}

const bloomTiming = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

/** A rose that opens, petal by petal, when it scrolls into view. */
export function Bloom({ className = "size-6", outer, inner }: { className?: string; outer?: string; inner?: string }) {
  return (
    <m.svg
      viewBox="0 0 24 24"
      className={className}
      variants={bloomTiming}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      aria-hidden="true"
    >
      <RosePetals outer={outer} inner={inner} />
    </m.svg>
  );
}

const vineLeaves = [
  [46, 17, -28], [74, 21, 150], [98, 31, 20], [132, 34, 190],
  [168, 24, -24], [236, 18, 165], [268, 19, -14], [292, 25, 170],
  [326, 33, 16], [364, 31, 205],
];

/** A garland that grows across the page between sections, then flowers along its length. */
export function Vine({ light = false }: { light?: boolean }) {
  const stem = light ? "var(--champagne)" : "var(--gold)";
  return (
    <div className="thangam-lazy thangam-lazy-vine pointer-events-none relative z-10 mx-auto -my-7 w-full max-w-xl px-3" aria-hidden="true">
      <m.svg
        viewBox="0 0 400 56"
        className="block h-auto w-full overflow-visible"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        <m.path
          d="M6 34C60 8 100 50 160 30S240 12 300 30 368 44 394 24"
          fill="none"
          stroke={stem}
          strokeWidth="1.6"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            show: { pathLength: 1, opacity: 1, transition: { duration: 0.9, ease: "easeInOut" } },
          }}
        />
        {vineLeaves.map(([x, y, angle]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <m.path
              d="M0 0c5-7 12-7 18-3-4 6-12 8-18 3z"
              fill={light ? "var(--champagne)" : "#7f9a4c"}
              style={{ originX: "0%", originY: "50%" }}
              variants={petalGrow}
            />
          </g>
        ))}
        {[
          [90, 16, 1],
          [186, 8, 1.55],
          [300, 12, 1.05],
        ].map(([x, y, size]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${size})`}>
            <RosePetals />
          </g>
        ))}
      </m.svg>
    </div>
  );
}

/** A slow-turning line rosette, set behind a section's main content. */
export function Rosette({ className = "", color = "var(--gold)" }: { className?: string; color?: string }) {
  const ring = (count: number, cy: number, rx: number, ry: number, key: string) =>
    Array.from({ length: count }, (_, index) => (
      <ellipse key={`${key}-${index}`} cx="100" cy={cy} rx={rx} ry={ry} transform={`rotate(${(index * 360) / count} 100 100)`} />
    ));
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="thangam-spin size-full" fill="none" stroke={color} strokeWidth="0.7">
        {ring(16, 30, 11, 26, "a")}
        {ring(12, 58, 9, 20, "b")}
        {ring(8, 80, 6, 14, "c")}
        <circle cx="100" cy="100" r="97" />
        <circle cx="100" cy="100" r="62" />
      </svg>
    </div>
  );
}

const corners = {
  tl: { place: "left-0 top-0", origin: "0% 0%", turn: -9 },
  tr: { place: "right-0 top-0", origin: "100% 0%", turn: 9 },
  bl: { place: "bottom-0 left-0", origin: "0% 100%", turn: 9 },
  br: { place: "bottom-0 right-0", origin: "100% 100%", turn: -9 },
};
const cornerArt = { tl: "topLeft", tr: "topRight", bl: "bottomLeft", br: "bottomRight" } as const;

/** Florals that grow out of a corner as they come into view, then stir in a light breeze. */
export function GrowCorner({
  corner,
  className = "",
  place,
  delay = 0,
}: {
  corner: keyof typeof corners;
  className?: string;
  place?: string;
  delay?: number;
}) {
  const shape = corners[corner];
  return (
    <m.div
      className={`pointer-events-none absolute ${place ?? shape.place} ${className}`}
      style={{ transformOrigin: shape.origin }}
      initial={{ opacity: 0, scale: 0.55, rotate: shape.turn }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.7, ease: smooth, delay }}
    >
      <Art src={artFiles[cornerArt[corner]]} className={`thangam-sway thangam-sway-${corner} h-auto w-full`} />
    </m.div>
  );
}

const burstColors = ["var(--rose)", "#f39aa8", "var(--burgundy)", "var(--peach)"];
const burstPetals = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2 + (index % 3) * 0.17;
  const reach = 26 + ((index * 7) % 5) * 7;
  return {
    x: Math.round(Math.cos(angle) * reach),
    y: Math.round(Math.sin(angle) * reach * 0.8 - 8),
    spin: 140 + ((index * 53) % 300),
    size: 0.7 + (index % 4) * 0.2,
    color: burstColors[index % burstColors.length],
    delay: (index % 5) * 0.035,
  };
});

/** One shower of petals thrown outward: the envelope opening, a reply received. */
export function PetalBurst({ className = "", count = 28 }: { className?: string; count?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div className={`pointer-events-none absolute size-0 ${className}`} aria-hidden="true">
      {burstPetals.slice(0, count).map((petal) => (
        <m.span
          key={`${petal.x}-${petal.y}-${petal.spin}`}
          className="absolute block"
          style={{ width: `${petal.size}rem`, height: `${petal.size * 1.25}rem`, color: petal.color }}
          initial={{ x: "0vmin", y: "0vmin", rotate: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: ["0vmin", `${petal.x}vmin`, `${petal.x * 1.15}vmin`],
            y: ["0vmin", `${petal.y}vmin`, `${petal.y + 34}vmin`],
            rotate: [0, petal.spin * 0.5, petal.spin],
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 1],
          }}
          transition={{ duration: 1.8, ease: "easeOut", delay: petal.delay }}
        >
          <PetalShape />
        </m.span>
      ))}
    </div>
  );
}

export function Heading({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <m.div {...reveal()} className="flex flex-col items-center text-center">
      <Lotus color={light ? "var(--champagne)" : "var(--gold)"} className="h-8 w-auto" />
      <h2
        className={`thangam-heading mt-1 text-[1.9rem] font-medium italic leading-tight ${
          light ? "text-[var(--ivory)]" : "text-[var(--burgundy)]"
        }`}
      >
        {children}
      </h2>
      <div className="mt-2">
        <FloralDivider />
      </div>
    </m.div>
  );
}

/** The wax seal: a pressed, uneven edge with the couple's initials in the middle. */
const sealEdge = (() => {
  const lobes = 13;
  const parts: string[] = [];
  for (let i = 0; i <= lobes * 2; i++) {
    const angle = (i / (lobes * 2)) * Math.PI * 2;
    const radius = (i % 2 === 0 ? 49 : 44.5) + (i % 3 === 0 ? 0.8 : -0.6);
    const x = (50 + Math.cos(angle) * radius).toFixed(1);
    const y = (50 + Math.sin(angle) * radius).toFixed(1);
    parts.push(i === 0 ? `M${x} ${y}` : `S${x} ${y} ${x} ${y}`);
  }
  return `${parts.join(" ")}Z`;
})();

export function WaxSeal({ initials, lang, className }: { initials: string; lang: Lang; className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-rim`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#f2cf8f" />
          <stop offset="0.55" stopColor="#c78b35" />
          <stop offset="1" stopColor="#7c4f16" />
        </radialGradient>
        <radialGradient id={`${id}-wax`} cx="40%" cy="34%" r="72%">
          <stop offset="0" stopColor="#b5244b" />
          <stop offset="1" stopColor="#64091f" />
        </radialGradient>
      </defs>
      <path d={sealEdge} fill={`url(#${id}-rim)`} />
      <circle cx="50" cy="50" r="35" fill={`url(#${id}-wax)`} stroke="#6b4312" strokeWidth="1" />
      <g fill="none" stroke="#e8c78d" strokeWidth="1" strokeLinecap="round">
        <path d="M28 62c6 10 14 15 22 15s16-5 22-15" />
      </g>
      <g fill="#e8c78d">
        {[-52, -38, -24, -10, 10, 24, 38, 52].map((angle) => (
          <ellipse key={angle} cx="50" cy="75.5" rx="1.5" ry="3.6" transform={`rotate(${angle} 50 50) rotate(${angle > 0 ? 35 : -35} 50 75.5)`} />
        ))}
      </g>
      <text
        x="50"
        y={lang === "ta" ? 54 : 56}
        textAnchor="middle"
        fill="#f5dfae"
        fontSize={lang === "ta" ? 14 : 23}
        style={{
          fontFamily: lang === "ta" ? "var(--font-thangam-tamil)" : "var(--font-thangam-script)",
          fontWeight: lang === "ta" ? 700 : 400,
        }}
      >
        {initials}
      </text>
    </svg>
  );
}

/** The scalloped arch from the card, in a 0 to 1 box so it fits any frame size. */
export const mehrabPath =
  "M0 1V.42C0 .34.03.3.08.28.09.21.15.17.21.17.24.1.31.08.37.09.42.09.47.06.5 0 .53.06.58.09.63.09.69.08.76.1.79.17.85.17.91.21.92.28.97.3 1 .34 1 .42V1Z";

/** The couple's photo inside a gold arch, with roses gathered at its foot. */
export function MehrabFrame({
  src,
  alt,
  sizes,
  className = "",
  florals = true,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  florals?: boolean;
  priority?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative ${className}`}>
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={mehrabPath} />
        </clipPath>
      </svg>
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `url(#${id})` }}>
        <m.div
          className="absolute inset-0"
          initial={{ scale: 1.14, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: smooth, delay: 0.1 }}
        >
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        </m.div>
      </div>
      {/* The gold edge climbs from the foot of the arch to its point. */}
      <m.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(100% -6% -6% -6%)" }}
        whileInView={{ clipPath: "inset(-6% -6% -6% -6%)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.15 }}
      >
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" fill="none" aria-hidden="true">
          <path d={mehrabPath} stroke="var(--gold)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          <path d={mehrabPath} stroke="var(--champagne)" strokeWidth="1" vectorEffect="non-scaling-stroke" transform="translate(-.02 -.02) scale(1.04)" />
        </svg>
      </m.div>
      {florals && (
        <>
          <GrowCorner corner="bl" place="-bottom-[9%] -left-[11%]" className="w-[54%]" delay={0.45} />
          <GrowCorner corner="br" place="-bottom-[9%] -right-[11%]" className="w-[52%]" delay={0.55} />
        </>
      )}
    </div>
  );
}

/** The arch-topped panel that holds the home screen. */
export function ArchPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  const top =
    "M0 100V62C0 52 6 46 14 44 16 34 26 28 36 28 42 16 56 12 70 14 84 16 92 10 100 0";
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="block h-20 w-full" aria-hidden="true">
          <path d={`${top}C108 10 116 16 130 14 144 12 158 16 164 28 174 28 184 34 186 44 194 46 200 52 200 62V100Z`} fill="rgb(255 250 243 / 0.9)" />
        </svg>
        <m.div
          className="absolute inset-0"
          initial={{ clipPath: "inset(100% -2% -2% -2%)" }}
          animate={{ clipPath: "inset(-2% -2% -2% -2%)" }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
        >
          <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="block size-full overflow-visible" aria-hidden="true">
            <path
              d={`${top}C108 10 116 16 130 14 144 12 158 16 164 28 174 28 184 34 186 44 194 46 200 52 200 62V100`}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </m.div>
      </div>
      <div className="-mt-px rounded-b-3xl border-x-[1.5px] border-b-[1.5px] border-[var(--gold)] bg-[rgb(255_250_243/0.9)]">
        {children}
      </div>
    </div>
  );
}

function PetalShape() {
  return (
    <svg viewBox="0 0 20 26" fill="currentColor" className="size-full" aria-hidden="true">
      <path d="M10 1C15 6 19 12 17 19c-1 4-5 6-7 6s-6-2-7-6C1 12 5 6 10 1z" />
      <path d="M10 5v16" stroke="#fff" strokeOpacity="0.35" strokeWidth="0.8" />
    </svg>
  );
}

function FlowerShape() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-full" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cx="12" cy="6.5" rx="4.4" ry="5.8" transform={`rotate(${angle} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.6" fill="#f0c15f" />
    </svg>
  );
}

const fallingPetals = [
  { left: "7%", fall: "17s", delay: "-3s", color: "var(--rose)", size: 1, flower: false },
  { left: "20%", fall: "23s", delay: "-15s", color: "#f4a7b2", size: 1.25, flower: false },
  { left: "33%", fall: "20s", delay: "-9s", color: "#fffaf3", size: 1, flower: true },
  { left: "46%", fall: "26s", delay: "-21s", color: "var(--burgundy)", size: 0.85, flower: false },
  { left: "58%", fall: "19s", delay: "-6s", color: "var(--rose)", size: 1.2, flower: false },
  { left: "69%", fall: "24s", delay: "-18s", color: "#fbd3dc", size: 1.1, flower: true },
  { left: "80%", fall: "21s", delay: "-12s", color: "#f4a7b2", size: 0.9, flower: false },
  { left: "92%", fall: "18s", delay: "-1s", color: "var(--rose)", size: 1.05, flower: false },
];

/** Rose petals with a few whole blossoms, always a light scatter and never a flurry. */
export function FallingPetals({ count = fallingPetals.length }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {fallingPetals.slice(0, count).map((petal) => (
        <span
          key={petal.left}
          className="thangam-petal"
          style={
            {
              left: petal.left,
              color: petal.color,
              width: `${petal.size}rem`,
              height: `${petal.size * (petal.flower ? 1 : 1.25)}rem`,
              "--fall": petal.fall,
              "--delay": petal.delay,
            } as React.CSSProperties
          }
        >
          {petal.flower ? <FlowerShape /> : <PetalShape />}
        </span>
      ))}
    </div>
  );
}

export const primaryButton =
  "thangam-press thangam-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-center font-medium";

export const secondaryButton =
  "thangam-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--gold)] bg-[rgb(255_250_243/0.85)] px-5 py-2.5 text-center font-medium text-[var(--burgundy)] hover:bg-[var(--ivory)]";
