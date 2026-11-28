"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Box, DashboardCanvas } from "@/components/dashboards/canvas";
import EncodencyBadge from "@/components/ui/EncodencyBadge";
import { siteConfig } from "@/lib/config/site";
import { userScreenPicker, type UserScreenCode } from "@/components/dashboards/user/routes";

const SB = 221;
export const userInk = "text-[#1a1d36]";

export const userPrimaryBtn =
  "inline-flex h-[28px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] px-[11px] pt-px text-[13.8px] font-normal text-white shadow-[0_1px_3px_rgba(9,60,221,0.3)] hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[linear-gradient(90deg,#95b6f2_0%,#95b6f2_100%)] disabled:shadow-none disabled:hover:brightness-100";

export const userOutlineBtn =
  "inline-flex h-[28px] shrink-0 items-center justify-center whitespace-nowrap rounded-[6px] border border-[#a9bddf] bg-white px-[10px] pt-px text-[13.8px] font-normal text-[#1e43a8] hover:bg-[#f1f5fd]";

export const userInputCls =
  "h-[31px] w-full rounded-[6px] border border-[#c9d2e0] bg-white px-[10px] text-[14px] text-[#1a1d36] outline-none placeholder:text-[#6b7488] focus:border-[#5b7fe0]";

export const userTextareaCls =
  "w-full rounded-[6px] border border-[#c9d2e0] bg-white p-[9px] text-[14px] text-[#1a1d36] outline-none placeholder:text-[#6b7488] focus:border-[#5b7fe0]";

export function UserFrame({ active, children }: { active?: string; children: ReactNode }) {
  return (
    <DashboardCanvas role="user" active={active}>
      <Box at={[SB, 60, 1600 - SB, 841]} as="div" fit="fluid" className="flex flex-col lg:px-[18px] lg:pt-[8px]">
        <div className="flex min-h-0 flex-1 flex-col gap-3 lg:gap-0">{children}</div>
        <footer className="mt-4 flex flex-col items-center gap-2 border-t border-[#e3e7ef] pt-3 text-[13px] font-semibold text-[#1d1f33] sm:flex-row sm:justify-between lg:mt-0 lg:h-[40px] lg:gap-0 lg:pt-0 lg:text-[14px]">
          <p className="whitespace-nowrap">
            © {siteConfig.copyrightYear} {siteConfig.trust}
            <span className="mx-[12px] inline-block h-[16px] w-[1.5px] translate-y-[3px] bg-[#3a3d55]" />
            <b className="font-bold text-[#0b0c36]">{siteConfig.name} CRM v1.0</b>
          </p>
          <p className="flex items-center whitespace-nowrap">
            Designed, Developed &amp; Maintained by
            <EncodencyBadge className="ml-[12px] h-[28px] min-w-[132px] px-2.5" nameClassName="text-[16px]" legalClassName="text-[7px]" sloganClassName="text-[5.5px]" />
          </p>
        </footer>
      </Box>
    </DashboardCanvas>
  );
}

export function UserHeader({ code, title }: { code: UserScreenCode; title: string }) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 lg:h-[48px] lg:flex-row lg:items-start lg:gap-[12px]">
      <div className="min-w-0">
        <h1 className={`text-[19px] font-medium leading-tight tracking-[-0.2px] lg:whitespace-nowrap lg:text-[21.5px] ${userInk}`}>
          {title}
        </h1>
        <p className={`mt-[2px] text-[13.8px] ${userInk}`}>User 07 / FY 2026–27 / Ghaziabad • My authorised work</p>
      </div>
      <div className="flex flex-wrap items-center gap-[10px] lg:ml-auto lg:mt-[4px] lg:flex-nowrap">
        <label className="relative block h-[30px] w-full sm:w-[328px]">
          <span className="sr-only">Open screen</span>
          <select
            value={code}
            onChange={(e) => {
              const next = userScreenPicker.find((s) => s.code === e.target.value);
              if (next) router.push(next.href);
            }}
            className={`h-full w-full cursor-pointer appearance-none truncate rounded-[6px] border border-[#c9d2e0] bg-white pl-[12px] pr-[30px] pt-px text-[14px] shadow-[0_1px_2px_rgba(20,45,90,0.06)] outline-none focus:border-[#5b7fe0] ${userInk}`}
          >
            {userScreenPicker.map((s) => (
              <option key={s.code} value={s.code}>
                {s.title}
              </option>
            ))}
          </select>
          <ChevronDown strokeWidth={2.6} className="pointer-events-none absolute right-[9px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#1a1d36]" aria-hidden />
        </label>
      </div>
    </div>
  );
}

export type UserKpiTone = "blue" | "orange" | "red" | "green" | "purple";
export type UserKpi = { value: string; label: string; tone: UserKpiTone; valueRed?: boolean };

const kpiStyles: Record<UserKpiTone, { bg: string; border: string }> = {
  blue: { bg: "linear-gradient(180deg,#ecf5fe 0%,#e3effc 100%)", border: "#c6d9ef" },
  orange: { bg: "linear-gradient(180deg,#fff7e7 0%,#fff1d9 100%)", border: "#f3dcaf" },
  red: { bg: "linear-gradient(180deg,#fff0ef 0%,#ffe7e7 100%)", border: "#f2c6c6" },
  green: { bg: "linear-gradient(180deg,#ecfaee 0%,#e2f5e6 100%)", border: "#c4e4cb" },
  purple: { bg: "linear-gradient(180deg,#f4f0fd 0%,#eee8fb 100%)", border: "#dacff4" },
};

