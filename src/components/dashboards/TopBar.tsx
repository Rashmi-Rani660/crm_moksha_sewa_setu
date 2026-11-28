"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type CSSProperties } from "react";
import { Bell, ChevronDown, CircleUserRound, LogOut, Menu, Mic, Search, Send, Sparkles } from "lucide-react";
import { DESIGN_W, useMenuToggle } from "@/components/dashboards/canvas";
import { sectionHref, sectionsOf } from "@/components/dashboards/shells";
import { usePopover } from "@/components/dashboards/usePopover";
import { canViewDashboard, signOut, useAuthSession, viewDashboard, type Role } from "@/lib/auth/session";
import { authorizedRequest } from "@/lib/api/authorized";
import { qs, useCrmQuery } from "@/lib/api/useCrmQuery";
import { ACCESS_LEVEL_LABEL, shortDateTime } from "@/lib/format";

/** Design x positions (full 1600px canvas) of the header pieces. */
export type TopBarSpec = {
  sidebarWidth: number;
  menuX: number;
  logoX: number;
  dividerX: number;
  crmX: number;
  search: { x: number; w: number; placeholder: string; size?: number };
  bellX: number;
  /** Unread notifications shown on the bell. */
  notifications: number;
  /** Line before the profile; omitted in the SA-011+ designs. */
  divider2X?: number;
  avatarX: number;
  chevronX: number;
  /** Profile name font size (default 18). */
  nameSize?: number;
  /** Smaller avatar with the chevron in line after the text (SA-011+ designs). */
  compactProfile?: boolean;
  user: { name: string; role: string };
  roleSize?: number;
  /** Blue "CRM" pill after the wordmark (design x). */
  crmBadgeX?: number;
  /** Purple "Ask AI" button (design x, width). */
  askAi?: { x: number; w: number };
  /** Voice-search mic inside the search box. */
  mic?: boolean;
};

