import { wedding, type FunctionKey, type Lang } from "@/data/wedding";
import { formatDate } from "@/lib/format";

const stamp = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** The whole wedding by default, or one function when a key is given. */
function details(lang: Lang, key?: FunctionKey) {
  const { venue, muhurtham, functions, ui } = wedding;
  const fn = key && functions.find((f) => f.key === key);
  const { start, end } = fn ?? muhurtham;
  return {
    start,
    end,
    title: fn ? `${fn.name[lang]}: ${ui.calendarEvent[lang]}` : ui.calendarEvent[lang],
    location: `${fn ? fn.venue[lang] : venue.name[lang]}, ${venue.address[lang]}`,
    description: formatDate(start, lang),
  };
}

export function googleCalendarUrl(lang: Lang, key?: FunctionKey) {
  const { start, end, title, location, description } = details(lang, key);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    location,
    details: description,
    ctz: wedding.timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

const escapeIcs = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function weddingIcs(lang: Lang, key?: FunctionKey) {
  const { start, end, title, location, description } = details(lang, key);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Menaka Invitations//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${wedding.slug}-${key ?? "muhurtham"}@menaka-invitations`,
    `DTSTAMP:${stamp(start)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escapeIcs(title)}`,
    `LOCATION:${escapeIcs(location)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
