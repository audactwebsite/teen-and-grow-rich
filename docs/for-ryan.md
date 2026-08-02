# What the site needs from Ryan

**This file is the list.** `docs/decisions.md` ends with a shorter "Open, needs Ryan"
section that was written before the reviews arrived and no longer agrees with this one.
Where they differ, this file is right. Nothing gets added to the owner's list in two places
again.

Everything else is built. These are the things the site cannot supply for itself: most need
Ryan or the family, a few need only your decision. They are in the order they block things.
Each one has a placeholder on the live site right now that says plainly that it is missing,
rather than quietly pretending otherwise.

Two of them are not like the rest:

- **If only one thing gets done this week, make it number 1.** It has no deadline and no
  substitute. The site is publicly reachable, six of the nineteen Reality Checks touch
  blackmail, self-harm and family money, and there is nobody behind any of them.
- **Number 10 is the only item with a clock somebody else controls.** Three domains were
  free at the registrar when we checked, and this project has already lost one address to a
  stranger.

---

## 1. A helpline route — the one thing this site cannot fix by itself

Both AI tools have fixed refusal paths for self-harm, abuse, grooming and blackmail, and
right now they signpost help without a destination. Both tool pages carry a block headed
*"Helpline finder — not in place yet"*. Every Reality Check, the parents page and the
schools page carry the same notice: nobody is on the other end of this site, and if it is
happening today, tell one adult in the room.

That is honest. It is not a route. A reviewer put the reason better than we had:

> The site promises each Reality Check "names who to raise that particular thing with", and
> the answer is currently "an adult in the room". **But teenagers with no safe adult
> exist** — and for them, "tell an adult" is not an answer.

That is the whole gap, and it is the one place where this project's integrity hits a limit
it cannot solve by writing better copy. It needs an outside organisation.

**The concrete next step, which is what this list was missing: two organisations to call.**

- **113** — the Netherlands. The Dutch-specific route.
- **Childline** — the UK. The international-audience route, and the model most other
  countries' services are built on.

Twenty minutes each. Ask them two things: what they want a site like this to say, and
whether they object to being named on a page a thirteen-year-old reaches from a scam
checker. Somebody who does safeguarding professionally can do this call better than we can.

**Do not shortcut it by pasting numbers off a search result.** The reason is in the code,
on both tool pages: inventing a helpline for a 13-year-old in a bad hour is worse than
admitting the gap. A number goes on the site once the organisation, or a safeguarding
professional, has confirmed the wording — not before.

## 2. Sign off the flags — the only judgement call on the whole site

**This is the one thing on the site that is interpretation rather than extraction**, which
makes it the most important item here that is not a safety gap.

Every one of the 231 items is lifted verbatim from the printed book by
`tools/extract_book_content.py`, which verifies 14 counts on every run. The flags are the
exception: **the book assigns no flag to any build.** The site derives them by applying the
book's own green/yellow/red definition — printed on **page 61**, under "For Parents &
Guardians" — to each build as printed.

Two teams did that independently and **disagreed on 7 of the 19 builds**, including
`squad-goals` (red vs yellow) and `fearless` (yellow vs green). The stricter reading won,
but that is a tiebreak, not an answer.

Open `src/lib/build-meta.ts`. Every entry carries a one-line `why`, written so it can be
checked against the printed page. Read the nineteen and correct any you disagree with.
Current split: **8 green · 9 yellow · 2 red.**

The site tells readers this in words, on the homepage and on every chapter page: *"The flag
on each row is this site applying the book's own traffic-light rule from page 61 to that
chapter's 24-Hour Build. The book does not print a flag beside each chapter."* That
sentence is only honest if the flags are actually right.

## 3. Archive copies of the seven source URLs

The karting sources are found — that ask is closed, see **Closed** at the bottom — and
putting them on `/proof` is our build, not yours. One step in it is not ours.

`/proof` will carry **eight source links across seven distinct URLs** (one RaceXpress piece
covers two separate claims). They are listed in `docs/reviews/05-the-sources-exist.md`.

**Every one of them needs an archive copy — Wayback Machine or archive.today — before it
goes on the page.** This is not belt-and-braces. One of the seven is already dead: the
Journaal van Beekdaelen piece returns 404 today. A dead link is not a source, and a page
built to satisfy non-negotiable 10 cannot rot into a page of 404s two years from now, on a
site whose whole argument is *go and check it yourself*.

Five minutes per URL, and it can be done by anyone. It only has to happen before the links
are published, not after.

## 4. The Formula 4 line — checkable, or it comes down

**This section used to contradict itself and now does not.** The claim is live on `/proof`,
so "no F4 claim is published" was simply wrong.

