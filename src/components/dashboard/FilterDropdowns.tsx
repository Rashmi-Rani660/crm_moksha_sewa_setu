"use client";

import { useId, useState, type ReactNode } from "react";
import { usePopover } from "@/components/dashboard/usePopover";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  PinIcon,
  SearchIcon,
} from "@/components/dashboard/dashboard-icons";
import {
  centres,
  formatRange,
  periodLabel,
  periodPresets,
  periodRange,
  toISODate,
  type Centre,
  type Period,
} from "@/lib/dashboard/filters";

/* -------------------------------------------------------------------------- */
/*                               Shared dropdown                              */
/* -------------------------------------------------------------------------- */

const OPTION = "[data-option]";

/** Button + popover panel. Closes on outside click and Escape. */
function Dropdown({
  icon,
  label,
  open,
  setOpen,
  minWidth,
  padLeft = 13,
  panelWidth,
  ariaLabel,
  children,
}: {
  icon: ReactNode;
  label: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  minWidth: string;
  padLeft?: number;
  panelWidth: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  const panelId = useId();
  const { rootRef, triggerRef, panelRef, onPanelKeyDown } = usePopover(open, setOpen, OPTION);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${ariaLabel}: ${label}`}
        onClick={() => setOpen(!open)}
        style={{ minWidth, paddingLeft: padLeft }}
        className={`flex h-[38px] max-w-[240px] items-center rounded-[10px] border bg-white pr-[12px] text-[#141b45] shadow-[0_3px_10px_rgba(28,45,110,0.08)] transition-colors hover:border-[#cfd6ee] ${
          open ? "border-[#b9c4ec]" : "border-[#e8ebf3]"
        }`}
      >
        {icon}
        <span className="ml-[9px] mr-[9px] truncate pt-[2px] text-[16px] leading-none tracking-[-0.3px]">{label}</span>
        <ChevronDownIcon
          className={`ml-auto h-[12px] w-[12px] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={ariaLabel}
          onKeyDown={onPanelKeyDown}
          style={{ width: panelWidth }}
          className="absolute right-0 top-[calc(100%+8px)] z-40 rounded-[12px] border border-[#e6e9f2] bg-white p-[6px] text-[#141b45] shadow-[0_14px_36px_rgba(20,35,90,0.16)]"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function Option({
  selected,
  onSelect,
  children,
  hint,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="option"
      data-option
      aria-selected={selected}
      onClick={onSelect}
      className={`flex h-[34px] w-full items-center rounded-[8px] px-[10px] text-left text-[14px] tracking-[-0.2px] outline-none transition-colors focus-visible:bg-[#f1f4fd] ${
        selected ? "bg-[#eef2ff] text-[#2d2de5]" : "hover:bg-[#f4f6fc]"
      }`}
    >
      <span className="w-[18px] shrink-0">{selected && <CheckIcon className="h-[12px] w-[12px]" />}</span>
      <span className="min-w-0 flex-1 truncate pt-[2px]">{children}</span>
      {hint && <span className="ml-2 shrink-0 pt-[2px] text-[12px] text-[#6b7393]">{hint}</span>}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Period filter                               */
/* -------------------------------------------------------------------------- */

export function PeriodFilter({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const today = toISODate(new Date());
  const [from, setFrom] = useState(() => toISODate(periodRange(value).from));
  const [to, setTo] = useState(() => toISODate(periodRange(value).to));

  const setPanel = (next: boolean) => {
    setOpen(next);
    if (next) {
      // Re-sync the custom form with the current selection each time it opens.
      const r = periodRange(value);
      setFrom(toISODate(r.from));
      setTo(toISODate(r.to));
      setCustom(value.id === "custom");
    }
  };

  const error =
    !from || !to
      ? "Select both dates."
      : from > to
        ? "Start date must be before end date."
        : to > today
          ? "End date can't be in the future."
          : null;

  return (
    <Dropdown
      icon={<CalendarIcon className="h-[18px] w-[18px] shrink-0" />}
      label={periodLabel(value)}
      open={open}
      setOpen={setPanel}
      minWidth="145px"
      panelWidth="272px"
      ariaLabel="Reporting period"
    >
      <div role="listbox" aria-label="Reporting period">
        {periodPresets.map((p) => (
          <Option
            key={p.id}
            selected={value.id === p.id}
            hint={formatRange(periodRange({ id: p.id }))}
            onSelect={() => {
              onChange({ id: p.id });
              setOpen(false);
            }}
          >
            {p.label}
          </Option>
        ))}
        <div className="my-[4px] h-px bg-[#eef0f6]" />
        <Option selected={value.id === "custom"} onSelect={() => setCustom(true)}>
          Custom Range
        </Option>
      </div>

      {custom && (
        <form
          className="px-[10px] pb-[6px] pt-[8px]"
          onSubmit={(e) => {
            e.preventDefault();
            if (error) return;
            onChange({ id: "custom", from, to });
            setOpen(false);
          }}
        >
          <div className="grid grid-cols-2 gap-[8px]">
            <label className="text-[12px] text-[#6b7393]">
              From
              <input
                type="date"
                value={from}
                max={today}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-[4px] h-[34px] w-full rounded-[8px] border border-[#dfe3ef] px-[8px] text-[13px] text-[#141b45] outline-none focus:border-[#8f9de0]"
              />
            </label>
            <label className="text-[12px] text-[#6b7393]">
              To
              <input
                type="date"
                value={to}
                min={from || undefined}
                max={today}
                onChange={(e) => setTo(e.target.value)}
                className="mt-[4px] h-[34px] w-full rounded-[8px] border border-[#dfe3ef] px-[8px] text-[13px] text-[#141b45] outline-none focus:border-[#8f9de0]"
              />
            </label>
          </div>
          {error && <p className="mt-[6px] text-[12px] text-[#e0201b]">{error}</p>}
          <div className="mt-[10px] flex justify-end gap-[8px]">
            <button
              type="button"
              onClick={() => setCustom(false)}
              className="h-[32px] rounded-[8px] px-[12px] pt-[2px] text-[13px] text-[#141b45] hover:bg-[#f4f6fc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!error}
              className="h-[32px] rounded-[8px] bg-[#2d2de5] px-[14px] pt-[2px] text-[13px] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </form>
      )}
    </Dropdown>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Centre filter                               */
/* -------------------------------------------------------------------------- */

export function CentreFilter({ value, onChange }: { value: Centre; onChange: (c: Centre) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = centres.filter((c) => c.toLowerCase().includes(q));

  const pick = (c: Centre) => {
    onChange(c);
    setOpen(false);
  };

  return (
    <Dropdown
      icon={<PinIcon className="h-[17px] w-[15px] shrink-0 text-[#1f3fe0]" />}
      label={value ?? "All Centres"}
      open={open}
      setOpen={(next) => {
        setOpen(next);
        if (next) setQuery("");
      }}
      minWidth="143px"
      padLeft={16}
      panelWidth="248px"
      ariaLabel="Centre"
    >
      <label className="mb-[6px] flex h-[34px] items-center rounded-[8px] border border-[#dfe3ef] px-[10px] focus-within:border-[#8f9de0]">
        <SearchIcon className="h-[14px] w-[14px] shrink-0 text-[#6b7393]" />
        <input
          data-autofocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && matches.length === 1) pick(matches[0]);
          }}
          placeholder="Search city / centre"
          aria-label="Search city or centre"
          className="ml-[8px] h-full min-w-0 flex-1 bg-transparent pt-[2px] text-[13.5px] outline-none placeholder:text-[#8a91ad]"
        />
      </label>
      <div role="listbox" aria-label="Centre" className="max-h-[264px] overflow-y-auto">
        {!q && (
          <>
            <Option selected={value === null} hint={`${centres.length} centres`} onSelect={() => pick(null)}>
              All Centres
            </Option>
            <div className="my-[4px] h-px bg-[#eef0f6]" />
          </>
        )}
        {matches.map((c) => (
          <Option key={c} selected={value === c} onSelect={() => pick(c)}>
            {c}
          </Option>
        ))}
        {!matches.length && (
          <p className="px-[10px] py-[10px] text-[13px] text-[#6b7393]">No centre matches “{query}”.</p>
        )}
      </div>
    </Dropdown>
  );
}
