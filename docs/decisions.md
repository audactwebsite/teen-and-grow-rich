# Decisions log

Every decision taken with Ryan/the owner, with the reasoning. Append, don't
rewrite — if a decision is reversed, add a new entry that supersedes it.

Date format: YYYY-MM-DD.

---

## 2026-07-30 — Foundation decisions

### D1 · No accounts, no server-side personal data
Progress lives in the browser. No login, no email capture, no user records.

**Why:** the audience is 13+. Accounts mean a lawful basis, parental consent,
age verification, retention policy, processor agreements and a DPIA before
launch. Local-first removes all of it, and it matches what the book already asks
of readers ("save your proof").

**Superseded in part by D9** — AI tool inputs necessarily leave the device.

### D2 · No AI in v1 → **reversed, see D9**

### D3 · Book sold via an external retailer; free starter chapter is a direct download
No checkout, no payment provider, no email wall on the chapter.

**Why:** the retailer handles payment, VAT, delivery and returns. A no-wall
download matches the book's tone, avoids collecting minors' email addresses, and
is better for search and for school web filters than a gated PDF.

### D4 · Site gives the tools; the book keeps the stories
Online: The Play, the 19 builds, all 19 Reality Checks, the 4 worksheets, the
90-day path, the 30-day launch, the seven offers, the parents material.
Book-only: the 15 stories, "The Hill Remix" essays, "What It Means Now" — teaser
plus a printed page reference.

**Why:** the site must not replace the book. This split makes each one better at
its own job and leaves a real reason to buy.

### D5 · One proof page about Ryan, verifiable facts only
The karting record as evidence that the book's method works, not as a second
brand.

**Why:** it answers "why trust a 13-year-old" with externally checkable results.
Any unverifiable claim would break the book's own "no fake case studies" promise.
See `CLAUDE.md` for the F4 caveat.

### D6 · Astro 5 + Tailwind v4 + React islands
Content collections for all 231 items. Static output.

**Why:** 95% of the site is content. Zero JS by default matters on a school desk
over 4G. All the component MCP servers still work through React islands.

### D7 · Dark theme by default; light theme is print/show-an-adult mode
**Why:** dark is teen-native and it is where the book's navy and the blue-hour
illustrations actually come alive. Light mode reproduces the book page and exists
to be printed and shown to a parent or teacher. Two themes, two clear jobs.

### D8 · English only
**Why:** the book is English ("created in English for readers aged 13 and up"),
the domain is .com, the QR sits in an English book. One language means all 231
items have exactly one version that stays correct.

---

## 2026-07-30 — After deep research

### D9 · Two AI tools in v1: Scam Check and Shrink My First Step
Supersedes D2. Adds one serverless function; the site is no longer purely static.

**Scam Check** — the reader pastes a real offer/DM and gets it run through the
book's Reality Check protocol: a flag, which specific red flags matched, the
chapter and page that covers it, and one concrete next action ending in "show one
adult".

**Shrink My First Step** — the reader types their oversized goal and gets three
20-minute first steps, each with the proof it would produce. This is Chapter 1's
Play step 3 as a tool.

**Why these two:** the Scam Check is the differentiating feature and the safety
proof for parents, schools and press — chapter 7 is literally about this. Shrink
My First Step is trivial to build and addresses the failure every reader has.
The other three candidates (Offer Canvas coach, hard-conversation role-play,
"is this proof?") wait for v2, when real usage shows what readers ask for.

### D10 · AI architecture: single-purpose tools, never a chatbot
One input, one structured output, per tool. No open-ended chat.

**Why:** an open chat window for 13-year-olds is where every safety, cost and
abuse problem lives, and it is not what they want — they want an answer, not a
conversation. Single-purpose tools are also faster, cheaper and easier to bound.

### D11 · AI safety: tightly bounded, nothing stored, adult in the loop
- Each tool can only do its one job; no free-form conversation
- No input or output persisted anywhere — consistent with D1
- Visible AI disclosure (EU requirement)
- Fixed refusal paths with signposting for self-harm, abuse, grooming, blackmail
- Every red flag ends in "show this to one adult"
- Spend cap and rate limiting without accounts

**Accepted trade-off:** storing nothing also means no audit trail when the tools
are misused. Chosen deliberately; revisit only with a stated reason.

### D12 · The racing flag system is the site's primary UI atom
Green / yellow / red is both the book's family approval system *and* the
universal language of race control. Every Reality Check, every build card, every
Seven Safe First Offers row and every worksheet field touching money, people or
data carries a flag. The parents page becomes "Race Control".

