import Image from "next/image";

export default function HeroPanel() {
  return (
    <section
      aria-label="Moksha Sewa"
      className="relative min-h-[690px] overflow-hidden bg-[linear-gradient(100deg,#fff7f5_0%,#fef4f1_60%,#fcebe3_100%)] lg:h-[794px] lg:min-h-0"
    >
      {/* Photo — fades into the extended sky at the top */}
      <Image
        src="/images/hero-photo.png"
        alt="A Moksha Sewa caregiver comforting an elderly woman beside the Ganga at sunrise"
        width={1536}
        height={1024}
        priority
        quality={90}
        sizes="999px"
        className="absolute bottom-0 left-0 h-[58%] w-full object-cover object-[35%_50%] [mask-image:linear-gradient(to_bottom,transparent_0,#000_40%)] lg:bottom-auto lg:left-[-37px] lg:top-[180px] lg:h-[666px] lg:w-[999px] lg:max-w-none lg:object-fill lg:[mask-image:linear-gradient(to_bottom,transparent_0,#000_38%)]"
      />

      {/* Lanyard, ID badge and chest logo (match the brand uniform) */}
      <svg
        aria-hidden
        viewBox="0 0 804 794"
        className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full lg:block"
      >
        <g strokeLinecap="butt" fill="none">
          <path d="M289 492 L327 622" stroke="#15296e" strokeWidth="11" />
          <path d="M351 502 L335 622" stroke="#15296e" strokeWidth="11" />
        </g>
        <rect x="321" y="619" width="18" height="11" rx="2" fill="#8c95b4" />
        <rect x="304" y="628" width="52" height="56" rx="3.5" fill="#fff" stroke="#cfd4e2" strokeWidth="1" />
        <image href="/images/moksha-sewa-logo.png" x="310" y="635" width="40" height="32" />
        <rect x="316" y="675" width="28" height="1.6" rx="0.8" fill="#8c95b4" />
        <image href="/images/moksha-sewa-logo.png" x="361" y="538" width="60" height="48" />
      </svg>

      {/* Bottom-left swoosh */}
      <svg
        aria-hidden
        viewBox="0 0 804 794"
        preserveAspectRatio="xMinYMax slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="swooshNavy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1f3a86" />
            <stop offset="1" stopColor="#0f2260" />
          </linearGradient>
        </defs>
        <path
          d="M0 690 C120 682 262 722 446 794 L396 794 C236 740 108 712 0 722 Z"
          fill="#f6c21a"
        />
        <path
          d="M0 722 C108 712 236 740 396 794 L0 794 Z"
          fill="url(#swooshNavy)"
        />
      </svg>

      {/* Brand + tagline */}
      <div className="absolute left-5 top-6 z-10 flex items-start gap-5 sm:left-8 sm:top-8 lg:contents">
        <div className="flex shrink-0 flex-col items-center lg:contents">
          <Image
            src="/images/moksha-sewa-logo.png"
            alt="Moksha Sewa"
            width={1292}
            height={1021}
            priority
            className="h-auto w-[170px] sm:w-[210px] lg:absolute lg:left-[64px] lg:top-[6px] lg:w-[244px]"
          />
          <div className="mt-1 flex w-full items-center gap-2 lg:absolute lg:left-[36px] lg:top-[207px] lg:mt-0 lg:w-[300px]">
            <span className="h-px flex-1 bg-navy-ink/70" />
            <span className="whitespace-nowrap text-[11px] font-semibold text-navy-ink sm:text-[13px] lg:text-[13.8px]">
              An Initiative of Namo Gange Trust
            </span>
            <span className="h-px flex-1 bg-navy-ink/70" />
          </div>
        </div>

        <span
          aria-hidden
          className="hidden w-px bg-navy-ink/70 lg:absolute lg:left-[344px] lg:top-[48px] lg:block lg:h-[150px]"
        />

        <div className="hidden lg:absolute lg:left-[374px] lg:top-[55px] lg:block">
          <h2 className="text-[30px] font-bold leading-[1.1] tracking-[-0.01em] text-navy-ink">
            Dignity in Every
            <br />
            Final Journey
          </h2>
          <span className="mt-[14px] block h-[5px] w-[74px] rounded-full bg-gold" />
          <p className="mt-[15px] text-[17.4px] font-medium leading-[1.4] text-navy-ink">
            Serving with compassion, care
            <br />
            and responsibility.
          </p>
        </div>
      </div>

      {/* Tagline for small screens (sits under the brand) */}
      <div className="absolute inset-x-5 top-[190px] z-10 sm:inset-x-8 sm:top-[235px] lg:hidden">
        <h2 className="text-[22px] font-bold leading-tight text-navy-ink sm:text-[26px]">
          Dignity in Every Final Journey
        </h2>
        <span className="mt-2 block h-1 w-16 rounded-full bg-gold" />
        <p className="mt-2.5 max-w-[260px] text-[14px] font-medium leading-snug text-navy-ink">
          Serving with compassion, care and responsibility.
        </p>
      </div>

      {/* Decorative hexagons (pointy-top) */}
      <svg
        aria-hidden
        viewBox="0 0 804 794"
        className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
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
