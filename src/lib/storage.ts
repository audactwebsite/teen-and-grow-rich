/**
 * The ONLY module in this codebase allowed to touch persistent browser storage.
 *
 * Why a chokepoint (docs/decisions.md D23): ePrivacy Article 5(3) is technology-neutral,
 * so localStorage is covered by the same consent rule as cookies. The only escape is the
 * "strictly necessary for a service explicitly requested by the user" exemption. An
 * explicit theme choice and user-initiated saved work sit inside it. A device id minted
 * on first visit, or a "last page you were on" written during page load, sit outside it
 * and would oblige us to show a consent banner on a site for 13-year-olds whose entire
 * promise is that nothing leaves the device.
 *
 * Therefore: every write must originate from a user gesture. In dev, violating that
 * throws.
 *
 * The chokepoint itself is held by convention, not yet by a machine: there is no ESLint
 * config in this repo, so nothing stops a new island calling localStorage directly. Do
 * not read that as permission — the only permitted uses outside this module are the
 * pre-paint theme READ in src/lib/inline-scripts.mjs (which cannot be async without
 * flashing the wrong theme) and nothing else. Adding the lint rule, or a grep step in the
 * postbuild alongside tools/verify-no-external-hosts.mjs, is outstanding work; whichever
 * lands, update this paragraph rather than leaving a guard described that does not run.
 *
 * Shape (D22): an append-only event log, not a blob. Appending is order-independent, so
 * two prerendered tabs cannot clobber each other, and current state is a fold of the log.
 *
 * Durability (D24): this is a CACHE, never the record. WebKit deletes all script-writable
 * storage after seven days of Safari use without interaction with the site, school
 * Chromebooks wipe on sign-out, and private browsing keeps nothing. The durable artifacts
 * are the printable receipt and copy-as-text. Never tell the user their work is "saved" —
 * the word is "kept in this browser".
 */

const LOG_KEY = "tgr.log.v1";
/** Duplicated as a literal in the pre-paint script in src/lib/inline-scripts.mjs, which
 *  cannot import this module without becoming async. Change it in both places. */
const THEME_KEY = "tgr.theme.v1";
const MAX_EVENTS = 4000;

export type EventKind = "build" | "play" | "day" | "field" | "score";

/** One appended fact. Deliberately terse: this log is read far more often than written. */
export interface LogEvent {
  /** Unix seconds. */
  t: number;
  k: EventKind;
  /** e.g. "dream-big", "dream-big:3", "tiny-launch:w1d2", "first-offer-canvas:the-problem" */
  id: string;
  /** 0 or 1 for checkable things; a string for text fields; a number for scores. */
  v: 0 | 1 | string | number;
}

const isBrowser = (): boolean => typeof window !== "undefined";

/**
 * Speculation Rules prerender our pages before the user ever sees them, and Chrome's
 * docs warn localStorage is not transactionally safe across prerendered documents. A
 * prerendered chapter page must never record a visit the reader did not make.
 */
const isPrerendering = (): boolean =>
  isBrowser() && (document as Document & { prerendering?: boolean }).prerendering === true;

let gestureSeen = false;
if (isBrowser()) {
  const mark = () => {
    gestureSeen = true;
  };
  for (const type of ["pointerdown", "keydown", "touchstart"] as const) {
    window.addEventListener(type, mark, { capture: true, once: false, passive: true });
  }
  document.addEventListener("prerenderingchange", () => void flush(), { once: true });
  // Never on unload — that disqualifies the page from bfcache, which is the fastest
  // "back" a reader will ever get.
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
  window.addEventListener("pagehide", () => void flush());
}

/**
 * Null until a real write has been attempted; false means this device will not keep
 * anything (private mode, an MDM policy, blocked storage).
 */
let writable: boolean | null = null;

