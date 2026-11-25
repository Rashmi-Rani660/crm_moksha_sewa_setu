import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

/** 24×24 line icon base for the dashboard main area. */
function I({ children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ------------------------------ header ------------------------------ */

export const MenuIcon = (p: IconProps) => (
  <I strokeWidth={2.4} {...p}>
    <path d="M3 5.5h18M3 12h18M3 18.5h18" />
  </I>
);

export const SearchIcon = (p: IconProps) => (
  <I strokeWidth={2.3} {...p}>
    <circle cx="10.5" cy="10.5" r="7" />
    <path d="m16 16 5 5" />
  </I>
);

export const MagicIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <path d="m3 21 10.5-10.5M11.4 8.4l4.2 4.2M14.5 5.6l2-3.6 1.4 3.4 3.6.4-2.8 2.4.8 3.6-3.2-1.9" />
    <path d="M5 4.5v3M3.5 6h3" />
  </I>
);

export const BellIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 2H4.2l1.8-2Z" />
    <path d="M10 21h4" />
  </I>
);

export const CalendarIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <rect x="3" y="4.5" width="18" height="16.5" rx="2.2" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4M8 13.5h0M12 13.5h0M16 13.5h0M8 17h0M12 17h0M16 17h0" strokeWidth={2.4} />
  </I>
);

export const PinIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path
      fill="currentColor"
      d="M12 1.5a8 8 0 0 0-8 8c0 5.6 6.6 12 7.2 12.6a1.2 1.2 0 0 0 1.6 0C13.4 21.5 20 15.1 20 9.5a8 8 0 0 0-8-8Zm0 11.3a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Z"
    />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <I strokeWidth={2.8} {...p}>
    <path d="m5.5 9 6.5 6.5L18.5 9" />
  </I>
);

export const ChevronRightIcon = (p: IconProps) => (
  <I strokeWidth={2.6} {...p}>
    <path d="m9 5.5 6.5 6.5L9 18.5" />
  </I>
);

export const ArrowRightIcon = (p: IconProps) => (
  <I strokeWidth={2.3} {...p}>
    <path d="M4 12h15.5M13.5 6l6 6-6 6" />
  </I>
);

export const ArrowUpIcon = (p: IconProps) => (
  <I strokeWidth={2.6} {...p}>
    <path d="M12 20.5V4M5.5 10.5 12 4l6.5 6.5" />
  </I>
);

export const ArrowDownIcon = (p: IconProps) => (
  <I strokeWidth={2.6} {...p}>
    <path d="M12 3.5V20M5.5 13.5 12 20l6.5-6.5" />
  </I>
);

export const CheckIcon = (p: IconProps) => (
  <I strokeWidth={2.8} {...p}>
    <path d="m4.5 12.5 4.8 4.8L19.5 7" />
  </I>
);

export const CheckCircleIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="m7.6 12.2 3 3 5.8-6" />
  </I>
);

/* --------------------------- critical alerts --------------------------- */

export const AlertTriangleFillIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path fill="currentColor" d="M10.3 2.9a2 2 0 0 1 3.4 0l9.2 16.2a2 2 0 0 1-1.7 3H2.8a2 2 0 0 1-1.7-3L10.3 2.9Z" />
    <path stroke="#fff" strokeWidth="2.4" strokeLinecap="round" d="M12 8.6v6.2" />
    <circle cx="12" cy="18.2" r="1.3" fill="#fff" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 6.5V12l-2.6 4" />
  </I>
);

export const ExclamationFillIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <circle cx="12" cy="12" r="11" fill="currentColor" />
    <path stroke="#fff" strokeWidth="2.6" strokeLinecap="round" d="M12 6.2v7.2" />
    <circle cx="12" cy="17.4" r="1.5" fill="#fff" />
  </svg>
);

export const PhoneFillIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...p}>
    <path
      fill="currentColor"
      d="M6.6 2.4c.7-.3 1.5 0 1.9.6l2 3.3c.4.7.3 1.5-.3 2L8.6 9.7a12 12 0 0 0 5.7 5.7l1.4-1.6c.5-.6 1.3-.7 2-.3l3.3 2c.6.4.9 1.2.6 1.9l-.8 2.1c-.4 1-1.4 1.6-2.5 1.5C9.7 20.3 3.7 14.3 3 5.7c-.1-1.1.5-2.1 1.5-2.5l2.1-.8Z"
    />
  </svg>
);

