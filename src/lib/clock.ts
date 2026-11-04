/**
 * The time the site believes it is. Adding ?at=2027-02-04T08:00:00%2B05:30 to a
 * link shows the invitation as it will look at that moment, for reviewing the
 * final-day message and thank-you cover early. It only changes that one view.
 */
let offset: number | null = null;

export function now() {
  if (offset === null) {
    offset = 0;
    try {
      const at = new URLSearchParams(window.location.search).get("at");
      const parsed = at ? Date.parse(at) : NaN;
      if (!Number.isNaN(parsed)) offset = parsed - Date.now();
    } catch {
      // No address to read: keep the real time.
    }
  }
  return Date.now() + offset;
}
