import type { Metadata } from "next";
import { PreferencesProvider } from "@/components/shared/Preferences";
import { ResponsesList } from "@/components/thangam/ResponsesList";

// Private to the family: search engines should never list this page.
export const metadata: Metadata = {
  title: "RSVP List",
  robots: { index: false, follow: false },
};

export default function ResponsesPage() {
  return (
    <PreferencesProvider>
      <ResponsesList />
    </PreferencesProvider>
  );
}
