import type { ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** 20×20 outline icons for the dashboard sidebar (white line art). */
function I({ children, ...rest }: P & { children: ReactNode }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: P) => (
  <I {...p}>
    <path
      d="M2.6 9.4 10 2.9l7.4 6.5h-2.2v7.1h-3.6v-4.4H8.4v4.4H4.8V9.4H2.6Z"
      fill="currentColor"
      strokeWidth={1.2}
    />
  </I>
);

export const OperationsIcon = (p: P) => (
  <I {...p}>
    <rect x="3" y="1.8" width="14" height="16.4" rx="2.6" />
    <path d="M6.3 5.4h7.4M6.3 8h7.4M6.3 10.6h7.4" />
    <circle cx="7" cy="14.4" r=".9" fill="currentColor" stroke="none" />
    <circle cx="13" cy="14.4" r=".9" fill="currentColor" stroke="none" />
  </I>
);

export const LeadsIcon = (p: P) => (
  <I {...p}>
    <circle cx="7.4" cy="6.2" r="3.3" />
    <path d="M1.6 17.4c.3-3.6 2.7-5.6 5.8-5.6s5.5 2 5.8 5.6H1.6Z" />
    <path d="M12.6 3.4a3 3 0 1 1 .4 5.6M14.6 9.8c2.1.6 3.5 2.3 3.8 5" />
  </I>
);

export const CasesIcon = (p: P) => (
  <I {...p}>
    <path d="M11 18.2H4.4a2 2 0 0 1-2-2V3.8a2 2 0 0 1 2-2h9.2a2 2 0 0 1 2 2v5" />
    <path d="M5.5 13.6c1.6-.2 2.4-1.8 3.8-1.8M5 6.4h6.6" />
    <path d="m14.6 10.4 3.8 3.8-3.8 3.8-3.8-3.8 3.8-3.8Z" />
    <circle cx="14.6" cy="14.2" r=".8" fill="currentColor" stroke="none" />
  </I>
);

export const CommunicationIcon = (p: P) => (
  <I {...p}>
    <rect x="1.8" y="2.6" width="13.4" height="9.8" rx="2" />
    <path d="M17.2 6.6h.2a1.4 1.4 0 0 1 1.4 1.4v6.4a1.4 1.4 0 0 1-1.4 1.4h-.8v2.4l-2.8-2.4H8.6a1.4 1.4 0 0 1-1.4-1.4v-.2" />
  </I>
);

export const FinanceIcon = (p: P) => (
  <I {...p}>
    <path d="M3.6 7.6h12.8v10.6H3.6zM2.6 7.6h14.8" />
    <path d="M10 18.2V3.2M7.4 5.6 10 3l2.6 2.6" />
    <path d="M6.2 10.4v5M13.8 10.4v5" />
  </I>
);

export const ReportsIcon = (p: P) => (
  <I {...p}>
    <path d="M2 18.4h16.4" />
    <path d="M3.6 16v-2.4M6.4 16v-4.2M9.2 16V10M12 16V8.2M14.8 16V6.4M17.4 16V4.8" />
    <path d="M2.6 9.4 9 5.4l3 1.6 5.6-5" />
    <path d="M14.4 2h3.4v3.2" />
  </I>
);

export const TeamIcon = (p: P) => (
  <I {...p}>
    <circle cx="7.4" cy="6" r="3.2" />
    <path d="M1.6 17.6c.2-3.8 2.6-5.8 5.8-5.8 3.2 0 5.6 2 5.8 5.8H1.6Z" />
    <circle cx="13.8" cy="7" r="2.4" />
    <path d="M14.6 11.6c2.2.4 3.6 2.2 3.8 5" />
  </I>
);

export const GearIcon = (p: P) => (
  <I {...p}>
    <path d="M8.5 1.8h3l.5 2.3 1.5.8 2.2-.8 1.5 2.6-1.7 1.6v1.6l1.7 1.6-1.5 2.6-2.2-.8-1.5.8-.5 2.3h-3l-.5-2.3-1.5-.8-2.2.8-1.5-2.6 1.7-1.6V8.3L2.8 6.7l1.5-2.6 2.2.8L8 4.1l.5-2.3Z" />
    <circle cx="10" cy="10" r="2.6" />
  </I>
);

export const LearningIcon = (p: P) => (
  <I {...p}>
    <path d="M10 2.6 1.6 6.4 10 10.2l8.4-3.8L10 2.6Z" />
    <path d="M4.6 8v4.6c0 1.6 2.4 3 5.4 3s5.4-1.4 5.4-3V8" />
    <path d="M4.6 11.4 10 13.8l5.4-2.4" />
    <path d="M18.4 6.4v4.4" />
  </I>
);

export const GovernanceIcon = (p: P) => (
  <I {...p}>
    <path d="M3.4 4.6 10 1.8l6.6 2.8v12.6L10 18.4l-6.6-1.2V4.6Z" />
    <path d="M10 1.8v16.6M3.4 4.6 10 6l6.6-1.4" />
    <path d="M6.6 7.4v8.6M13.4 7.4v8.6" />
  </I>
);

export const HelpIcon = (p: P) => (
  <I {...p}>
    <circle cx="10" cy="10" r="8.2" />
    <path d="M7.6 7.6a2.4 2.4 0 1 1 3.4 2.2c-.7.3-1 .8-1 1.6v.6" />
    <circle cx="10" cy="14.6" r=".9" fill="currentColor" stroke="none" />
  </I>
);

export const AdminIcon = (p: P) => (
  <I {...p}>
    <rect x="1.8" y="3" width="16.4" height="14" rx="3" />
    <path d="M1.8 7.2h16.4M5.4 10.4h9.2M5.4 13.4h9.2" />
    <path d="M8 13.4v3.6M12 13.4v3.6" />
  </I>
);

export const ChevronRightIcon = (p: P) => (
  <svg
    width={6}
    height={10}
    viewBox="0 0 6 10"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...p}
  >
    <path d="m1.2 1.2 3.6 3.8-3.6 3.8" />
  </svg>
);