**Why:** it makes the safety layer the most compelling part of the site instead of
the small print, and it makes the karting career structural rather than
decorative. One visual system unifying brand, safety and biography with no new
content.

**Constraints:** no fourth colour. No chequered flag for "done" — chequered means
the session is over, which is wrong for a 90-day path.

### D13 · Page-number routing, and page 65 is the secret chapter
`/p/1`–`/p/64` routes a printed page number to its tool. The homepage's first
element, for someone holding the book, is a page-number input.

The book ends on page 64 with "End of the condensed edition". **Typing 65 unlocks
Chapter 16**, written by Ryan, about what he learned *after* the book went to
print — the one thing a printed book can never contain.

**Why:** it retro-fits deep links into the already-printed first run with no
reprint. It also works where QR cannot: the Netherlands banned phones, tablets
and smartwatches in classrooms from 1 January 2024, and school Chromebooks have
no camera workflow — a typeable number works on a locked-down device, on a
projector, and read aloud by a teacher. And it makes discovery a reward for
curiosity, which is the trait the book is trying to build.

Routing must be edition-aware so page numbers moving in a second print run never
break the first. These paths must never 404 — printed books outlive redesigns.

### D14 · Unlocks are soft: earned by work, never blocking
~~Ryan's own filled-in worksheets (after 5 builds), the per-chapter "what I'd do
differently" notes, and the printable receipt slip (after the first build) are
earned.~~

**Superseded by D19.** Everything on the website is open.

### D19 · Nothing on the website is locked. The book is the only scarce thing.
No gates at all — not paywalls, not email walls, not earned unlocks, not
progress gates. Every build, Reality Check, worksheet, sequence, template,
Ryan's own filled-in worksheets, the per-chapter notes and Chapter 16 are freely
available to anyone who arrives, first visit, no conditions.

The scarcity lives entirely in the book: the 15 stories, "The Hill Remix" essays
and "What It Means Now". That is D4, and it is enough.

**Why:** the research reached the same conclusion independently — gating tools
behind proof of purchase is the most likely reason a reader who arrives via the
printed QR never comes back, and the tools convert non-buyers *precisely because*
they are complete and free. A generous site is also the only version consistent
with a book that argues against hype and gatekeeping.

**Consequence for D13:** Chapter 16 stays *discoverable* but is never *gated*.
Typing 65 is the delightful way to find it; a plain, linked, crawlable URL also
reaches it. A secret that can only be found via an easter egg excludes anyone
using a screen reader or anyone who simply never tries — discovery may be a
reward, never a barrier.

**Consequence for D15:** the challenge layer creates rhythm, not entitlement.
Nothing about a streak, a weekly build or a chain ever unlocks or withholds
content.

### D15 · Challenge layer: rhythm without a backend
- **Weekly Build** — one featured build a week, derived from the date so it is
  deterministic and needs no server. A shared rhythm with no social features.
- **20-minute roulette** — one build sized to the time available, timer starts.
- **Challenge chains** — the book's own multi-day sequences (the 7-day Signal
  audit, the 5-step fear ladder, the 7-day streak) exported as dated `.ics`
  events with alarms, so they happen on the phone rather than on a page the
  reader must remember to reopen.
- **Two-player challenge** — send one friend a challenge via a link carrying its
  state in the URL hash. No account, no server, no data. Chapter 9's squad idea,
  and it spreads itself without ever building a social network.

### D16 · Mechanics ruled out by evidence
- **No streaks that can be lost.** Chapter 8's seven-day streak is a *repairable
  count-up* ("days built: 5, one missed, keep going"). Streaks work through loss
  aversion, which is why they produce anxiety in teens.
- **No badges, leaderboards or XP.** Hanus & Fox found badges and leaderboards
  reduced motivation and satisfaction; Deci's 128-study meta-analysis found
  expected tangible rewards undermine intrinsic motivation for tasks people
  already find interesting. A leaderboard would also directly contradict the
  book's argument against comparison. Use self-referenced "personal best" framing.
- **No vision board, dream collage, affirmation wall or AI dream imagery.**
  Oettingen & Mayer found vivid positive fantasy about a desired outcome
  predicted *worse* real-world results. Chapter 3's tool is a timed process
  rehearsal with a required "the mistake" and "the recovery" — which is what the
  evidence supports and what the book already asks for.
