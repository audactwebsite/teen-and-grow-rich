# teen-andgrowrich.com

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

Both printed QR codes encode the bare root `https://teen-andgrowrich.com`, so the
homepage is a landing page for someone holding a physical book on a phone. It is
not primarily a marketing page. Verified by rendering every page of the print
files and running QR detection — there are exactly two codes, both point at the
hyphenated domain, and neither deep-links.

**The hyphen is not optional.** `teenandgrowrich.com` without it belongs to an
unrelated company. The book was re-issued to fix this: the QR codes, the
Publishing Note on page 3, the author page and the back cover all carry
`teen-andgrowrich.com`. Never write the hyphen-free spelling anywhere in the
codebase; the origin is read once from `astro.config.mjs` through
`src/lib/site.ts` and everything else derives from it.

## The changelog test

Before any new tool, partner, product, page or interview, ask one question: **could this
be written up in the append-only changelog without contradicting the method?** If not,
do not do it.

It works because this site already publishes its own reversals — non-negotiable 7 below
is a public U-turn, printed as one. A decision that cannot survive that treatment is a
decision that creates a gap between what the site says and what it does, and that gap is
the only thing that can actually kill this project. This is not a twelfth rule; it is the
test that guards the eleven.

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
7. **Nothing is locked, and that now includes the book.** No paywalls, no email
   walls, no earned unlocks, no progress gates. Every build, Reality Check,
   worksheet, template and Chapter 16 is free on a first visit — and so is the
   complete text: all 15 chapters with their stories, Hill Remix essays and What
   It Means Now, readable on the chapter pages and downloadable as a PDF.

   **This reverses the original rule, deliberately.** The stories and essays used
   to be withheld so the book had something to sell. The owner decided otherwise,
   and the reasoning is worth keeping: for an unknown thirteen-year-old author
   obscurity is the enemy, not piracy; the print margin was never going to be the
   value; and a teenager who *gives away* a book about money is immune to the
   hustle-culture criticism that a teenager who *sells* one invites. The book's
   own argument — proof over performance — points the same way. The book is
   Ryan's receipt, and a receipt is worth showing.

   **What is sold is the object, not the words.** The printed copy is something
   to hand to somebody, leave on a shelf, finish without a notification closing
   it, and keep when a browser clears. Never sell it as access to information
   that is free two clicks away.

   Do not re-introduce a teaser, a sample chapter, or a "read the rest in the
   book" line — those are all the previous rule, and they are gone.
8. **Napoleon Hill wording is load-bearing.** "Inspired by success principles
   associated with Napoleon Hill." Never imply affiliation, endorsement,
   translation or reproduction. Mirror the book's front-matter disclaimer.
9. **No mechanics the evidence rules out.** No streak that can be lost — Chapter
   8's seven-day streak is a *repairable count-up*. No badges, leaderboards or XP.
   No vision board, dream collage, affirmation wall or AI dream imagery. No
   motivational statistic from the self-help canon. Each of these is ruled out on
   published research, not taste — see `docs/decisions.md` D16.
10. **Every number links to a primary source, or it gets cut.** Site-wide.
11. **English only.** No Dutch, no dual-language, no translated parents page, no
    `hreflang`. Two separate reviews proposed a Dutch version and the owner has
    ruled it out. The book is English and all 231 items are its verbatim wording,
    so a translated site would either paraphrase the book — which rule 1 of the
    content pipeline forbids — or wrap English content in Dutch chrome. Verified:
    `lang="en"`, no Dutch markers in any of the 147 pages, no alternate versions.
    Do not propose it again.

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

The three `*_NEW_DOMAIN.pdf` files in the repo root are the shipped book — the
re-issued edition that carries the hyphenated domain. They are the source of
truth for all copy; do not paraphrase the book's wording when quoting it.
The pre-re-issue set (the four files without `NEW_DOMAIN` in the name) is still
in the repo root and is **not** the source of truth. Do not extract from it and
do not quote it — it carries the hyphen-free domain. The content is otherwise
identical: re-running the extraction against the new edition produced a zero-line
diff against the committed data, which is how we know the re-issue changed only
the address.
`assets/from-book/` holds the extracted artwork.

**Known constraint:** the 15 chapter illustrations are only 900 × 675. Too small
for full-bleed desktop heroes. See `docs/design-system.md` §7 for the three
options and the chosen route.

## Facts about Ryan — verify before publishing

Publicly reported and safe to state: from Schimmert (NL); first time in a kart at
8; first race ever (Spa, Micromax, Dutch Rotax Max round 2) took 4th, best rookie
and driver of the day; teams Strawberry Racing and François Slangen; Rotax Max
Euro Trophy and the Le Mans international finals; inspired by Max Verstappen.

**Mini Rookie and Minimax are two different classes — never merge them into one
claim.** The Belgian championship (Genk, 25 October 2023, at 10) was **Rotax Max
Mini Rookie**. The win in round 2 of the German Rotax Max championship (Genk, at
10) was **Minimax**, and the driver who finished second there was the previous
year's Rotax Max world champion, from Bahrain. Both are in the Dutch motorsport
press; neither is "Belgian champion in the class he beat a world champion in".

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
