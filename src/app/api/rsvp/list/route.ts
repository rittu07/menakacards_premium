import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { wedding } from "@/data/wedding";
import { supabaseAdmin } from "@/lib/supabase";

const digest = (value: string) => createHash("sha256").update(value).digest();

// The passcode travels in the request body, never in the address bar.
export async function POST(request: NextRequest) {
  const expected = process.env.RSVP_FAMILY_PASSCODE;
  const supabase = supabaseAdmin();
  if (!expected || !supabase) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const body = await request.json().catch(() => null);
  const passcode = typeof body?.passcode === "string" ? body.passcode : "";
  if (!timingSafeEqual(digest(passcode), digest(expected))) {
    return NextResponse.json({ error: "wrong_passcode" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("id, name, attending, guests, created_at")
    .eq("wedding_slug", wedding.slug)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("RSVP list failed:", error.message);
    return NextResponse.json({ error: "load_failed" }, { status: 502 });
  }
  return NextResponse.json({ responses: data });
}