- **No motivational statistics from the self-help canon.** The "1953 Yale
  goal-setting study" does not exist; the "65%/95% accountability partner" figure
  has no traceable source. Rule for the whole site: every number links to a
  primary source or gets cut.

### D17 · Print is the canonical record, not localStorage
WebKit deletes all script-writable storage (localStorage, IndexedDB, service
workers) after seven days of Safari use without interaction with the site.
Home-screen-installed web apps are exempt. Shared school Chromebooks wipe local
data on sign-out by design.

Therefore:
- **Never say "saved".** Say "kept in this browser".
- The printable receipt slip, sized to fit inside the 140 × 216 mm book and
  styled as a race timing slip, is the durable artifact. Build 01 already asks for
  a *physical* folder called REAL RICH RECEIPTS; the site feeds it.
- PWA install is prompted as "install so your receipts don't disappear", after
  the first completed build — it is the durability mechanism, not a nicety.
- Export and import both exist, so a reader can move between phone and school
  laptop with no account.
- Treat localStorage as a cache, never a store.

### D18 · Easter egg: `box box`
Typing `box box` — the radio call bringing a driver into the pits — opens a rest
screen citing Chapter 8, page 33: rest is not quitting.

**Why:** a joke a racing fan gets instantly that explains itself to everyone
else, and it teaches the chapter-8 point teens most need. Zero cost, fully
on-brand.

---

## 2026-07-30 — After verification and the completeness critic

Three adversarial verifiers returned *partly-wrong* on the research. These entries
record what survived, and correct what did not.

### D20 · Astro 6, not Astro 5. Supersedes the version in D6.
Astro 6.0 shipped 2026-03-10; 6.4 is current. Node 22.12+. Zod 4 schema syntax from
the first schema — Astro 6 moved to Zod 4, so writing 231 items' schemas on 5 means
doing them twice.

Use the built-in **Fonts API** with local font files for Noto Sans. The typeface is
taken verbatim from the print book, so a font swap is a brand-fidelity defect, not a
CLS number. Local files also mean the build has no network dependency and no
third-party font host — which the school-facing privacy claim depends on.

Turn on the **CSP API**. It is the clean answer to the pre-paint theme script: pass
its hash rather than opening up `unsafe-inline`. Two traps: CSP does not work in dev
(Vite dev server), so test via `astro build && astro preview`; and CSP is
incompatible with ClientRouter.

### D21 · No ClientRouter. Native view transitions plus Speculation Rules.
`@view-transition { navigation: auto; }` guarded by
`@media (prefers-reduced-motion: no-preference)`, plus a `speculationrules` script
with `prerender` at moderate eagerness, scoped to `/c/*`, `/build/*`, `/worksheets/*`
and explicitly **excluding** the retailer link and the PDFs.

Set `::view-transition-old(*) / ::view-transition-new(*) { object-fit: cover }` — the
default is `fill`, which visibly stretches the harbour illustrations mid-transition.
Treat all of it as progressive enhancement; never depend on the `pagereveal` event.

### D22 · Receipts are an append-only event log, not a blob.
`{t, k: 'build'|'play'|'day', id, v}`. Appending is order-independent, so two
prerendered tabs cannot clobber each other; fold the log to derive current state.

- Paint the checked state optimistically in the handler; persist *after* a yield.
- Gate every write on `document.prerendering === false`; defer queued writes to
  `prerenderingchange`. Otherwise the Receipts dashboard counts pages the reader never
  opened.
- Flush on `visibilitychange`/`pagehide`, **never** on `unload` (that disqualifies
  bfcache).
- Re-fold on `pageshow` when `event.persisted`; listen for `storage` +
  `BroadcastChannel` so a second tab's ticks appear.
- 19 checkboxes do not need React. One delegated listener on a server-rendered list is
  smaller and faster. Reserve React islands for worksheets with genuinely derived state.
- Budget: **under 150 KB gzipped JS total.**

### D23 · One storage chokepoint, enforced. "No cookie banner" is a claim we must defend.
ePrivacy Article 5(3) is technology-neutral — swapping cookies for localStorage does
not escape consent. The only escape is the "strictly necessary for a service
explicitly requested by the user" exemption. An explicit theme preference and
user-initiated saved work sit inside it. A device ID minted on first visit, a "last
chapter you were on" written on page load, or an A/B bucket sit **outside** it. Dutch
implementation: Telecommunicatiewet 11.7a; the AP warned 50 organisations in April 2025.

