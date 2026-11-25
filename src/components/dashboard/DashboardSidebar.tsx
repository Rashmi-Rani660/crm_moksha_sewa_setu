import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import emblem from "@/app/icon.png";
import {
  AdminIcon,
  CasesIcon,
  ChevronRightIcon,
  CommunicationIcon,
  FinanceIcon,
  GearIcon,
  GovernanceIcon,
  HelpIcon,
  HomeIcon,
  LeadsIcon,
  LearningIcon,
  OperationsIcon,
  ReportsIcon,
  TeamIcon,
} from "@/components/dashboard/sidebar-icons";
import { siteConfig } from "@/lib/config/site";

type NavItem = { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const navItems: NavItem[] = [
  { label: "Sewa Operations", icon: OperationsIcon },
  { label: "Leads & Requests", icon: LeadsIcon },
  { label: "Cases & Services", icon: CasesIcon },
  { label: "Communication", icon: CommunicationIcon },
  { label: "Finance & Donations", icon: FinanceIcon },
  { label: "Reports & Analytics", icon: ReportsIcon },
  { label: "Team & Volunteers", icon: TeamIcon },
  { label: "AI & Automation", icon: GearIcon },
  { label: "Learning & Training", icon: LearningIcon },
  { label: "Governance", icon: GovernanceIcon },
  { label: "Help & Support", icon: HelpIcon },
  { label: "Administration", icon: AdminIcon },
  { label: "Settings", icon: GearIcon },
];

/**
 * Dashboard sidebar. Sizes are the design's pixel values (204px wide panel,
 * 194×40 active pill, 33.6px rows) so it matches the mock-up 1:1.
 */
export default function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[204px] lg:static lg:h-auto lg:self-stretch shrink-0 flex-col overflow-hidden bg-[linear-gradient(180deg,#001534_0%,#001432_55%,#001331_100%)] font-hind text-white md:flex">
      {/* Brand */}
      <div className="relative h-[141px] shrink-0">
        <Image
          src={emblem}
          alt=""
          priority
          className="absolute left-[69.5px] top-[2px] h-[74px] w-[74px]"
        />
        <p className="absolute inset-x-0 top-[64px] translate-x-[5px] text-center font-serif text-[21.5px] font-medium leading-none tracking-[0.005em] text-white">
          {siteConfig.brand.toUpperCase()}
        </p>
        <p className="absolute inset-x-0 top-[97px] translate-x-[3px] text-center text-[11.3px] font-medium leading-none tracking-[-0.1px] text-white">
          {siteConfig.initiative}
        </p>
        <span className="absolute left-[23px] top-[122px] h-px w-[164px] bg-[#1b2b45]" />
      </div>

      <nav aria-label="Main" className="flex flex-col">
        <Link
          href="/dashboard"
          aria-current="page"
          className="relative ml-[6px] flex h-[40px] w-[194px] shrink-0 items-center rounded-[9px] bg-[linear-gradient(90deg,#e6ae42_0%,#d9a545_22%,#a28040_62%,#7c683d_100%)] pl-[12px] text-[16px] font-normal tracking-[-0.2px] text-white"
        >
          <HomeIcon className="h-[20px] w-[20px] shrink-0" />
          <span className="ml-[13px] pt-[2px]">Dashboard</span>
        </Link>

        <ul className="mt-[7.2px]">
          {navItems.map(({ label, icon: Icon }) => (
            <li key={label}>
              <button
                type="button"
                className="relative flex h-[33.6px] w-full items-center pl-[18px] text-left text-[14px] font-normal tracking-[-0.15px] text-[#f4f6fb] transition-colors hover:bg-white/5"
              >
                <Icon className="h-[20px] w-[20px] shrink-0" />
                <span className="ml-[13px] whitespace-nowrap pt-[2px]">{label}</span>
                <ChevronRightIcon className="absolute right-[18px] top-1/2 -translate-y-1/2" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Diya */}
      <div className="relative mt-auto h-[150px] shrink-0">
        <Image
          src="/images/sidebar-diya.png"
          alt=""
          width={400}
          height={300}
          className="absolute bottom-[8px] left-[2px] h-[150px] w-[200px]"
        />
      </div>
    </aside>
  );
}
