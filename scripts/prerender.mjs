// Bakes the data-driven sections and the JSON-LD into index.html, so crawlers and link previews that
// don't run JavaScript still see the full content. Re-run after editing js/data.js:
//
//   node scripts/prerender.mjs          update index.html
//   node scripts/prerender.mjs --check  exit 1 if index.html is out of date (e.g. in a pre-commit hook)
//
// Each region sits between <!-- prerender:NAME --> and <!-- /prerender:NAME --> in index.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(root + p, 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of ['js/data.js', 'js/render.js']) vm.runInContext(read(file), sandbox, { filename: file });
const D = sandbox.window.PORTFOLIO, R = sandbox.window.PortfolioRender;

const before = read('index.html');
// The canonical URL is the single place the site's address is written; JSON-LD reuses it.
const canonical = before.match(/<link rel="canonical" href="([^"]+)"/);
if (!canonical) throw new Error('index.html has no <link rel="canonical">');

const regions = {
  jsonld: `<script type="application/ld+json">\n${R.jsonLd(D, canonical[1])}\n  </script>`,
  unlocks: R.unlocks(D),
  quests: R.quests(D),
  worlds: R.worlds(D),
  sheet: R.sheet(D),
  direct: R.direct(D),
};

let html = before;
for (const [name, content] of Object.entries(regions)) {
  const re = new RegExp(`(<!-- prerender:${name} -->)[\\s\\S]*?(<!-- /prerender:${name} -->)`);
  if (!re.test(html)) throw new Error(`index.html is missing the prerender:${name} markers`);
  html = html.replace(re, (_, open, close) => `${open}\n${content}\n${close}`);
}

if (process.argv.includes('--check')) {
  if (html !== before) {
    console.error('index.html is out of date with js/data.js. Run: node scripts/prerender.mjs');
    process.exit(1);
  }
  console.log('index.html is up to date.');
} else if (html === before) {
  console.log('index.html already up to date.');
} else {
  writeFileSync(root + 'index.html', html);
  console.log('Prerendered index.html.');
}
