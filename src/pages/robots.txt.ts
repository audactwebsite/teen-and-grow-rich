import type { APIRoute } from "astro";
import { SITE_URL } from "../lib/site";

/**
 * robots.txt, generated rather than kept as a static file in public/.
 *
 * It was a static file with the sitemap URL typed into it by hand, and when the site moved
 * to a different domain that line went on pointing crawlers at a host that does not exist —
 * silently, because nothing checks a string in public/. The one line in this file that has
 * to be right is the one that was wrong. It now comes from astro.config.mjs `site`, the
 * same single source as the canonical URLs and the sitemap itself.
 *
 * The named AI crawlers are D30: a reader who asks an assistant "what does Teen & Grow Rich
 * say about scam DMs" should get the book's own answer with its Reality Check attached,
 * rather than a summary of somebody else's advice. /privacy and /schools/privacy both state
 * this to parents and to schools in words, so this file has to actually do it.
 */

const AI_CRAWLERS = [
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export const GET: APIRoute = () => {
  const body = `# ${new URL(SITE_URL).host}
#
# Everything here is free and public. Nothing is locked, so nothing needs hiding.
#
# The AI crawlers are named explicitly (docs/decisions.md D30) because a reader who asks
# an assistant "what does Teen & Grow Rich say about scam DMs" should get the book's own
# answer with its Reality Check attached, not a summary of somebody else's advice. Two
# pages state this in words to parents and to schools - /privacy and /schools/privacy -
# so this file has to actually say it.
#
# Nothing here collects anything. There is no account, no login, no analytics and no
# server-side storage to crawl into.

User-agent: *
Allow: /

# Answer engines and AI training/retrieval crawlers, allowed by name.
${AI_CRAWLERS.map((ua) => `User-agent: ${ua}\nAllow: /`).join("\n\n")}

# The sitemap deliberately omits /p/1..65: those are a navigation mechanism for a
# reader holding the printed book, and each resolves to a canonical page already listed.
Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
