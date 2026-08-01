/**
 * Renders the share card in a real browser so it uses the site's own Noto Sans and the
 * exact brand tokens, instead of whatever font an image library happens to find.
 * Output: public/og-default.jpg at 1200x630. Run against a served build.
 */
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const cover = (await readFile('src/assets/photos/book-cover.jpg')).toString('base64');

/**
 * The host, read from astro.config.mjs rather than typed here.
 *
 * It was typed here, at the hyphen-free spelling, and stayed that way after the site moved.
 * Nothing checks a string inside a card generator: the wrong domain was baked into a JPEG
 * and served as the preview every time anybody shared this site on WhatsApp, Slack or
 * LinkedIn. A picture is the one place a stale string cannot be found by grepping the
 * output, so it reads the single source like everything else does.
 */
const configSource = await readFile('astro.config.mjs', 'utf8');
const siteMatch = /^\s*site:\s*["'](https?:\/\/[^"']+)["']/m.exec(configSource);
if (!siteMatch) throw new Error('make-og: no `site` found in astro.config.mjs');
const host = new URL(siteMatch[1]).host;

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
  @font-face { font-family: N; src: url('http://127.0.0.1:4321/_astro/fonts/1e5097bbf9c9d577.woff2') format('woff2'); font-weight: 400 700; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:#08131f; color:#e8eef4;
         font-family:N,system-ui,sans-serif; display:flex; align-items:center; gap:64px;
         padding:0 72px; overflow:hidden; }
  .cover { flex:none; height:502px; border-radius:3px; box-shadow:0 24px 60px rgba(0,0,0,.55); }
  .body { flex:1; min-width:0; }
  .eyebrow { color:#00ddb3; font-size:19px; font-weight:700; letter-spacing:.09em;
             text-transform:uppercase; }
  h1 { font-size:66px; line-height:1.02; letter-spacing:-.02em; margin-top:14px; font-weight:700; }
  .rules { display:flex; gap:10px; margin:22px 0 24px; }
  .r1 { width:210px; height:6px; background:#00ddb3; }
  .r2 { width:64px;  height:6px; background:#ff9f1c; }
  p  { font-size:25px; line-height:1.4; color:#e8eef4; max-width:34ch; }
  .foot { margin-top:30px; font-size:19px; color:#9baabb; white-space:nowrap; }
  .dot { display:inline-block; width:9px; height:9px; border-radius:50%;
         background:#ff9f1c; vertical-align:middle; margin:0 10px 3px; }
</style></head><body>
  <img class="cover" src="data:image/jpeg;base64,${cover}" alt="">
  <div class="body">
    <p class="eyebrow">Holding the book?</p>
    <h1>Type the page<br>you are on.</h1>
    <div class="rules"><span class="r1"></span><span class="r2"></span></div>
    <p>It opens the tool for that page.</p>
    <p class="foot">${host} <span class="dot"></span> no account, nothing to sign up for</p>
  </div>
</body></html>`;

await writeFile('.og-tmp.html', html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL('.og-tmp.html').href);
await p.waitForTimeout(900);
await p.screenshot({ path: 'public/og-default.jpg', type: 'jpeg', quality: 88 });
await b.close();
console.log('wrote public/og-default.jpg');
