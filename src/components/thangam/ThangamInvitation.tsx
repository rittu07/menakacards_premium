"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { now } from "@/lib/clock";
import { FallingPetals, Vine } from "./art";
import { Countdown } from "./Countdown";
import { Envelope } from "./Envelope";
import { Family } from "./Family";
import { Footer } from "./Footer";
import { Gallery } from "./Gallery";
import { Gift } from "./Gift";
import { Home } from "./Home";
import { Loader } from "./Loader";
import { Rsvp } from "./Rsvp";
import { Schedule } from "./Schedule";
import { Story } from "./Story";
import { ThankYouCover } from "./ThankYouCover";
import { Toolbar } from "./Toolbar";
import { Venue } from "./Venue";

type Stage = "loading" | "cover" | "open";

export function ThangamInvitation() {
  const [stage, setStage] = useState<Stage>("loading");
  const { speechNotice } = usePreferences();

  const showCover = useCallback(() => setStage("cover"), []);
  const open = useCallback(() => {
    setStage("open");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const finished = now() >= Date.parse(wedding.thangam.thanksFrom);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait" initial={false}>
          {stage === "loading" && (
            <m.div key="loading" exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
              <Loader onDone={showCover} />
            </m.div>
          )}
          {stage === "cover" && (
            <m.div
              key="cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              {finished ? <ThankYouCover onOpen={open} /> : <Envelope onOpen={open} />}
            </m.div>
          )}
          {stage === "open" && (
            <m.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <Toolbar />
              <main>
                <Home />
                <Vine />
                <Countdown />
                <Vine />
                <Schedule />
                <Vine />
                <Story />
                <Vine />
                <Family />
                <Vine />
                <Gallery />
                <Vine />
                <Venue />
                <Rsvp />
                {wedding.thangam.gift.enabled && <Gift />}
              </main>
              <Footer />
              <FallingPetals />
            </m.div>
          )}
        </AnimatePresence>
        {speechNotice && (
          <p
            role="status"
            className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm rounded-lg bg-[var(--burgundy)] px-4 py-3 text-center text-[var(--ivory)]"
          >
            {speechNotice}
          </p>
        )}
      </MotionConfig>
    </LazyMotion>
  );
}
