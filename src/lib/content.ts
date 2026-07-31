/**
 * Memoised content accessors and derived indexes.
 *
 * Never call getCollection() from a page or component (docs/decisions.md D20). Astro
 * re-walks every entry looking for image references on each call — measured at roughly
 * 70ms per uncached call — and this site's shape guarantees many calls: 15 chapter pages
 * want prev/next, 19 build pages want their chapter and Reality Check, and the hub,
 * the Reality Check library, search and OG generation each want everything again.
 *
 * The module cache lives for the whole build, so every index below is computed once.
 */

import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type Chapter = CollectionEntry<"chapters">;
export type Build = CollectionEntry<"builds">;
export type RealityCheck = CollectionEntry<"realityChecks">;
export type Worksheet = CollectionEntry<"worksheets">;
export type Sequence = CollectionEntry<"sequences">;
export type Offer = CollectionEntry<"offers">;

let _chapters: Chapter[] | undefined;
let _builds: Build[] | undefined;
let _checks: RealityCheck[] | undefined;
let _worksheets: Worksheet[] | undefined;
let _sequences: Sequence[] | undefined;
let _offers: Offer[] | undefined;

export const allChapters = async (): Promise<Chapter[]> =>
  (_chapters ??= (await getCollection("chapters")).sort((a, b) => a.data.n - b.data.n));

export const allBuilds = async (): Promise<Build[]> =>
  (_builds ??= (await getCollection("builds")).sort((a, b) => a.data.n - b.data.n));

export const allRealityChecks = async (): Promise<RealityCheck[]> =>
  (_checks ??= (await getCollection("realityChecks")).sort(
    (a, b) => a.data.printedPage - b.data.printedPage,
  ));

export const allWorksheets = async (): Promise<Worksheet[]> =>
  (_worksheets ??= await getCollection("worksheets"));

export const allSequences = async (): Promise<Sequence[]> =>
  (_sequences ??= await getCollection("sequences"));

export const allOffers = async (): Promise<Offer[]> =>
  (_offers ??= (await getCollection("offers")).sort((a, b) => a.data.n - b.data.n));

/* --- Derived indexes -------------------------------------------------------- */

export async function chapterBySlug(slug: string): Promise<Chapter | undefined> {
  return (await allChapters()).find((c) => c.data.slug === slug);
}

export async function buildForChapter(n: number): Promise<Build | undefined> {
  return (await allBuilds()).find((b) => b.data.chapter === n);
}

export async function chapterNeighbours(
  n: number,
): Promise<{ prev: Chapter | undefined; next: Chapter | undefined }> {
  const list = await allChapters();
  return { prev: list[n - 2], next: list[n] };
}

/**
 * Printed page number -> the canonical path for that page.
 *
 * This is the mechanism that retro-fits deep links into an already-printed first run
 * (D13). Both printed QR codes resolve only to the bare root, and a reader holding the
 * open book has a page number, not a browsing intent. It also works where a camera
 * cannot: Dutch classrooms have banned phones since 1 January 2024 and school
 * Chromebooks have no scanning workflow, but any device can type a number.
 *
 * Page 65 is deliberate: the book ends on printed page 64 with "End of the condensed
 * edition", so one past the end is where Chapter 16 lives.
 */
export async function pageIndex(): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  const chapters = await allChapters();
  const builds = await allBuilds();
  const worksheets = await allWorksheets();
  const sequences = await allSequences();

  // Chapters occupy three printed pages each, starting at their opener.
  for (const c of chapters) {
    for (let p = c.data.printedPage; p < c.data.printedPage + 3; p += 1) {
      map.set(p, `/c/${String(c.data.n).padStart(2, "0")}`);
    }
  }
  for (const w of worksheets) map.set(w.data.printedPage, `/worksheet/${w.id}`);
  for (const s of sequences) map.set(s.data.printedPage, `/path/${s.id}`);

  /* LAST, so a build wins the page it is actually printed on.
     Order matters and used to be wrong: with builds set before worksheets and sequences,
     page 54 resolved to /worksheet/real-rich-scoreboard instead of /build/16 and page 59
     to /path/tiny-launch instead of /build/18 — and build 18 has no chapter page, so a
     reader typing a page number could not reach it at all. The reader holding page 59
     open is being told "Choose your Day 1 and put it in the calendar now"; the page they
     land on has to be the one that says that. */
  for (const b of builds) {
    map.set(b.data.printedPage, `/build/${String(b.data.n).padStart(2, "0")}`);
  }

  /* Printed page 2 is the Publishing Note, which carries one of the three Reality Checks
     that belong to no build. /terms renders it in full, so the page number must reach it —
     otherwise nearest-neighbour sends the reader to /build/01. */
  map.set(2, "/terms");
  map.set(57, "/offers");
  map.set(61, "/parents");
  map.set(65, "/c/16");

  return map;
}

export async function totals(): Promise<{
  chapters: number;
  builds: number;
  realityChecks: number;
  playSteps: number;
  debriefQuestions: number;
  worksheetFields: number;
  sequenceActions: number;
  offers: number;
  trackable: number;
}> {
  const chapters = await allChapters();
  const builds = await allBuilds();
  const checks = await allRealityChecks();
  const worksheets = await allWorksheets();
  const sequences = await allSequences();
  const offers = await allOffers();

  const playSteps = chapters.reduce((n, c) => n + c.data.play.length, 0);
  const debriefQuestions = chapters.reduce((n, c) => n + c.data.debrief.length, 0);
  const worksheetFields = worksheets.reduce((n, w) => n + w.data.fields.length, 0);
  const sequenceActions = sequences.reduce(
    (n, s) => n + s.data.groups.reduce((m, g) => m + g.items.length, 0),
    0,
  );

  return {
    chapters: chapters.length,
    builds: builds.length,
    realityChecks: checks.length,
    playSteps,
    debriefQuestions,
    worksheetFields,
    sequenceActions,
    offers: offers.length,
    trackable:
      builds.length + playSteps + debriefQuestions + worksheetFields + sequenceActions + offers.length,
  };
}
