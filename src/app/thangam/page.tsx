import { wedding } from "@/data/wedding";
import { PreferencesProvider } from "@/components/shared/Preferences";
import { ThangamInvitation } from "@/components/thangam/ThangamInvitation";

export default function ThangamPage() {
  return (
    <PreferencesProvider defaultTrack={wedding.thangam.music.defaultTrack}>
      <ThangamInvitation />
    </PreferencesProvider>
  );
}