export const IntegrationIcon = (p: IconProps) => (
  <I strokeWidth={2.2} {...p}>
    <path d="M3 20.5c2.5 0 3.2-1.6 4.4-4.4l1.8-4.4c1.2-2.8 2-4.2 4.6-4.2h3.2" />
    <path d="m15 4.2 3.6 3.3-3.6 3.3" />
    <path d="M6.2 20.5c2.6 0 3.3-1.6 4.5-4.4l.6-1.4" />
  </I>
);

/* ----------------------------- snapshot ----------------------------- */

export const ChatIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v6a3.5 3.5 0 0 1-3.5 3.5H10l-4.6 3.8V16A3.5 3.5 0 0 1 4 13.2V6.5Z" />
  </I>
);

export const ChatCircleIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 3a9 9 0 1 1-4.6 16.7L3 21l1.3-4.3A9 9 0 0 1 12 3Z" />
    <circle cx="12" cy="12" r="3.6" />
  </I>
);

export const VanIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M2.5 6.5h12v9h-12zM14.5 9.5h4l3 3.2v2.8h-7" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17.5" cy="17.5" r="1.8" />
    <path d="M5 9.5h3" />
  </I>
);

export const DiamondIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" />
    <path d="M12 2.5v3" />
  </I>
);

export const PeopleIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="9" cy="8" r="3.6" />
    <path d="M2.5 20c.4-3.9 3-6.2 6.5-6.2s6.1 2.3 6.5 6.2" />
    <path d="M15.2 4.6a3.4 3.4 0 0 1 0 6.6M17.2 13.9c2.4.7 4 2.8 4.3 5.6" />
  </I>
);

export const PeopleGroupIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="9" cy="8.5" r="3.6" />
    <circle cx="16.6" cy="9.5" r="2.8" />
    <path d="M2 20.5c.3-4 3-6.4 7-6.4s6.6 2.4 7 6.4H2Z" />
    <path d="M16.5 14.2c3 .2 5 2.4 5.4 5.8" />
  </I>
);

export const WarningIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <path d="M10.3 3.4a2 2 0 0 1 3.4 0l8.4 14.8a2 2 0 0 1-1.7 3H3.6a2 2 0 0 1-1.7-3l8.4-14.8Z" />
    <path d="M12 9.2v5" />
    <circle cx="12" cy="17.4" r=".6" fill="currentColor" />
  </I>
);

export const LocationIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 21.5s-7-6.2-7-11.8a7 7 0 0 1 14 0c0 5.6-7 11.8-7 11.8Z" />
    <circle cx="12" cy="9.8" r="2.6" />
  </I>
);

/* --------------------------- communication --------------------------- */

export const WhatsAppIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L2.8 21.2l4.6-1.2A9.2 9.2 0 1 0 12 2.8Z" />
    <path d="M8.6 7.6c.3-.4.8-.5 1-.1l1 2.1c.1.3 0 .6-.2.8l-.6.6a6 6 0 0 0 3.2 3.2l.6-.6c.2-.2.5-.3.8-.2l2.1 1c.4.2.3.7-.1 1-1 .9-2.2 1.2-3.5.6a10 10 0 0 1-4.9-4.9c-.6-1.3-.3-2.5.6-3.5Z" strokeWidth={1.4} />
  </I>
);

export const MailIcon = (p: IconProps) => (
  <I {...p}>
    <rect x="3" y="3.5" width="18" height="17" rx="1.5" />
    <path d="m3 4 9 8.5L21 4" />
  </I>
);

export const BubbleIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 3c5 0 9 3.6 9 8s-4 8-9 8c-1 0-2-.1-2.9-.4L5 21l.8-4.1A7.7 7.7 0 0 1 3 11c0-4.4 4-8 9-8Z" />
  </I>
);

export const WebFormIcon = (p: IconProps) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <circle cx="12" cy="12" r="4.2" />
    <path d="M12 2.5v5.3M12 16.2v5.3M2.5 12h5.3M16.2 12h5.3M5.3 5.3l3.7 3.7M15 15l3.7 3.7M18.7 5.3 15 9M9 15l-3.7 3.7" strokeWidth={1.4} />
  </I>
);

export const SocialIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <circle cx="7" cy="14.5" r="4" />
    <circle cx="16.5" cy="6.5" r="3" />
    <circle cx="17" cy="17" r="3" />
  </I>
);

/* ----------------------------- approvals ----------------------------- */

