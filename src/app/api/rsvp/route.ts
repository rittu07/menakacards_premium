import { NextResponse, type NextRequest } from "next/server";
import { wedding } from "@/data/wedding";
import { supabaseAdmin } from "@/lib/supabase";

const MAX_GUESTS = 20;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // A hidden field people never see. Bots that fill it get a quiet success.
  if (body.website) return NextResponse.json({ ok: true });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const attending = body.attending;
  const guests = Number(body.guests);
  if (
    name.length < 1 ||
    name.length > 80 ||
    typeof attending !== "boolean" ||
    !Number.isInteger(guests) ||
    guests < (attending ? 1 : 0) ||
    guests > MAX_GUESTS
  ) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const { error } = await supabase.from("rsvps").insert({
    wedding_slug: wedding.slug,
    tier: "thangam",
    name,
    attending,
    guests: attending ? guests : 0,
  });
  if (error) {
    console.error("RSVP save failed:", error.message);
    return NextResponse.json({ error: "save_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
