# Teen & Grow Rich — Design System

Extracted directly from the print PDFs (not invented). Every value below was measured
from the embedded text layers and rendered pages of
`04_Teen_and_Grow_Rich_Full_Book_Digital_Mobile.pdf`.

The website is a **translation** of the book's design language, not a redesign.

---

## 1. Colour

The book runs on a white page, one navy, two teals, one orange, and three tint
washes. That is the whole system. Do not add colours.

### Core

| Token | Hex | Used for |
|---|---|---|
| `--tgr-navy` | `#06264D` | H1, box labels, table header fill, page numbers |
| `--tgr-ink` | `#10233A` | Body copy |
| `--tgr-ink-strong` | `#031A35` | Copy inside the 24-Hour Build box |
| `--tgr-teal` | `#087A69` | Eyebrows, section headings ("The Story", "Debrief"), list markers |
| `--tgr-teal-bright` | `#00DDB3` | Chapter spine bar, accent rules, progress fills |
| `--tgr-orange` | `#FF9F1C` | Accent dot, 24-Hour Build border, primary CTA |
| `--tgr-muted` | `#637386` | Running header, meta, debrief question text |
| `--tgr-page` | `#FFFFFF` | Page background — pure white, not off-white |
| `--tgr-hairline` | `#D9E3EA` | Header/footer rules, table borders |

### Tint washes — one per semantic box

| Token | Hex | Box |
|---|---|---|
| `--tgr-tint-mint` | `#EDF6F4` | Hill's Original Idea · alternating table rows |
| `--tgr-tint-cream` | `#FFF6E8` | Your 24-Hour Build |
| `--tgr-tint-blue` | `#EDF2F9` | Reality Check |

### Cinematic layer

The illustrations are Monaco harbour at blue hour. Sampled dominants:
`#1D3A5D` `#36577D` `#0B131E` (water and dusk) with `#C9AA95` `#FFBE67` (harbour
lights). Use these **only** inside or adjacent to imagery — for image overlays,
gradient scrims and hero treatments. They are not UI colours.

### Dark theme — the default

Dark is the default theme. Light is the "print / show an adult" mode that
reproduces the book page exactly. Two themes, two jobs.

The dark base is not invented: it is sampled from the deepest water in the book's
own blue-hour illustrations.

| Token | Hex | Role |
|---|---|---|
| `--tgr-dark-base` | `#08131F` | Page background (sampled from ch. 1 and 6 artwork) |
| `--tgr-dark-surface` | `#0F233A` | Cards, boxes — this is the book's body-ink colour, reused |
| `--tgr-dark-surface-2` | `#163051` | Raised surfaces, hover states |
| `--tgr-dark-text` | `#E8EEF4` | Body copy |
| `--tgr-dark-muted` | `#9BAABB` | Meta, secondary |
| `--tgr-navy-lift` | `#8FB6E0` | Stands in for `--tgr-navy` where navy would vanish |

`--tgr-teal-bright` and `--tgr-orange` carry over unchanged. This is the point of
dark mode: on `#08131F` they finally have room to work, and they become legible
enough to carry text, which they never are in light mode.

The three semantic boxes in dark: tint washes become translucent accent over
surface — `rgba(0,221,179,.08)` for Hill's Idea, `rgba(255,159,28,.10)` for the
24-Hour Build, `--tgr-dark-surface-2` with a `--tgr-navy-lift` border for the
Reality Check. Left borders and labels stay exactly as in light mode.

### Contrast — measured, not estimated

Computed WCAG 2.x ratios. Every pairing below is one we actually intend to ship.

| Pairing | Ratio | |
|---|---|---|
| `--tgr-dark-text` on `--tgr-dark-base` | 16.00 | AAA |
| `--tgr-dark-text` on `--tgr-dark-surface` | 13.59 | AAA |
| `--tgr-dark-muted` on `--tgr-dark-base` | 7.89 | AAA |
| `--tgr-dark-muted` on `--tgr-dark-surface` | 6.70 | AA |
| `--tgr-teal-bright` on `--tgr-dark-base` | 10.68 | AAA |
| `--tgr-orange` on `--tgr-dark-base` | 9.11 | AAA |
| `--tgr-navy-lift` on `--tgr-dark-base` | 6.47 | AA |
| `--tgr-ink` on `--tgr-page` | 15.87 | AAA |
| `--tgr-navy` on `--tgr-page` | 15.08 | AAA |
| `--tgr-teal` on `--tgr-page` | 5.25 | AA |
| `--tgr-muted` on `--tgr-page` | 4.85 | AA |
| `--tgr-navy` on `--tgr-orange` | 7.35 | AAA |
| `--tgr-ink-strong` on `--tgr-tint-cream` | 16.29 | AAA |
| `--tgr-navy` on `--tgr-tint-blue` | 13.41 | AAA |
| `--tgr-teal` on `--tgr-tint-mint` | 4.77 | AA |

**Two hard rules that fall out of the numbers:**

1. **White text on `--tgr-orange` is 2.05:1 and is forbidden.** Orange buttons
   take `--tgr-navy` text (7.35:1). No exceptions.
