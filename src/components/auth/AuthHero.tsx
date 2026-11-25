import Image from "next/image";
import type { CSSProperties } from "react";
import type { AuthVariant } from "@/components/auth/AuthShell";
import { siteConfig } from "@/lib/config/site";

type Hex = { cx: number; cy: number; r: number };

/**
 * Desktop (lg) placement of everything in the brand panel, in design pixels
 * relative to the panel's top-left corner. One entry per auth screen.
 */
const layouts: Record<
  AuthVariant,
  {
    w: number;
    h: number;
    logo: { x: number; y: number; w: number };
    init: { x: number; y: number; w: number; fs: number };
    divider: { x: number; y: number; h: number };
    tag: { x: number; y: number; titleFs: number; titleLh: number; barMt: number; textFs: number; textLh: number; textMt: number };
    photo: { x: number; y: number; w: number };
    swoosh: number;
    hexes: Hex[];
  }
> = {
  login: {
    w: 804,
    h: 794,
    logo: { x: 70, y: 12, w: 232 },
    init: { x: 36, y: 203, w: 300, fs: 14.5 },
    divider: { x: 344, y: 50, h: 150 },
    tag: { x: 374, y: 58, titleFs: 30, titleLh: 1.1, barMt: 14, textFs: 17.4, textLh: 1.4, textMt: 15 },
    photo: { x: -18, y: 175, w: 840 },
    swoosh: 1,
    hexes: [
      { cx: 746.7, cy: 106.5, r: 30 },
      { cx: 696.2, cy: 154, r: 21 },
    ],
  },
  verify: {
    w: 731,
    h: 912,
    logo: { x: 72, y: 28, w: 205 },
    init: { x: 41, y: 195, w: 274, fs: 12.8 },
    divider: { x: 315, y: 57, h: 137 },
    tag: { x: 347, y: 64, titleFs: 24, titleLh: 1.125, barMt: 9, textFs: 15.3, textLh: 1.31, textMt: 20 },
    photo: { x: -60, y: 274, w: 850 },
    swoosh: 1.3,
    hexes: [
      { cx: 675, cy: 100, r: 26.5 },
      { cx: 632, cy: 145, r: 22 },
    ],
  },
};

const hexPath = ({ cx, cy, r }: Hex) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ") + " Z";

/**
 * Brand panel shared by the auth screens.
 *
 * Below `lg` it is a normal flow layout (brand block, then the photo) so
 * nothing can overlap. At `lg` the pieces are placed on the design grid
 * described by `layouts[variant]`.
 */
