import type { APIRoute } from "astro";
import {
  allChapters,
  allBuilds,
  allRealityChecks,
  allWorksheets,
  allSequences,
} from "../lib/content";

/**
 * The sitemap, generated rather than pulled in as a dependency.
 *
 * `@astrojs/sitemap` would do this, but CLAUDE.md requires asking before adding a
 * dependency and a static content site needs very few. Writing it here also lets us make
 * the one judgement an integration cannot: which URLs belong in it.
 *
 * Excluded on purpose:
 *  - /p/1 .. /p/65. They are a navigation mechanism for a reader holding the printed
 *    book, not content. Each one resolves to a canonical destination that is already
 *    listed below, so submitting all 65 would advertise 65 non-canonical URLs for pages
 *    that already appear here — the shape search engines read as doorway pages.
 *  - /404.
 *
 * Included first: the 19 Reality Checks. They are the one content class this site can
 * genuinely own (D30), and they are what a worried teenager or parent actually searches
 * for.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error("`site` must be set in astro.config.mjs for the sitemap.");

  const [chapters, builds, checks, worksheets, sequences] = await Promise.all([
    allChapters(),
    allBuilds(),
    allRealityChecks(),
    allWorksheets(),
    allSequences(),
  ]);

  /** [path, priority] — priority reflects what we most want found, not vanity. */
  const entries: Array<[string, string]> = [
    ["/", "1.0"],
    ["/reality-check", "0.9"],
    ...checks.map((c) => [`/reality-check/${c.id}`, "0.9"] as [string, string]),
    ["/builds", "0.8"],
    ...chapters.map((c) => [`/c/${pad(c.data.n)}`, "0.8"] as [string, string]),
    /* /c/16 is deliberately absent while it says "not written yet". It carries
       noindex until Ryan's text lands; submitting a placeholder would ask search
       engines to weigh a page this site does not want weighed. Put it back then. */
    ...builds.map((b) => [`/build/${pad(b.data.n)}`, "0.7"] as [string, string]),
    ...worksheets.map((w) => [`/worksheet/${w.id}`, "0.7"] as [string, string]),
    ...sequences.map((s) => [`/path/${s.id}`, "0.7"] as [string, string]),
    ["/offers", "0.7"],
    ["/parents", "0.8"],
    ["/schools/privacy", "0.7"],
    ["/hill", "0.7"],
    ["/proof", "0.6"],
    ["/get", "0.6"],
    ["/receipts", "0.5"],
    ["/tools/scam-check", "0.6"],
    ["/tools/shrink", "0.6"],
    ["/privacy", "0.4"],
    ["/terms", "0.4"],
    ["/updates", "0.4"],
    ["/editions", "0.4"],
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ([path, priority]) =>
      `  <url><loc>${new URL(path, site).href}</loc><priority>${priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
