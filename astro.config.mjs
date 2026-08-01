// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { INLINE_SCRIPT_HASHES } from "./src/lib/inline-scripts.mjs";

/**
 * teenandgrowrich.com — static companion site for the book Teen & Grow Rich.
 *
 * Decisions this file implements (see docs/decisions.md):
 *  D20  Astro 7 + the built-in Fonts API. Noto Sans is taken verbatim from the print
 *       book, so a font swap is a brand-fidelity defect. The Fonts API downloads and
 *       self-hosts, so no third-party font request happens at runtime — which the
 *       school-facing privacy claim depends on (D33).
 *  D20  CSP is on. It is the clean answer to the pre-paint theme script: its hash is
 *       registered rather than opening up unsafe-inline. Note CSP does not apply in
 *       dev (Vite dev server) — verify with `astro build && astro preview`.
 *  D21  No ClientRouter. Native cross-document view transitions plus speculation
 *       rules are declared in CSS/HTML instead, with zero routing JavaScript.
 *  D1   Static output. No adapter, no server, host-agnostic.
 */
export default defineConfig({
  /* The live origin. Every canonical URL, the sitemap and every share card are built
     from this string, so it must match the domain that is actually connected — a
     canonical pointing at a host that does not resolve is worse than none.

     The two printed QR codes encode the bare root https://teenandgrowrich.com (decoded
     from assets/from-book/qr-companion.png, not assumed). THAT DOMAIN BELONGS TO SOMEBODY
     ELSE — a different company, unconnected to this project. It is not available and it is
     not coming. teen-andgrowrich.com, with the hyphen, is the only address this book has.

     So this is not a placeholder waiting to be swapped back. Every printed QR code points
     at a stranger's domain, and the only route a reader has into this site is typing the
     page number. That is what /p/1../p/65 is for, and it is why those routes must never
     break. */
  site: "https://teen-andgrowrich.com",
  output: "static",

  /* "ignore" so both /c/01 and /c/01/ resolve. Printed QR targets must never 404, and a
     trailing slash is exactly the kind of detail that differs between the host you test
     on and the host you deploy to (D13). */
  trailingSlash: "ignore",

  build: {
    // One stylesheet beats a request per page for a site this small.
    inlineStylesheets: "auto",
    // directory format keeps URLs extension-less on every static host.
    format: "directory",
  },

  markdown: {
    /* No code samples on this site, and Shiki emits inline styles that CSP would have to
       be loosened for. Turning it off keeps the CSP strict. */
    syntaxHighlight: false,
  },

  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "base-uri 'none'",
        /* 'self', not 'none'. The page-number field on / and /404 is a real
           <form method="get" action="/p/"> — it is the no-JS path for a reader holding
           the open book, and the single most important interaction on the site (D13).
           'none' blocks the submission outright, and CSP does not apply in dev, so the
           failure would only ever have shown up in production. Still no cross-origin
           target: 'self' cannot post anywhere but this site. */
        "form-action 'self'",
        /* frame-ancestors is NOT here, and cannot be. The CSP spec requires browsers to
           ignore it when it arrives in a <meta> element, so it protected nothing and
           logged a console error on every single page load — the only failing item in a
           Lighthouse run. It is served as a real Content-Security-Policy response header
           from vercel.json instead, alongside X-Frame-Options: DENY. If this site ever
           moves off a host that can set response headers, that protection moves with it
           and does not come back here. */
        "object-src 'none'",
      ],

      scriptDirective: {
        /* Astro emits hashes only for the scripts it compiles. It compiles neither an
           `is:inline` script (the pre-paint theme script) nor a <script> carrying a type
           attribute (the speculation rules), so both were being blocked in production —
           invisibly, because CSP does not apply in dev. Derived from the same strings
           that get rendered; see src/lib/inline-scripts.mjs. */
        hashes: INLINE_SCRIPT_HASHES,
      },
    },
  },

  /* Kept deliberately small, because Base.astro preloads this family and `rel=preload`
     ignores `unicode-range`: every file the family generates is downloaded on every page
     whether or not a glyph from it is ever drawn. The primary reader is on a phone, on
     mobile data or school wifi, holding the printed book.

       - `latin` only. The whole site was scanned for codepoints in U+0100–U+024F and
         U+1E00–U+1EFF and contains none; `latin-ext` was 357KB of preloaded weight that no
         page could ever render. Add it back the day a page needs one of those glyphs.
       - `normal` only. There are exactly two <i> elements on the site (a book title on
         /hill and one word on /p); they take the browser's synthesised oblique rather than
         228KB of italic files preloaded onto all 143 pages. */
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Noto Sans",
      cssVariable: "--font-noto-sans",
      weights: [400, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
    {
      // Cover and display type only. The book uses Noto Sans Display Condensed Black.
      provider: fontProviders.google(),
      name: "Noto Sans Display",
      cssVariable: "--font-noto-display",
      weights: [900],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
