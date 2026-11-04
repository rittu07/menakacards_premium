import { wedding, type Lang } from "@/data/wedding";

const locales: Record<Lang, string> = { en: "en-IN", ta: "ta-IN" };

/** Every date on the site is shown in Indian time, wherever the guest is. */
export function formatDate(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(locales[lang], {
    timeZone: wedding.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatShortDate(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(locales[lang], {
    timeZone: wedding.timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTime(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(locales[lang], {
    timeZone: wedding.timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function formatTimeRange(start: string, end: string, lang: Lang) {
  return `${formatTime(start, lang)} – ${formatTime(end, lang)}`;
}

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function telUrl(phone: string) {
  return `tel:+${phone}`;
}

export function whatsappUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function coupleNames(lang: Lang) {
  const { bride, groom } = wedding.couple;
  return `${bride[lang]} & ${groom[lang]}`;
}
