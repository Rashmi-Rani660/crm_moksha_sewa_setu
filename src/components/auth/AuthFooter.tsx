import { siteConfig } from "@/lib/config/site";
import type { AuthVariant } from "@/components/auth/AuthShell";

const styles = {
  login: {
    wrap: "mx-6 mb-6 mt-4 border-t border-[#b9bfd6] pt-5 sm:mx-auto sm:w-full sm:max-w-[460px] lg:ml-[23px] lg:mr-[30px] lg:mt-2 lg:mb-[34px] lg:w-auto lg:max-w-none lg:pt-[22px]",
    row: "lg:-mx-[6px] lg:text-[11.8px]",
    badge: "lg:h-[34px] lg:min-w-[114px] lg:px-1.5",
    name: "lg:text-[12px]",
    sep: "",
  },
  verify: {
    wrap: "mx-6 mb-6 mt-6 border-t border-[#b9bfd6] pt-4 sm:mx-auto sm:w-full sm:max-w-[560px] lg:ml-[36px] lg:mr-[29px] lg:mt-auto lg:mb-[30px] lg:w-auto lg:max-w-none lg:pt-[15px]",
    row: "lg:text-[12.2px]",
    badge: "lg:h-[38px] lg:min-w-[130px] lg:px-1.5",
    name: "lg:text-[14.5px]",
    sep: "mx-1.5 lg:mx-2.5",
  },
} as const;

/** Copyright line + developer badge, shared by the auth screens. */
export default function AuthFooter({ variant }: { variant: AuthVariant }) {
  const s = styles[variant];
  const dev = siteConfig.developer;

  return (
    <footer className={s.wrap}>
      <div
        className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-3 text-[12px] font-medium text-navy-ink lg:flex-nowrap lg:justify-start lg:gap-x-[10px] ${s.row}`}
      >
        <p className="leading-snug lg:whitespace-nowrap">
          <b className="font-bold">
            © {siteConfig.copyrightYear} {siteConfig.trust}
          </b>
          <span className={s.sep}> | </span>
          Designed, Developed &amp; Maintained by
        </p>
        <span
          className={`inline-flex h-[34px] min-w-[128px] shrink-0 flex-col items-center justify-center rounded-[5px] bg-[#e3141b] px-2.5 leading-none text-white shadow-sm ${s.badge}`}
          role="img"
          aria-label={`${dev.name} ${dev.legal} — ${dev.slogan}`}
        >
          <span className={`text-[15px] font-semibold tracking-tight ${s.name}`}>
            {dev.name}
            <span className="ml-0.5 text-[6px] font-bold">{dev.legal}</span>
          </span>
          <span className="mt-0.5 text-[5px] font-semibold italic">
            {dev.slogan}
          </span>
        </span>
      </div>
    </footer>
  );
}