export default function TopBar({ spec, role, menuOpen }: { spec: TopBarSpec; role: Role; menuOpen: boolean }) {
  const { sidebarWidth: sb } = spec;
  const x = (v: number) => ({ left: v - sb }) as CSSProperties;
  const toggleMenu = useMenuToggle();

  const menuButton = (
    <button
      type="button"
      aria-label={menuOpen ? "Hide menu" : "Show menu"}
      aria-expanded={menuOpen}
      aria-controls="dashboard-sidebar"
      onClick={toggleMenu}
      className="flex h-[30px] w-[32px] items-center justify-center rounded-[6px] text-[#0b0c36] hover:bg-[#eef1f8]"
    >
      <Menu strokeWidth={2.6} className="h-[32px] w-[34px]" />
    </button>
  );

  return (
    <header className="relative z-30 border-b lg:h-[60px] border-[#dfe3ec] bg-[#fbfcfe] shadow-[0_2px_6px_rgba(30,45,90,0.06)] lg:absolute lg:inset-x-0 lg:top-0">
      {/* Below lg: compact bar */}
      <div className="lg:hidden">
        <div className="flex h-[56px] items-center gap-3 px-3">
          {menuButton}
          <Link href={`/dashboard/${role}`} className="whitespace-nowrap text-[22px] font-bold leading-none tracking-[-0.5px] text-[#0a0b3c]">Sewa Setu</Link>
          <div className="relative ml-auto"><Notifications role={role} count={spec.notifications} /></div>
          <div className="relative"><ProfileMenu role={role} user={spec.user} compact /></div>
        </div>
        <div className="px-3 pb-2.5">
          <SearchBox role={role} placeholder="Search sections…" size={15} />
        </div>
      </div>

      <div style={{ width: DESIGN_W - sb }} className="relative mx-auto hidden h-full max-w-full lg:block lg:[transform:scaleX(var(--k))]">
        <div style={x(spec.menuX)} className="absolute top-[14px]">{menuButton}</div>

        {/* Sewa Setu wordmark */}
        <Link href={`/dashboard/${role}`} aria-label="Sewa Setu dashboard" style={x(spec.logoX)} className="absolute top-[12px] w-[112px]">
          <span className="block whitespace-nowrap text-[24.4px] font-bold leading-none tracking-[-0.5px] text-[#0a0b3c]">Sewa Setu</span>
          {/* Swoosh traced from the brand artwork; viewBox units = artwork px with
              the wordmark's left edge at x 0 and its cap height at y 0 → 22. */}
          <svg viewBox="0 0 147 50" className="pointer-events-none absolute left-[-2.8px] top-[-1px] h-[38.8px] w-[114px]" aria-hidden>
            <defs>
              <linearGradient id="sewa-setu-swoosh" x1="0" x2="1">
                <stop offset="0" stopColor="#f6b02a" />
                <stop offset="0.3" stopColor="#fdac0b" />
                <stop offset="0.55" stopColor="#ffa406" />
                <stop offset="0.85" stopColor="#f9b011" />
                <stop offset="1" stopColor="#efbb45" />
              </linearGradient>
            </defs>
            <path d="M4.0 35.2C6.2 35.6 12.5 37.0 17.0 37.8C21.5 38.6 26.7 39.5 31.0 39.8C35.3 40.1 38.7 39.9 43.0 39.4C47.3 38.9 52.3 37.9 57.0 37.0C61.7 36.1 66.0 35.2 71.0 34.0C76.0 32.8 81.7 30.9 87.0 30.0C92.3 29.1 97.0 29.0 103.0 28.8C109.0 28.6 118.0 28.6 123.0 28.9C128.0 29.2 129.5 29.8 133.0 30.8C136.5 31.8 142.2 34.3 144.0 35.0L144.0 35.4C142.2 35.2 136.5 34.2 133.0 34.0C129.5 33.8 127.3 33.8 123.0 34.0C118.7 34.2 113.0 34.0 107.0 35.0C101.0 36.0 93.0 38.3 87.0 40.0C81.0 41.7 76.0 43.8 71.0 45.0C66.0 46.2 61.7 46.7 57.0 47.0C52.3 47.3 47.3 47.2 43.0 47.0C38.7 46.8 35.3 46.8 31.0 46.0C26.7 45.2 21.5 43.7 17.0 42.0C12.5 40.3 6.2 36.7 4.0 35.6Z" fill="url(#sewa-setu-swoosh)" />
          </svg>
        </Link>

        {spec.crmBadgeX !== undefined && (
          <span style={x(spec.crmBadgeX)} className="absolute top-[17px] flex h-[22px] items-center rounded-full bg-[linear-gradient(180deg,#3f8cff,#1f62e0)] px-[12px] pt-px text-[14.5px] font-bold leading-none tracking-[0.3px] text-white shadow-[0_2px_5px_rgba(31,98,224,0.35)]">
            CRM
          </span>
        )}

        <span style={x(spec.dividerX)} className="absolute top-[10px] h-[36px] w-[1.5px] bg-[#3a3d55]" />

        <p style={x(spec.crmX)} className="absolute top-[16px] whitespace-nowrap text-[19.5px] font-semibold leading-none tracking-[-0.2px] text-[#131313]">
          CRM for Humanitarian Services
        </p>

        <div style={{ ...x(spec.search.x), width: spec.search.w }} className="absolute top-[9px]">
          <SearchBox role={role} placeholder={spec.search.placeholder} size={spec.search.size ?? 16.5} mic={spec.mic} />
        </div>

        {spec.askAi && (
          <div style={{ ...x(spec.askAi.x), width: spec.askAi.w }} className="absolute top-[11px]">
            <AskAi />
          </div>
        )}

        <div style={x(spec.bellX)} className="absolute top-[12px]">
          <Notifications role={role} count={spec.notifications} />
        </div>

        {spec.divider2X !== undefined && <span style={x(spec.divider2X)} className="absolute top-[10px] h-[38px] w-[1.5px] bg-[#3a3d55]" />}

        <div style={{ left: spec.avatarX - sb }} className="absolute top-[7px]">
          <ProfileMenu role={role} user={spec.user} chevron={spec.chevronX - spec.avatarX} roleSize={spec.roleSize ?? 13} nameSize={spec.nameSize ?? 18} inline={spec.compactProfile} />
        </div>
      </div>
    </header>
  );
}

