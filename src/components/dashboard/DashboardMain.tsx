"use client";

import Image from "next/image";
import { useState, type ComponentType, type ReactNode } from "react";
import BrandTitle from "@/components/auth/BrandTitle";
import {
  AlertTriangleFillIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  AutomationIcon,
  BackupIcon,
  BellIcon,
  BubbleIcon,
  ChatCircleIcon,
  ChatIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  DiamondIcon,
  DocIcon,
  ExclamationFillIcon,
  FlagIcon,
  GradCapIcon,
  IntegrationIcon,
  LocationIcon,
  MagicIcon,
  MailIcon,
  MenuIcon,
  PeopleGroupIcon,
  PeopleIcon,
  PhoneFillIcon,
  PlugIcon,
  PulseIcon,
  RosetteIcon,
  SearchIcon,
  ShieldCheckIcon,
  SocialIcon,
  StaffIcon,
  TruckIcon,
  VanIcon,
  VolunteersIcon,
  WarningIcon,
  WebFormIcon,
  WhatsAppIcon,
  type IconProps,
} from "@/components/dashboard/dashboard-icons";
import { CentreFilter, PeriodFilter } from "@/components/dashboard/FilterDropdowns";
import ProfileMenu from "@/components/dashboard/ProfileMenu";
import { defaultPeriod, periodLabel, type Centre, type Period } from "@/lib/dashboard/filters";
import { siteConfig } from "@/lib/config/site";

type Icon = ComponentType<IconProps>;

/* -------------------------------------------------------------------------- */
/*                                 Mock data                                  */
/*         TODO: replace with API data once the backend is available.         */
/* -------------------------------------------------------------------------- */

const kpis = [
  { value: "52", label: "Total Requests Today", delta: "+12%", up: true, good: true, period: "vs. yesterday", bg: "bg-[linear-gradient(135deg,#fffffa_0%,#fbf8f3_100%)]" },
  { value: "03", label: "Emergency Requests", delta: "+50%", up: true, good: false, period: "vs. yesterday", bg: "bg-[linear-gradient(135deg,#fdfbfd_0%,#fef1f4_100%)]" },
  { value: "08", label: "Pending Verification", delta: "-20%", up: false, good: true, period: "vs. yesterday", bg: "bg-[linear-gradient(135deg,#fafbff_0%,#ecf5ff_100%)]" },
  { value: "07", label: "Active Sewa Cases", delta: "+8%", up: true, good: true, period: "vs. last week", bg: "bg-[linear-gradient(135deg,#fcfcfe_0%,#f2f7f8_100%)]" },
  { value: "36", label: "Open Tasks", delta: "-10%", up: false, good: true, period: "vs. last week", bg: "bg-[linear-gradient(135deg,#fdfdff_0%,#ebf4fe_100%)]" },
  { value: "03", label: "Overdue Tasks", delta: "-40%", up: false, good: false, period: "vs. last week", bg: "bg-[linear-gradient(135deg,#fefafd_0%,#fdf0f8_100%)]" },
  { value: "₹2.45 L", label: "Donations Received", delta: "+20%", up: true, good: true, period: "vs. last month", bg: "bg-[linear-gradient(135deg,#fbfbfb_0%,#fbf8f2_100%)]" },
  { value: "₹1.82 L", label: "Sewa Expenses", delta: "+10%", up: true, good: true, period: "vs. last month", bg: "bg-[linear-gradient(135deg,#f9fafc_0%,#f0f4ff_100%)]" },
];

const alerts: {
  icon: Icon;
  color: string;
  title: string;
  sub: string;
  value: string;
  tone: "first" | "red" | "attention";
}[] = [
  { icon: AlertTriangleFillIcon, color: "text-[#ef4d5a]", title: "Emergency Requests", sub: "Require immediate attention", value: "03", tone: "first" },
  { icon: ClockIcon, color: "text-[#f4a51c]", title: "Pending Approvals", sub: "Cases / expenses / donations awaiting approval", value: "08", tone: "red" },
  { icon: ExclamationFillIcon, color: "text-[#f6a800]", title: "Overdue Tasks", sub: "Tasks beyond SLA", value: "03", tone: "red" },
  { icon: PhoneFillIcon, color: "text-[#f4a21a]", title: "Unanswered Calls", sub: "Leads or case calls not responded (last 4 hours)", value: "05", tone: "red" },
  { icon: IntegrationIcon, color: "text-[#f2a516]", title: "Integration Warning", sub: "WhatsApp sync delayed (Since 28 mins)", value: "Attention", tone: "attention" },
];