So: route 100% of persistence through a single `storage.ts` that throws in dev if
called outside a user-gesture task, and is the only module allowed to touch
`idb-keyval`. Add an ESLint rule banning `localStorage`/`indexedDB`/`caches`
everywhere else. Trivial on day one, near-impossible to retrofit at 231 items.

**Analytics:** Umami's tracker uses localStorage and therefore lands inside 5(3).
Plausible and GoatCounter do not. Pick one of those, or ship nothing.

### D24 · Durability: the PWA is not the safety net. Supersedes part of D17.
Corrections to D17, from primary sources:

- The WebKit 7-day timer resets on **user interaction** with the site, not on script
  writes, and it counts days of Safari *use*, not calendar days. There is no
  script-side way to keep storage alive.
- `navigator.storage.persist()` is not a fix: Safari auto-decides from interaction
  history, so a first-time visitor filling in a worksheet has none — and WebKit does
  not document persistence as an exemption from the purge at all.
- Service worker registrations and Cache Storage are included in the deletion, so **the
  PWA silently uninstalls itself too.** Never write "works offline" for iOS.
- **iOS has no programmatic install** — `BeforeInstallPromptEvent` is non-standard. It
  needs illustrated Share-sheet instructions, and uptake is low.
- An iOS home-screen app has **storage isolated from Safari**. Assume install does not
  migrate data; test on device.
- Severity is market-dependent, and the "iOS is the majority for teens" framing was
  wrong for this author's home market: Statcounter NL June 2026 is Android 64.2% / iOS
  35.8%. It is true in the US (~87% teen iPhone ownership). Treat it as a real but
  **bounded** correctness bug — do not spend the largest engineering block on PWA
  plumbing.

The durable path is therefore teen-native and one tap: **"copy my answers as text"**
into their own Notes or WhatsApp, plus the printable slip, plus export/import. A JSON
download-then-file-input round trip on an iPhone is a hostile flow for a 13-year-old.
Everyday loss is platform-agnostic anyway: private browsing, clearing data, a new
phone, a shared device. Design so losing local state is annoying, never catastrophic.

### D25 · No printer dependency, and no dead ends without an adult.
The critic found the safety system's single point of failure: it outsources the gate to
an adult who may be absent, working nights, unsupportive, or simply not the kind of
parent who does worksheets. The failure is silent and invisible by design, and it
selects against exactly the readers with no network.

- On the approval gate itself, name who else counts: a teacher, coach, librarian, youth
  worker, or a sibling over 18.
- **Every yellow and red build must have a green-rated variant that needs no adult**,
  so no reader's path terminates at step one. The 90-day path must be completable, in
  reduced form, alone.
- Say the honest thing in the book's register: going around the gate is the failure, not
  the clever move. And for the reader whose adult says no — a no is information about
  timing, not about them.
- Every worksheet must be completable on a phone with copy-to-clipboard. **Print is one
  output, never a requirement.**

### D26 · Publish the Napoleon Hill audit ourselves.
The largest unmitigated reputational risk in the project, missed by all eight research
angles even though three of them read the Foundation's trademark filings: Hill's own
biography does not hold up. Biographer David Nasaw found no evidence Hill and Carnegie
ever met; there are no records of Hill interviewing the famous men he claimed beyond a
brief Edison encounter; he was on the run over Alabama lumber fraud during the period
he places the Carnegie commission; *Motor World* called his Automobile College a scam in
April 1912; Illinois issued blue-sky warrants in June 1918; the FTC charged him in 1919.

A book whose first promise is "no fake case studies" is standing on the most famous
unverifiable case-study collection in publishing. So one page, sourced and dated,
linked from the footer of every chapter page: *the principles are still worth testing,
the man's stories were not checkable, and that is precisely why this book uses labelled
composites and refuses income claims.*

Site-wide rule that follows: **the site never describes the book as inheriting Hill's
authority, only as remapping his ideas.**

### D27 · Dual licence, chosen against grifter capture as well as for teachers.
Two requirements pull in opposite directions and both are real. OER Commons and Share
My Lesson *require* a Creative Commons licence at upload, and 30 US states now have a
standalone personal-finance graduation requirement — that channel needs remixable
material. But Hill's text already lives in MLM and teen-hustle ecosystems, and a free
CC-licensed teen version is an attractive legitimacy prop.

Resolution — licence by content type:

- **Worksheets, builds, tools: CC BY-NC-SA 4.0.** Teachers may copy, remix and print
  for class. Commercial resale blocked, derivatives stay open.
- **The 19 Reality Checks and all safety text: CC BY-NC-ND 4.0.** No derivatives, so an
  altered safety warning cannot legally circulate.
