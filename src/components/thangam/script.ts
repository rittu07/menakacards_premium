import { wedding, type Lang } from "@/data/wedding";
import { coupleNames, formatDate, formatTimeRange } from "@/lib/format";

/** What "Read aloud" says, assembled from the same data the page shows. */
export function readAloudScript(lang: Lang) {
  const { thangam, muhurtham, venue, functions, families } = wedding;
  const parts = [
    thangam.cover.special[lang],
    coupleNames(lang),
    thangam.home.message[lang],
    `${formatDate(muhurtham.start, lang)}, ${formatTimeRange(muhurtham.start, muhurtham.end, lang)}`,
    `${venue.name[lang]}, ${venue.address[lang]}`,
    thangam.events.title[lang],
    ...functions.map(
      (fn) => `${fn.name[lang]}: ${formatDate(fn.start, lang)}, ${formatTimeRange(fn.start, fn.end, lang)}`,
    ),
    `${families.bride.title[lang]}: ${families.bride.parents.map((p) => p[lang]).join(", ")}`,
    `${families.groom.title[lang]}: ${families.groom.parents.map((p) => p[lang]).join(", ")}`,
  ];
  return parts.join(". ");
}
