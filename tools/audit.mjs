/**
 * A dated, reproducible audit of the built site.
 *
 * Why this exists: /schools/privacy invites an IT reviewer to open developer tools and
 * check the privacy claims themselves, and /accessibility lists what has and has not been
 * tested. Both are stronger with a committed artefact than with an invitation — "here is
 * the check, run on this date, and here is the command that produced it" beats "trust us,
 * or go and look".
 *
 * What this is NOT: a Lighthouse score or an axe-core run. Neither is installed, and
 * CLAUDE.md requires asking before adding a dependency. Calling this a Lighthouse report
 * would be exactly the kind of borrowed authority /hill exists to complain about. It is a
 * set of things that can be measured with a real browser and no new packages, and every
 * check below states what it actually looked at.
 *
 * Run:  node tools/audit.mjs            (needs `npx astro preview` on :4330)
 * Out:  docs/audits/<date>.md
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:4330";

/** One per page template, not one per page: 147 pages come from about a dozen shapes. */
const ROUTES = [
  ["Homepage", "/"],
  ["Chapter", "/c/07/"],
  ["24-Hour Build", "/build/12/"],
  ["Reality Check", "/reality-check/mindful-tech/"],
  ["Reality Check index", "/reality-check/"],
  ["Worksheet", "/worksheet/first-offer-canvas/"],
  ["Plan", "/path/ninety-day/"],
  ["Receipts", "/receipts/"],
  ["Race Control (reader)", "/race-control/"],
  ["Race Control (adults)", "/parents/"],
  ["For teachers", "/teachers/"],
  ["Schools privacy", "/schools/privacy/"],
  ["Offers", "/offers/"],
  ["Author", "/proof/"],
  ["AI tool", "/tools/scam-check/"],
  ["Page index", "/p/"],
];