/**
 * Whether this device is expected to keep anything.
 *
 * Deliberately does NOT probe by writing. It used to: `setItem("tgr.probe", "1")` ran at
 * module scope on every page view, because every island calls this while painting its
 * initial state — including on documents Speculation Rules prerendered and the reader
 * never opened. That is a device write with no user gesture behind it, which is exactly
 * what /privacy promises does not happen and what the ePrivacy 5(3) "strictly necessary
 * for a service explicitly requested by the user" exemption — the whole reason this site
 * shows no consent banner — does not cover.
 *
 * So: optimistic until a genuine, gesture-originated write proves otherwise. `flush()` and
 * `writeTheme()` set the real answer from the outcome of the write the reader asked for,
 * and every read here is already wrapped in try/catch, so a device that throws on access
 * degrades to "nothing kept" rather than breaking.
 */
export function canKeep(): boolean {
  if (writable !== null) return writable;
  return isBrowser();
}

let cache: LogEvent[] | null = null;
let pending: LogEvent[] = [];
let flushScheduled = false;

function readLog(): LogEvent[] {
  if (cache) return cache;
  if (!isBrowser() || !canKeep()) return (cache = []);
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    cache = raw ? (JSON.parse(raw) as LogEvent[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

async function flush(): Promise<void> {
  flushScheduled = false;
  if (!pending.length || !isBrowser() || !canKeep() || isPrerendering()) return;

  const merged = [...readLog(), ...pending].slice(-MAX_EVENTS);
  pending = [];
  cache = merged;
  try {
    window.localStorage.setItem(LOG_KEY, JSON.stringify(merged));
    writable = true;
  } catch {
    // QuotaExceededError. Drop the oldest half rather than losing the newest work.
    try {
      const trimmed = merged.slice(-Math.floor(MAX_EVENTS / 2));
      window.localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
      cache = trimmed;
      writable = true;
    } catch {
      writable = false;
    }
  }
}

function scheduleFlush(): void {
  if (flushScheduled) return;
  flushScheduled = true;
  // Persist AFTER the interaction has painted. localStorage is synchronous main-thread
  // I/O, so doing it inside the click handler puts it on the INP critical path.
  const yieldFn =
    (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler?.yield?.bind(
      (globalThis as { scheduler?: unknown }).scheduler,
    ) ?? (() => new Promise<void>((r) => setTimeout(r, 0)));
  void yieldFn().then(flush);
}

/**
 * Append one fact. MUST be called from a user gesture.
 * Returns false if this device cannot keep anything, so the UI can say so honestly.
 */
export function record(kind: EventKind, id: string, value: LogEvent["v"]): boolean {
  if (!isBrowser()) return false;
  if (isPrerendering()) return false;

  if (import.meta.env.DEV && !gestureSeen) {
    throw new Error(
      `storage.record("${kind}", "${id}") was called without a preceding user gesture. ` +
        "Persisting outside an explicitly requested action breaks the ePrivacy 5(3) " +
        "exemption this site's no-cookie-banner claim depends on. See docs/decisions.md D23.",
    );
  }

  pending.push({ t: Math.floor(Date.now() / 1000), k: kind, id, v: value });
  scheduleFlush();
  return canKeep();
}

/** Current state, folded from the log. Last write for an id wins. */
export function state(): Map<string, LogEvent["v"]> {
  const out = new Map<string, LogEvent["v"]>();
  for (const e of [...readLog(), ...pending]) out.set(`${e.k}:${e.id}`, e.v);
  return out;
}

export function isDone(kind: EventKind, id: string): boolean {
  return state().get(`${kind}:${id}`) === 1;
}

export function valueOf(kind: EventKind, id: string): string | number | undefined {
  const v = state().get(`${kind}:${id}`);
  return typeof v === "string" || typeof v === "number" ? v : undefined;
}

/** Counts for the Receipts dashboard. Real numbers only — no scores, no levels, no badges. */
export function counts(): { builds: number; playSteps: number; fields: number } {
  let builds = 0;
  let playSteps = 0;
  let fields = 0;
  for (const [key, v] of state()) {
    if (key.startsWith("build:") && v === 1) builds += 1;
    else if (key.startsWith("play:") && v === 1) playSteps += 1;
    else if (key.startsWith("field:") && typeof v === "string" && v.trim()) fields += 1;
  }
  return { builds, playSteps, fields };
}

/* --- Getting work OFF this device -------------------------------------------
   D24: a JSON download then a file-input round trip is a hostile flow on an iPhone,
   which is where a large share of readers are. Copy-as-text is one tap and lands in
   the app they already use. Both exist; copy-as-text is the one we put first. */

export function exportJson(): string {
  return JSON.stringify({ v: 1, exportedAt: new Date().toISOString(), log: readLog() }, null, 2);
}

/**
 * Bring a log in from another device.
 *
 * The file comes from outside, so nothing in it is trusted. The first version checked that
 * `k` and `id` were strings and nothing else, which left three ways for one bad file to
 * destroy a reader's own record:
 *
 *  - No cap on how many entries arrive. The log holds MAX_EVENTS and trims from the OLDEST
 *    end, so a file with 10,000 rows silently evicts every build tick and every written
 *    answer the reader has. That is the same failure as the slider bug: the damage is not
 *    the bad data, it is what the bad data pushes out.
 *  - No cap on the length of `id` or a string `v`. Megabytes of one field fill the quota
 *    and every later write fails.
 *  - `t` was never checked, and the log is sorted and dated by it. One NaN and entries
 *    render at the epoch or not at all.
 *
 * No attacker is needed for any of this. A truncated download does it.
 */
const MAX_IMPORT_EVENTS = MAX_EVENTS;
const MAX_ID_LENGTH = 200;
const MAX_VALUE_LENGTH = 5000;
const EVENT_KINDS = new Set<EventKind>(["build", "play", "day", "field", "score"]);

function isSaneEvent(e: unknown): e is LogEvent {
  if (!e || typeof e !== "object") return false;
  const { t, k, id, v } = e as Partial<LogEvent>;
  if (typeof t !== "number" || !Number.isFinite(t) || t < 0) return false;
  if (typeof k !== "string" || !EVENT_KINDS.has(k as EventKind)) return false;
  if (typeof id !== "string" || id.length === 0 || id.length > MAX_ID_LENGTH) return false;
  if (typeof v === "string") return v.length <= MAX_VALUE_LENGTH;
  return typeof v === "number" && Number.isFinite(v);
}

export function importJson(raw: string): { ok: true; added: number } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(raw) as { v?: number; log?: unknown };
    if (!parsed || !Array.isArray(parsed.log)) {
      return { ok: false, error: "Not a Teen & Grow Rich export file." };
    }

    const usable = parsed.log.filter(isSaneEvent);
    if (usable.length === 0) {
      return { ok: false, error: "That file had nothing in it this site could read." };
    }
    if (usable.length > MAX_IMPORT_EVENTS) {
      /* Refuse rather than truncate. Silently keeping the first 4,000 of 40,000 is a
         decision about which of the reader's records survive, and it is not ours. */
      return {
        ok: false,
        error: `That file has ${usable.length} entries, more than this site keeps (${MAX_IMPORT_EVENTS}). Nothing was changed.`,
      };
    }

    pending.push(...usable);
    scheduleFlush();
    /* usable.length, not parsed.log.length. Reporting the count before filtering told the
       reader 150 entries had arrived when 3 had. */
    return { ok: true, added: usable.length };
  } catch {
    return { ok: false, error: "That file could not be read." };
  }
}

export function clearAll(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(LOG_KEY);
  } catch {
    /* Nothing was kept in the first place. Clearing the in-memory copy still matters. */
  }
  cache = [];
  pending = [];
}

/* --- Theme ------------------------------------------------------------------
   An explicit user preference, so it sits inside the 5(3) exemption. */

export type Theme = "dark" | "light";

export function readTheme(): Theme | null {
  if (!isBrowser()) return null;
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

export function writeTheme(theme: Theme): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
    writable = true;
  } catch {
    /* Private mode or a blocked-storage policy. The toggle still works for this page
       view; this is also the first honest evidence that nothing can be kept. */
    writable = false;
  }
}