/* --------------------------------- search --------------------------------- */

/** Finds dashboard sections by name; Enter or click opens the section. */
function SearchBox({ role, placeholder, size, mic = false }: { role: Role; placeholder: string; size: number; mic?: boolean }) {
  const router = useRouter();
  const listId = useId();
  const { open, setOpen, ref } = usePopover();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  const matches = q ? sectionsOf(role).filter((s) => words.every((w) => s.label.toLowerCase().includes(w))).slice(0, 8) : [];

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div ref={ref} className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const hit = matches[index] ?? matches[0];
          if (hit) go(hit.href);
        }}
        className="flex h-[36px] items-center rounded-full border border-[#9ea3b5] bg-white pl-[16px] pr-[14px] focus-within:border-[#5b6fe0]"
      >
        <Search strokeWidth={2.6} className="h-[21px] w-[21px] shrink-0 text-[#0b0c36]" />
        <input
          type="search"
          role="combobox"
          aria-expanded={open && !!q}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder={placeholder}
          aria-label="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(i + 1, matches.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(i - 1, 0));
            }
          }}
          style={{ fontSize: size }}
          className="ml-[11px] h-full min-w-0 flex-1 bg-transparent pt-[3px] font-semibold tracking-[-0.25px] text-[#1b1c38] outline-none placeholder:text-[#272844]"
        />
        {mic && (
          <VoiceButton
            onText={(t) => {
              setQuery(t);
              setIndex(0);
              setOpen(true);
            }}
          />
        )}
      </form>
      {open && q && (
        <ul id={listId} role="listbox" aria-label="Search results" className="absolute inset-x-0 top-[42px] z-50 max-h-[320px] overflow-y-auto rounded-[12px] border border-[#e3e7ef] bg-white p-[6px] shadow-[0_14px_36px_rgba(20,35,90,0.16)]">
          {matches.length ? (
            matches.map((m, i) => (
              <li key={m.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(m.href)}
                  className={`flex h-[36px] w-full items-center rounded-[8px] px-[12px] pt-[2px] text-left text-[15px] font-semibold ${i === index ? "bg-[#eef2ff] text-[#2320c4]" : ""}`}
                >
                  {m.label}
                </button>
              </li>
            ))
          ) : (
            <li className="px-[12px] py-[10px] text-[16px] font-medium text-[#5b6280]">No section matches “{query}”.</li>
          )}
        </ul>
      )}
    </div>
  );
}

type Recognition = { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void };

/** Voice search: fills the search box using the browser's speech recognition. */
function VoiceButton({ onText }: { onText: (t: string) => void }) {
  const [listening, setListening] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  return (
    <button
      type="button"
      aria-label={listening ? "Listening…" : "Search by voice"}
      title={unsupported ? "Voice search is not supported in this browser" : "Search by voice"}
      onClick={() => {
        const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
        const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
        if (!Ctor) return setUnsupported(true);
        const rec = new Ctor();
        rec.lang = "en-IN";
        rec.interimResults = false;
        rec.onresult = (e) => onText(e.results[0][0].transcript);
        rec.onend = () => setListening(false);
        rec.onerror = () => setListening(false);
        setListening(true);
        rec.start();
      }}
      className={`ml-[6px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full ${listening ? "bg-[#fde0e0] text-[#e02424]" : unsupported ? "text-[#9aa1b5]" : "text-[#0b0c36] hover:bg-[#eef1f8]"}`}
    >
      <Mic strokeWidth={2.4} className={`h-[18px] w-[18px] ${listening ? "animate-pulse" : ""}`} />
    </button>
  );
}