const channels: { icon: Icon; color: string; name: string; received: number; pending: number; unanswered: number }[] = [
  { icon: PhoneFillIcon, color: "text-[#1a73e8]", name: "IR Calling", received: 42, pending: 3, unanswered: 1 },
  { icon: WhatsAppIcon, color: "text-[#25a244]", name: "WhatsApp", received: 48, pending: 4, unanswered: 2 },
  { icon: MailIcon, color: "text-[#2f7fd8]", name: "Email", received: 32, pending: 6, unanswered: 1 },
  { icon: BubbleIcon, color: "text-[#2f7fd8]", name: "Chatbot", received: 26, pending: 1, unanswered: 0 },
  { icon: WebFormIcon, color: "text-[#2f7fd8]", name: "Website Forms", received: 21, pending: 3, unanswered: 1 },
  { icon: SocialIcon, color: "text-[#4b3fd1]", name: "Social Media / Ads", received: 18, pending: 2, unanswered: 1 },
];

const approvals: { icon: Icon; label: string; value: string }[] = [
  { icon: DocIcon, label: "Pending Legal Review", value: "03" },
  { icon: RosetteIcon, label: "Pending Eligibility Checks", value: "07" },
  { icon: DocIcon, label: "Expense Approvals", value: "05" },
  { icon: DocIcon, label: "Donation Receipt Queue", value: "04" },
  { icon: FlagIcon, label: "Complaints Open", value: "02" },
];

const overview = [
  { label: "EWS Families", value: 32, pct: 49, color: "#1d5fa8" },
  { label: "Unclaimed Bodies", value: 18, pct: 28, color: "#efb033" },
  { label: "Unsupported Persons", value: 15, pct: 23, color: "#c5d1e3" },
];

const activities = [
  { dot: "bg-[#138a0c]", text: "New sewa request registered – MSR-26124", time: "10:45 AM" },
  { dot: "bg-[#fcc709]", text: "Volunteer task completed – VT-139", time: "09:30 AM" },
  { dot: "bg-[#f6b803]", text: "Donation of ₹25,000 received – DN-784", time: "08:59 AM" },
  { dot: "bg-[#056aba]", text: "Case MS-2603 moved to 'In Progress'", time: "08:20 AM" },
  { dot: "bg-[#a3c0e2]", text: "Expense approval request – EED-442", time: "Yesterday, 06:09 PM" },
];

const insights = [
  "8 requests need approval (legal / eligibility / expense).",
  "Delays highest in Unclaimed Bodies (avg. +36 hrs).",
  "3 high-priority cases require review today.",
  "Review 2 open complaints for resolution.",
  "Donation trend up by 32% this month. Consider outreach.",
];

const health: { icon: Icon; label: string; sub?: string; value: ReactNode; green?: boolean }[] = [
  { icon: BackupIcon, label: "Last Backup Time", value: "Today, 02:00 AM" },
  { icon: ShieldCheckIcon, label: "Security Status", value: "Protected (No Threats)", green: true },
  { icon: PlugIcon, label: "Integrations Health", sub: "WhatsApp, Email, Payment, etc.", value: "All Connected", green: true },
  {
    icon: PulseIcon,
    label: "Server Uptime",
    value: (
      <>
        <span className="text-[#1f8a2e]">99.98%</span> (Last 30 Days)
      </>
    ),
  },
  { icon: AutomationIcon, label: "AI Automation Status", value: "Running Normally", green: true },
];

const teamStats: { icon: Icon; label: string; value: string; extra?: string }[] = [
  { icon: StaffIcon, label: "Staff", value: "08 / 10" },
  { icon: VolunteersIcon, label: "Volunteers", value: "126 / 148", extra: "(85%)" },
  { icon: TruckIcon, label: "Fleet Running", value: "2 / 2" },
  { icon: GradCapIcon, label: "Training", value: "86%" },
];

const pendingIssues = [
  "Complete training for 21 volunteers (next batch: 3 days).",
  "Fill 2 vacant staff positions (Case Management & Communication).",
];

/* -------------------------------------------------------------------------- */
/*                                 Primitives                                 */
/* -------------------------------------------------------------------------- */

const card =
  "relative min-w-0 overflow-hidden rounded-[12px] border border-[#e6e9f2] bg-white shadow-[0_3px_12px_rgba(28,45,110,0.07)]";

