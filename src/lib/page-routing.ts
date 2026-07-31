/**
 * Printed page number -> a *labelled* destination.
 *
 * `pageIndex()` in ./content answers "where does page 12 go". It does not answer "what
 * is on page 12", and every surface that resolves a page number has to say so out loud:
 * the homepage prints the destination live as the reader types, /p/[page] names it
 * before it moves, /p/ lists all 65. Deriving that label three times would let the three
 * drift apart, and printed page numbers are the one thing on this site that can never be
 * corrected after the fact (D13).
 *
 * Labels are composed from the extracted book data, never written here.
 */

import { allChapters, allBuilds, allWorksheets, allSequences, pageIndex } from "./content";

export const FIRST_PAGE = 1;
/** The book ends here, on "End of the condensed edition". */
export const LAST_PRINTED_PAGE = 64;
/** One past the end, which is where Chapter 16 lives (D13). */
export const LAST_PAGE = 65;

export interface PageTarget {
  /** The page the reader asked for. */
  page: number;
  href: string;
  /** What kind of thing it is: "Chapter 04", "24-Hour Build", "Worksheet". */
  kind: string;
  /** Its name, verbatim from the book. */
  label: string;
  /** False when the reader's page carries no tool and we fell back to the nearest one. */
  exact: boolean;
  /** The printed page the destination actually covers. Equals `page` when exact. */
  landsOn: number;
}

const pad = (n: number): string => String(n).padStart(2, "0");

let _labels: Map<string, { kind: string; label: string }> | undefined;

/**
 * Canonical path -> how to name it. Keyed by href rather than by page so that
 * `pageIndex()` stays the single authority on which page goes where; this module only
 * supplies the words.
 */
async function hrefLabels(): Promise<Map<string, { kind: string; label: string }>> {
  if (_labels) return _labels;

  const m = new Map<string, { kind: string; label: string }>();

  for (const c of await allChapters()) {
    m.set(`/c/${pad(c.data.n)}`, { kind: `Chapter ${pad(c.data.n)}`, label: c.data.title });
  }
  for (const b of await allBuilds()) {
    m.set(`/build/${pad(b.data.n)}`, { kind: "24-Hour Build", label: b.data.source });
  }
  for (const w of await allWorksheets()) {
    m.set(`/worksheet/${w.id}`, { kind: "Worksheet", label: w.data.title });
  }
  for (const s of await allSequences()) {
    m.set(`/path/${s.id}`, { kind: "Plan", label: s.data.title });
  }

  m.set("/offers", { kind: "Table", label: "Seven Safe First Offers" });
  m.set("/parents", { kind: "For parents and teachers", label: "Race Control" });
  m.set("/c/16", { kind: "Chapter 16", label: "The chapter that is not in the book" });

  return (_labels = m);
}

/**
 * Resolve one printed page.
 *
 * Pages inside the book that carry no tool of their own resolve to the nearest page that
 * does, flagged `exact: false` so the caller can explain itself. They must never 404 —
 * the first print run is already in readers' hands and a dead number there is permanent.
 *
 * The nearest-neighbour search deliberately excludes 65: a reader who types 63 or 64 has
 * mistyped or is on the last spread, and handing them Chapter 16 would spend the one
 * piece of delight in the routing on an accident.
 */
export async function resolvePage(page: number): Promise<PageTarget | undefined> {
  if (!Number.isInteger(page) || page < FIRST_PAGE || page > LAST_PAGE) return undefined;

  const index = await pageIndex();
  const labels = await hrefLabels();

  const name = (href: string) => labels.get(href) ?? { kind: "Tool", label: href };

  const exactHref = index.get(page);
  if (exactHref) {
    return { page, href: exactHref, ...name(exactHref), exact: true, landsOn: page };
  }

  let bestPage: number | undefined;
  for (const candidate of index.keys()) {
    if (candidate > LAST_PRINTED_PAGE) continue;
    if (
      bestPage === undefined ||
      Math.abs(candidate - page) < Math.abs(bestPage - page) ||
      // Tie: prefer the earlier page. The reader has just turned past it, so it is the
      // one they were most recently looking at.
      (Math.abs(candidate - page) === Math.abs(bestPage - page) && candidate < bestPage)
    ) {
      bestPage = candidate;
    }
  }
  if (bestPage === undefined) return undefined;

  const href = index.get(bestPage)!;
  return { page, href, ...name(href), exact: false, landsOn: bestPage };
}

/** Every page 1–65, resolved. Used by getStaticPaths and by the two page-number fields. */
export async function allResolved(): Promise<PageTarget[]> {
  const out: PageTarget[] = [];
  for (let p = FIRST_PAGE; p <= LAST_PAGE; p += 1) {
    const t = await resolvePage(p);
    if (t) out.push(t);
  }
  return out;
}
