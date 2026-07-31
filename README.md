# teenandgrowrich.com

Companion site for the book **Teen & Grow Rich** by Ryan Rijvers, imprint Bright Kids.

A reader finishes a chapter, scans the QR code in the book or types the printed page
number, and lands on the tool for that page. The site supplies the tools; the book keeps
the stories.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/, then verifies zero external hosts
npm run preview  # serves the build — the only way to test CSP, which is off in dev
```

Node ≥ 22.12.0.

## What is where

| Path | What |
| --- | --- |
| `src/content/` | All 231 book items as typed YAML. Never hardcode book text into a page. |
| `src/lib/build-meta.ts` | The 19 derived flags — the site's only editorial judgement. See `docs/for-ryan.md`. |
| `src/lib/storage.ts` | The one module allowed to touch localStorage. |
| `docs/decisions.md` | Every decision with its reasoning. Read before proposing anything. |
| `docs/design-system.md` | The brand, measured from the print PDFs. |
| `docs/for-ryan.md` | The nine things only the author can supply. |
| `tools/extract_book_content.py` | Regenerates `src/content/` from the print PDFs, with 14 assertions. |

The print PDFs are deliberately **not** in this repository — see `.gitignore`. The content
they produce is committed, so the site builds from a clean clone; only re-running the
extraction needs them.

## Ground rules

No accounts, no login, no email capture, no server-side storage, no individual tracking.
Progress is kept in the browser and never called "saved". Nothing on the site is locked.
No income claims. Full list in `CLAUDE.md`.

## Deploy

Static output, host-agnostic. `vercel.json` sets the security and cache headers that a
`<meta>` CSP cannot deliver. The production origin is hardcoded in `astro.config.mjs`
(`site`), because the sitemap and canonical URLs need it at build time.
