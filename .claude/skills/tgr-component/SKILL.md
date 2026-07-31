---
name: tgr-component
description: Use when building or restyling ANY UI for teenandgrowrich.com — pages, components, islands, layouts, boxes, buttons, tables, heroes, timers, worksheets. Enforces the book-derived design system in both themes and blocks generic AI-website aesthetics.
---

# Building UI for Teen & Grow Rich

The brand already exists — it was printed in a book. Your job is translation, not
design. Read `docs/design-system.md` before you write CSS. Read it again if you
are about to introduce a colour, a font, or a fourth box variant.

## Before you write anything

1. Which of the three semantic boxes does this content belong in? Hill's Idea
   (mint/teal), 24-Hour Build (cream/orange), Reality Check (blue/navy). If the
   answer is "none", it is body content — do not invent a box.
2. Does it need JavaScript? Astro ships zero JS by default. A checklist that
   persists needs an island; a chapter page does not.
3. Will it be printed? Worksheets, plans and the receipts report all get printed.
   Write the print stylesheet in the same pass, not later.
4. Does it work in **both** themes? Dark is the default; light must look like the
   book page.

## The checklist — every component, every time

Create a todo for each and verify it before claiming done.

- [ ] Colours come only from the tokens in `docs/design-system.md` §1 and the
      dark-theme table. No new hex values.
- [ ] **No white text on orange.** Orange fill → navy text.
- [ ] Light mode: `--tgr-teal-bright` and `--tgr-orange` carry no text.
- [ ] Noto Sans only. No second family, no serif, no system-ui fallback stack
      that changes the look.
- [ ] Prose containers capped at `65ch`.
- [ ] Renders correctly in dark **and** light, checked in both.
- [ ] Keyboard reachable, visible focus ring, logical tab order.
- [ ] Touch targets ≥ 24×24 CSS px (WCAG 2.2 target size), and ≥ 44px for
      anything a thumb hits on mobile.
- [ ] Primary action in the thumb zone on mobile.
- [ ] Real alt text if there is an image. Describe the scene and its point.
- [ ] `prefers-reduced-motion` respected — motion removed, not merely shortened.
- [ ] No horizontal page scroll at 320px. Tables collapse to stacked cards.
- [ ] Print stylesheet, if this is printable content.
- [ ] Any Reality Check is fully visible — not collapsed, tabbed or truncated.

## Chapter furniture

Chapter openers reproduce the book: navy top bar, teal-bright spine down the left
edge, orange dot top-right, eyebrow in teal caps, H1 in navy (light) or
`--tgr-dark-text` (dark), then a teal-bright rule followed by a short orange
rule — two rules, that order.

## Things that are wrong here even though they are fashionable

Gradient text. Glassmorphism. Neon glow. Purple-to-pink gradients. Dark hero with
floating glass cards. Emoji as icons. Bento grids for their own sake. Animated
counters. Confetti. Marquees of logos. "Trusted by" rows. Countdown timers on
anything commercial. Cookie banners (there are no cookies). Chat bubbles.

If a component would look at home on a generic SaaS landing page, it is wrong for
this site.

## The tone test

The book has a stated tone rule: *"When a phrase feels clever but hides the truth,
choose the truth."* Apply it to interface copy. No "Hey future millionaire", no
"Crush your goals", no invented rank names. Say what the thing does.
