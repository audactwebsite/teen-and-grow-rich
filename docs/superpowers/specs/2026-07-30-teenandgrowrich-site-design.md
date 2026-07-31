# teenandgrowrich.com — v1 design spec

Status: approved. Supersedes nothing; implements `docs/decisions.md` D1–D34.

The full reasoning lives in `docs/decisions.md`. The brand lives in
`docs/design-system.md`. The content lives in `src/content/data/*.yaml`, generated
verbatim from the printed book. **This document is the cut list**: what v1 is, and
what it explicitly is not.

---

## 1. The one-sentence brief

A reader finishes a chapter, scans the QR code in the book, and lands on a phone with
the book open in front of them — and the site's only job is to get them doing the thing
on that page within one tap.

## 2. Why there is a cut list

The completeness critic named scope collapse the highest-probability cause of death:
the union of ~70 research findings is a staffed product team's roadmap, and the
household is one 13-year-old with a race calendar plus a guardian. A small site that is
honestly maintained beats a large one that is visibly abandoned.

**v1 is judged on one question: did a visitor finish one real thing and leave with an
artefact.**

## 3. Design direction

**Spine: "Blue Hour."** Cinematic photography and the book's own chapter furniture
carry the site. The three grafts:

- **Flags, from Pit Wall.** Green/yellow/red is both the book's family approval system
  and the language of race control, which is the author's actual world. It is the
  primary UI atom: every Reality Check, build card, Safe First Offer and worksheet
  field touching money, people or data carries one. `tabular-nums slashed-zero` on all
  numerals. Page rhythm alternates full-width hairline data rows with a 65ch prose column.
- **The page-number field, from Tool First.** Display-size numeral input, live resolved
  destination, an inline `65 = Chapter 16` hint, and a typographic index rather than
  cards for the builds hub.
- **Paper, from Paper After Dark.** The light theme is the literal book page — folio
  tab, running header, white sheet — but only in the light theme and on worksheets, not
  as a site-wide register.

Fixes required, from the designers' own stated risks:

- The hero may not cost 90svh. The page-number field must be visible above the fold at
  390 × 844 **without scrolling**, with a solid blue-hour base colour behind the image so
  a slow-loading photograph never leaves a dark rectangle and a form.
- Race red splits to pass AA: `#FF4438` for bars and fills, `#FF6A5E` for label text.
- Light mode must never be the default; dark is (D7).

## 4. Mobile is the design target, not an adaptation

Both printed QR codes land a phone user on the homepage. Hard requirements:

| | |
|---|---|
| Design origin | 390 px. Desktop is the adaptation. |
| Horizontal scroll | None at 320 px. Tables become stacked cards. |
| Primary action | Thumb zone, bottom. |
| Touch targets | ≥ 44 px on coarse pointers; 24 px absolute floor (WCAG 2.2 §2.5.8). |
| JS budget | < 150 KB gzipped, whole site. |
| Browser floor | Safari 16.4+ / Chrome 111+ (Tailwind v4). Content stays readable below it. |
| Worksheets | Completable on a phone with copy-to-clipboard. Print is an output, never a requirement. |

## 5. v1 pages

| Route | What it is |
|---|---|
| `/` | Homepage. Page-number field first, then continue-where-you-left-off, then the 15 chapters, then the adult/teacher doors, then the book. |
| `/p/[1-64]` | Printed page → its tool. Retro-fits deep links into the already-printed run. |
| `/p/65` | Chapter 16, the chapter that isn't in the book. Also reachable at `/c/16` and linked plainly. |
| `/c/[01-15]` | 15 chapter tool pages: Hill's Idea box, The Play as a 5-step checklist, the build with timer, the Reality Check in full, 3 debrief fields. Story stays in the book — teaser plus page reference. |
| `/build/[01-19]` | 19 build pages: instruction, flag, timer, proof field, done state, printable receipt. |
| `/builds` | The hub. Typographic index, filterable by chapter, time and flag. |
| `/worksheet/[id]` | 4 worksheets: Starting Point, First Offer Canvas, One-Page Real Rich Plan, Real Rich Scoreboard. Autosave, copy-as-text, print. |
| `/path/ninety-day` · `/path/tiny-launch` | The 3-phase 90-day path (13 actions) and the 21-task 30-Day Tiny Launch with a start-date picker generating real dates + `.ics` export. |
| `/offers` | Seven Safe First Offers. Each seeds a partly-filled First Offer Canvas. |
| `/reality-check` | The library. All 19, each with its own indexable URL, question-shaped H1, 40–60 word direct answer first. Grouped by risk. Printable. |
| `/reality-check/[id]` | One check per URL — the site's real search engine. |
| `/receipts` | Local dashboard. Real counts, export, import, copy-as-text, print the whole folder. |
| `/parents` | Race Control: the green/yellow/red system, the family rule, what to ask. |
| `/schools/privacy` | Written for a school IT reviewer. Every claim verifiable from page source. |
| `/hill` | The Napoleon Hill audit. Sourced, dated, in the book's voice. |
| `/proof` | Ryan's verifiable record. Karting only, sources linked. |
| `/get` | The book. 64 pages, word count, honest reading time, what the book has that the site does not, who it is not for. |
| `/tools/scam-check` | AI tool 1. Paste an offer → flag, matched red flags, chapter and page, one action ending in "show one adult". |
| `/tools/shrink` | AI tool 2. Oversized goal → three 20-minute first steps. |
| `/updates` · `/editions` · `/privacy` · `/terms` | Changelog, canonical ISBN list, privacy, terms. |

## 6. Explicitly NOT in v1

Written down so nobody quietly adds them back:

- No accounts, login, email capture or newsletter.
- No forum, comments, profiles or any user-generated content. Enforced by a CI test —
  this also keeps the site outside the DSA's online-platform definition.
- No leaderboards, badges, XP, or any streak that can be lost.
- No vision board, dream collage, affirmation wall or AI dream imagery.
- No `/schools` procurement page, bulk-order route, standards crosswalk or OER
  submissions — there is no verified trade distribution to hang them on yet.
- No `/press`, `/homeschool`, `/drivers`, `/glossary`, `/standards`, `/rules` ledger.
- No Dutch translation. One `/nl` press-and-parents page may follow launch.
- No PWA install flow as a data-durability mechanism (D24).
- No motivational statistic from the self-help canon, ever.
- No paid award badges or bestseller-rank screenshots.

## 7. Content integrity

`tools/extract_book_content.py` is the only sanctioned route from book to site, and it
verifies 14 counts on every run. All 231 items are already extracted and passing.
Copy is verbatim; every tool page states its printed page number.

The three Reality Checks that belong to no build — the Publishing Note, Your Starting
Point and Seven Safe First Offers — must appear in the library alongside the other 16.

## 8. Safety architecture

- Reality Checks render in full, always. Never collapsed, tabbed or truncated.
- Every yellow and red build has a **green variant that needs no adult**, so no reader's
  path terminates when there is nobody to ask.
- The approval gate names who counts beyond a parent: teacher, coach, librarian, youth
  worker, sibling over 18.
- One adult-monitored contact address. No form that collects anything from a minor.
- Fixed refusal paths with signposting in both AI tools.

## 9. Done means

1. `npm run build` succeeds and `verify-no-external-hosts` passes.
2. `python tools/extract_book_content.py` passes all 14 checks.
3. No horizontal scroll at 320 px on any page.
4. Zero contrast failures in either theme.
5. Every page keyboard-operable with visible focus.
6. Reality Checks fully visible on every page that carries one.
7. Site renders and is readable with JavaScript disabled.
8. The word "saved" appears nowhere about a reader's work.