- A plain-English line on every worksheet: *"Yes — print or photocopy this for your
  class, free, no permission needed."*
- State on the schools page that the pack is free to any teacher, parent, club or youth
  worker and **may not be included in any paid programme.**

### D28 · Child-protection operating plan, written before launch.
The project's founding asset is a child. These are cheap to write now and impossible to
improvise under pressure.

1. **Zero user-generated content anywhere on the domain, enforced by a CI test.** No
   comments, no forum, no inbound posting. This also keeps the site outside the DSA's
   online-platform definition.
2. **One adult-monitored mailbox** for all inbound. Auto-reply stating plainly that
   nobody reads this urgently, plus a helpline finder link. A written triage rule for the
   message that will eventually arrive from a distressed 14-year-old: this is not a
   crisis service and must not act like one, but the response must be decided in advance.
3. **Incident playbook** for the first 24 hours of a hostile viral post: who speaks, a
   pre-drafted holding statement, and an explicit agreement that Ryan may go silent
   indefinitely with no consequence. He never replies to a stranger anywhere.
4. **A written consent review at 16**: does he still want this, and what happens to the
   domain, the imprint and the site if the answer is no.

### D29 · Freshness is structural, never promised.
Any dated claim carries a `verifiedOn` field, and the build automatically demotes
anything older than 180 days to a visible *"we have not re-checked this since <date> —
confirm it yourself before acting"* state with the source link promoted.

Ship 20 rows that will actually be maintained, not 200. A visible date that has gone
stale testifies that nobody is home, which is worse than having no table at all.

### D30 · Discovery decisions, from the distribution research.
- **Explicitly allow AI crawlers** in `robots.txt` (OAI-SearchBot, GPTBot,
  PerplexityBot, ClaudeBot, Google-Extended) and document the choice on the privacy
  page. Teacher discovery in 2026 runs through a prompt box, and ChatGPT Search
  retrieves via Bing's index. Blocking them would be self-harm — the site collects
  nothing.
- **Verify in Bing Webmaster Tools and wire IndexNow into the build.**
- **No `llms.txt`.** 97% of them receive zero AI crawler requests and Google stated on
  15 June 2026 that it is not required.
- **Schema: Article, Book, Person, Breadcrumb, DefinedTerm only.** Google deprecated
  HowTo rich results and removed FAQ rich results; marking up 45 debrief questions as
  FAQPage is busywork. For curriculum mapping use
  `educationalAlignment`/`AlignmentObject`, **not** `teaches` — `teaches` is in
  schema.org's "new" area and cannot name a framework. Justify it as OER and library
  harvester metadata, not SEO: LearningResource earns no Google rich result.
- **Do not chase the money head-terms** ("side hustles for teens" etc.). They are YMYL,
  owned by banks and fintechs, and AI Overviews drive ~83% zero-click. Own the Reality
  Checks and the coined terms instead.
- **Give every Reality Check its own indexable URL** with a question-shaped H1 and a
  40–60 word direct answer first. This is the only content class where this site can
  outrank everyone, and it sidesteps the YMYL credential wall because it is
  consumer-protection content, not financial advice.
- Print run two: design QR payloads first. **QR alphanumeric mode is uppercase-only**
  at 5.5 bits/char versus 8 for byte mode, so `TEEN-ANDGROWRICH.COM/C7` encodes into a
  smaller, more robustly scannable symbol than a lowercase slug. Keep every printed URL
  under ~25 characters, print the human-readable short URL next to every QR, and treat
  printed targets as immutable forever.

  **Uppercasing is the only thing that changes — the payload is still the hyphenated
  domain.** The hyphen is one of the nine punctuation characters alphanumeric mode
  permits, so keeping it costs nothing at all in symbol size and there is never an
  encoding argument for dropping it. Drop it anyway and the payload becomes a different
  company's address, which is the exact mistake the whole re-issue was made to undo —
  and this entry carried the hyphen-free form as its own example until 2 August 2026.
  Anything typed into a QR generator gets read back character by character against
  `astro.config.mjs` before it goes near a printer, and the printed short URL beside it
  gets the same check.
