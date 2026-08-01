# What the site needs from Ryan

Everything else is built. These are the items only he can supply, in the order they
block things. Each one has a placeholder on the live site right now that says plainly
that it is missing, rather than quietly pretending otherwise.

---

## 1. Sign off the flags — the only judgement call on the whole site

**This is the most important item here, and it is the one thing on the site that is
interpretation rather than extraction.**

Every one of the 231 items is lifted verbatim from the printed book by
`tools/extract_book_content.py`, which verifies 14 counts on every run. The flags are
the exception: **the book assigns no flag to any build.** The site derives them by
applying the book's own green/yellow/red definition — printed on **page 61**, under
"For Parents & Guardians" — to each build as printed.

Two teams did that independently and **disagreed on 7 of the 19 builds**, including
`squad-goals` (red vs yellow) and `fearless` (yellow vs green). The stricter reading
won, but that is a tiebreak, not an answer.

Open `src/lib/build-meta.ts`. Every entry carries a one-line `why`, written so it can be
checked against the printed page. Read the nineteen and correct any you disagree with.
Current split: **8 green · 9 yellow · 2 red.**

The site tells readers this in words, on the homepage and on every chapter page: *"The
flag on each row is this site applying the book's own traffic-light rule from page 61 to
that chapter's 24-Hour Build. The book does not print a flag beside each chapter."* That
sentence is only honest if the flags are actually right.

## 2. Chapter 16

The book ends on printed page 64 with "End of the condensed edition", so typing **65**
into the page-number field finds Chapter 16. It is also plainly linked from the homepage
and reachable at `/c/16` — a secret must never be the only route, or it excludes anyone
using a screen reader and anyone who never tries.

The page is built and waiting. It needs Ryan's text on **what he learned after the book
went to print** — what worked, what did not, what he would write differently now. That
is the one thing a printed book can never contain, which is what makes the website
necessary rather than decorative.

Structure it like the other fifteen so it does not feel bolted on: an idea, something
that actually happened, and one thing the reader can do.

**Nobody else can write this.** No AI, and not me — the site's own rules forbid writing
in Ryan's voice, and a fabricated Chapter 16 on a site whose centrepiece is an honesty
audit would be indefensible.

## 2b. The domain in the printed book is not ours

This one is not on Ryan; it is worth knowing before anything else on this list.

Both QR codes in the printed book encode `https://teenandgrowrich.com` — decoded from the
artwork, not assumed. **That domain belongs to a different company.** It is not for sale to
us and it is not coming. The site lives at `teen-andgrowrich.com`, with the hyphen.

So every QR code in every printed copy points at somebody else's domain. It does not
resolve today, but the owner can put anything there at any time, and a reader scanning a
code from a book written for thirteen-year-olds would land on it.

What already covers it: `/p/1`–`/p/65`. A reader types the page number they are on instead
of scanning. That system was built to retro-fit deep links into the first print run, and it
turns out to be the only route from the printed book into this site — which is why those
sixty-five routes must never break.

What is worth deciding, in rough order of cost:

1. **Ask the owner what they want for it.** A short, polite email. Worst case is no.
2. **A sticker or insert** for stock that has not shipped, with the hyphenated address.
3. **Fix it in the second print run** — both QR codes and any printed URL.
4. **Say it out loud** in the book's own listing or on `/editions`: if the QR does not work,
   type the page number at teen-andgrowrich.com.

## 3. The exact Formula 4 facts

`/proof` currently publishes only what the press has reported and can be checked: from
Schimmert; first time in a kart at 8; first race ever at Spa took 4th, best rookie and
driver of the day; Belgian champion Rotax Max Mini Rookie at 10; won round 2 of the
German Rotax Max championship at Genk at 10, ahead of a Rotax world champion; teams
Strawberry Racing and François Slangen; Rotax Max Euro Trophy and the Le Mans
international finals.

**No F4 claim is published**, because I could not verify one. The photograph in the repo
is filenamed `era-round-3---zolder-(08-07-2022)`, and in July 2022 Ryan was 8. Zolder
also sells a "Formula 4 Experience" through the ERA Racing School, which is not the same
as competing in a championship.

Tell me exactly what happened — which car, which day, which programme — and I will state
it precisely. *"Drove an F4-spec single-seater at Zolder at eleven"* is impressive and
true. A book whose first promise is "no fake case studies" cannot carry an unverifiable
claim about its own author.

## 4. Source links for `/proof`

Non-negotiable 10 is *every number links to a primary source, or it gets cut.* The
karting results are currently asserted without links, which is the one place the site
breaks its own rule. The coverage exists — RaceXpress, ParkstadActueel, Journaal van
Beekdaelen — so this is a matter of pasting the URLs, one per claim.

## 5. Where the book is sold

`/get` renders a labelled placeholder instead of a buy button. Once the retailer link
exists it goes in one place and nowhere else. Two constraints:

- **Never put an affiliate-tagged link in the printed book or the free chapter PDF.** The
  Amazon Associates agreement prohibits offline promotion; a tagged link behind a printed
  QR code is a bannable violation.
- Amazon Attribution is free through Author Central and reports real sales by source with
  zero tracking on this site. That is how to measure a launch without breaking the privacy
  promise.

## 6. The contact address

Every page shows `hello@teen-andgrowrich.com`, which does not exist yet. It needs to be a
real mailbox **an adult reads**.

Note the hyphen. It used to read `hello@teenandgrowrich.com` — a domain that belongs to an
unrelated company, so mail sent there would have gone to a stranger rather than nowhere. The site already tells readers, in the footer and
on both AI tool pages: *"One adult-monitored mailbox. Nobody reads it urgently, and it is
not a crisis service."*

That last clause needs to be true, which means item 7.

## 7. A helpline route

Both AI tools have fixed refusal paths for self-harm, abuse, grooming and blackmail — and
right now they signpost help without a destination. For a 13+ audience that is a real
gap. It needs one verified helpline finder appropriate to an international audience, plus
a Dutch-specific one. Worth 20 minutes with someone who does safeguarding professionally.

## 8. Two files

- **The free starter chapter**, as a PDF *and* as HTML. A PDF is invisible on a projector
  and near-useless behind a school filter, and the chapter is the thing that convinces a
  parent to buy.
- **The real ISBNs** for `/editions`, which is the page that lets anyone check which
  "Teen & Grow Rich" listings are genuine.

## 9. Ryan's own filled-in worksheets

Not blocking, but it is the best content on the list. A real First Offer Canvas and a
real One-Page Real Rich Plan, filled in by the author with actual numbers, is worth more
than any blank template — and it is his own work, so it costs nothing but a scan.

---

## One decision for you, not Ryan

`package.json` does not list `zod`, which produces 61 deprecation hints in `astro check`
(0 errors, 0 warnings). Zod 4.4.3 is already present as a transitive dependency of Astro.
Adding it as a direct dependency clears the hints and pins the version the schemas are
written against. Your working agreement says to ask before adding a dependency — so:
may I?
