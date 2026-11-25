"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { LogoutIcon } from "@/components/dashboard/dashboard-icons";
import { usePopover } from "@/components/dashboard/usePopover";
import { setFlash, signOut, useAuthSession } from "@/lib/auth/session";

/** TODO: the signed-in user's name and role come from the API. */
const user = { name: "Vijay Sharma", role: "Super Admin" };

const ITEM = "[data-menuitem]";

const maskMobile = (m: string) => `+91 ${m.slice(0, 2)}XXXXXX${m.slice(-2)}`;

function Avatar({ size, text }: { size: number; text: number }) {
  return (
    <span
      style={{ width: size, height: size, fontSize: text }}
      className="flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#48a3e4_0%,#2f8ad6_100%)] pt-[2px] leading-none text-white"
    >
      {user.name.charAt(0)}
    </span>
  );
}

/** Avatar + name in the top bar; opens the account menu with Sign out. */
export default function ProfileMenu() {
  const router = useRouter();
  const { session } = useAuthSession();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { rootRef, triggerRef, panelRef, onPanelKeyDown } = usePopover(open, setOpen, ITEM);

  const handleSignOut = () => {
    setOpen(false);
    setFlash("You have been signed out.");
    signOut();
    router.replace("/login");
  };

  return (
    <div ref={rootRef} className="relative ml-[15px]">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen(!open)}
        className={`flex items-center rounded-[10px] px-[6px] py-[4px] text-left text-[#141b45] transition-colors hover:bg-[#eceffa] ${
          open ? "bg-[#eceffa]" : ""
        }`}
      >
        <Avatar size={35} text={17} />
        <span className="ml-[16px] hidden whitespace-nowrap leading-none sm:block">
          <span className="block text-[17px] tracking-[-0.3px]">{user.name}</span>
          <span className="mt-[3px] block text-[14.5px] tracking-[-0.2px]">{user.role}</span>
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-label="Account"
          onKeyDown={onPanelKeyDown}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px] rounded-[12px] border border-[#e6e9f2] bg-white p-[6px] text-[#141b45] shadow-[0_14px_36px_rgba(20,35,90,0.16)]"
        >
          <div className="flex items-center px-[10px] pb-[10px] pt-[8px]">
            <Avatar size={40} text={18} />
            <div className="ml-[12px] min-w-0 leading-none">
              <p className="truncate text-[15px] tracking-[-0.2px]">{user.name}</p>
              <p className="mt-[4px] truncate text-[13px] text-[#6b7393]">{user.role}</p>
              {session && (
                <p className="mt-[4px] truncate text-[12.5px] text-[#6b7393]">{maskMobile(session.mobile)}</p>
              )}
            </div>
          </div>
          <div className="mb-[4px] h-px bg-[#eef0f6]" />
          <button
            type="button"
            role="menuitem"
            data-menuitem
            onClick={handleSignOut}
            className="flex h-[38px] w-full items-center rounded-[8px] px-[10px] text-left text-[14px] text-[#e0201b] outline-none transition-colors hover:bg-[#fff1f1] focus-visible:bg-[#fff1f1]"
          >
            <LogoutIcon className="h-[17px] w-[17px] shrink-0" />
            <span className="ml-[10px] pt-[2px]">Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