export default function AuthHero({ variant }: { variant: AuthVariant }) {
  const { tagline } = siteConfig;
  const L = layouts[variant];
  const px = (n: number) => `${n}px`;

  const vars = {
    "--logo-x": px(L.logo.x),
    "--logo-y": px(L.logo.y),
    "--logo-w": px(L.logo.w),
    "--init-x": px(L.init.x),
    "--init-y": px(L.init.y),
    "--init-w": px(L.init.w),
    "--init-fs": px(L.init.fs),
    "--div-x": px(L.divider.x),
    "--div-y": px(L.divider.y),
    "--div-h": px(L.divider.h),
    "--tag-x": px(L.tag.x),
    "--tag-y": px(L.tag.y),
    "--title-fs": px(L.tag.titleFs),
    "--title-lh": L.tag.titleLh,
    "--bar-mt": px(L.tag.barMt),
    "--text-fs": px(L.tag.textFs),
    "--text-lh": L.tag.textLh,
    "--text-mt": px(L.tag.textMt),
    "--ph-x": px(L.photo.x),
    "--ph-y": px(L.photo.y),
    "--ph-w": px(L.photo.w),
    "--sw-w": px(804 * L.swoosh),
    "--sw-h": px(794 * L.swoosh),
  } as CSSProperties;

  return (
    <section
      aria-label={siteConfig.brand}
      style={vars}
      className="relative flex min-w-0 flex-col overflow-hidden bg-[linear-gradient(100deg,#fff7f5_0%,#fef4f1_60%,#fcebe3_100%)] lg:block"
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
            className="h-auto w-full lg:absolute lg:left-[var(--logo-x)] lg:top-[var(--logo-y)] lg:z-10 lg:w-[var(--logo-w)]"
          />
          <div className="mt-1 flex w-full items-center gap-1.5 lg:absolute lg:left-[var(--init-x)] lg:top-[var(--init-y)] lg:z-10 lg:mt-0 lg:w-[var(--init-w)] lg:gap-2">
            <span className="h-px min-w-1 flex-1 bg-navy-ink/70" />
            <span className="whitespace-nowrap text-[10.5px] font-semibold text-navy-ink sm:text-[12px] lg:text-[length:var(--init-fs)]">
              {siteConfig.initiative}
            </span>
            <span className="h-px min-w-1 flex-1 bg-navy-ink/70" />
          </div>
        </div>

        <span
          aria-hidden
          className="hidden w-px bg-navy-ink/70 lg:absolute lg:left-[var(--div-x)] lg:top-[var(--div-y)] lg:z-10 lg:block lg:h-[var(--div-h)]"
        />

        <div className="lg:absolute lg:left-[var(--tag-x)] lg:top-[var(--tag-y)] lg:z-10">
          <p className="text-[26px] font-bold leading-[1.15] tracking-[-0.01em] text-navy-ink sm:text-[30px] lg:text-[length:var(--title-fs)] lg:leading-[var(--title-lh)]">
            {tagline.title[0]} <br className="hidden sm:inline" />
            {tagline.title[1]}
          </p>
          <span className="mt-3 block h-[5px] w-[74px] rounded-full bg-gold lg:mt-[var(--bar-mt)] lg:w-[59px]" />
          <p className="mt-3 max-w-[300px] text-[15px] font-medium leading-snug text-navy-ink sm:text-[17px] lg:mt-[var(--text-mt)] lg:max-w-none lg:text-[length:var(--text-fs)] lg:leading-[var(--text-lh)]">
            {tagline.text[0]} <br className="hidden sm:inline" />
            {tagline.text[1]}
          </p>
        </div>
      </div>

      {/* Photo — fades into the sky at the top; scales with the panel */}
      <div className="relative mt-3 aspect-[4/3] w-full [mask-image:linear-gradient(to_bottom,transparent_0,#000_28%)] lg:absolute lg:left-[var(--ph-x)] lg:top-[var(--ph-y)] lg:mt-0 lg:w-[var(--ph-w)] lg:[mask-image:linear-gradient(to_bottom,transparent_0,#000_32%)]">
        <Image
          src="/images/new.png"
          alt="A Moksha Sewa caregiver comforting an elderly woman beside the Ganga at sunrise"
          fill
          priority
          quality={90}
          sizes="(min-width: 1024px) 1200px, (min-width: 640px) 720px, 100vw"
          className="object-cover object-top [filter:saturate(0.95)_brightness(1.01)]"
        />
      </div>

      {/* Bottom-left swoosh */}
      <svg
        aria-hidden
        viewBox="0 0 804 794"
        preserveAspectRatio="xMinYMax slice"
        className="pointer-events-none absolute inset-0 h-full w-full lg:inset-auto lg:bottom-0 lg:left-0 lg:h-[var(--sw-h)] lg:w-[var(--sw-w)]"
      >
        <defs>
          <linearGradient id={`swooshNavy-${variant}`} x1="0" y1="0" x2="1" y2="1">
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
          fill={`url(#swooshNavy-${variant})`}
        />
      </svg>

      {/* Decorative hexagons (pointy-top) */}
      <svg
        aria-hidden
        viewBox={`0 0 ${L.w} ${L.h}`}
        className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
        fill="none"
        stroke="#eab833"
        strokeWidth="2.6"
        strokeLinejoin="round"
      >
        {L.hexes.map((h) => (
          <path key={`${h.cx}-${h.cy}`} d={hexPath(h)} />
        ))}
      </svg>
    </section>
  );
}
