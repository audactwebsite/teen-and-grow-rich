/**
 * The site's own address, in one place.
 *
 * It was written out by hand in seven pages — including the line printed on the receipt a
 * reader keeps and the description a school IT reviewer reads — and when the site moved to
 * a different domain, all seven quietly began naming a host the site does not live at. The
 * receipt is meant to be the durable record; a durable record pointing somewhere else is
 * worse than no record.
 *
 * `import.meta.env.SITE` is Astro's own view of `site` in astro.config.mjs, so this cannot
 * drift from the canonical URLs, the sitemap or the share cards.
 */
const raw = import.meta.env.SITE;

if (!raw) {
  throw new Error("`site` must be set in astro.config.mjs — src/lib/site.ts depends on it.");
}

/** Full origin with scheme, e.g. `https://teen-andgrowrich.com`. */
export const SITE_URL: string = raw.replace(/\/$/, "");

/** Bare host for prose and printed lines, e.g. `teen-andgrowrich.com`. */
export const SITE_HOST: string = new URL(SITE_URL).host;
