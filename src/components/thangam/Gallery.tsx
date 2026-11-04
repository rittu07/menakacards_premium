"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { wedding, type Text } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { GrowCorner, Heading, reveal } from "./art";

const MAX_PHOTOS = 25;
type Photo = { src: string; alt: Text };

const main = wedding.gallery.slice(0, MAX_PHOTOS);
const preWedding = wedding.preWeddingGallery.slice(0, Math.max(0, MAX_PHOTOS - main.length));

const lightboxButton =
  "thangam-press flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--burgundy)] hover:bg-[var(--peach)]";

/** One framed photo: largest at the centre, tilting away as it is swiped aside. */
function SwipeSlide({
  photo,
  row,
  onOpen,
}: {
  photo: Photo;
  row: RefObject<HTMLUListElement | null>;
  onOpen: (button: HTMLButtonElement) => void;
}) {
  const { lang } = usePreferences();
  const slide = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const { scrollXProgress } = useScroll({ container: row, target: slide, axis: "x", offset: ["start end", "end start"] });
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [0.86, 1, 0.86]);
  const rotate = useTransform(scrollXProgress, [0, 0.5, 1], reduced ? [0, 0, 0] : [-3.5, 0, 3.5]);
  return (
    <li ref={slide} className="w-[min(72vw,20rem)]">
      <m.div style={{ scale, rotate }}>
        <button
          type="button"
          onClick={(event) => onOpen(event.currentTarget)}
          aria-label={`${wedding.thangam.gallery.enlarge[lang]}: ${photo.alt[lang]}`}
          className="thangam-press thangam-card block w-full rounded-t-[7rem] rounded-b-xl p-2"
        >
          <span className="relative block aspect-[4/5] overflow-hidden rounded-t-[6.5rem] rounded-b-lg">
            <Image src={photo.src} alt="" fill sizes="(min-width: 480px) 320px, 72vw" className="thangam-drift object-cover" />
          </span>
        </button>
      </m.div>
    </li>
  );
}

/** A row of framed photos that the guest swipes through. */
function SwipeRow({ photos, onOpen }: { photos: Photo[]; onOpen: (index: number, button: HTMLButtonElement) => void }) {
  const row = useRef<HTMLUListElement>(null);
  return (
    <ul ref={row} className="thangam-swipe relative -mx-4 gap-3 px-[max(1rem,calc(50%-12rem))] py-3">
      {photos.map((photo, index) => (
        <SwipeSlide key={photo.src} photo={photo} row={row} onOpen={(button) => onOpen(index, button)} />
      ))}
    </ul>
  );
}

/** Full screen, and swiped natively, so it stays smooth on any phone. */
function Lightbox({ photos, start, onClose }: { photos: Photo[]; start: number; onClose: () => void }) {
  const { lang } = usePreferences();
  const { ui } = wedding;
  const strip = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(start);

  const go = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const element = strip.current;
    if (element) element.scrollTo({ left: index * element.clientWidth, behavior });
  }, []);

  useEffect(() => {
    go(start, "auto");
    closeButton.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [go, start]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(Math.max(0, active - 1));
      if (event.key === "ArrowRight") go(Math.min(photos.length - 1, active + 1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, go, onClose, photos.length]);

  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label={photos[active].alt[lang]}
      className="fixed inset-0 z-50 flex flex-col bg-[#3d0715]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between p-3 text-[var(--ivory)]">
        <p className="px-2">
          {active + 1} / {photos.length}
        </p>
        <button ref={closeButton} type="button" onClick={onClose} aria-label={ui.close[lang]} className={lightboxButton}>
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>
      <div
        ref={strip}
        className="thangam-swipe min-h-0 flex-1"
        onScroll={(event) => {
          const element = event.currentTarget;
          setActive(Math.round(element.scrollLeft / element.clientWidth));
        }}
      >
        {photos.map((photo) => (
          <div key={photo.src} className="relative h-full w-full">
            <Image src={photo.src} alt={photo.alt[lang]} fill sizes="100vw" className="object-contain" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <button type="button" onClick={() => go(Math.max(0, active - 1))} disabled={active === 0} aria-label={ui.previous[lang]} className={`${lightboxButton} disabled:opacity-40`}>
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <p className="min-w-0 text-center text-[var(--ivory)]">{photos[active].alt[lang]}</p>
        <button
          type="button"
          onClick={() => go(Math.min(photos.length - 1, active + 1))}
          disabled={active === photos.length - 1}
          aria-label={ui.next[lang]}
          className={`${lightboxButton} disabled:opacity-40`}
        >
          <ChevronRight className="size-6" aria-hidden="true" />
        </button>
      </div>
    </m.div>
  );
}

export function Gallery() {
  const { lang } = usePreferences();
  const copy = wedding.thangam.gallery;
  const [view, setView] = useState<{ photos: Photo[]; start: number } | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const openFrom = (photos: Photo[]) => (start: number, button: HTMLButtonElement) => {
    opener.current = button;
    setView({ photos, start });
  };
  const close = useCallback(() => {
    setView(null);
    opener.current?.focus();
  }, []);

  return (
    <section id="gallery" className="thangam-lazy relative overflow-hidden px-4 py-14 [--lazy-size:1250px]">
      <GrowCorner corner="tl" className="w-[24%] max-w-44 opacity-90" />
      <GrowCorner corner="tr" className="w-[24%] max-w-44 opacity-90" delay={0.1} />
      <Heading>{copy.title[lang]}</Heading>
      <m.p {...reveal("up", 0.1)} className="mt-2 text-center text-[0.92rem]">
        {copy.swipe[lang]}
      </m.p>
      <m.div {...reveal("right", 0.1)} className="mt-3">
        <SwipeRow photos={main} onOpen={openFrom(main)} />
      </m.div>

      {preWedding.length > 0 && (
        <>
          <m.h3 {...reveal()} className="thangam-heading mt-8 text-center text-[1.45rem] font-medium italic text-[var(--burgundy)]">
            {copy.preWedding[lang]}
          </m.h3>
          <m.div {...reveal("left", 0.1)} className="mt-2">
            <SwipeRow photos={preWedding} onOpen={openFrom(preWedding)} />
          </m.div>
        </>
      )}

      <AnimatePresence>
        {view && <Lightbox photos={view.photos} start={view.start} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
