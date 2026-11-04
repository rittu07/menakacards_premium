import type { NextRequest } from "next/server";
import { wedding } from "@/data/wedding";
import { weddingIcs } from "@/lib/calendar";

// A real address, not a browser blob: phones hand it straight to the calendar
// app, including from inside WhatsApp's own browser.
export function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "ta" ? "ta" : "en";
  const event = request.nextUrl.searchParams.get("event");
  const fn = wedding.functions.find((f) => f.key === event);
  return new Response(weddingIcs(lang, fn?.key), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${wedding.slug}.ics"`,
    },
  });
}