What is on the site is what the family confirmed: **at eleven he drove a Formula 4 car
built to his measurements — the seat, the pedals and the steering made to fit him — and he
trains in it rather than racing it.** That is smaller than the rumour and more interesting
than it, which is why it is worth stating precisely.

What is missing is narrow: **which car, which day, which programme.** A team name, a date
and a circuit would do it.

**The deadline is real.** Once item 3 lands, that sentence sits on a page where every other
claim carries a source link beside it. The contrast makes the unsourced one conspicuous,
not less so. Either something independently checkable arrives, or the line comes down —
that is what non-negotiable 10 says, and the site does not get an exemption for its own
author.

Two things worth recording while this is open:

- **What the press does support.** At nine, Ryan's stated goal was to race Formula 4 at
  fourteen — Journaal van Beekdaelen. That is a *goal*, reported in his own words, and it
  is a perfectly good thing to publish. **It cannot be cited yet**, because that URL is the
  one that 404s. It goes up when the archive copy from item 3 exists.
- **What is still forbidden.** Any claim of *competing* in an F4 championship. The photo in
  the repo is filenamed `era-round-3---zolder-(08-07-2022)`, and in July 2022 Ryan was 8.
  Zolder sells an "F4 Experience" through the ERA Racing School, which is not a
  championship. `CLAUDE.md` rules this out and nothing here changes that.

## 5. Chapter 16

The book ends on printed page 64 with "End of the condensed edition", so typing **65** into
the page-number field finds Chapter 16. It is also plainly linked from the homepage and
reachable at `/c/16` — a secret must never be the only route, or it excludes anyone using a
screen reader and anyone who never tries.

The page is built and waiting. It needs Ryan's text on **what he learned after the book
went to print** — what worked, what did not, what he would write differently now. That is
the one thing a printed book can never contain, which is what makes the website necessary
rather than decorative.

Structure it like the other fifteen so it does not feel bolted on: an idea, something that
actually happened, and one thing the reader can do.

**Nobody else can write this.** No AI, and not me — the site's own rules forbid writing in
Ryan's voice, and a fabricated Chapter 16 on a site whose centrepiece is an honesty audit
would be indefensible.

Until it lands, `/c/16` is `noindex` and out of the sitemap. It is still linked and 65 still
works.

## 6. Photographs of the book, for `/get`

`/get` has one image: the cover render. That is a file, not a photograph, and it is the
only commercial page on the site.

**Four phone photos fix it**, and they are the four a reader actually wants:

- the book on a desk, next to whatever else is on the desk
- the book in a bag, half out of it
- the book being handed to somebody, as a gift
- the book in a classroom, on a table with more than one copy

Daylight, no styling, no stock-photo poses. The whole argument of `/get` is that **what is
sold is the object, not the words** — every word is free two clicks away — and you cannot
make that argument with a render. A photograph of a real copy on a real desk is the
argument.

Twenty minutes with a phone. Nothing else on this list fixes that page, and no amount of
rewriting the copy will.

## 7. Where the book is sold

`/get` renders a labelled placeholder instead of a buy button. It is the oldest open item on
this list. A reviewer who knows the trade supplied named routes rather than restating the
problem:

- **Amazon KDP paperback** — the default English-language search surface. Not because it is
  the best route, but because it is where people type the title.
- **Bookshop.org** — UK and EU, and it splits margin to independent bookshops. Better fit
  for the project's argument than Amazon is.
- **Centraal Boekhuis** — NL and BE. This is the one that matters locally and the one an
  outsider would not think of: without a Centraal Boekhuis listing, Dutch libraries and
  bookshops effectively cannot order the book at all.
- **A direct route for "I want thirty for my class."** Schools do not buy through a retail
  cart, they buy on an invoice against a purchase order. `/teachers` already tells them what
  to check before Monday and then has nowhere to send them.

Once a link exists it goes in one place and nowhere else. Two constraints:

- **Never put an affiliate-tagged link in the printed book or the free book PDF.** The
  Amazon Associates agreement prohibits offline promotion; a tagged link behind a printed QR
  code is a bannable violation.
- Amazon Attribution is free through Author Central and reports real sales by source with
  zero tracking on this site. That is how to measure a launch without breaking the privacy
  promise.

## 8. The contact address

Every page shows `hello@teen-andgrowrich.com`, which does not exist yet. It needs to be a
real mailbox **an adult reads**.

Note the hyphen — it is load-bearing. The address without it belongs to an unrelated
company, which is why the book was re-issued with the hyphenated address on the QR codes,
the Publishing Note, the author page and the back cover. The site already tells readers, in
the footer and on both AI tool pages: *"One adult-monitored mailbox. Nobody reads it
urgently, and it is not a crisis service."*