function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="whitespace-nowrap text-[length:var(--t,18px)] font-normal leading-none tracking-[-0.2px] text-[#111a45]">
      {children}
    </h2>
  );
}

function LinkArrow({ children }: { children: ReactNode }) {
  return (
    <a
      href="#"
      className="inline-flex shrink-0 items-center gap-[5px] whitespace-nowrap pt-[2px] text-[12.8px] font-normal leading-none tracking-[-0.2px] text-[#2d2de5] hover:underline"
    >
      {children}
      <ArrowRightIcon className="h-[13px] w-[13px]" />
    </a>
  );
}

function GreenPill({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-[#cdebc4] bg-[linear-gradient(180deg,#f1fbee_0%,#e1f5da_100%)] leading-none text-[#1a2a14] ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Sections                                  */
/* -------------------------------------------------------------------------- */

function TopBar() {
  return (
    <header className="relative z-30 flex h-[48px] shrink-0 items-center border-b border-[#e4e7f1] bg-[#f7f8fd] px-4 lg:pl-[26px] lg:pr-[21px]">
      <button type="button" aria-label="Toggle menu" className="text-[#141b45]">
        <MenuIcon className="h-[22px] w-[22px]" />
      </button>
      <BrandTitle className="ml-4 mt-[9px] text-[26px] lg:ml-[38px]" />
      <span className="ml-[5px] hidden h-[31px] w-px bg-[#c9cedd] lg:block" />
      <p className="ml-[17px] hidden whitespace-nowrap pt-[2px] text-[19.3px] lg:block font-normal leading-none tracking-[-0.2px] text-[#141b45]">
        CRM for Humanitarian Services
      </p>

      <label className="ml-auto hidden h-[31px] w-[386px] shrink items-center lg:flex rounded-full border border-[#dfe3ef] bg-white/70 pl-[12px] pr-4">
        <SearchIcon className="h-[19px] w-[19px] shrink-0 text-[#141b45]" />
        <input
          type="search"
          placeholder="Search people, cases, requests, donations..."
          className="ml-[11px] h-full min-w-0 flex-1 bg-transparent pt-[2px] text-[14.6px] tracking-[-0.2px] text-[#141b45] outline-none placeholder:text-[#4b5bb5]"
        />
      </label>

      <button type="button" className="ml-auto flex items-center text-[#141b45] lg:ml-[24px]">
        <MagicIcon className="h-[20px] w-[20px] text-[#3532c8]" />
        <span className="ml-[7px] pt-[2px] text-[17.5px] font-normal leading-none">AI</span>
      </button>
      <span className="ml-[16px] hidden h-[26px] w-px bg-[#d3d7e3] sm:block" />
      <button type="button" aria-label="Notifications" className="relative ml-[22px] text-[#141b45]">
        <BellIcon className="h-[22px] w-[22px]" />
        <span className="absolute -right-[8px] -top-[8px] flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#fa0606] pt-[1px] text-[11px] font-normal leading-none text-white">
          1
        </span>
      </button>
      <span className="ml-[27px] hidden h-[26px] w-px bg-[#d3d7e3] sm:block" />
      <ProfileMenu />
    </header>
  );
}

function TitleBar({
  period,
  onPeriodChange,
  centre,
  onCentreChange,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
  centre: Centre;
  onCentreChange: (c: Centre) => void;
}) {
  return (
    <section className="relative z-20 flex shrink-0 flex-wrap items-start gap-y-3 pb-4 pl-[6px] lg:h-[85px] lg:flex-nowrap lg:pb-0">
      {/* soft golden wave behind the heading */}
      <svg
        aria-hidden
        viewBox="0 0 1396 90"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -top-[2px] h-[90px] w-full"
      >
        <defs>
          <linearGradient id="titleWaveFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff3d6" stopOpacity="0" />
            <stop offset="0.35" stopColor="#fff2d4" stopOpacity="0.6" />
            <stop offset="0.6" stopColor="#ffeec8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fdf3e0" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M380 90 C620 70 760 10 980 18 C1120 24 1200 60 1396 50 L1396 90 Z" fill="url(#titleWaveFill)" />
        <path d="M560 90 C760 64 880 34 1060 40 C1180 44 1260 72 1396 70 L1396 90 Z" fill="#ffefcc" opacity="0.55" />
      </svg>

      <span className="relative mt-[12px] h-[58px] w-[6px] shrink-0 rounded-full bg-[linear-gradient(180deg,#f3b009_0%,#f7b00a_50%,#ffb90e_100%)]" />
      <div className="relative ml-[22px] mt-[14px] w-[calc(100%-28px)] min-w-0 lg:w-auto">
        <h1 className="text-[24px] lg:whitespace-nowrap lg:text-[32.9px] font-normal leading-none tracking-[-0.3px] text-[#0d1847]">
          Management Command Centre
        </h1>
        <p className="mt-[2px] text-[15px] lg:whitespace-nowrap lg:text-[18.8px] font-normal leading-none tracking-[-0.2px] text-[#0d1847]">
          Namo Gange Namaskar! Here is your live operational overview...
        </p>
      </div>

      <div className="relative ml-[28px] flex gap-[16px] lg:ml-auto lg:mt-[22px]">
        <PeriodFilter value={period} onChange={onPeriodChange} />
        <CentreFilter value={centre} onChange={onCentreChange} />
      </div>
    </section>
  );
}

function KpiRow() {
  return (
    <section className="grid shrink-0 grid-cols-2 gap-[4px] md:grid-cols-4 lg:grid-cols-[189fr_170fr_166fr_163fr_164fr_164fr_163fr_160fr]">
      {kpis.map((k, i) => {
        const tone = k.good ? "text-[#1a7b2a]" : "text-[#e3251d]";
        const Arrow = k.up ? ArrowUpIcon : ArrowDownIcon;
        return (
          <div
            key={k.label}
            className={`relative flex h-[95px] min-w-0 flex-col rounded-[10px] border border-[#eceef5] shadow-[0_2px_8px_rgba(28,45,110,0.06)] ${k.bg} ${i === 0 ? "pl-[34px]" : "pl-[19px]"}`}
          >
            {i === 0 && (
              <span className="absolute left-[12px] top-[11px] h-[73px] w-[8px] rounded-full bg-[linear-gradient(180deg,#ffd586_0%,#fdc652_45%,#f1a921_100%)]" />
            )}
            <p className="mt-[11px] whitespace-nowrap text-[28px] font-normal leading-none tracking-[0px] text-[#08083c]">
              {k.value}
            </p>
            <p className="mt-[2px] whitespace-nowrap text-[14.8px] font-normal leading-none tracking-[-0.4px] text-[#111a45]">
              {k.label}
            </p>
            <p className="mt-[7px] flex items-center whitespace-nowrap text-[14.2px] leading-none tracking-[-0.3px]">
              <Arrow className={`h-[14px] w-[14px] ${tone}`} />
              <span className={`ml-[5px] pt-[2px] font-normal ${tone}`}>{k.delta}</span>
              <span className="ml-[5px] pt-[2px] font-normal text-[#3d4f86]">{k.period}</span>
            </p>
          </div>
        );
      })}
    </section>
  );
}

function CriticalAlerts() {
  return (
    <div className={card}>
      <div className="flex h-[38px] items-center pt-[2px] [--t:17.4px] pl-[15px] pr-[15px]">
        <CardTitle>Critical Alerts / Priority Actions</CardTitle>
        <span className="ml-[3px] mt-[-3px] flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full bg-[#ef1515] pt-[2px] text-[15px] font-normal leading-none text-white">
          5
        </span>
        <span className="ml-auto">
          <LinkArrow>View All</LinkArrow>
        </span>
      </div>
      <ul className="mt-[2px] px-[6px]">
        {alerts.map(({ icon: Icon, ...a }) => (
          <li
            key={a.title}
            className={`flex h-[34.6px] items-center rounded-[8px] pl-[18px] pr-[11px] ${
              a.tone === "attention"
                ? "bg-[linear-gradient(90deg,rgba(255,251,240,0)_0%,#fffaf0_45%,#fff8ec_100%)]"
                : "bg-[linear-gradient(90deg,rgba(255,245,250,0)_0%,#fff6fa_45%,#fff1f4_100%)]"
            }`}
          >
            <Icon className={`h-[22px] w-[22px] shrink-0 ${a.color}`} />
            <div className="ml-[18px] min-w-0 flex-1 leading-none">
              <p className="whitespace-nowrap text-[14.7px] font-normal tracking-[-0.3px] text-[#111a45]">{a.title}</p>
              <p className="mt-[2px] whitespace-nowrap text-[11.9px] font-normal tracking-[-0.3px] text-[#1d2233]">{a.sub}</p>
            </div>
            {a.tone === "attention" ? (
              <span className="ml-2 pt-[2px] text-[14px] font-normal tracking-[-0.2px] text-[#3b2a12]">{a.value}</span>
            ) : (
              <span className="ml-2 pt-[3px] text-[19px] font-normal leading-none text-[#e0201b]">{a.value}</span>
            )}
            <ChevronRightIcon
              className={`ml-[9px] h-[13px] w-[13px] shrink-0 ${
                a.tone === "first" ? "text-[#111a45]" : a.tone === "attention" ? "text-[#3b2a12]" : "text-[#e0201b]"
              }`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SnapshotCell({
  icon: Icon,
  label,
  value,
  small,
  children,
}: {
  icon: Icon;
  label: ReactNode;
  value?: ReactNode;
  small?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center border-b border-[#eef0f6]">
      <Icon className="h-[20px] w-[20px] shrink-0 text-[#1d2a6b]" />
      <span
        className={`min-w-0 flex-1 whitespace-nowrap pt-[2px] leading-[1.15] text-[#1a2040] ${
          small ? `ml-[7px] ${small} font-normal tracking-[-0.4px]` : "ml-[10px] text-[12.2px] font-normal tracking-[-0.5px]"
        }`}
      >
        {label}
      </span>
      {value !== undefined && (
        <span className="ml-1 shrink-0 pt-[2px] text-[16px] font-normal leading-none tracking-[-0.3px] text-[#111a45]">
          {value}
        </span>
      )}
      {children}
    </div>
  );
}

function LiveSnapshot() {
  return (
    <div className={card}>
      <div className="flex h-[38px] items-center pt-[2px] [--t:17.4px] pl-[9px] pr-[7px]">
        <CardTitle>Live Operational Snapshot</CardTitle>
        <GreenPill className="ml-auto h-[25px] w-[86px] gap-[6px] text-[13px] font-normal">
          <CheckIcon className="h-[13px] w-[13px] text-[#1f8a2e]" />
          <span className="pt-[2px]">Healthy</span>
        </GreenPill>
      </div>
      <div className="mt-[3px] grid grid-cols-[151fr_120fr] gap-x-[16px] pl-[12px] pr-[15px] [grid-template-rows:36.5px_36.5px_36.5px_62px]">
        <SnapshotCell icon={ChatIcon} label="Ongoing Cases" value="65" />
        <SnapshotCell icon={VanIcon} label="My Active" value="2 / 2" small="text-[11.5px]" />
        <SnapshotCell icon={ChatCircleIcon} label="Cases Closing Today" value="07" />
        <SnapshotCell icon={DiamondIcon} label="Avg. Response" small="text-[9.3px]">
          <GreenPill className="h-[19px] shrink-0 px-[3px] pt-[2px] text-[10px] font-normal">18 mins</GreenPill>
        </SnapshotCell>
        <SnapshotCell icon={PeopleIcon} label="Staff On Duty" value="08 / 10" />
        <SnapshotCell icon={WarningIcon} label="SLA Breaches" small="text-[11px]" value={<span className="text-[#e3251d]">03</span>} />
        <div className="flex min-w-0 items-start pt-[8px]">
          <PeopleGroupIcon className="mt-[2px] h-[20px] w-[20px] shrink-0 text-[#1d2a6b]" />
          <span className="ml-[10px] min-w-0 flex-1 pt-[2px] text-[12.2px] font-normal leading-[1.25] tracking-[-0.5px] text-[#1a2040]">
            Volunteers
            <br />
            Availability
          </span>
          <span className="flex shrink-0 flex-col items-end">
            <span className="pt-[2px] text-[16px] font-normal leading-none tracking-[-0.3px] text-[#111a45]">126 / 148</span>
            <GreenPill className="mr-[1px] mt-[8px] h-[17px] w-[39px] pt-[2px] text-[11.5px] font-normal">(85%)</GreenPill>
          </span>
        </div>
        <div className="flex min-w-0 items-start pt-[8px]">
          <LocationIcon className="mt-[2px] h-[19px] w-[19px] shrink-0 text-[#1d2a6b]" />
          <span className="ml-[7px] min-w-0 flex-1 whitespace-nowrap pt-[2px] text-[9.6px] font-normal leading-[1.55] tracking-[-0.4px] text-[#1a2040]">
            City / Centre
            <br />
            Coverage
          </span>
          <span className="flex shrink-0 flex-col items-end">
            <span className="pt-[2px] text-[16px] font-normal leading-none tracking-[-0.3px] text-[#111a45]">12 / 12</span>
            <GreenPill className="mt-[8px] h-[17px] w-[36px] pt-[2px] text-[11px] font-normal">(100%)</GreenPill>
          </span>
        </div>
      </div>
    </div>
  );
}

function CommunicationStatus() {
  const cols = "grid grid-cols-[1fr_60px_52px_66px] items-center";
  return (
    <div className={card}>
      <div className="flex h-[38px] items-center pt-[2px] [--t:16.6px] pl-[14px] pr-[18px]">
        <CardTitle>Communication &amp; Lead Status</CardTitle>
        <span className="ml-auto">
          <LinkArrow>View Report</LinkArrow>
        </span>
      </div>
      <div className="pl-[16px] pr-[16px]">
        <div className={`${cols} mt-[3px] h-[21px] border-b border-[#eef0f6] pt-[1px] text-[12px] font-normal tracking-[-0.3px] text-[#1d2550]`}>
          <span>Channel</span>
          <span className="text-center">Received</span>
          <span className="text-center">Pending</span>
          <span className="text-center">Unanswered</span>
        </div>
        {channels.map(({ icon: Icon, ...c }) => (
          <div key={c.name} className={`${cols} h-[24px] border-b border-[#f0f2f7] last:border-b-0`}>
            <span className="flex min-w-0 items-center">
              <Icon className={`h-[18px] w-[18px] shrink-0 ${c.color}`} />
              <span className="ml-[15px] whitespace-nowrap pt-[2px] text-[13px] font-normal tracking-[-0.5px] text-[#1a2040]">{c.name}</span>
            </span>
            {[c.received, c.pending, c.unanswered].map((n, i) => (
              <span key={i} className={`pt-[2px] text-center text-[14.5px] font-normal text-[#111a45] ${i === 0 ? "pl-[8px]" : ""}`}>
                {n}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ApprovalsCompliance() {
  return (
    <div className={card}>
      <div className="flex h-[38px] items-center pt-[2px] [--t:17.4px] pl-[9px] pr-[13px]">
        <CardTitle>Approvals &amp; Compliance</CardTitle>
        <span className="ml-auto">
          <LinkArrow>View All</LinkArrow>
        </span>
      </div>
      <ul className="mt-[2px] pl-[14px] pr-[31px]">
        {approvals.map(({ icon: Icon, ...a }) => (
          <li key={a.label} className="flex h-[32.5px] items-center border-b border-[#eef0f6] last:border-b-0">
            <Icon className="h-[21px] w-[21px] shrink-0 text-[#f39a2c]" />
            <span className="ml-[14px] min-w-0 flex-1 truncate pt-[2px] text-[14.8px] font-normal tracking-[-0.4px] text-[#1a2040]">
              {a.label}
            </span>
            <span className="pt-[3px] text-[19px] font-normal leading-none text-[#e0201b]">{a.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Donut() {
  const r = 55;
  const c = 2 * Math.PI * r;
  const lens = overview.map((s) => (s.pct / 100) * c);
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <svg viewBox="0 0 134 134" className="h-[134px] w-[134px] shrink-0 -rotate-90">
      {overview.map((s, i) => (
        <circle
          key={s.label}
          cx="67"
          cy="67"
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth="24"
          strokeDasharray={`${lens[i]} ${c - lens[i]}`}
          strokeDashoffset={-starts[i]}
        />
      ))}
    </svg>
  );
}

function SewaOverview({ period }: { period: Period }) {
  return (
    <div className={card}>
      <div className="flex h-[41px] items-center pt-[2px] pl-[16px] pr-[14px]">
        <CardTitle>
          Sewa Overview <span className="text-[16px] font-normal tracking-[-0.4px]">({periodLabel(period)})</span>
        </CardTitle>
        <span className="ml-auto">
          <LinkArrow>View Details</LinkArrow>
        </span>
      </div>
      <div className="mt-[5px] flex items-center pl-[14px] pr-[14px]">
        <div className="relative">
          <Donut />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#111a45]">
            <span className="pt-[4px] text-[31px] font-normal leading-none">65</span>
            <span className="mt-[1px] text-[14px] font-normal leading-none tracking-[-0.3px]">Total Cases</span>
          </div>
        </div>
        <ul className="-mt-[10px] ml-[15px] min-w-0 flex-1">
          {overview.map((s) => (
            <li key={s.label} className="flex h-[34px] items-center">
              <span className="h-[12px] w-[12px] shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="ml-[9px] min-w-0 flex-1 whitespace-nowrap pt-[2px] text-[13.4px] font-normal tracking-[-0.4px] text-[#1a2040]">
                {s.label}
              </span>
              <span className="pt-[2px] text-[14.5px] tracking-[-0.2px] text-[#111a45]">
                {s.value} ({s.pct}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecentActivities() {
  return (
    <div className={card}>
      <div className="flex h-[41px] items-center pt-[2px] pl-[10px] pr-[14px]">
        <CardTitle>Recent Activities</CardTitle>
        <span className="ml-auto">
          <LinkArrow>View All</LinkArrow>
        </span>
      </div>
      <ul className="mt-[1px] pl-[16px] pr-[14px]">
        {activities.map((a) => (
          <li key={a.text} className="flex h-[27px] items-center">
            <span className={`h-[9px] w-[9px] shrink-0 rounded-full ${a.dot}`} />
            <span className="ml-[10px] min-w-0 flex-1 whitespace-nowrap pt-[2px] text-[11.2px] font-normal tracking-[-0.45px] text-[#1a2040]">
              {a.text}
            </span>
            <span className="ml-2 shrink-0 pt-[2px] text-[12px] tracking-[-0.3px] text-[#1b2d6b]">{a.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AiInsights() {
  return (
    <div className={card}>
      {/* faint golden wave on the left */}
      <svg aria-hidden viewBox="0 0 340 185" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="aiWave" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#fdefc9" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#fdf4df" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 185 L0 60 C30 90 60 140 130 150 C170 156 190 170 200 185 Z" fill="url(#aiWave)" />
      </svg>
      <div className="relative flex h-[41px] items-center pt-[2px] [--t:17px] pl-[14px] pr-[14px]">
        <CardTitle>AI Management Insights</CardTitle>
        <span className="ml-auto">
          <LinkArrow>View Insights</LinkArrow>
        </span>
      </div>
      <ul className="relative mt-[1px] pl-[83px] pr-[4px]">
        {insights.map((t) => (
          <li key={t} className="flex min-h-[26px] items-start">
            <CheckCircleIcon className="mt-[2px] h-[17px] w-[17px] shrink-0 text-[#1e8f35]" />
            <span className="ml-[6px] pt-[4px] text-[10.5px] font-normal leading-[14px] tracking-[-0.4px] text-[#1a2040]">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SystemHealth() {
  return (
    <div className={card}>
      <div className="flex h-[41px] items-center pt-[2px] pl-[10px] pr-[9px]">
        <CardTitle>System Health</CardTitle>
        <GreenPill className="ml-auto h-[25px] w-[148px] gap-[6px] text-[12px] font-normal tracking-[-0.4px]">
          <CheckIcon className="h-[12px] w-[12px] text-[#1f8a2e]" />
          <span className="pt-[2px]">All Systems Operational</span>
        </GreenPill>
      </div>
      <ul className="-mt-[6px] pl-[18px] pr-[14px]">
        {health.map(({ icon: Icon, ...h }) => (
          <li
            key={h.label}
            className={`flex items-center border-b border-[#eef0f6] last:border-b-0 ${h.sub ? "h-[32px]" : "h-[28px]"}`}
          >
            <Icon className="h-[19px] w-[19px] shrink-0 text-[#2a3a8c]" />
            <span className="ml-[14px] min-w-0 flex-1 pt-[2px] leading-none">
              <span className="block truncate text-[13px] font-normal tracking-[-0.4px] text-[#1a2040]">{h.label}</span>
              {h.sub && (
                <span className="mt-[2px] block truncate text-[10px] tracking-[-0.3px] text-[#1a2040]">{h.sub}</span>
              )}
            </span>
            <span
              className={`ml-2 shrink-0 pt-[2px] text-[13px] tracking-[-0.3px] ${
                h.green ? "font-normal text-[#1f8a2e]" : "font-normal text-[#111a45]"
              }`}
            >
              {h.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TeamTraining() {
  return (
    <section className={`${card} shrink-0 pb-[5px]`}>
      <div className="relative flex h-[32px] items-end border-b border-[#eceef5] pb-[2px] pl-[18px]">
        <CardTitle>
          <span className="text-[19.7px]">Team &amp; Training Status</span>
        </CardTitle>
        <span className="absolute bottom-[8px] left-[608px] hidden lg:block">
          <LinkArrow>View Details</LinkArrow>
        </span>
      </div>
      <div className="mt-[8px] grid grid-cols-2 gap-x-[60px] gap-y-2 pl-[25px] pr-[29px] lg:grid-cols-[240fr_318fr_302fr_273fr]">
        {teamStats.map(({ icon: Icon, ...s }) => (
          <div key={s.label} className="flex h-[50px] items-center rounded-[12px] bg-[#eef8ef] pl-[24px]">
            <Icon className="h-[34px] w-[34px] shrink-0 text-[#1f8a2e]" />
            <div className="ml-[16px] leading-none text-[#111a45]">
              <p className="text-[14px] font-normal tracking-[-0.3px]">{s.label}</p>
              <p className="mt-[5px] whitespace-nowrap text-[18px] font-normal tracking-[-0.3px]">
                {s.value}
                {s.extra && <span className="ml-[5px] text-[13.5px] font-normal text-[#1f8a2e]">{s.extra}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-[11px] mt-[10px] flex h-[62px] items-start rounded-[10px] bg-[linear-gradient(90deg,#fff6ea_0%,#fff7e8_50%,#fef4e0_100%)] pl-[22px] pt-[3px]">
        <ExclamationFillIcon className="mt-[4px] h-[19px] w-[19px] shrink-0 text-[#f7b500]" />
        <div className="ml-[17px] leading-none text-[#1a1a2e]">
          <p className="pt-[1px] text-[16.5px] font-normal tracking-[-0.3px] text-[#2a1a0a]">Top Pending Issues</p>
          <ul className="mt-[2px] pl-[3px]">
            {pendingIssues.map((t) => (
              <li key={t} className="flex h-[19px] items-center text-[14px] tracking-[-0.3px]">
                <span className="mr-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#4a2a10]" />
                <span className="pt-[2px]">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const dev = siteConfig.developer;
  return (
    <footer className="mt-auto flex h-[57px] shrink-0 items-center justify-between gap-4 pl-[6px] pr-[8px] text-[15px] font-normal tracking-[-0.3px] text-[#141b45]">
      <p className="whitespace-nowrap pt-[2px]">
        © {siteConfig.copyrightYear} {siteConfig.trust}
        <span className="mx-[12px]">|</span>
        {siteConfig.name} CRM v1.0
      </p>
      <div className="flex items-center gap-[15px]">
        <p className="whitespace-nowrap pt-[2px]">Designed, Developed &amp; Maintained by</p>
        <Image
          src="/images/encodency-logo.png"
          alt={`${dev.name} ${dev.legal} — ${dev.slogan}`}
          width={640}
          height={120}
          sizes="160px"
          className="h-[30px] w-[160px] shrink-0 rounded-[5px]"
        />
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */

/** Everything to the right of the sidebar on the dashboard home screen. */
export default function DashboardMain() {
  // TODO: fetch the dashboard data for { period, centre } once the API exists;
  // the figures below are still the static mock-up values.
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [centre, setCentre] = useState<Centre>(null);

  return (
    <div className="flex min-h-dvh min-w-0 flex-1 flex-col bg-[#f4f5fb] font-hind">
      <TopBar />
      <main className="flex flex-1 flex-col pl-[14px] pr-[12px]">
        <TitleBar period={period} onPeriodChange={setPeriod} centre={centre} onCentreChange={setCentre} />
        <KpiRow />
        <section className="mt-[13px] grid shrink-0 grid-cols-1 gap-[11px] md:grid-cols-2 lg:grid-cols-[369fr_315fr_338fr_315fr] lg:[grid-template-rows:217px]">
          <CriticalAlerts />
          <LiveSnapshot />
          <CommunicationStatus />
          <ApprovalsCompliance />
        </section>
        <section className="mt-[15px] grid shrink-0 grid-cols-1 gap-[11px] md:grid-cols-2 lg:grid-cols-[369fr_315fr_338fr_315fr] lg:[grid-template-rows:186px]">
          <SewaOverview period={period} />
          <RecentActivities />
          <AiInsights />
          <SystemHealth />
        </section>
        <div className="mt-[14px]">
          <TeamTraining />
        </div>
        <Footer />
      </main>
    </div>
  );
}
