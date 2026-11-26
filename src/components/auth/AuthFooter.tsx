import { siteConfig } from "@/lib/config/site";
import type { AuthVariant } from "@/components/auth/AuthShell";
import EncodencyBadge from "@/components/ui/EncodencyBadge";

const styles = {
  login: {
    wrap: "mx-6 mb-6 mt-4 border-t border-[#b9bfd6] pt-5 sm:mx-auto sm:w-full sm:max-w-[460px] lg:ml-[23px] lg:mr-[30px] lg:mt-2 lg:mb-[34px] lg:w-auto lg:max-w-none lg:pt-[22px]",
    row: "lg:-mx-[6px] lg:text-[11.8px]",
    badge: "lg:h-[34px] lg:min-w-[114px] lg:px-1.5",
    name: "lg:text-[12px]",
    sep: "",
  },
} as const;

/** Copyright line + developer badge, shared by the auth screens. */
export default function AuthFooter({ variant }: { variant: AuthVariant }) {
  const s = styles[variant];
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
        <EncodencyBadge className={s.badge} nameClassName={s.name} />
      </div>
    </footer>
  );
}
