/**
 * Structured data, in one place.
 *
 * Only the nineteen Reality Check pages carried any, which left the book itself, its
 * author and the fifteen chapters invisible as entities — including to the AI crawlers
 * this site allows by name, which is the whole point of allowing them: a reader who asks
 * an assistant about the book should get the book's own answer, not somebody's summary.
 *
 * Two rules this file is written under, both borrowed from the rest of the site:
 *
 *  - Nothing is asserted that is not known. There is no `isbn`, because the ISBNs are not
 *    confirmed; no `offers`, because there is no retailer link yet; no `aggregateRating`,
 *    because inventing reviews is the exact thing /hill exists to complain about. A field
 *    appears here the day the fact does, and not before.
 *  - No dates that move on their own. `dateModified` is a written constant, not a build
 *    timestamp: a rebuild does not modify anything a reader can read, and a freshness
 *    signal nobody earned is a claim nobody made.
 */

const NAME = "Teen & Grow Rich";
const AUTHOR_NAME = "Ryan Rijvers";
const PUBLISHER_NAME = "Bright Kids";

export const author = {
  "@type": "Person",
  name: AUTHOR_NAME,
  /* Deliberately thin. He is a minor: no address, no birth date, no school, no sameAs
     chain of social profiles. `url` points at the page this site controls and nowhere
     else. */
  url: "/proof",
  jobTitle: "Author",
} as const;

export const publisher = {
  "@type": "Organization",
  name: PUBLISHER_NAME,
} as const;

/** The printed book. Facts only, all of them checkable on /get and /editions. */
export const book = {
  "@type": "Book",
  name: NAME,
  bookFormat: "https://schema.org/Paperback",
  numberOfPages: 64,
  inLanguage: "en",
  datePublished: "2026",
  author: { "@type": "Person", name: AUTHOR_NAME },
  publisher: { "@type": "Organization", name: PUBLISHER_NAME },
  audience: { "@type": "PeopleAudience", suggestedMinAge: 13 },
} as const;

/** Resolve the relative urls above against the real origin, and stamp @context on. */
export function jsonLd(node: Record<string, unknown>, site: URL | undefined): string {
  const origin = site ? site.origin : "";
  const absolute = JSON.parse(
    JSON.stringify({ "@context": "https://schema.org", ...node }, (_k, v) =>
      typeof v === "string" && v.startsWith("/") ? `${origin}${v}` : v,
    ),
  );
  /* Escape the one character that could close the script element early. */
  return JSON.stringify(absolute).replace(/</g, "\\u003c");
}
