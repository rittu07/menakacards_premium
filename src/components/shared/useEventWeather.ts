"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/data/wedding";
import { now } from "@/lib/clock";

const FORECAST_DAYS = 16;
const DAY = 86_400_000;
const istDate = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: wedding.timeZone }).format(new Date(iso));

export type Forecast = { code: number; max: number; min: number; rain: number | null };

/** The wedding day's forecast, once the wedding is near enough to have one. */
export function useEventWeather() {
  const { venue, muhurtham } = wedding;
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const target = Date.parse(muhurtham.start);
  const opensOn = target - FORECAST_DAYS * DAY;
  const current = now();
  // Uses the real clock as well: a preview link can't get a forecast for a far-off date.
  const inWindow = current >= opensOn && current <= target + DAY && Date.now() >= opensOn;

  useEffect(() => {
    if (!inWindow) return;
    const controller = new AbortController();
    const date = istDate(muhurtham.start);
    const params = new URLSearchParams({
      latitude: String(venue.coords.latitude),
      longitude: String(venue.coords.longitude),
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: wedding.timeZone,
      start_date: date,
      end_date: date,
    });
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const day = data?.daily;
        if (day?.weather_code?.[0] == null) return;
        setForecast({
          code: day.weather_code[0],
          max: Math.round(day.temperature_2m_max[0]),
          min: Math.round(day.temperature_2m_min[0]),
          rain: day.precipitation_probability_max?.[0] ?? null,
        });
      })
      .catch(() => {
        // No forecast to show: the usual-climate line stays on screen.
      });
    return () => controller.abort();
  }, [inWindow, muhurtham.start, venue.coords.latitude, venue.coords.longitude]);

  return { forecast, waiting: current < opensOn, opensOn };
}