That last clause needs to stay true, which is item 1.

## 9. brightkids.ai says twelve

`brightkids.ai/meet-ryan` currently reads: *"Ryan Rijvers is the 12-year-old founder and
creative mind behind BrightKids.ai"* — present tense. The book and this site say thirteen.

Two separate reviewers reported it and it has been checked directly. Our side was measured
too: this site says thirteen everywhere, and all eight occurrences of "twelve" come from the
book's own stories — *prints twelve copies*, *twelve weeks from now*. None of them is an
age.

Almost certainly a sentence that expired rather than an error, which is exactly what makes
it worth fixing today: it is **one word, on a property Ryan controls**, and it is the
cheapest possible thing to get wrong on a site whose entire claim is that every statement
is checkable. Anyone comparing the two properties finds the author's age disagreeing with
itself before they find anything else.

## 10. Three domains, free today

Checked at the registrar. All three resolve to nothing and appear unregistered:

- `teen-and-grow-rich.com`
- `teenandgrowrich.nl`
- `teen-andgrowrich.nl`

Register them and point them at the real site. A reader typing the address from memory,
from a printed page, is precisely the reader this project cannot afford to lose — and the
hyphen-free `.com` is already gone to somebody else and is not obtainable, which is the
whole reason the book had to be re-issued.

To be clear: these are redirects. The canonical address stays `teen-andgrowrich.com` and
nothing in the codebase changes.

**This is the only item on this list with an external clock.** Owner's money and owner's
call, but the check is done and it is worth nothing sitting in a document.

## 11. A legal read of the money chapter

The only tail-risk item any reviewer raised. Chapter 12 carries a **Spend / Save / Build
split**, and the site renders the book's wording verbatim. The book contains no income
promises and no investment advice, which is the important part — but *"verbatim from the
book"* is not a defence if the book itself has a grey edge under financial-promotion rules.

One read, by somebody who works in child law and financial promotion, covering **NL plus
the US and UK** as the two largest English-speaking markets. Small money against a real
risk.

While that person is engaged, ask the adjacent question, because it is about Ryan rather
than the book: **how a minor's creator income should be structured.**

- **France** requires income earned by minors from influencer and creator work to be held in
  trust until they are of age.
- **The Netherlands has no equivalent.**
- **The US Coogan law** protects child performers — and does not cover child authors.

There is no obligation here. There is a fifteen-minute conversation that is much easier to
have before there is money than after.

## 12. The ISBNs

For `/editions`, which is the page that lets anyone check which "Teen & Grow Rich" listings
are genuine. Paperback and ebook. Until they land, `src/lib/schema.ts` deliberately emits no
`isbn` field rather than a guessed one.

## 13. Ryan's own filled-in worksheets

Not blocking, but it is the best content on the list. A real First Offer Canvas and a real
One-Page Real Rich Plan, filled in by the author with actual numbers, is worth more than any
blank template — and it is his own work, so it costs nothing but a scan.

---

## Closed

Kept here rather than deleted, because this project does not quietly drop things.

- **"Source links for the karting record."** Resolved, and nothing is needed from the family.
  Four claims now resolve to independent Dutch motorsport press written years before this
  project existed, by people with no stake in a book:

  - **Spa, age eight**, six months into karting — round 2 of the Dutch Rotax Max, Micromax,
    qualified third, third in the prefinal, **fourth overall**, three trophies: fourth, best
    rookie, driver of the day. RaceXpress 27 May 2022, Parkstad Actueel 26 May 2022.
  - **Belgian champion, Rotax Max Mini Rookie**, Genk, 25 October 2023, at ten. RaceXpress.
  - **Round 2 of the German Rotax Max at Genk, MINIMAX class** — won the final, ahead of the
    previous year's Rotax Max world champion from Bahrain. RaceXpress.
  - **Verstappen as his inspiration**, in his own words at eight.

  The two classes are not the same and the site used to blur them: the Belgian title was
  **Mini Rookie**, the German win was **MINIMAX**. **The build is ours** — a source line per
  claim on `/proof`, once the archive copies in item 3 exist.
- **"The free starter chapter, as PDF and HTML."** Superseded on 1 August. The whole book is
  free, readable on the chapter pages and downloadable as a PDF, so there is no starter
  chapter to produce. Non-negotiable 7 now forbids re-introducing one.

---

## One decision for you, not Ryan

`package.json` does not list `zod`, which produces 61 deprecation hints in `astro check`
(0 errors, 0 warnings). Zod 4.4.3 is already present as a transitive dependency of Astro.
Adding it as a direct dependency clears the hints and pins the version the schemas are
written against. Your working agreement says to ask before adding a dependency — so: may I?