export function UserKpiRow({ items }: { items: readonly [UserKpi, UserKpi, UserKpi, UserKpi, UserKpi, UserKpi] }) {
  return (
    <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 lg:mt-[6px] lg:h-[68px] lg:grid-cols-6 lg:gap-[11px]">
      {items.map((k) => {
        const s = kpiStyles[k.tone];
        return (
          <div
            key={`${k.value}-${k.label}`}
            style={{ background: s.bg, borderColor: s.border }}
            className="flex min-h-[64px] min-w-0 flex-col justify-center rounded-[8px] border px-[14px] py-[8px] shadow-[0_1px_3px_rgba(20,45,90,0.05)]"
          >
            <p className={`truncate text-[24px] font-medium leading-none tracking-[-0.3px] ${k.valueRed ? "text-[#b42318]" : userInk}`}>
              {k.value}
            </p>
            <p className="mt-[4px] truncate text-[14px] leading-[16px] text-[#4a5468]">{k.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export function UserPanel({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section
      aria-label={title}
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[7px] border border-[#d6deea] bg-[#f8fbff] shadow-[0_1px_4px_rgba(20,45,90,0.08)] ${className}`}
    >
      <h2 className={`flex h-[34px] shrink-0 items-center border-b border-[#e0e8f2] bg-[#fbfcfe] px-[12px] pt-px text-[15.6px] font-semibold ${userInk}`}>
        {title}
      </h2>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain px-[12px] pb-[10px] pt-[8px] [scrollbar-width:thin]">{children}</div>
    </section>
  );
}

export type UserPillTone = "red" | "amber" | "green" | "blue" | "gray";

const pillTones: Record<UserPillTone, string> = {
  red: "bg-[#fde0e0] text-[#b42318]",
  amber: "bg-[#ffeabd] text-[#8a5b00]",
  green: "bg-[#d5f3d7] text-[#247537]",
  blue: "bg-[#dde9fd] text-[#1d4fb8]",
  gray: "bg-[#e9ecf2] text-[#3b4256]",
};

export function UserPill({ tone, children }: { tone?: UserPillTone; children: string }) {
  const autoTone: UserPillTone =
    tone ??
    (/^(high|overdue|urgent|pending)$/.test(children.toLowerCase()) && children.toLowerCase() !== "pending"
      ? "red"
      : /^(accepted|completed|approved|allocated|available|human|human active)$/.test(children.toLowerCase())
        ? "green"
        : /^(to do|unread|scheduled|ai|open)$/.test(children.toLowerCase())
          ? "blue"
          : "amber");
  return (
    <span className={`inline-flex h-[19px] items-center whitespace-nowrap rounded-full px-[9px] pt-px text-[12.6px] font-normal leading-none ${pillTones[autoTone]}`}>
      {children}
    </span>
  );
}

export function UserKVList({ rows }: { rows: readonly (readonly [string, ReactNode])[] }) {
  return (
    <dl>
      {rows.map(([k, v]) => (
        <div key={k} className={`flex min-h-[26px] items-center gap-[12px] border-b border-[#e1e7f0] py-[2px] text-[14.2px] ${userInk}`}>
          <dt className="min-w-0 flex-1 truncate pt-px">{k}</dt>
          <dd className="shrink-0 whitespace-nowrap pt-px">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function UserFlowSteps({ steps }: { steps: readonly string[] }) {
  return (
    <div className="flex items-center pt-[2px]">
      {steps.map((step, idx) => (
        <div key={step} className="contents">
          {idx > 0 && (
            <span aria-hidden className="w-[18px] shrink-0 text-center text-[13px] text-[#2b3a67]">
              →
            </span>
          )}
          <div
            className={`flex h-[42px] min-w-0 flex-1 items-center justify-center rounded-[6px] border px-[6px] text-center text-[13.8px] font-medium ${userInk} ${
              idx % 2 === 0
                ? "border-[#c9d8ee] bg-[linear-gradient(180deg,#f4f9ff_0%,#e6f0fc_100%)]"
                : "border-[#cfe4d6] bg-[linear-gradient(180deg,#f7fdf8_0%,#eaf6ee_100%)]"
            }`}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

export function UserTabs<T extends string>({
  tabs,
  value,
  onChange,
  className = "",
}: {
  tabs: readonly T[];
  value: T;
  onChange: (t: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={`flex overflow-x-auto rounded-[6px] border border-[#d9e1eb] bg-white lg:mt-[6px] lg:h-[36px] lg:shrink-0 ${className}`}
    >
      {tabs.map((t, i) => {
        const on = t === value;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t)}
            className={`h-[34px] min-w-[140px] flex-1 whitespace-nowrap px-[10px] pt-px text-[14.2px] font-medium transition-colors lg:h-full lg:min-w-0 ${
              i > 0 ? "border-l border-[#d9e1eb]" : ""
            } ${
              on
                ? "border-l-0 bg-[linear-gradient(90deg,#086eed_0%,#093cdd_100%)] text-white"
                : `${userInk} hover:bg-[#f3f6fc]`
            } ${i === 0 ? "rounded-l-[5px]" : ""} ${i === tabs.length - 1 ? "rounded-r-[5px]" : ""}`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export function UserProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#e3eaf5]">
      <div
        style={{ width: `${clamped}%` }}
        className="h-full rounded-full bg-[linear-gradient(90deg,#1f6fe5_0%,#2563eb_100%)]"
      />
    </div>
  );
}

export function useUserNotice() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg((cur) => (cur === m ? null : cur)), 3200);
  };
  const node = msg ? (
    <div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-[8px] bg-[#0b0c36] px-4 py-2 text-[13.5px] font-medium text-white shadow-[0_10px_28px_rgba(0,0,0,0.25)]">
      {msg}
    </div>
  ) : null;
  return { show, node };
}