export const DocIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8L14 2.5Z" />
    <path d="M14 2.5V8h5.5" />
    <path d="M9 15.5c1-1.5 2-.2 3-1.4s1.6-.4 2.8.6" strokeWidth={1.4} />
  </I>
);

export const RosetteIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 2.5 14.3 4l2.7-.2 1.2 2.5 2.4 1.3-.2 2.7L22 12.6l-1.6 2.2.2 2.7-2.4 1.2-1.2 2.5-2.7-.2L12 22.5 9.7 21l-2.7.2-1.2-2.5-2.4-1.3.2-2.7L2 12.4l1.6-2.2-.2-2.7 2.4-1.2L7 3.8l2.7.2L12 2.5Z" />
    <path d="m8.6 12.2 2.4 2.4 4.4-4.6" strokeWidth={1.6} />
  </I>
);

export const FlagIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M5 21.5V3.2c4.5-1.6 7 2.2 14 .3v9.8c-6.6 2-9.2-1.8-14-.3" />
  </I>
);

/* ----------------------------- system health ----------------------------- */

export const BackupIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z" />
    <path d="M9 12.5a3 3 0 1 0 1-2.3M9.6 8.6l.4 1.7-1.7.4" strokeWidth={1.5} />
  </I>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <path d="M12 2.5 20 5.5v6.2c0 4.9-3.4 8.6-8 10-4.6-1.4-8-5.1-8-10V5.5l8-3Z" />
    <path d="m8.2 11.8 2.8 2.8 5-5.2" />
  </I>
);

export const PlugIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <path d="M14.5 3.5 20.5 9.5 11 19a3 3 0 0 1-4.2 0L5 17.2a3 3 0 0 1 0-4.2L14.5 3.5Z" />
    <path d="m5.8 18.2-3.3 3.3M15.5 8.5h.01" />
  </I>
);

export const PulseIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <path d="M2 13h4.2l2.6-6 3.6 11 3-8h6.6" />
  </I>
);

export const AutomationIcon = (p: IconProps) => (
  <I {...p}>
    <path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7L12 2.2Z" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M12 7.4v1.8M12 14.8v1.8M7.4 12h1.8M14.8 12h1.8" strokeWidth={1.4} />
  </I>
);

/* ----------------------------- team ----------------------------- */

export const StaffIcon = (p: IconProps) => (
  <I strokeWidth={1.7} {...p}>
    <circle cx="12" cy="6.5" r="3" />
    <circle cx="5.5" cy="8.5" r="2.5" />
    <circle cx="18.5" cy="8.5" r="2.5" />
    <path d="M6.2 19.5c0-3.6 2.6-6.4 5.8-6.4s5.8 2.8 5.8 6.4H6.2Z" />
    <path d="M1.5 18.5c0-2.8 1.7-4.8 4-4.8.8 0 1.5.2 2 .6M22.5 18.5c0-2.8-1.7-4.8-4-4.8-.8 0-1.5.2-2 .6" />
  </I>
);

export const VolunteersIcon = (p: IconProps) => (
  <I strokeWidth={1.7} {...p}>
    <circle cx="12" cy="6.5" r="3.4" />
    <path d="M6.2 21c0-4.2 2.6-7 5.8-7s5.8 2.8 5.8 7H6.2Z" />
    <path d="M5 4.6a2.6 2.6 0 0 0 .4 5M19 4.6a2.6 2.6 0 0 1-.4 5M1.5 18c0-2.6 1.4-4.6 3.6-5M22.5 18c0-2.6-1.4-4.6-3.6-5" />
  </I>
);

export const TruckIcon = (p: IconProps) => (
  <I strokeWidth={1.7} {...p}>
    <path d="M1.5 5.5h13v11h-13zM14.5 9h4.3l3.7 4v3.5h-8" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </I>
);

export const GradCapIcon = (p: IconProps) => (
  <I strokeWidth={1.7} {...p}>
    <path d="M12 3.5 1.5 8.5 12 13.5l10.5-5L12 3.5Z" />
    <path d="M5.5 10.5v6c0 1.7 2.9 3.5 6.5 3.5s6.5-1.8 6.5-3.5v-6" />
    <path d="M22.5 8.5v7" />
  </I>
);

/* ----------------------------- account ----------------------------- */

export const LogoutIcon = (p: IconProps) => (
  <I strokeWidth={2} {...p}>
    <path d="M9.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4.5" />
    <path d="m16 16.5 4.5-4.5L16 7.5M20.5 12H9" />
  </I>
);
