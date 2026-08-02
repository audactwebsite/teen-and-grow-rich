/**
 * Fails the build if the output references any host other than our own.
 *
 * Why this exists (docs/decisions.md D33): the school- and parent-facing privacy claim is
 * "no accounts, no cookies, no analytics, no third-party requests — verify it yourself in
 * the network tab". That claim is the site's strongest asset with a school DPO, and a
 * single leftover CDN, font or analytics reference silently makes it false. A promise a
 * reviewer can independently check beats one they must trust, so it has to be enforced by
 * a machine rather than by good intentions.
 *
 * Run automatically as postbuild.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, extname } from "node:path";

const DIST = "dist";
const SCANNED = new Set([".html", ".css", ".js", ".mjs", ".json", ".xml", ".webmanifest", ".svg"]);

/**
 * Our own origin, read from astro.config.mjs rather than repeated here.
 *
 * It was hardcoded, and the day the site moved to a different domain this verifier began
 * reporting every canonical URL and every sitemap entry as an external host — a check that
 * fails for the one reason it should never fire is a check people learn to switch off.
 * There is exactly one place the origin is written; this reads that place.
 */
const SITE = await (async () => {
  const src = await readFile("astro.config.mjs", "utf8");
  const m = src.match(/^\s*site:\s*["'](https?:\/\/[^"']+)["']/m);
  if (!m) throw new Error("verify-no-external-hosts: no `site` found in astro.config.mjs");
  return m[1].replace(/\/$/, "");
})();

/** Hosts that may legitimately appear as text rather than as a fetched subresource. */
const ALLOWED_TEXT = [
  SITE,
  "http://www.w3.org/2000/svg",
  "http://www.w3.org/1999/xhtml",
  "https://schema.org",
  "http://schema.org",
  "https://creativecommons.org",

  /* The two citations on /hill, listed as complete URLs rather than as host prefixes so
     that only these exact links pass — an <img src> from either host would still fail.
     They are outbound <a rel="external noreferrer"> links: nothing is requested until a
     reader chooses to leave, so the "open the network tab and check" claim holds. They
     cannot be cut, because /hill states that Napoleon Hill faced fraud charges and
     non-negotiable 10 requires every such claim to carry its source. An unsourced
     accusation would be the worse failure. */
  "https://en.wikipedia.org/wiki/Napoleon_Hill",
  "https://gizmodo.com/the-untold-story-of-napoleon-hill-the-greatest-self-he-1789385645",

  /* The host's data-processing terms, cited on /schools/privacy. Same shape as the two
     above: an outbound <a rel="external noreferrer"> that fetches nothing until a reader
     follows it. A privacy page that names its processor without linking the document that
     makes it one is asking to be taken on trust, which is the opposite of that page's job. */
  "https://vercel.com/legal/dpa",

  /* The karting record on /proof, sourced. Same shape again: outbound links, nothing
     requested until a reader leaves. These exist because /proof was the one page breaking
     non-negotiable 10 — it asked a reader to believe a thirteen-year-old's results and
     linked to nothing, because nobody had gone looking. They are independent Dutch
     motorsport press from 2022 and 2023, written years before this project by people with
     no stake in a book. Listed as complete URLs, not host prefixes, so only these exact
     articles pass.

     Note for whoever touches this next: one of the eight sources found during that search
     already returns 404, which is why archive copies are on the owner's list. A dead link
     is not a source, and a citation that breaks is worse than none — it looks like the
     claim was checked when it can no longer be. */
  "https://www.racexpress.nl/formule-1/karttalent-ryan-rijvers-uit-schimmert-imponeert-tijdens-eerste-wedstrijd-ooit-en-pakt-drie-bekers/n/121318",
  "https://parkstadactueel.nl/2022/05/26/karttalent-ryan-rijvers-8-uit-schimmert-imponeert-tijdens-eerste-wedstrijd-ooit-en-pakt-drie-bekers/",
  "https://www.racexpress.nl/rotax-euro/ryan-rijvers-10-wint-titanenstrijd-in-genk-en-wordt-belgisch-kampioen-ik-was-heel-blij-dat-voelt-zo-goed/n/131801",
  "https://www.racexpress.nl/rotax-euro/karttalent-ryan-rijvers-bluft-iedereen-af-in-genk-en-wint-duitse-rotax-max-fijn-weer-eens-te-winnen/n/136219",
];

/** Attributes that actually cause a network request. */
const FETCHING = /(?:\bsrc|\bhref|\bsrcset|\baction|\bposter|\bdata-src|@import\s+url\(|url\()\s*=?\s*["'(]?\s*(https?:\/\/[^"')\s>]+)/gi;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else if (SCANNED.has(extname(entry.name))) out.push(path);
  }
  return out;
}

const violations = [];

let files;
try {
  files = await walk(DIST);
} catch {
  console.error(`\n  verify-no-external-hosts: no ${DIST}/ directory — run a build first.\n`);
  process.exit(1);
}

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(FETCHING)) {
    const url = match[1];
    if (ALLOWED_TEXT.some((ok) => url.startsWith(ok))) continue;
    violations.push({ file, url });
  }
}

if (violations.length) {
  console.error("\n  EXTERNAL HOST REFERENCES FOUND — the privacy claim would be false.\n");
  const seen = new Set();
  for (const v of violations) {
    const key = `${v.file}::${v.url}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.error(`    ${v.file}\n      -> ${v.url}`);
  }
  console.error(
    "\n  Either self-host the asset or, if it is text rather than a subresource,\n" +
      "  add it to ALLOWED_TEXT in tools/verify-no-external-hosts.mjs with a reason.\n",
  );
  process.exit(1);
}

console.log(`  verify-no-external-hosts: clean (${files.length} files scanned)`);