/* ---------------------------------- Ask AI --------------------------------- */

const aiSuggestions = ["Show emergency requests", "Overdue tasks today", "Pending approvals summary"];

function AskAi() {
  const { open, setOpen, ref } = usePopover();
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const ask = (text: string) => {
    if (!text.trim()) return;
    setQ(text);
    // TODO: connect the AI assistant API.
    setAnswer("The AI assistant is not connected yet. Your question will be answered here once it is live.");
  };
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-[34px] w-full items-center justify-center gap-[6px] rounded-[9px] bg-[linear-gradient(135deg,#7b2ff7,#5b21d6)] text-[16px] font-semibold text-white shadow-[0_3px_8px_rgba(91,33,214,0.35)] hover:brightness-110"
      >
        <Sparkles strokeWidth={2.2} className="h-[16px] w-[16px]" />
        <span className="pt-px">Ask AI</span>
      </button>
      {open && (
        <div role="dialog" aria-label="Ask AI" className="absolute right-0 top-[42px] z-50 w-[320px] rounded-[12px] border border-[#e3e7ef] bg-white p-[12px] shadow-[0_14px_36px_rgba(20,35,90,0.16)]">
          <p className="flex items-center gap-[6px] text-[15px] font-bold"><Sparkles strokeWidth={2.2} className="h-[16px] w-[16px] text-[#6d28d9]" />Ask AI</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(q);
            }}
            className="mt-[8px] flex items-center gap-[6px] rounded-[9px] border border-[#cfd5e2] px-[8px] focus-within:border-[#6d28d9]"
          >
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about requests, cases, tasks…" aria-label="Ask AI" className="h-[34px] min-w-0 flex-1 bg-transparent text-[15.5px] font-medium outline-none" />
            <button type="submit" aria-label="Send" className="text-[#6d28d9]"><Send strokeWidth={2.2} className="h-[16px] w-[16px]" /></button>
          </form>
          <div className="mt-[8px] flex flex-wrap gap-[6px]">
            {aiSuggestions.map((s) => (
              <button key={s} type="button" onClick={() => ask(s)} className="rounded-full bg-[#f1ebff] px-[10px] py-[3px] text-[14px] font-semibold text-[#5b21b6] hover:bg-[#e6dcff]">{s}</button>
            ))}
          </div>
          {answer && <p className="mt-[10px] rounded-[8px] bg-[#f6f8fd] p-[8px] text-[14.5px] font-medium text-[#3b4256]">{answer}</p>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------ notifications ------------------------------ */

type InboxItem = { id: string; title: string; message: string; read: boolean; priority: string; createdAt: string };
type InboxSummary = { unread: number };

/** The signed-in user's CRM notifications (GET /crm/notifications). `count` is the design placeholder, unused. */
function Notifications({ role }: { role: Role; count: number }) {
  const { open, setOpen, ref } = usePopover();
  const inbox = useCrmQuery<InboxItem[]>(`/notifications${qs({ limit: 6 })}`);
  const summary = useCrmQuery<InboxSummary>("/notifications/summary");
  const notices = inbox.data ?? [];
  const unread = summary.data?.unread ?? 0;
  const refresh = () => {
    inbox.reload();
    summary.reload();
  };
  const markRead = () => {
    authorizedRequest("/notifications/read-all", { method: "POST" }).then(refresh, refresh);
  };
  const openOne = (id: string) => {
    setOpen(false);
    authorizedRequest(`/notifications/${id}/read`, { method: "POST" }).then(refresh, refresh);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={unread ? `${unread} unread notifications` : "Notifications"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative h-[32px] w-[32px] text-[#0b0c36]"
      >
        <Bell strokeWidth={2.3} className="h-[32px] w-[32px]" />
        {unread > 0 && (
          <span className="absolute -top-[6px] left-[19px] flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#f00a06] px-[4px] pt-[2px] text-[14px] font-semibold leading-none text-white ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute right-[-60px] top-[44px] z-50 w-[340px] rounded-[12px] border border-[#e3e7ef] bg-white shadow-[0_14px_36px_rgba(20,35,90,0.16)]">
          <div className="flex items-center justify-between border-b border-[#eef0f6] px-[14px] py-[10px]">
            <p className="text-[16px] font-bold">
              Notifications {unread > 0 && <span className="text-[15px] font-semibold text-[#5b6280]">({unread} unread)</span>}
            </p>
            <button type="button" disabled={!unread} onClick={markRead} className="text-[15px] font-semibold text-[#2320c4] hover:underline disabled:text-[#9aa1b5] disabled:no-underline">
              Mark all as read
            </button>
          </div>
          <ul className="p-[6px]">
            {notices.map((n) => (
              <li key={n.id}>
                <Link
                  href={sectionHref(role, "Notifications")}
                  onClick={() => openOne(n.id)}
                  className="flex items-start gap-[10px] rounded-[8px] px-[10px] py-[8px] hover:bg-[#f4f6fc]"
                >
                  <span className={`mt-[6px] h-[8px] w-[8px] shrink-0 rounded-full ${n.read ? "bg-[#c4cad6]" : "bg-[#2f6fe0]"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold leading-snug">{n.title}</span>
                    <span className="block text-[14px] font-medium text-[#5b6280]">{shortDateTime(n.createdAt)} · {n.message}</span>
                  </span>
                </Link>
              </li>
            ))}
            {!notices.length && (
              <li className="px-[10px] py-[12px] text-[15px] font-medium text-[#5b6280]">{inbox.loading ? "Loading…" : inbox.error ?? "No notifications yet."}</li>
            )}
          </ul>
          <Link
            href={sectionHref(role, "Notifications")}
            onClick={() => setOpen(false)}
            className="block border-t border-[#eef0f6] py-[10px] text-center text-[16px] font-semibold text-[#2320c4] hover:bg-[#f7f9ff]"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- profile -------------------------------- */

type NavigationApi = {
  entries(): { url: string | null; key: string }[];
  currentEntry: { index: number } | null;
  traverseTo(key: string): { finished: Promise<unknown> };
};

/**
 * After sign-out, step back to the first dashboard entry of this visit (so
 * the dashboard pages behind it are not left in Back history), then run
 * `done`, which replaces that entry with /login. Without the Navigation API
 * (e.g. Firefox) `done` runs right away. If the step back loads another
 * document, that page's own guard sends it to /login (the session is gone).
 */
function leaveDashboard(done: () => void) {
  let ran = false;
  const finish = () => {
    if (ran) return;
    ran = true;
    done();
  };
  const nav = (window as unknown as { navigation?: NavigationApi }).navigation;
  const current = nav?.currentEntry;
  if (!nav || !current || typeof nav.traverseTo !== "function") return finish();
  const entries = nav.entries();
  const isDashboard = (url: string | null) => !!url && new URL(url).pathname.startsWith("/dashboard");
  let first = current.index;
  while (first > 0 && isDashboard(entries[first - 1]?.url)) first--;
  if (first === current.index) return finish();
  window.setTimeout(finish, 1500);
  try {
    nav.traverseTo(entries[first].key).finished.then(finish, finish);
  } catch {
    finish();
  }
}

function ProfileMenu({
  role,
  user: designUser,
  chevron = 0,
  roleSize = 13,
  nameSize = 18,
  inline = false,
  compact = false,
}: {
  role: Role;
  user: TopBarSpec["user"];
  chevron?: number;
  roleSize?: number;
  nameSize?: number;
  /** Chevron in line after the text, smaller avatar. */
  inline?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const { session } = useAuthSession();
  const { open, setOpen, ref } = usePopover();
  // The signed-in person, not the design placeholder.
  const user = session ? { name: session.name, role: ACCESS_LEVEL_LABEL[session.accessLevel] } : designUser;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${user.name}, ${user.role}: account menu`}
        onClick={() => setOpen(!open)}
        style={compact || inline ? undefined : { width: chevron + 22 }}
        className="flex h-[44px] items-center text-left"
      >
        <span className={`flex shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#2f95e3,#0d6fbf)] font-semibold text-white ${inline ? "h-[32px] w-[32px] pt-[2px] text-[17px]" : "h-[43px] w-[43px] pt-[3px] text-[23px]"}`}>
          {user.name.charAt(0)}
        </span>
        {!compact && (
          <span className={`min-w-0 ${inline ? "ml-[8px]" : "ml-[11px]"}`}>
            <span style={{ fontSize: nameSize }} className="block whitespace-nowrap font-semibold leading-none tracking-[-0.3px] text-[#0b0c36]">{user.name}</span>
            <span style={{ fontSize: roleSize }} className={`${inline ? "mt-[3px]" : "mt-[5px]"} block whitespace-nowrap font-semibold leading-none tracking-[-0.3px] text-[#1f2236]`}>{user.role}</span>
          </span>
        )}
        {inline && !compact && (
          <ChevronDown strokeWidth={2.4} aria-hidden className={`ml-[8px] h-[16px] w-[16px] shrink-0 text-[#0b0c36] transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      {!compact && !inline && (
        <ChevronDown
          strokeWidth={2.4}
          aria-hidden
          style={{ left: chevron }}
          className={`pointer-events-none absolute top-[13px] h-[20px] w-[20px] text-[#0b0c36] transition-transform ${open ? "rotate-180" : ""}`}
        />
      )}

      {open && (
        <div role="menu" className="absolute right-[-12px] top-[52px] z-50 w-[220px] rounded-[12px] border border-[#e3e7ef] bg-white p-[6px] shadow-[0_14px_36px_rgba(20,35,90,0.16)]">
          <div className="px-[10px] py-[8px]">
            <p className="text-[15px] font-semibold leading-tight">{user.name}</p>
            <p className="text-[15px] font-semibold text-[#5b6280]">{user.role}</p>
          </div>
          <div className="my-[4px] h-px bg-[#eef0f6]" />
          <Link
            href={sectionHref(role, "My Profile")}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex h-[36px] w-full items-center gap-[10px] rounded-[8px] px-[10px] text-[16px] font-semibold hover:bg-[#f4f6fc]"
          >
            <CircleUserRound className="h-[16px] w-[16px]" />
            <span className="pt-[2px]">My Profile</span>
          </Link>
          {role !== "user" ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                if (viewDashboard("user")) router.push("/dashboard/user/my-tasks");
              }}
              className="flex h-[36px] w-full items-center gap-[10px] rounded-[8px] px-[10px] text-[16px] font-semibold text-[#1d4fe0] hover:bg-[#f1f4fb]"
            >
              <CircleUserRound className="h-[16px] w-[16px]" />
              <span className="pt-[2px]">User</span>
            </button>
          ) : (
            // Back to the Super Admin dashboard — only for someone who actually has that access.
            canViewDashboard(session, "super-admin") && <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                if (viewDashboard("super-admin")) router.push("/dashboard/super-admin");
              }}
              className="flex h-[36px] w-full items-center gap-[10px] rounded-[8px] px-[10px] text-[16px] font-semibold text-[#1d4fe0] hover:bg-[#f1f4fb]"
            >
              <CircleUserRound className="h-[16px] w-[16px]" />
              <span className="pt-[2px]">Super Admin</span>
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              signOut(); // always first: the session ends no matter what follows
              // full load of /login: nothing from the signed-in screens survives
              leaveDashboard(() => window.location.replace("/login"));
            }}
            className="flex h-[36px] w-full items-center gap-[10px] rounded-[8px] px-[10px] text-[16px] font-semibold text-[#d61f1f] hover:bg-[#fdf1f1]"
          >
            <LogOut className="h-[16px] w-[16px]" />
            <span className="pt-[2px]">Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}