2. In **light** mode, `--tgr-teal-bright` and `--tgr-orange` never carry text —
   they are bars, borders, dots and fills only. In **dark** mode they may.

`--tgr-muted` on `--tgr-tint-mint` is 4.41:1 and fails AA for body size. That
combination appears in the book's own table rows; on the web, raise those cells
to `--tgr-ink`.

---

## 2. Typography

**Noto Sans** — Regular, Bold, Italic. Cover display type is **Noto Sans Display
Condensed Black**. Both are free via Google Fonts; self-host the woff2 subsets.

There is no serif in this book and no third typeface. Do not introduce one.

### Measured print scale → web scale

Print sizes are for a 140 × 216 mm page. The ratios are what matter; the web
column is those ratios applied to a 17px body.

| Role | Print | Weight | Colour | Web |
|---|---|---|---|---|
| Chapter eyebrow | 7.5pt | Bold, uppercase, tracked | `--tgr-teal` | 13px / .08em |
| H1 chapter title | 23.4pt | Bold | `--tgr-navy` | 50px, clamp to 34px mobile |
| Chapter subtitle | 10.3pt | Bold | `--tgr-ink` | 22px |
| H2 section | 12.1pt | Bold | `--tgr-teal` | 26px |
| Box label | 8.5–9.4pt | Bold, uppercase | `--tgr-navy` | 15px / .04em |
| Body | 7.9–8.3pt | Regular | `--tgr-ink` | 17px / 1.65 |
| Meta, running header, debrief | 6.6–7.7pt | Regular or Bold | `--tgr-muted` | 14px |

Body ratio to H1 is ~2.96 in print. Keep that relationship; it is why the book
feels calm and the headings still land.

Measure: the book's text column is ~104mm on a 140mm page — roughly 68
characters. Cap prose at `65ch`.

---

## 3. The three boxes

These carry the book's meaning. Build them once as components and never
freestyle a fourth variant.

```
┌ 4px left border, --tgr-teal ─────────────────┐
│ fill --tgr-tint-mint                          │
│ HILL'S ORIGINAL IDEA        (label, navy)     │
│ Desire                      (bold, ink)       │
│ Body copy…                                    │
└───────────────────────────────────────────────┘

┌ 4px left border, --tgr-orange ───────────────┐
│ fill --tgr-tint-cream, 1px orange hairline    │
│ YOUR 24-HOUR BUILD          (label)           │
│ Body copy…                  (ink-strong)      │
└───────────────────────────────────────────────┘

┌ 4px left border, --tgr-navy ─────────────────┐
│ fill --tgr-tint-blue, 1px navy hairline       │
│ REALITY CHECK               (label, navy)     │
│ Body copy…                                    │
└───────────────────────────────────────────────┘
```

**Reality Check is never collapsible, never behind a tab, never lazy-loaded.**
It is the safety layer of a book written for 13-year-olds. If it is on the page,
it is visible.

### The three boxes must survive a photocopier

`#EDF6F4`, `#FFF6E8` and `#EDF2F9` sit at almost identical luminance. On a
monochrome photocopier — which is exactly how a teacher will reproduce a
worksheet for a class — **all three render as the same grey**, and the semantic
distinction the whole system rests on disappears.

So colour may never be the only carrier. Each box is identifiable by three
independent signals:

| Box | Fill | Left border | Outline |
|---|---|---|---|
| Hill's Original Idea | mint | **2px solid** teal | none |
| Your 24-Hour Build | cream | **6px solid** orange | 1px hairline |
| Reality Check | pale blue | **6px double** navy | 1px solid |

Plus the uppercase label, which is always present and always spelled out in full.
Between border weight, border style and label, the three remain distinguishable in
pure black and white — and that is a WCAG 1.4.1 (Use of Colour) requirement, not
just a printing nicety.

Test every print stylesheet in greyscale before calling it done.

---

## 4. Chapter page furniture

- Navy bar across the top of every chapter opener (`--tgr-navy`, ~10px)
- `--tgr-teal-bright` vertical spine bar down the left edge, full bleed
- Solid `--tgr-orange` dot, top right of the opener
- Under the H1: a `--tgr-teal-bright` rule (~70% width) followed by a short
  `--tgr-orange` rule — two rules, two colours, in that order
- Running header: `TEEN & GROW RICH` left / `SKILLS. FREEDOM. MONEY. MEANING.`
  right, `--tgr-muted`, hairline beneath
- Page number centred at the foot, `--tgr-muted`

## 5. Tables

Navy header row, white uppercase labels. Body rows alternate `--tgr-page` and
`--tgr-tint-mint`. `--tgr-hairline` borders. Worksheet tables invert this: a
tinted label column on the left, white input column on the right.

On mobile, tables collapse to stacked label/value cards — never a horizontal
scroll for the Hill Remix or Seven Safe Offers tables. Wide *content* (code,
diagrams) may scroll inside its own container; the page body never scrolls
sideways.

## 6. Motion

