import { siteConfig } from "@/lib/config/site";

/**
 * enCodency developer badge — the same one on the login screens and the
 * dashboards. Size it with `className` (box) and `nameClassName` (wordmark).
 */
export default function EncodencyBadge({
  className = "",
  nameClassName = "",
  legalClassName = "text-[6px]",
  sloganClassName = "text-[5px]",
}: {
  className?: string;
  nameClassName?: string;
  legalClassName?: string;
  sloganClassName?: string;
}) {
  const dev = siteConfig.developer;
  // Slogan / legal sizing props kept for callers; the badge is one line now.
  void legalClassName;
  void sloganClassName;
  return (
    <span
      className={`inline-flex h-[34px] min-w-[128px] shrink-0 items-center justify-center whitespace-nowrap rounded-[8px] bg-[#d63031] px-2.5 leading-none text-white shadow-sm ${className}`}
      role="img"
      aria-label={`${dev.name} ${dev.legal}`}
    >
      <span className={`pt-px text-[15px] font-normal tracking-[-0.1px] ${nameClassName}`}>
        {dev.name} {dev.legal}
      </span>
    </span>
  );
}
