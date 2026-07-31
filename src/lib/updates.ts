/**
 * The changelog, in one place, because two things render it: /updates and /updates.xml.
 *
 * Entries are appended, never rewritten. If something on this site turns out to be wrong,
 * the correction gets its own dated entry saying what was wrong — not a quiet edit. That
 * rule is stated on the page itself, so this file has to actually keep it.
 *
 * There is a feed because there is no newsletter and there never will be: a newsletter
 * needs an email address from a thirteen-year-old, which is the one thing this site exists
 * not to ask for. A feed reader needs no account, no address and no permission.
 */

export interface Entry {
  /** ISO date. Newest first. */
  date: string;
  title: string;
  items: string[];
}

export const ENTRIES: Entry[] = [
  {
    date: "2026-07-31",
    title: "Public beta, said out loud",
    items: [
      "This site is in public beta and says so on the homepage. It is reachable, it is crawlable, and it is not finished — so claiming otherwise on a site about not faking things was not an option.",
      "There is no verified helpline route yet, and that is now stated rather than implied. Every Reality Check, both AI tool pages, the parents page and the schools page carry one notice: nobody is on the other end of this site, and if it is happening today, tell one adult in the room.",
      "Fixed a real defect in bringing receipts in from another device. A file with more entries than this site keeps would have pushed a reader's own build ticks and written answers out of storage. Oversized files are now refused rather than trimmed, because choosing which of your records survive is not ours to do.",
      "The hosting section on the schools page can finally answer itself: the site is served by Vercel from fra1, Frankfurt, inside the EEA, and you can check that in the response headers yourself. Two items about their log fields and retention are still open, and stay named as open.",
      "Chapter 16 is now noindex and out of the sitemap until Ryan's text lands. It is still linked, still reachable, and typing 65 still works.",
    ],
  },
  {
    date: "2026-07-31",
    title: "Live, and the author page rewritten",
    items: [
      "The site went live. Every printed page number, /p/1 to /p/65, was checked against the live server: all 65 resolve.",
      "The author page at /proof was rewritten. It had been a claims table with a column of editorial notes beside it — useful to whoever was building the site, no use at all to a thirteen-year-old who had just put the book down. It is now a timeline: eight to thirteen, in order.",
      "The Formula 4 fact is now on that page, because the exact facts arrived. At eleven he drove an F4 car built to his measurements, and he trains in it rather than racing it. That is smaller than the rumour and more interesting than it.",
      "Still no count of wins or podiums anywhere, because a number without a source gets cut rather than rounded. The page says the results are published and tells you to go and look, which is what Chapter 7 tells you to do with anybody's claims.",
    ],
  },
  {
    date: "2026-07-30",
    title: "First public build",
    items: [
      "All 231 items from the printed book extracted and typed, so every word of book copy on this site is the book's own wording rather than a paraphrase.",
      "The Napoleon Hill audit published at /hill: what the record actually shows about Hill, with dates and two sources, and the two self-help statistics this site refuses to quote.",
      "The author page published at /proof: the karting record, and what he is building now.",
      "The book page published at /get: 64 pages, the word count, an honest reading time, what the book has that this site does not, and who it is not for.",
      "Scam Check and Shrink My First Step published as shells. Neither is live; both say so on the page and show exactly what they will ask for and give back.",
      "Privacy, terms and editions published. Privacy lists what is kept in your browser key by key.",
      "No analytics, no cookies, no third-party requests. A step in the build reads every published file and fails the release if an external host appears in it.",
    ],
  },
];

/** Named here rather than left for a reader to discover. Each becomes a dated entry above. */
export const MISSING = [
  "A verified helpline route — international, plus one for the Netherlands. This is the most urgent thing missing.",
  "The retailer link on /get. The book is sold through an outside retailer and the link is not confirmed.",
  "The free starter chapter, as a readable page and as a printable PDF. Neither file is in place.",
  "The ISBNs on /editions.",
  "What the host's access logs contain, and how long they are kept, on /schools/privacy.",
  "The serverless function behind the two AI tools. Until it exists, both tools are shells.",
  "Chapter 16, which Ryan is writing about what he learned after the book went to print.",
  "Links to the published karting results on /proof, so you can check each one without having to go searching for it.",
];

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