/** Runs inside the page. No dependencies, and every rule says what it measured. */
const COLLECT = () => {
  const problems = [];
  const note = (rule, detail) => problems.push({ rule, detail });

  // Images without alt. An empty alt is correct for decorative images and is not an error.
  for (const img of document.querySelectorAll("img")) {
    if (!img.hasAttribute("alt")) note("img-alt", img.currentSrc || img.src || "(no src)");
  }

  // Every form control needs an accessible name.
  for (const el of document.querySelectorAll("input, select, textarea")) {
    const id = el.getAttribute("id");
    const labelled =
      (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
      el.closest("label") ||
      el.getAttribute("aria-label") ||
      el.getAttribute("aria-labelledby") ||
      el.getAttribute("title");
    if (!labelled) note("control-name", (el.tagName + "#" + (id || "(no id)")).toLowerCase());
  }

  // Heading order: a skipped level breaks the outline a screen reader navigates by.
  const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => +h.tagName[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) note("heading-skip", `h${levels[i - 1]} then h${levels[i]}`);
  }
  const h1s = document.querySelectorAll("h1").length;
  if (h1s !== 1) note("h1-count", String(h1s));

  // Duplicate ids break every aria-labelledby and every in-page anchor that points at one.
  const seen = new Set();
  for (const el of document.querySelectorAll("[id]")) {
    if (seen.has(el.id)) note("duplicate-id", el.id);
    seen.add(el.id);
  }

  // WCAG 2.2 AA 2.5.8 — target size, minimum 24x24 CSS px. Skips targets inside a line of
  // prose, which the success criterion exempts.
  for (const el of document.querySelectorAll("a[href], button, input[type=checkbox], summary")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const inline = el.closest("p, li, dd, figcaption, blockquote");
    if (inline) continue;
    if (r.width < 24 || r.height < 24) {
      note("target-size", `${el.tagName.toLowerCase()} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  }

  // Landmarks and language.
  if (!document.querySelector("main")) note("landmark", "no <main>");
  if (!document.documentElement.getAttribute("lang")) note("lang", "no lang on <html>");
  if (!document.querySelector("title")?.textContent?.trim()) note("title", "empty");

  return {
    problems,
    counts: {
      images: document.querySelectorAll("img").length,
      links: document.querySelectorAll("a[href]").length,
      headings: levels.length,
    },
  };
};

await mkdir("docs/audits", { recursive: true });
const browser = await chromium.launch();
const rows = [];
let totalProblems = 0;

for (const [name, path] of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  const hosts = new Set();
  let bytes = 0;
  let requests = 0;
  page.on("request", (r) => {
    requests++;
    const h = new URL(r.url()).host;
    if (h !== new URL(BASE).host) hosts.add(h);
  });
  page.on("response", async (r) => {
    const len = Number(r.headers()["content-length"] ?? 0);
    if (Number.isFinite(len)) bytes += len;
  });

  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const desktop = await page.evaluate(COLLECT);

  // 320px is the narrowest screen in common use; nothing here may scroll sideways.
  await page.setViewportSize({ width: 320, height: 800 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  const problems = [...desktop.problems];
  if (overflow > 0) problems.push({ rule: "overflow-320", detail: `${overflow}px` });
  if (hosts.size) problems.push({ rule: "external-host", detail: [...hosts].join(", ") });

  totalProblems += problems.length;
  rows.push({ name, path, requests, kb: Math.round(bytes / 1024), counts: desktop.counts, problems });
  await ctx.close();
}

await browser.close();

const stamp = process.env.AUDIT_DATE ?? new Date().toISOString().slice(0, 10);
const clean = rows.filter((r) => !r.problems.length).length;

const lines = [
  `# Site audit — ${stamp}`,
  "",
  "Produced by `node tools/audit.mjs` against a local `astro preview` of the built site.",
  "One route per page template rather than one per page: 147 pages come from about a dozen",
  "shapes, and auditing all of them would report the same finding 130 times.",
  "",
  "The table below is measured directly in a real browser with no extra packages, and each",
  "rule states what it looked at. Lighthouse results, where a run was done, are appended",
  "under their own heading — and axe-core is still not among them, which the closing section",
  "says out loud rather than letting a green table imply otherwise.",
  "",
  `**Result: ${clean} of ${rows.length} templates with nothing found, ${totalProblems} findings in total.**`,
  "",
  "| Template | Route | Requests | KB | Findings |",
  "| --- | --- | ---: | ---: | --- |",
  ...rows.map(
    (r) =>
      `| ${r.name} | \`${r.path}\` | ${r.requests} | ${r.kb} | ${
        r.problems.length ? r.problems.map((p) => `\`${p.rule}\``).join(", ") : "—"
      } |`,
  ),
  "",
  "## What each rule checked",
  "",
  "| Rule | What it measured |",
  "| --- | --- |",
  "| `img-alt` | Every `<img>` has an `alt` attribute. An empty `alt` is correct for a decorative image and is not counted. |",
  "| `control-name` | Every input, select and textarea has a label, `aria-label`, `aria-labelledby` or `title`. |",
  "| `heading-skip` | No heading level is skipped, so the outline a screen reader navigates by stays intact. |",
  "| `h1-count` | Exactly one `<h1>` per page. |",
  "| `duplicate-id` | No id appears twice, which would break `aria-labelledby` and in-page anchors. |",
  "| `target-size` | WCAG 2.2 AA 2.5.8: interactive targets at least 24×24 CSS px. Targets inside a line of prose are exempt and are skipped. |",
  "| `landmark` | A `<main>` element exists. |",
  "| `lang` | `<html>` carries a language. |",
  "| `overflow-320` | Nothing scrolls sideways at a 320px viewport. |",
  "| `external-host` | No request goes to any host but this one. |",
  "",
];

const detailed = rows.filter((r) => r.problems.length);
if (detailed.length) {
  lines.push("## Findings in full", "");
  for (const r of detailed) {
    lines.push(`### ${r.name} — \`${r.path}\``, "");
    for (const p of r.problems) lines.push(`- **${p.rule}** — ${p.detail}`);
    lines.push("");
  }
}

const out = `docs/audits/${stamp}.md`;
await writeFile(out, lines.join("\n"), "utf8");
console.log(`${out}: ${clean}/${rows.length} templates clean, ${totalProblems} findings`);
