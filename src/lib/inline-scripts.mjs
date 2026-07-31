/**
 * Every inline <script> on the site, plus the CSP hashes that let them run.
 *
 * Why they live here rather than in the components that render them:
 *
 * `security.csp` is on, and Astro emits hashes only for the scripts it compiles itself.
 * It does not compile an `is:inline` script, and it does not compile a <script> carrying a
 * type attribute. Both of the blocks below are one of those, so both need a hash supplied
 * by hand in astro.config.mjs — otherwise `script-src 'self' <hashes>` blocks them.
 *
 * The failure mode is nasty and invisible in dev, because CSP does not apply to the Vite
 * dev server (D20). Both of these were shipping blocked: the theme script never ran, so
 * `data-js` was never set, so the theme toggle and every print button gated on it stayed
 * hidden — light mode, the print / show-an-adult mode, was unreachable in production.
 *
 * Pasting a hash into the config by hand would go stale the first time someone edited a
 * script, silently. Deriving the markup and the hash from one string means they cannot
 * drift: edit the source below and the hash follows.
 *
 * .mjs rather than .ts so astro.config.mjs can import it directly.
 */

import { createHash } from "node:crypto";

/**
 * Astro's CSP config types a hash as the template literal `sha256-${string}`, so the
 * return is asserted rather than left as a plain string.
 *
 * @param {string} source
 * @returns {`sha256-${string}`}
 */
const sha256 = (source) =>
  /** @type {`sha256-${string}`} */ (
    `sha256-${createHash("sha256").update(source, "utf8").digest("base64")}`
  );

/**
 * Pre-paint theme resolution. Base.astro ships `data-theme="dark"` in the markup, so the
 * default costs nothing; this only corrects the document when the reader has explicitly
 * chosen light.
 *
 * It deliberately does NOT consult `prefers-color-scheme`. Light is not "the OS is light",
 * it is a mode the reader picks when they are about to print or hand the screen to an
 * adult, so an OS setting must not flip it.
 *
 * Must stay inline and un-deferred: a bundled module would paint dark first.
 */
export const THEME_SCRIPT = `
  // The key is duplicated from src/lib/storage.ts on purpose. Importing the module
  // would make this async and hand the reader a flash of the wrong theme; a five-line
  // literal is the honest trade. If THEME_KEY ever changes, change it in both places.
  try {
    var stored = localStorage.getItem("tgr.theme.v1");
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch (e) {
    /* Private mode, or an MDM policy blocking storage. Dark stays. */
  }
  // Proof that scripting ran, set before first paint. Controls that cannot work without
  // JS stay hidden unless this attribute exists, so nothing degrades into a dead button.
  document.documentElement.setAttribute("data-js", "on");
`;

/**
 * Prerender same-origin links on moderate eagerness — roughly, on hover or pointerdown.
 * Excluded: the PDFs (a download rather than a navigation), anything marked rel="external"
 * (the two /hill citations, which must not be fetched until a reader chooses to leave),
 * and anything a page opts out with data-no-prerender.
 *
 * Serialised once, so the string rendered into the HTML and the string being hashed are
 * the same bytes rather than two JSON.stringify calls that happen to agree today.
 */
export const SPECULATION_RULES = JSON.stringify({
  prerender: [
    {
      where: {
        and: [
          { href_matches: "/*" },
          { not: { href_matches: "/*.pdf" } },
          { not: { selector_matches: "[rel~=external]" } },
          { not: { selector_matches: "[data-no-prerender]" } },
        ],
      },
      eagerness: "moderate",
    },
  ],
});

/**
 * /p/[page] — jump straight to the tool for an exactly-matched printed page.
 *
 * Byte-identical on all 65 pages, so it costs one hash. Progressive enhancement over the
 * visible "Open …" link, which works with scripting off.
 *
 * location.replace, never assign: a history entry here would trap the back button in a
 * loop between the destination and this page.
 */
export const PAGE_REDIRECT_SCRIPT = `
    (function () {
      var link = document.querySelector('[data-page-go="redirect"]');
      if (!link) return;
      var go = function () {
        window.location.replace(link.getAttribute("href"));
      };
      // Speculation Rules prerender this document; navigating during a prerender would
      // resolve a page number the reader never typed.
      if (document.prerendering) {
        document.addEventListener("prerenderingchange", go, { once: true });
      } else {
        go();
      }
    })();
  `;

/**
 * /p — honour ?page= when the homepage's own enhancement did not load, rather than making
 * the reader scan 65 rows. The full list underneath is the no-JS answer.
 */
export const PAGE_INDEX_SCRIPT = `
    (function () {
      var raw = new URLSearchParams(window.location.search).get("page");
      if (!raw || !/^\\d+$/.test(raw)) return;
      var row = document.querySelector('[data-page="' + String(Number(raw)) + '"]');
      if (row) window.location.replace(row.getAttribute("href"));
    })();
  `;

/** Passed to security.csp.scriptDirective.hashes in astro.config.mjs. */
export const INLINE_SCRIPT_HASHES = [
  THEME_SCRIPT,
  SPECULATION_RULES,
  PAGE_REDIRECT_SCRIPT,
  PAGE_INDEX_SCRIPT,
].map(sha256);
