"use client";

import Image from "next/image";
import { Cloud, CloudLightning, CloudRain, MapPin, Phone, Sun, type LucideIcon } from "lucide-react";
import { m } from "motion/react";
import { wedding, type Text } from "@/data/wedding";
import { usePreferences } from "@/components/shared/Preferences";
import { useEventWeather } from "@/components/shared/useEventWeather";
import { formatDate, mapsUrl, telUrl } from "@/lib/format";
import { GrowCorner, Heading, primaryButton, reveal, secondaryButton } from "./art";

function describe(code: number): { label: Text; Icon: LucideIcon } {
  const { weather } = wedding.thangam.venue;
  if (code >= 95) return { label: weather.storm, Icon: CloudLightning };
  if (code >= 51) return { label: weather.rain, Icon: CloudRain };
  if (code >= 2) return { label: weather.cloudy, Icon: Cloud };
  return { label: weather.clear, Icon: Sun };
}

function Weather() {
  const { lang } = usePreferences();
  const { venue, thangam } = wedding;
  const copy = thangam.venue;
  const { forecast, waiting, opensOn } = useEventWeather();

  const { label, Icon } = describe(forecast?.code ?? 0);

  return (
    <m.div {...reveal("up", 0.1)} className="thangam-card flex items-center gap-4 rounded-2xl px-4 py-3 text-left">
      <Icon className={`size-9 shrink-0 text-[var(--gold-deep)] ${Icon === Sun ? "thangam-spin-slow" : ""}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className="thangam-heading font-semibold text-[var(--burgundy)]">{copy.weatherTitle[lang]}</p>
        {forecast ? (
          <p className="leading-snug">
            {label[lang]}, {forecast.min}–{forecast.max}°C
            {forecast.rain !== null && ` · ${forecast.rain}% ${copy.rainChance[lang]}`}
          </p>
        ) : (
          <>
            <p className="leading-snug">{venue.climate[lang]}</p>
            {waiting && (
              <p className="mt-1 text-[0.9rem] leading-snug">
                {copy.forecastFrom[lang]}: {formatDate(new Date(opensOn).toISOString(), lang)}
              </p>
            )}
          </>
        )}
      </div>
    </m.div>
  );
}

export function Venue() {
  const { lang } = usePreferences();
  const { venue, thangam, ui, contact } = wedding;
  const copy = thangam.venue;

  return (
    <section id="venue" className="thangam-lazy thangam-blush relative overflow-hidden px-4 py-14 [--lazy-size:1100px]">
      <GrowCorner corner="tl" className="w-[24%] max-w-44 opacity-90" />
      <GrowCorner corner="tr" className="w-[24%] max-w-44 opacity-90" delay={0.1} />
      <Heading>{copy.title[lang]}</Heading>

      <div className="relative mx-auto mt-6 grid max-w-4xl gap-4 md:grid-cols-2">
        <m.div {...reveal("left")} className="thangam-card overflow-hidden rounded-3xl p-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem]">
            <Image src={venue.photo} alt={copy.photoAlt[lang]} fill sizes="(min-width: 768px) 440px, 92vw" className="thangam-drift object-cover" />
            {/* A map pin drops onto the venue and settles. */}
            <m.span
              className="absolute left-1/2 top-3 flex size-11 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--burgundy)] text-[var(--ivory)] shadow-lg"
              initial={{ y: -70, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 11, delay: 0.5 }}
              aria-hidden="true"
            >
              <MapPin className="size-6" />
            </m.span>
          </div>
          <div className="px-3 py-3 text-center">
            <p className="thangam-heading text-[1.35rem] font-semibold text-[var(--burgundy)]">{venue.name[lang]}</p>
            <p>{venue.address[lang]}</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href={mapsUrl(venue.mapQuery)} target="_blank" rel="noreferrer" className={primaryButton}>
                <MapPin className="size-5" aria-hidden="true" />
                {ui.openMap[lang]}
              </a>
              <a href={telUrl(contact.phone)} className={secondaryButton}>
                <Phone className="size-5" aria-hidden="true" />
                {copy.callDirections[lang]}
              </a>
            </div>
          </div>
        </m.div>

        <div className="flex flex-col gap-4">
          <m.div {...reveal("right")} className="thangam-card min-h-64 flex-1 overflow-hidden rounded-3xl p-2">
            <iframe
              title={copy.mapTitle[lang]}
              src={`https://www.google.com/maps?q=${encodeURIComponent(venue.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full min-h-60 rounded-[1.25rem] border-0"
            />
          </m.div>
          <Weather />
        </div>
      </div>
    </section>
  );
}
