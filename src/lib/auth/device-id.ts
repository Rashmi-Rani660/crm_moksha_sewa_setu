/**
 * Random id for this browser, kept in localStorage. The CRM uses it to recognise devices that were
 * already verified (no e-mail code on the next sign-in). Only its hash is stored on the server.
 * If storage is blocked, a per-tab id is used — the user is then asked to verify again next time.
 */
const KEY = "sewa-setu:device-id";
let fallback: string | null = null;

function newId(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getDeviceId(): string {
  try {
    const existing = window.localStorage.getItem(KEY);
    if (existing && /^[A-Za-z0-9_-]{16,128}$/.test(existing)) return existing;
    const id = newId();
    window.localStorage.setItem(KEY, id);
    return id;
  } catch {
    fallback ??= newId();
    return fallback;
  }
}
