import type { APIRoute } from "astro";
import { ENTRIES } from "../lib/updates";
import { SITE_URL } from "../lib/site";

/**
 * The changelog as a feed.
 *
 * There is no newsletter on this site and there never will be: a newsletter needs an email
 * address from a thirteen-year-old, and asking for one is the single thing this site exists
 * not to do. That left anyone who wanted to follow the site with "bookmark it and come
 * back", which is not following, it is remembering.
 *
 * A feed fixes that at zero cost to the promise. A reader's feed reader polls this file; no
 * account, no address, no permission, nothing stored here and no way for us to know who
 * subscribed — which is the same shape as everything else on the site.
 *
 * RSS 2.0 rather than Atom because every reader in existence handles it, and this is a
 * plain reverse-chronological list with no need for anything Atom adds.
 */

const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** RFC 822, which is what RSS 2.0 wants. Dates are date-only, so midnight UTC. */
const rfc822 = (iso: string): string => new Date(`${iso}T00:00:00Z`).toUTCString();

export const GET: APIRoute = () => {
  /* Entries share a date, so the id cannot be the date alone. Title is stable and unique
     within a day, and an append-only log never rewrites one. */
  const items = ENTRIES.map((e) => {
    const guid = `${SITE_URL}/updates#${e.date}-${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    const body = e.items.map((i) => `<li>${esc(i)}</li>`).join("");
    return `    <item>
      <title>${esc(e.title)}</title>
      <link>${SITE_URL}/updates</link>
      <guid isPermaLink="false">${esc(guid)}</guid>
      <pubDate>${rfc822(e.date)}</pubDate>
      <description>${esc(`<ul>${body}</ul>`)}</description>
    </item>`;
  }).join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Teen &amp; Grow Rich — updates</title>
    <link>${SITE_URL}/updates</link>
    <description>What changed on this site, and when. Newest first. No account and no email address anywhere.</description>
    <language>en</language>
    <docs>https://www.rssboard.org/rss-specification</docs>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
