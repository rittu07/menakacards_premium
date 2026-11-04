import { wedding, type Lang } from "@/data/wedding";

/** The company logo, on an ivory plaque so its red stays clear on dark footers. */
export function BrandLogo({ lang, className = "" }: { lang: Lang; className?: string }) {
  return (
    <span className={`mx-auto block w-fit rounded-xl bg-[#fffaf3] px-3 py-2 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a small, already compressed logo */}
      <img src={wedding.brand.logo} alt={wedding.brand.logoAlt[lang]} width={250} height={145} loading="lazy" className="h-auto w-28" />
    </span>
  );
}
