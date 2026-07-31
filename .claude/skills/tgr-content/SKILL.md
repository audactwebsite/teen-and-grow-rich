---
name: tgr-content
description: Use when adding, editing or checking site content that comes from the book — chapters, the 19 builds, The Play steps, Reality Checks, debrief questions, worksheets, the 90-day path, the 30-Day Tiny Launch, Seven Safe First Offers, or the parents section. Enforces fidelity to the printed book and the site/book split.
---

# Content work for Teen & Grow Rich

All site content traces back to a printed book that is already shipped. The book
is the source of truth. `docs/content-inventory.md` is the index.

## Fidelity rules

1. **Quote the book verbatim.** Builds, Reality Checks, The Play steps, debrief
   questions and worksheet field labels are the author's words. Extract them from
   `04_Teen_and_Grow_Rich_Full_Book_Digital_Mobile.pdf`; do not paraphrase,
   modernise, shorten or "improve" them.
2. **Every item records its printed page number.** Readers hold the book. A tool
   page that cannot say "page 42" fails its main job.
3. **Respect the site/book split.** Online: The Play, the 19 builds, all 19
   Reality Checks, the 4 worksheets, the 90-day path, the 30-day launch, the
   seven offers, the parents material. Book-only: the 15 stories, "The Hill
   Remix" essays, "What It Means Now". Those get a short teaser and a page
   reference — never the full text.
4. **Content is data.** Everything goes in a typed content collection. If you are
   writing a build's instruction into a `.astro` template, stop and move it.
5. **No new content in the author's voice.** You may write interface copy, labels
   and help text. You may not write new chapters, new builds, new stories or new
   Reality Checks and present them as the book's. If something is genuinely
   missing, flag it and let Ryan write it.

## Verifying against the book

Page N printed = PDF page N+1. To pull exact text:

```bash
python -c "
import fitz
d = fitz.open('04_Teen_and_Grow_Rich_Full_Book_Digital_Mobile.pdf')
print(d[42].get_text())   # PDF index 42 == printed page 42
"
```

Requires `pymupdf`. Counts to check against `docs/content-inventory.md`: 19
builds, 19 Reality Checks, 15 × 5 Play steps, 15 × 3 debrief questions, 26
worksheet fields, 21 tiny-launch tasks, 13 phase actions, 7 offers, 6 scoreboard
dimensions — 231 trackable items.

## Safety content is not decoration

The 19 Reality Checks cover age and platform rules, purchases, copyright and AI
uploads, contracts and customer data, urgency as manipulation, burnout,
collaboration boundaries, courage versus danger, under-18 accounts, privacy
traded for attention, anxiety mistaken for intuition, harassment and blackmail,
self-worth and family finances, and safe offer scope.

They render in full, always visible. Never summarise one. Never drop one because
the layout is tight.

The parents' green/yellow/red approval system is a component, not prose: Green =
low-cost and reversible. Yellow = public posting, small spending, new contacts —
check in first. Red = contracts, financial products, travel, ID documents, large
payments, in-person meetings — direct adult involvement.

## Things that must never appear

- Income figures, earnings claims, or testimonials implying typical results
- Any statement that the book is affiliated with, endorsed by, or a translation
  of Napoleon Hill's work or the Napoleon Hill Foundation. The correct phrasing
  is "inspired by success principles associated with Napoleon Hill".
- The fictional-composite stories presented as real case studies
- Financial, legal, tax or investment advice framing. It is educational content.
- Unverified claims about Ryan — in particular any Formula 4 competition record.
  See `CLAUDE.md`.