- Print run two, second requirement: **every printed page carries its own QR**, deep-linking
  to that page's tool rather than to the root. The first run has exactly two codes and both
  encode the bare root, so a reader who scans from page 41 lands on the homepage and still
  has to go looking for the thing page 41 was about. One code per page removes that step,
  which is the whole reason deep links were retro-fitted in the first place.

  **This never makes `/p/1`–`/p/65` removable.** Three reasons, and each one is enough on
  its own: the first print run exists forever and its two codes will never deep-link; Dutch
  classrooms have banned phones since 1 January 2024, so the reader most likely to be
  holding the book cannot scan anything; and school Chromebooks have no camera workflow.
  A typeable page number is the only route that survives all three. Per-page QR is an
  addition to `/p/[n]`, never a replacement for it.
- **Never put an affiliate-tagged link in the printed book or the free chapter PDF** —
  the Amazon Associates agreement prohibits offline promotion. Route everything through
  an on-site buy page and use Amazon Attribution (free via Author Central) on the
  outbound click, which gives real sales data by source with zero on-site tracking.

### D31 · Calibrate the book honestly on the buy page.
An impressive site selling a 64-page book invites the review that kills a debut: *"this
could have been a blog post."* So `/get` states the physical truth in the book's own
anti-hype register: 64 pages, word count, honest reading time, what the book contains
that the site does not (the 15 stories and the essays), and who it is not for. Publish
the full starter chapter as **HTML as well as PDF** so nobody buys blind — and because
a PDF is invisible on a projector and near-useless behind a school filter.

### D32 · Browser floor, stated not assumed.
Tailwind v4 requires Safari 16.4 / Chrome 111 / Firefox 128 with no automatic
degradation. `@page { size: A4 }` is Safari 18.2+. The audience includes hand-me-down
phones and post-AUE school Chromebooks, so: core content must remain readable when the
modern CSS does not apply, set explicit mm dimensions on printable containers rather
than relying on `@page`, and never promise exact page reproduction in print.

Accessible (tagged) PDF is **not** what a browser print dialog produces — it is an
experimental Chrome DevTools Protocol parameter. Any archival PDF that carries a
conformance claim must be generated at build time with headless Chrome using
`generateTaggedPDF: true` and explicit A4 dimensions, and committed as a versioned
static asset.

### D33 · Honest privacy wording. "Processes nothing" is not achievable.
Any hosted static site receives IP and User-Agent in access logs, and an IP is personal
data under the GDPR. So the claim is: *"we collect nothing, and our hosting provider
processes connection metadata as our processor"* — never "nothing is processed".

Name the host, state what its logs contain and the retention period, and say whether
logs are disabled or IP-truncated. Drop "no DPIA needed" as our own legal conclusion;
present the facts and invite verification instead. **The moat is that a DPO can check
every claim from the page source in two minutes.** Enforce it with a CI check over
`dist/` that fails the build if any external host appears in the output.

### D34 · Imagery: the illustrated boy is the reader, the photographed boy is the author.
Never mix them, and label both. The 15 chapter illustrations are AI images made from
Ryan's own photographs — presenting them as photographs of Ryan would be misleading,
which is exactly what this book argues against.

- **Illustrations** appear on chapter pages, as a character the reader sees themselves in.
- **Photographs** appear on the proof page, as evidence about the author.
- **The cover** appears freely — it is the product, and carries no privacy question.

Approved photographs, chosen to add **no new exposure of a minor** beyond what the
printed book already published:

- The three 2560 × 1440 Monaco harbour frames, shot from behind — the site's primary
  imagery. More cinematic *and* less identifying, and the same harbour and light the
  illustrations were made from.
- The B&W back-cover portrait (already printed).
- The illustrated author portrait (already printed).

**Not used:** the trophy photograph with his face, the paddock photograph, the F4 car,
and the casual portraits. The trophy image may be used only if cropped so the suit and
the trophy read without the face.

No stock-style silhouettes or vector figures. Real photography does that job better, and
adding decorative human shapes is the generic move this design system exists to avoid.

---

## Open, needs Ryan

- **Chapter 16 text** — Ryan writes "what I learned after the book". Brief to be
  supplied with the structure the other 15 chapters use.
- **Ryan's filled-in worksheets** — his real First Offer Canvas and One-Page Real
  Rich Plan, with real numbers. Open to everyone from the first visit, like everything
  else: D19 and non-negotiable 7 removed earned unlocks entirely, and this entry still
  said "as the earned unlock" long after D14 was superseded. Blocked on Ryan supplying
  the pages, never on the reader doing anything to deserve them.
- **The exact F4 facts** — what actually happened at Zolder, so it can be stated
  precisely and truthfully. See `CLAUDE.md`.
- **Retailer link** — where the book is sold.
- **Contact address** — the adult-monitored email that serves as the safe contact
  route.
