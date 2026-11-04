import { createClient } from "@supabase/supabase-js";

/**
 * Server-side only. The service key is read from a private environment variable
 * and must never carry a NEXT_PUBLIC_ prefix, which would send it to browsers.
 * Returns null until the settings exist, so callers can answer gracefully.
 */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
