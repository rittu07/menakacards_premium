"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle, MessageCircle, Minus, Plus, Send } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { now } from "@/lib/clock";
import { whatsappUrl } from "@/lib/format";
import { Bloom, Heading, PetalBurst, reveal, Rosette, smooth } from "./art";

const MAX_GUESTS = 20;

const lightButton =
  "thangam-press inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--ivory)] px-6 py-2.5 font-medium text-[var(--burgundy)] hover:bg-[var(--peach)] disabled:opacity-80";

export function Rsvp() {
  const { lang } = usePreferences();
  const { thangam, contact, couple } = wedding;
  const copy = thangam.rsvp;

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState(1);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [problem, setProblem] = useState<string | null>(null);

  const closed = now() >= Date.parse(thangam.thanksFrom);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setProblem(copy.needName[lang]);
    if (attending === null) return setProblem(copy.needChoice[lang]);
    setProblem(null);
    setState("sending");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), attending, guests: attending ? guests : 0, website }),
      });
      setState(response.ok ? "sent" : "failed");
    } catch {
      setState("failed");
    }
  };

  // If saving fails, the reply can still reach the family, written out on WhatsApp.
  const whatsappReply = `${name.trim()} ${
    attending ? `${copy.whatsappYes[lang]} ${guests}` : copy.whatsappNo[lang]
  } (${couple.bride[lang]} & ${couple.groom[lang]})`;

  const choice = (selected: boolean) =>
    `thangam-press flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-2 py-2 text-center font-medium ${
      selected
        ? "border-[var(--champagne)] bg-[var(--ivory)] text-[var(--burgundy)]"
        : "border-[var(--champagne)] text-[var(--ivory)] hover:bg-[rgb(255_255_255/0.08)]"
    }`;

  return (
    <section id="rsvp" className="thangam-lazy thangam-wine relative overflow-hidden px-4 py-14 [--lazy-size:620px]">
      <Rosette color="var(--champagne)" className="left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-20" />
      <div className="relative">
        <Heading light>{copy.title[lang]}</Heading>
      </div>

      <m.div {...reveal("up", 0.1)} className="relative mx-auto mt-4 max-w-md text-center">
        {closed ? (
          <p className="text-balance">{copy.closed[lang]}</p>
        ) : state === "sent" ? (
          <m.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: smooth }} role="status" className="relative">
            <PetalBurst className="left-1/2 top-7" count={18} />
            <span className="relative mx-auto flex size-20 items-center justify-center">
              <Bloom className="absolute inset-0 size-full" outer="var(--champagne)" inner="var(--ivory)" />
              <span className="relative flex size-9 items-center justify-center rounded-full bg-[var(--burgundy)]">
                <Check className="size-5" aria-hidden="true" />
              </span>
            </span>
            <p className="thangam-heading mt-3 text-balance text-[1.3rem] italic leading-snug">
              {attending ? copy.thanksYes[lang] : copy.thanksNo[lang]}
            </p>
            <button type="button" onClick={() => setState("idle")} className="mt-3 inline-flex min-h-11 items-center px-3 underline underline-offset-4">
              {copy.again[lang]}
            </button>
          </m.div>
        ) : (
          <form onSubmit={submit} noValidate className="text-left">
            <p className="mb-4 text-center">{copy.intro[lang]}</p>

            <label htmlFor="rsvp-name" className="mb-1 block font-medium">
              {copy.name[lang]}
            </label>
            <input
              id="rsvp-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setProblem(null);
              }}
              autoComplete="name"
              maxLength={80}
              className="min-h-12 w-full rounded-2xl border border-[var(--champagne)] bg-[var(--ivory)] px-4 text-[var(--ink)]"
            />

            {/* Hidden from people. Only bots fill this in. */}
            <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
              </label>
            </div>

            <fieldset className="mt-4">
              <legend className="mb-1 font-medium">{copy.attendingLegend[lang]}</legend>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" aria-pressed={attending === true} onClick={() => {
                    setAttending(true);
                    setProblem(null);
                  }} className={choice(attending === true)}>
                  {copy.yes[lang]}
                </button>
                <button type="button" aria-pressed={attending === false} onClick={() => {
                    setAttending(false);
                    setProblem(null);
                  }} className={choice(attending === false)}>
                  {copy.no[lang]}
                </button>
              </div>
            </fieldset>

            <AnimatePresence initial={false}>
              {attending && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: smooth }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span id="rsvp-guests" className="font-medium">
                      {copy.guests[lang]}
                    </span>
                    <div className="flex items-center gap-1" role="group" aria-labelledby="rsvp-guests">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        disabled={guests <= 1}
                        aria-label={copy.fewer[lang]}
                        className="thangam-press flex size-11 items-center justify-center rounded-full border border-[var(--champagne)] disabled:opacity-40"
                      >
                        <Minus className="size-5" aria-hidden="true" />
                      </button>
                      <output aria-live="polite" className="thangam-heading w-10 text-center text-[1.5rem] font-semibold tabular-nums lining-nums">
                        {guests}
                      </output>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                        disabled={guests >= MAX_GUESTS}
                        aria-label={copy.more[lang]}
                        className="thangam-press flex size-11 items-center justify-center rounded-full border border-[var(--champagne)] disabled:opacity-40"
                      >
                        <Plus className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </m.div>
              )}
            </AnimatePresence>

            {problem && (
              <p role="alert" className="mt-3 text-center font-medium text-[var(--champagne)]">
                {problem}
              </p>
            )}

            <button type="submit" disabled={state === "sending"} className={`${lightButton} mt-5 w-full`}>
              {state === "sending" ? (
                <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              ) : (
                <Send className="size-5" aria-hidden="true" />
              )}
              {state === "sending" ? copy.sending[lang] : copy.send[lang]}
            </button>

            {state === "failed" && (
              <div role="alert" className="mt-4 text-center">
                <p className="text-balance">{copy.failed[lang]}</p>
                <a
                  href={whatsappUrl(contact.phone, whatsappReply)}
                  target="_blank"
                  rel="noreferrer"
                  className="thangam-press mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--champagne)] px-5 py-2 font-medium"
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                  {copy.sendWhatsapp[lang]}
                </a>
              </div>
            )}
          </form>
        )}
      </m.div>
    </section>
  );
}
