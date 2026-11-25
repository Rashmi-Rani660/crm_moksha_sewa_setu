import Image from "next/image";
import { siteConfig } from "@/lib/config/site";

/**
 * Brand panel of the login screen.
 *
 * Below `lg` it is a normal flow layout (brand block, then the photo) so
 * nothing can overlap. At `lg` the pieces are placed on the 794px-tall design
 * grid; the photo scales with the panel width.
 */
export default function LoginHero() {
  const { tagline } = siteConfig;

  return (
    <section
      aria-label={siteConfig.brand}
      className="relative flex min-w-0 flex-col overflow-hidden bg-[linear-gradient(100deg,#fff7f5_0%,#fef4f1_60%,#fcebe3_100%)] lg:block lg:h-[794px]"
    >
      {/* Brand + tagline */}
      <div className="relative z-10 flex flex-col gap-5 px-6 pt-7 sm:flex-row sm:items-center sm:gap-10 sm:px-10 sm:pt-9 lg:contents">
        <div className="flex w-[210px] shrink-0 flex-col items-center sm:w-[250px] lg:contents">
          <Image
            src="/images/moksha-sewa-logo.png"
            alt={siteConfig.brand}
            width={1292}
            height={1021}
            priority
            className="h-auto w-full lg:absolute lg:left-[70px] lg:top-[12px] lg:z-10 lg:w-[232px]"
          />
          <div className="mt-1 flex w-full items-center gap-1.5 lg:absolute lg:left-[36px] lg:top-[203px] lg:z-10 lg:mt-0 lg:w-[300px] lg:gap-2">
            <span className="h-px min-w-1 flex-1 bg-navy-ink/70" />
            <span className="whitespace-nowrap text-[10.5px] font-semibold text-navy-ink sm:text-[12px] lg:text-[14.5px]">
              {siteConfig.initiative}
            </span>
            <span className="h-px min-w-1 flex-1 bg-navy-ink/70" />
          </div>
        </div>

        <span
          aria-hidden
          className="hidden w-px bg-navy-ink/70 lg:absolute lg:left-[344px] lg:top-[50px] lg:z-10 lg:block lg:h-[150px]"
        />

        <div className="lg:absolute lg:left-[374px] lg:top-[58px] lg:z-10">
          <h2 className="text-[26px] font-bold leading-[1.15] tracking-[-0.01em] text-navy-ink sm:text-[30px] lg:text-[30px] lg:leading-[1.1]">
            {tagline.title[0]} <br className="hidden sm:inline" />
            {tagline.title[1]}
          </h2>
          <span className="mt-3 block h-[5px] w-[74px] rounded-full bg-gold lg:mt-[14px]" />
          <p className="mt-3 max-w-[300px] text-[15px] font-medium leading-snug text-navy-ink sm:text-[17px] lg:mt-[15px] lg:max-w-none lg:text-[17.4px] lg:leading-[1.4]">
            {tagline.text[0]} <br className="hidden sm:inline" />
            {tagline.text[1]}
          </p>
        </div>
      </div>

      {/* Photo — fades into the sky at the top; scales with the panel width */}
      <div className="relative mt-3 aspect-[3/2] w-full [mask-image:linear-gradient(to_bottom,transparent_0,#000_32%)] lg:absolute lg:left-[-37px] lg:top-[180px] lg:mt-0 lg:aspect-[3/2] lg:w-[min(1200px,max(999px,calc(100%+37px)))] lg:[mask-image:linear-gradient(to_bottom,transparent_0,#000_38%)]">
        <Image
          src="/images/hero-photo.png"
          alt="A Moksha Sewa caregiver comforting an elderly woman beside the Ganga at sunrise"
          fill
          priority
          quality={90}
          sizes="(min-width: 1024px) 1200px, (min-width: 640px) 720px, 100vw"
          className="object-fill [filter:saturate(0.9)_brightness(1.02)]"
        />

        {/* Lanyard, ID badge and chest logo for the nurse's uniform.
            viewBox is in hero-panel design space (-37,180 = photo top-left). */}
        <svg
          aria-hidden
          viewBox="-37 180 999 666"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <g fill="none">
            <path d="M289 492 L327 622" stroke="#15296e" strokeWidth="11" />
            <path d="M351 502 L335 622" stroke="#15296e" strokeWidth="11" />
          </g>
          <rect x="321" y="619" width="18" height="11" rx="2" fill="#8c95b4" />
          <rect x="304" y="628" width="52" height="56" rx="3.5" fill="#fff" stroke="#cfd4e2" strokeWidth="1" />
          <image href="/images/moksha-sewa-logo.png" x="310" y="635" width="40" height="32" />
          <rect x="316" y="675" width="28" height="1.6" rx="0.8" fill="#8c95b4" />
          <image href="/images/moksha-sewa-logo.png" x="361" y="538" width="60" height="48" />
        </svg>
      </div>

      {/* Bottom-left swoosh */}
      <svg
        aria-hidden
        viewBox="0 0 804 794"
        preserveAspectRatio="xMinYMax slice"
        className="pointer-events-none absolute inset-0 h-full w-full lg:inset-auto lg:bottom-0 lg:left-0 lg:h-[794px] lg:w-[804px]"
      >
        <defs>
          <linearGradient id="swooshNavy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f3a86" />
            <stop offset="1" stopColor="#0f2260" />
          </linearGradient>
        </defs>
        <path
          d="M0 690 C110 684 240 718 404 794 L356 794 C222 738 104 706 0 704 Z"
          fill="#f6c21a"
        />
        <path
          d="M0 704 C104 706 222 738 356 794 L0 794 Z"
          fill="url(#swooshNavy)"
        />
      </svg>

      {/* Decorative hexagons (pointy-top), anchored to the panel's right edge */}
      <svg
        aria-hidden
        viewBox="0 0 804 794"
        className="pointer-events-none absolute right-0 top-[3px] z-10 hidden h-[794px] w-[804px] lg:block"
        fill="none"
        stroke="#eab833"
        strokeWidth="2.6"
        strokeLinejoin="round"
      >
        <path d="M746.7 73.5 L772.7 88.5 L772.7 118.5 L746.7 133.5 L720.7 118.5 L720.7 88.5 Z" />
        <path d="M696.2 130 L714.4 140.5 L714.4 161.5 L696.2 172 L678 161.5 L678 140.5 Z" />
      </svg>
    </section>
  );
}
