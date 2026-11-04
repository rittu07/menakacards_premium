"use client";

import { useState, type FormEvent } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { wedding } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { downloadBlob } from "@/lib/pdf";

type Response = { id: string; name: string; attending: boolean; guests: number; created_at: string };

// Stops a spreadsheet treating a guest's typed name as a formula.
function csvCell(value: string | number | boolean) {
  const text = String(value);
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function ResponsesList() {
  const { lang, toggleLang } = usePreferences();
  const { thangam, ui, timeZone, slug } = wedding;
  const copy = thangam.responses;
  const [passcode, setPasscode] = useState("");
  const [responses, setResponses] = useState<Response[] | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "wrong" | "unavailable">("idle");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setState("busy");
    try {
      const reply = await fetch("/api/rsvp/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (reply.status === 401) return setState("wrong");
      if (!reply.ok) return setState("unavailable");
      const data = await reply.json();
      setResponses(data.responses);
      setPasscode("");
      setState("idle");
    } catch {
      setState("unavailable");
    }
  };

  const when = (iso: string) =>
    new Intl.DateTimeFormat(lang === "ta" ? "ta-IN" : "en-IN", {
      timeZone,
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));

  const download = () => {
    if (!responses) return;
    const rows = [
      [copy.name[lang], copy.reply[lang], copy.guests[lang], copy.when[lang]],
      ...responses.map((r) => [r.name, r.attending ? copy.yes[lang] : copy.no[lang], r.guests, when(r.created_at)]),
    ];
    const csv = `﻿${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${slug}-rsvp.csv`);
  };

  const attending = responses?.filter((r) => r.attending) ?? [];
  const totals = [
    { label: copy.attending[lang], value: attending.length },
    { label: copy.declined[lang], value: (responses?.length ?? 0) - attending.length },
    { label: copy.totalGuests[lang], value: attending.reduce((sum, r) => sum + r.guests, 0) },
  ];

  return (
    <main className="thangam-blush min-h-svh px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="thangam-heading text-[1.9rem] font-medium italic text-[var(--burgundy)]">{copy.title[lang]}</h1>
          <button
            type="button"
            onClick={toggleLang}
            aria-label={ui.switchLanguageLabel[lang]}
            className="thangam-press min-h-11 rounded-full border border-[var(--gold)] bg-[rgb(255_250_243/0.85)] px-4 font-medium text-[var(--burgundy)]"
          >
            {ui.switchLanguage[lang]}
          </button>
        </div>

        {!responses ? (
          <form onSubmit={submit} className="thangam-card mt-5 rounded-2xl p-5">
            <p>{copy.intro[lang]}</p>
            <label htmlFor="family-passcode" className="mb-1 mt-4 block font-medium">
              {copy.passcode[lang]}
            </label>
            <input
              id="family-passcode"
              type="password"
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              autoComplete="current-password"
              className="min-h-12 w-full rounded-xl border border-[var(--gold)] bg-[var(--ivory)] px-4"
            />
            {state === "wrong" && (
              <p role="alert" className="mt-2 font-medium text-[var(--burgundy)]">
                {copy.wrong[lang]}
              </p>
            )}
            {state === "unavailable" && (
              <p role="alert" className="mt-2 font-medium text-[var(--burgundy)]">
                {copy.unavailable[lang]}
              </p>
            )}
            <button
              type="submit"
              disabled={state === "busy" || !passcode}
              className="thangam-press thangam-button mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 font-medium disabled:opacity-70"
            >
              {state === "busy" && <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
              {copy.open[lang]}
            </button>
          </form>
        ) : (
          <>
            <dl className="mt-5 grid grid-cols-3 gap-2">
              {totals.map((total) => (
                <div key={total.label} className="thangam-card rounded-2xl px-1 py-3 text-center">
                  <dd className="thangam-heading text-[1.8rem] font-semibold leading-none text-[var(--burgundy)]">{total.value}</dd>
                  <dt className="mt-1 text-[0.85rem] leading-tight">{total.label}</dt>
                </div>
              ))}
            </dl>

            {responses.length === 0 ? (
              <p className="mt-6 text-center">{copy.empty[lang]}</p>
            ) : (
              <>
                <div className="thangam-card mt-4 overflow-x-auto rounded-2xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[var(--champagne)] text-[var(--burgundy)]">
                        <th className="px-3 py-2">{copy.name[lang]}</th>
                        <th className="px-3 py-2">{copy.reply[lang]}</th>
                        <th className="px-3 py-2">{copy.guests[lang]}</th>
                        <th className="px-3 py-2">{copy.when[lang]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((r) => (
                        <tr key={r.id} className="border-b border-[rgb(232_199_141/0.5)] last:border-0">
                          <td className="min-w-28 break-words px-3 py-2">{r.name}</td>
                          <td className="px-3 py-2">{r.attending ? copy.yes[lang] : copy.no[lang]}</td>
                          <td className="px-3 py-2">{r.guests}</td>
                          <td className="whitespace-nowrap px-3 py-2">{when(r.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={download}
                  className="thangam-press thangam-button mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 font-medium"
                >
                  <Download className="size-5" aria-hidden="true" />
                  {copy.download[lang]}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