The book is still and calm. The site should be too. Fades and short translations
only, 150–250ms, `ease-out`. Progress and timer states may animate because they
carry information. Respect `prefers-reduced-motion` — no exceptions.

No parallax, no scroll-jacking, no counters ticking up, no confetti. The book
argues against performance for its own sake; the interface has to agree with it.

## 7. Imagery — and a real constraint

Extracted to `assets/from-book/`:

| Asset | Native size | Verdict |
|---|---|---|
| 15 chapter illustrations | 900 × 675 | **Too small for full-bleed heroes** |
| Front cover | 1654 × 2551 | Fine for anything |
| Illustrated author portrait | 600 × 750 | Fine as a portrait card, not as a hero |
| Photographic author portrait (B&W) | 900 × 900 | Fine |
| QR code | 264 × 264 (PNG) | Regenerate as SVG for print |

900 × 675 is adequate print resolution on a 104mm column (~220 dpi) but it is
**not** enough for a full-bleed web hero: at 1440px wide on a 2× display you need
~2880px and would be upscaling 3.2×. It will look visibly soft.

### The answer: two image layers, two jobs

The repo root also holds 21 original photographs, and auditing them resolved this
better than any upscaler could. **The book's blue-hour illustrations were made
from real photographs of Ryan at Monaco harbour — and those photographs are here,
at web-native resolution.**

| Source | Size | Use |
|---|---|---|
| `Ontwerp zonder titel*.png` ×3 | 2560 × 1440 | Ready-cropped 16:9 — homepage hero, section breaks |
| `image00014/15/17/18.jpeg` | 2268 × 4032 | Monaco, portrait — mobile full-bleed heroes |
| `image00008.jpeg` | 1179 × 1775 | Green race suit, trophy in hand, Belgium podium — **the proof page's key image** |
| `image00026.jpeg` | 1366 × 2048 | Kart paddock, cinematic |
| `era-round-3-zolder…jpg` | 2477 × 1651 | ERA single-seater on track — see the F4 caveat in `CLAUDE.md` |
| `IMG_5427.jpg` | 1179 × 1554 | B&W portrait, OMP suit — this is the back-cover photo |
| `IMG_5330/5332/5335/5336` | 4032 × 3024 | Casual portraits |

So the rule is:

- **Photographs carry the full-bleed heroes.** They are large enough, they are
  real, and they are the same harbour, the same light and the same boy the
  illustrations depict.
- **Illustrations stay framed, at or near native size**, on chapter pages — a
  contained panel in a navy field. This is the better composition anyway, and at
  900px it is honest rather than stretched.

That pairing is also the site's strongest authenticity move: show the real
photograph beside the illustration it produced. The book's whole argument is
proof over polish, and this is the design equivalent.

Upscaling is now a fallback, not the plan. If a specific layout genuinely needs a
larger illustration, upscale that one file once, offline, and commit the result —
never at runtime, and never regenerate, which would let the artwork drift away
from the printed book.

### Approved, prepared and ready to import

Copied into `src/assets/photos/` with EXIF rotation baked in. The originals stay
untouched in the repo root. Import through `astro:assets` so they are served as
AVIF/WebP with explicit dimensions.

| File | Size | Use |
|---|---|---|
| `monaco-harbour-01.jpg` | 2560 × 1440 | Homepage hero |
| `monaco-harbour-02.jpg` | 2560 × 1440 | Section break / `/get` |
| `monaco-harbour-03.jpg` | 2560 × 1440 | `/proof` |
| `ryan-portrait-bw.jpg` | 1179 × 1554 | `/proof`, `/get` — the back-cover portrait |
| `ryan-portrait-illustrated.jpg` | 600 × 750 | Author card |
| `book-cover.jpg` | 1654 × 2551 | `/get`, homepage book section, OG images |

Nothing else is approved. Per D34 the trophy photograph, the paddock photograph, the
ERA/F4 car and the casual portraits are **not** used, and there are no silhouettes.

### Two technical traps in the photo set

1. **Eight files carry EXIF orientation 6 or 8** (`IMG_5330`, `IMG_5330 (1)`,
   `IMG_5332`, `IMG_5335`, `IMG_5336`, `IMG_5836`, `IMG_5847`, `image00019`).
   They are stored landscape and rotated by metadata. Browsers honour this;
   most build-time image pipelines do not. **Bake the rotation in during asset
   prep** or they will ship sideways.
2. These are photographs of a minor. Prefer the back-to-camera Monaco frames —
   they are more cinematic *and* less identifying. Use only face portraits that
   are already published in the book. Never anything that shows a routine, a
   location he returns to, a school, or a schedule.

Do not stretch a 900px image across a 2560px viewport and hope. Ship AVIF + WebP
with explicit `width`/`height`, `loading="lazy"` below the fold, and a
`--tgr-dark-base` background so there is no flash.

Every illustration needs real alt text. These images carry the emotional argument
of each chapter; "chapter illustration" is not alt text.

## 8. What this system rules out

Gradient text. Glassmorphism. Neon glow. Purple-to-pink SaaS gradients. Dark hero
with floating cards. Emoji as iconography. Any second typeface. Any colour not
listed in section 1.
