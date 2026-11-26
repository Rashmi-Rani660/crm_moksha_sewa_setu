"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import { CalendarDays, ChevronDown, RefreshCw } from "lucide-react";
import { Box, useDashboardRole } from "@/components/dashboards/canvas";
import { homeHref, sectionHref } from "@/components/dashboards/shells";
import { Ico, PinSolid, Select, Today, formatDay } from "@/components/dashboards/ui";

type Spec = {
  title: string;
  /** Title / links block position. */
  x: number;
  titleY: number;
  titleSize: number;
  linksY: number;
  linksSize: number;
  /** Section links; `to` = section label, none = this dashboard. */
  links: { label: string; to?: string }[];
  /** Date, centre and refresh controls: [x, width]. */
  date: [number, number];
  centre: [number, number];
  refresh: [number, number];
  controlsY: number;
  controlsH: number;
  controlSize: number;
  centres: readonly string[];
  defaultCentre: string;
};

/** Dashboard title, section links and the date / centre / refresh controls. */
export default function PageHeader({ spec }: { spec: Spec }) {
  const [centre, setCentre] = useState(spec.defaultCentre);
  const role = useDashboardRole();
  const y = spec.controlsY;
  const h = spec.controlsH;

  return (
    <>
      <Box at={[spec.x, spec.titleY, 700, spec.linksY - spec.titleY + 24]} as="div">
        <h1 style={{ fontSize: spec.titleSize }} className="absolute left-0 top-0 whitespace-nowrap font-bold leading-none tracking-[-0.6px] text-[#0b0c36]">
          {spec.title}
        </h1>
        <nav
          aria-label="Dashboard sections"
          style={{ top: spec.linksY - spec.titleY, fontSize: spec.linksSize }}
          className="absolute left-0 flex items-center whitespace-nowrap font-semibold leading-none tracking-[-0.3px] text-[#141a4a]"
        >
          {spec.links.map((l, i) => (
            <Fragment key={l.label}>
              {i > 0 && <span className="mx-[13px] h-[16px] w-[1.5px] bg-[#2b2f4a]" />}
              <Link
                href={l.to ? sectionHref(role, l.to) : homeHref(role)}
                aria-current={l.to ? undefined : "page"}
                className="hover:text-[#2320c4] hover:underline"
              >
                {l.label}
              </Link>
            </Fragment>
          ))}
        </nav>
      </Box>

      <Box at={[spec.date[0], y, spec.date[1], h]} as="div">
        <DateSelect size={spec.controlSize} />
      </Box>
      <Box at={[spec.centre[0], y, spec.centre[1], h]} as="div">
        <Select
          label="Centre"
          value={centre}
          options={spec.centres}
          onChange={setCentre}
          size={spec.controlSize}
          icon={<span className="mr-[12px] shrink-0"><PinSolid size={22} /></span>}
          className="h-full [&>button]:rounded-[9px] [&>button]:pl-[16px] [&>button]:pr-[14px]"
        />
      </Box>
      <Box at={[spec.refresh[0], y, spec.refresh[1], h]} as="div">
        <RefreshButton size={spec.controlSize} />
      </Box>
    </>
  );
}

function DateSelect({ size }: { size: number }) {
  const input = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState("");
  const label = picked ? formatDay(new Date(`${picked}T00:00`)) : <Today />;

  return (
    <div className="relative h-full">
      <button
        type="button"
        aria-label="Choose date"
        onClick={() => {
          try {
            input.current?.showPicker();
          } catch {
            input.current?.focus();
          }
        }}
        style={{ fontSize: size }}
        className="flex h-full w-full items-center whitespace-nowrap rounded-[9px] border border-[#d6dbe6] bg-white pl-[14px] pr-[12px] font-semibold leading-none tracking-[-0.3px] text-[#0b0c36] shadow-[0_1px_4px_rgba(30,50,110,0.1)]"
      >
        <Ico icon={CalendarDays} color="#0b0c36" size={22} stroke={2.1} className="mr-[11px]" />
        <span className="min-w-0 flex-1 truncate pt-[1px] text-left">{label}</span>
        <ChevronDown strokeWidth={2.4} className="ml-[6px] h-[20px] w-[20px] shrink-0" />
      </button>
      <input
        ref={input}
        type="date"
        tabIndex={-1}
        aria-hidden
        value={picked}
        onChange={(e) => setPicked(e.target.value)}
        className="pointer-events-none absolute bottom-0 left-0 h-0 w-full opacity-0"
      />
    </div>
  );
}

function RefreshButton({ size }: { size: number }) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        setSpinning(true);
        router.refresh(); // TODO: refetch dashboard data once it comes from the API
        setTimeout(() => setSpinning(false), 700);
      }}
      style={{ fontSize: size }}
      className="flex h-full w-full items-center justify-center rounded-[9px] border-[1.5px] border-[#6d7fe8] bg-[#f3f7ff] font-semibold leading-none tracking-[-0.3px] text-[#2320c4] shadow-[0_1px_4px_rgba(30,50,110,0.1)] hover:bg-[#e9f0ff]"
    >
      <RefreshCw strokeWidth={2.4} className={`mr-[10px] h-[22px] w-[22px] ${spinning ? "animate-spin" : ""}`} />
      <span className="pt-[1px]">Refresh</span>
    </button>
  );
}
