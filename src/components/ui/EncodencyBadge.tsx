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
  return (
    <span
      className={`inline-flex h-[34px] min-w-[128px] shrink-0 flex-col items-center justify-center rounded-[5px] bg-[#e3141b] px-2.5 leading-none text-white shadow-sm ${className}`}
      role="img"
      aria-label={`${dev.name} ${dev.legal} — ${dev.slogan}`}
    >
      <span className={`text-[15px] font-semibold tracking-tight ${nameClassName}`}>
        {dev.name}
        <span className={`ml-0.5 font-bold ${legalClassName}`}>{dev.legal}</span>
      </span>
      <span className={`mt-0.5 font-semibold italic ${sloganClassName}`}>{dev.slogan}</span>
    </span>
  );
}
