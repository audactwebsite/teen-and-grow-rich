# teenandgrowrich.com

Companion website for the book **Teen & Grow Rich** by Ryan Rijvers (13), imprint
Bright Kids. The book is done and printed. This repo is the website.

Read once before your first change:
- `docs/decisions.md` — every decision taken, with reasoning. Check here before
  proposing anything; several obvious ideas have already been ruled out on evidence.
- `docs/design-system.md` — the brand, measured from the print PDFs. Not negotiable.
- `docs/content-inventory.md` — all 231 trackable items and where they come from.
- `docs/superpowers/specs/` — the approved design spec.

## What this site is

A reader finishes a chapter, scans the QR code in the book, and lands here to
**do the thing**. The site supplies the tools; the book keeps the stories.

Both printed QR codes encode the bare root `https://teenandgrowrich.com`, so the
homepage is a landing page for someone holding a physical book on a phone. It is
not primarily a marketing page. Verified by rendering all 132 PDF pages and
running QR detection — there are exactly two codes and neither deep-links.

## Non-negotiables

These come from the book itself. Breaking one breaks the product.

1. **No personal data leaves the device.** No accounts, no login, no email
   capture, no server-side storage, no individual tracking. Progress lives in
   the browser. The audience is 13-year-olds; this is the whole compliance
   strategy, and it is also the honest choice.

   The one exception is the two AI tools, which necessarily send their input to
   an API. Nothing from them is ever persisted — not the input, not the output.
   See "AI tools" below.

   **Never tell the user their work is "saved".** It is "kept in this browser".
   WebKit deletes all script-writable storage after seven days of Safari use
   without interaction with the site, and school Chromebooks wipe on sign-out.
   localStorage is a cache, never a store — the printable receipt is the durable
   record.
2. **Reality Checks are always visible.** Never collapsed, never behind a tab,
   never lazy-loaded, never truncated. There are 19 of them and they are the
   book's safety layer.
3. **No comparison mechanics.** No leaderboards, no public streaks, no follower
   counts, no vanity metrics, no badges with invented rank names. The book argues
   against exactly this. Real counts only: "4 of 19 builds · 6 receipts saved".
4. **No income promises, ever.** No "earn €X", no testimonials implying typical
   results, no urgency or countdown timers on anything commercial. The book's
   own disclaimer applies to the site.
5. **No community features.** No forum, comments, DMs or user-to-user contact.
   Moderating minors is a liability this project will not take on.
6. **Safe contact route only** — one adult-monitored email address. Never a form
   that collects data from a minor.
7. **Nothing on the website is locked; the book is the only scarce thing.** No
   paywalls, no email walls, no earned unlocks, no progress gates. Every build,
   Reality Check, worksheet, template and Chapter 16 is free to anyone on their
   first visit. The scarcity is the book itself: the 15 stories, "The Hill Remix"
   essays and "What It Means Now" do not go online — teaser plus a page reference.
8. **Napoleon Hill wording is load-bearing.** "Inspired by success principles
   associated with Napoleon Hill." Never imply affiliation, endorsement,
   translation or reproduction. Mirror the book's front-matter disclaimer.
9. **No mechanics the evidence rules out.** No streak that can be lost — Chapter
   8's seven-day streak is a *repairable count-up*. No badges, leaderboards or XP.
   No vision board, dream collage, affirmation wall or AI dream imagery. No
   motivational statistic from the self-help canon. Each of these is ruled out on
   published research, not taste — see `docs/decisions.md` D16.
10. **Every number links to a primary source, or it gets cut.** Site-wide.

## Stack

- **Astro 5** — static output, zero JS by default
- **Tailwind CSS v4** — CSS-first config via `@theme`, tokens from `docs/design-system.md`
- **React islands** — only for genuinely interactive parts: timers, worksheets,
  checklists, the receipts dashboard, search
- **Content collections** — all 231 items are typed data, never hardcoded markup.
  If you find yourself writing a build's text into a `.astro` file, stop.
- **One serverless function**, for the two AI tools only. It is the sole piece of
  server-side code and the sole place a secret exists. Everything else is static.

## AI tools — exactly two, and they are not a chatbot

**Scam Check** — reader pastes a real offer or DM; returns a flag, which specific
red flags matched, the chapter and page that covers it, and one action ending in
"show one adult". **Shrink My First Step** — reader types an oversized goal;
returns three 20-minute first steps and the proof each produces.

Rules:
- **Single-purpose tools, never open conversation.** One input, one structured
  output. No chat window, ever.
