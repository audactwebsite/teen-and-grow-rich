/**
 * Screenshot every reviewable page for the visual review pass.
 * Full-page, both themes, phone and desktop. Writes to design/review-shots/.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://127.0.0.1:4321';
const OUT = 'design/review-shots';

const ROUTES = [
  ['home', '/'], ['chapter-01', '/c/01/'], ['chapter-11', '/c/11/'], ['chapter-16', '/c/16/'],
  ['build-02', '/build/02/'], ['build-12', '/build/12/'], ['build-17', '/build/17/'],
  ['builds-hub', '/builds/'], ['reality-check-index', '/reality-check/'],
  ['worksheet-starting-point', '/worksheet/starting-point/'],
  ['worksheet-offer-canvas', '/worksheet/first-offer-canvas/'],
  ['path-tiny-launch', '/path/tiny-launch/'], ['path-ninety-day', '/path/ninety-day/'],
  ['offers', '/offers/'], ['receipts', '/receipts/'], ['parents', '/parents/'],
  ['schools-privacy', '/schools/privacy/'], ['hill', '/hill/'], ['proof', '/proof/'],
  ['get', '/get/'], ['scam-check', '/tools/scam-check/'], ['shrink', '/tools/shrink/'],
  ['privacy', '/privacy/'], ['terms', '/terms/'], ['updates', '/updates/'],
  ['editions', '/editions/'], ['p-index', '/p/'], ['404', '/404.html'],
];

const VIEWPORTS = [['phone', 390, 844], ['desktop', 1440, 900]];
const THEMES = ['dark', 'light'];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
let n = 0, fails = [];

for (const [vpName, width, height] of VIEWPORTS) {
  for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    // Set the theme the same way the site does, before any script runs.
    await ctx.addInitScript((t) => {
      try { localStorage.setItem('tgr.theme.v1', t); } catch {}
    }, theme);
    const page = await ctx.newPage();
    for (const [name, route] of ROUTES) {
      try {
        const res = await page.goto(BASE + route, { waitUntil: 'load', timeout: 20000 });
        if (!res || res.status() >= 400) { fails.push(`${route} -> ${res && res.status()}`); continue; }
        await page.waitForTimeout(250);
        await page.screenshot({
          path: `${OUT}/${name}__${vpName}__${theme}.jpeg`,
          type: 'jpeg', quality: 72, fullPage: true,
        });
        n += 1;
      } catch (e) { fails.push(`${route} (${vpName}/${theme}): ${e.message.split('\n')[0]}`); }
    }
    await ctx.close();
  }
}

await browser.close();
console.log(`wrote ${n} screenshots to ${OUT}`);
if (fails.length) { console.log('FAILURES:'); for (const f of fails) console.log('  ' + f); }
