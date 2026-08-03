/**
 * The changelog, in one place, because two things render it: /updates and /updates.xml.
 *
 * Entries are appended. If something on this site turns out to be wrong, the correction
 * gets its own dated entry saying what was wrong — not a quiet edit. That rule is stated
 * on the page itself, so this file has to actually keep it. The 3 August entry is one:
 * the 31 July entry named a page as carrying the crisis notice when it does not, and both
 * the correction and the fixed sentence are here.
 *
 * What that rule does NOT protect is the wording. Several of these entries were written in
 * build vocabulary — "content pipeline", "zero-line diff", "noindex", "shells", "fra1" —
 * on a page a thirteen-year-old reads. Those were rewritten in place to say the same
 * events in words a reader has. Same facts, same dates, plainer sentences; a changelog
 * nobody can read is not a record of anything.
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
    date: "2026-08-03",
    title: "Corrections, and the karting sources went up",
    items: [
      "The author page now links the report for every dated result on it — four of them, written at the time by motorsport press with no stake in this book. Two entries still have no report to link to, and they now say so in the same words the Formula 4 entry uses, instead of sitting there looking sourced.",
      "A correction to the entry below dated 31 July. It said the schools privacy page carried the same notice as the Reality Checks — that nobody is on the other end of this site. It does not, and never did. The schools page carries the shorter public-beta note, the same one the homepage carries. The Reality Checks, both AI tool pages and the parents page carry the full notice. That entry has been corrected to say so.",
      "The parents page was recommending Scam Check in the present tense as the thing to hand a teenager who will not read the book. Scam Check is not built. It now says so on that page, the way the book page and the schools page already did.",
      "The page-number box was printing a route path as the name of a destination: type 2 and it answered \"Page 2 → Tool · /terms\". Page 2 is the book's Publishing Note, and that is what it says now. Nothing else on this site can print a raw address as a name any more — a missing name stops the site being built rather than reaching a reader.",
      "\"Print the agreement\" on the parents page was a button with nothing behind it: visible, orange, and inert, with the working instruction beside it hidden from everyone whose JavaScript was on. It prints now, and it prints the agreement rather than the whole page.",
    ],
  },
  {
    date: "2026-08-02",
    title: "One answer about copying, instead of three",
    items: [
      "Three pages gave three different answers about what you may do with the book. The book page said the PDF was already licensed to print, photocopy and put on a shared drive. The terms page said the stories were not published here at all, which had stopped being true the day before. The teachers page said the licence below allowed putting the file on a shared drive and sending it to a class, and the licence below said the opposite.",
      "The settled answer, in one line: everything this site made — the worksheets, the builds, the templates, the Reality Checks — is Creative Commons and yours to copy. The book itself is free to read and free to download, and it is shared by sending its link rather than its file.",
      "That is narrower than the book page claimed yesterday, so it is worth being plain about what changed: an implied permission to pass the PDF around was withdrawn. Nothing that was free stopped being free. All fifteen chapters are still there for anyone with the link, with no account and no email address, and a class reached by a link has exactly what a class reached by a file would have had.",
      "Fixed a control that did nothing. The plus and minus buttons on the Real Rich Scoreboard were visible and could be tabbed to with JavaScript switched off, and pressing them did nothing at all. They are now hidden when there is no scripting to make them work — the slider beside them is a normal one and still answers the arrow keys, and the sheet still prints and fills in by hand.",
      "Fixed five places where two words were printed with no space between them, on the teachers, schools privacy, privacy, editions and how-this-was-made pages. A template was eating the line break between a sentence and the word that followed it.",
    ],
  },
  {
    date: "2026-08-01",
    title: "The whole book is free",
    items: [
      "All fifteen chapters now carry the complete text — the story, the Hill Remix and What It Means Now — exactly as printed. The full text was always sitting in the files, word for word — the site simply was not showing it.",
      "The book is downloadable as a PDF as well — 66 pages on screen, which is the 64-page book plus its covers. No email address, nothing to fill in. Both routes are the complete book and neither is a sample.",
      "This reverses what this site used to do. The stories and essays were held back so the printed book had something to sell. It now sells the paper instead — something to hand to somebody, leave on a shelf, or finish without a notification closing it.",
      "Something broke while we did this. The tool that lifts the book's words out of the print file dropped five of the Seven Safe First Offers — the table was showing 2 of 7. All seven are back. We then checked every other word on this site against the printed book, and nothing else had moved: the re-issue changed the address and nothing else.",
    ],
  },
  {
    date: "2026-07-31",
    title: "Public beta, said out loud",
    items: [
      "This site is in public beta and says so on the homepage. It is reachable, it is crawlable, and it is not finished — so claiming otherwise on a site about not faking things was not an option.",
      /* Corrected on 3 August, and the correction has its own dated entry at the top of
         this list. It used to name the schools page as carrying the crisis notice; it
         carries the shorter beta note, which is also the one the homepage carries. */
      "There is no checked list of helplines yet, and that is now said rather than implied. Every Reality Check, both AI tool pages and the parents page carry the same notice: nobody is on the other end of this site, and if it is happening today, tell one adult in the room. The homepage and the schools page carry the shorter version — that this is a public beta and not finished.",
      "Fixed a real bug in bringing your receipts over from another device. A file holding more than this site keeps would have pushed your own build ticks and written answers out of the browser. Files that are too big are now refused instead of trimmed — choosing which of your records survive is not ours to do.",
      "The schools page can now answer its own question about where this site lives: it is served by a company called Vercel, from a machine in Frankfurt, inside the EU. The page shows you how to check that yourself. Two things — exactly what that company writes down, and how long it keeps it — are still unanswered, and still named as unanswered.",
      "Chapter 16 is hidden from Google until Ryan has actually written it, because an empty page should not turn up in search results. It is still linked here, still reachable, and typing 65 still works.",
    ],
  },
  {
    date: "2026-07-31",
    title: "Live, and the author page rewritten",
    items: [
      "The site went live. Every page number in the book, 1 to 64 — plus 65, which is one page past the end — was checked on the live site. All 65 open.",
      "The author page at /proof was rewritten. It had been a claims table with a column of editorial notes beside it — useful to whoever was building the site, no use to you if you had just put the book down. It is now a timeline: eight to thirteen, in order.",
      "People had been saying Ryan raced Formula 4 at eleven. He did not, and we would not print it until we knew what actually happened. Here it is: at eleven he drove an F4 car built to his measurements, and he trains in it rather than racing it. Smaller than the story going round, and more interesting.",
      "Still no count of wins or podiums anywhere, because a number without a source gets cut rather than rounded. Chapter 7 tells you to do exactly that with anybody's claims, and these are somebody's claims too.",
    ],
  },
  {
    date: "2026-07-30",
    title: "First public build",
    items: [
      "Every one of the 231 pieces of the book is on this site in the book's own words, not a summary of them.",
      "The Napoleon Hill audit published at /hill: what the record actually shows about Hill, with dates and two sources, and the two self-help statistics this site refuses to quote.",
      "The author page published at /proof: the karting record, and what he is building now.",
      "The book page published at /get: 64 pages, the word count, an honest reading time, what the book has that this site does not, and who it is not for.",
      "Scam Check and Shrink My First Step published as previews. Neither can answer you yet; both say so on the page and show exactly what they will ask for and give back.",
      "Privacy, terms and editions published. Privacy lists everything this site puts in your browser, one line per thing.",
      "No analytics, no cookies, no third-party requests. Before this site can go out, it is checked file by file for anything that would load from another company's server. If one turns up, it does not go out.",
    ],
  },
];

/** Named here rather than left for a reader to discover. Each becomes a dated entry above. */
export const MISSING = [
  "A checked list of helplines you can call or message — one international, one for the Netherlands. This is the most urgent thing missing.",
  "The shop link on the book page. The printed book is sold through an outside shop and the link is not confirmed yet.",
  "The ISBNs on the editions page — the ID numbers a shop or a library uses to order one exact book.",
  "What the company hosting this site writes down when you open a page, and how long it keeps it, on the schools privacy page.",
  "The code that makes the two AI tools actually answer you. Until it exists, both tools only show you what they would ask for and what they would give back.",
  "Chapter 16, which Ryan is writing about what he learned after the book went to print.",
];

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