- **Nothing is persisted** — not input, not output, not logs of either.
- **Visible AI disclosure** on every tool.
- **Fixed refusal paths with signposting** for self-harm, abuse, grooming and
  blackmail. These are not edge cases for a 13+ audience.
- Spend cap and rate limiting without accounts.
- AI never writes in Ryan's voice and never generates book content.
- Both tools must degrade honestly when the function is unavailable — the rest of
  the site cannot depend on them.

## Routing — printed books outlive redesigns

- `/p/1`–`/p/64` maps a printed page number to its tool. The homepage's first
  element for a book-holder is a page-number input. This retro-fits deep links
  into the already-printed first run, and it works where QR cannot — Dutch
  classrooms have banned phones since 1 January 2024 and school Chromebooks have
  no camera workflow.
- `/p/65` reaches **Chapter 16**, written by Ryan about what he learned after the
  book went to print. Discoverable by typing 65, but also plainly linked and
  crawlable — a secret must never be the only route, or it excludes screen-reader
  users and anyone who never tries.
- `/c/01`–`/c/15` and `/build/01`–`/build/19` are canonical.
- Routing is edition-aware, so page numbers shifting in a second print run never
  break the first. **These paths must never 404.**

## Hard design rules

Full system in `docs/design-system.md`. The ones most often got wrong:

- **The racing flag is the primary UI atom.** Green / yellow / red is both the
  book's family approval system and the language of race control. Every Reality
  Check, build card, Safe First Offer and worksheet field touching money, people
  or data carries a flag. No fourth colour. **No chequered flag for "done"** —
  chequered means the session is over, which is wrong for a 90-day path.
- **Dark theme is the default.** Light theme is print/show-an-adult mode and must
  reproduce the book page faithfully.
- **White text on `--tgr-orange` is forbidden** (2.05:1). Orange fills take navy
  text (7.35:1).
- In light mode `--tgr-teal-bright` and `--tgr-orange` never carry text — bars,
  borders, dots and fills only. In dark mode they may.
- **Noto Sans only** (plus Noto Sans Display Condensed Black for display). No
  second typeface, no serif.
- Three semantic boxes, three colours. Do not invent a fourth variant.
- Prose caps at `65ch` — matches the book's ~68-character measure.
- Motion: fades and short translations, 150–250ms, ease-out. No parallax, no
  scroll-jacking, no confetti, no counting-up numbers. Honour
  `prefers-reduced-motion` absolutely.
- Primary actions sit in the thumb zone on mobile.
- Tables collapse to stacked cards on mobile. The page body never scrolls
  horizontally.

## Accessibility and performance are requirements, not polish

- WCAG 2.2 AA. Watch the 2.2 additions that hit checkbox and worksheet UIs:
  target size, focus appearance, dragging movements, consistent help, redundant
  entry.
- Keyboard-complete, visible focus, real alt text on all 15 illustrations.
- Every interactive island must work, or degrade honestly, without JS.
- Print stylesheets are a first-class deliverable, not an afterthought — several
  features exist specifically to be printed.

## Source material

The four PDFs in the repo root are the shipped book. They are the source of
truth for all copy; do not paraphrase the book's wording when quoting it.
`assets/from-book/` holds the extracted artwork.

**Known constraint:** the 15 chapter illustrations are only 900 × 675. Too small
for full-bleed desktop heroes. See `docs/design-system.md` §7 for the three
options and the chosen route.

## Facts about Ryan — verify before publishing

Publicly reported and safe to state: from Schimmert (NL); first time in a kart at
8; first race ever (Spa, Micromax, Dutch Rotax Max round 2) took 4th, best rookie
and driver of the day; Belgian champion Rotax Max Mini Rookie at 10; won round 2
of the German Rotax Max championship at Genk at 10, ahead of a Rotax world
champion; teams Strawberry Racing and François Slangen; Rotax Max Euro Trophy and
the Le Mans international finals; inspired by Max Verstappen.

**Not verified: any claim of competing in Formula 4 at age 11.** No source found.
Zolder sells an "F4 Experience" via the ERA Racing School, which is not the same
as racing a championship. Do not publish an F4 competition claim until the exact
facts are confirmed. A book whose premise is "no fake case studies" cannot carry
an unverifiable claim about its own author.

He is a minor. Publish achievements, not routines, schedules, addresses or
anything that locates him day to day.

## Working agreements

- This is not a git repository yet. Do not run `git init` or commit without asking.
- Do not move or rename the user's PDFs and photos in the repo root.
- Ask before adding a dependency. A static content site needs very few.
- Never add analytics that identify individuals. If analytics at all: cookieless
  and aggregate.
