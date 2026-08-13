/**
 * Generates public/sitemap.xml and public/robots.txt from the live route list.
 *
 * Canonical host is the client's own domain — the GitHub Pages URL is only the
 * staging address, and pointing search engines at it would split ranking signal
 * across two hosts.
 *
 * Run: node scripts/build-seo.mjs  (wired into `npm run build`)
 */
import { writeFile, readFile } from 'node:fs/promises';

const SITE = 'https://kjaugustarentals.com';
const today = new Date().toISOString().slice(0, 10);

// Read straight from the data file so a renamed or added stay can't be missed.
// The structured data in index.html used to be hand-written and drifted out of
// sync when the stays were renamed: it advertised names and URLs that 404ed,
// which is exactly the search-value loss KJ asked us to avoid. It is generated
// here now so the two cannot disagree.
const src = await readFile('src/data/accommodations.ts', 'utf8');

const stays = [...src.matchAll(
  /^\s{4}slug: '([^']+)',[\s\S]*?^\s{4}name: '([^']+)',[\s\S]*?^\s{4}guests: (\d+),\s*^\s{4}bedrooms: (\d+),\s*^\s{4}beds: (\d+),\s*^\s{4}bathrooms: (\d+),/gm
)].map(m => ({
  slug: m[1], name: m[2],
  guests: +m[3], bedrooms: +m[4], beds: +m[5], bathrooms: +m[6],
}));

if (stays.length < 3) {
  throw new Error(`build-seo: parsed ${stays.length} stays from accommodations.ts, expected 3+`);
}

const slugs = stays.map(s => s.slug);

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/masters', priority: '0.9', changefreq: 'monthly' },
  ...slugs.map(s => ({ path: `/stays/${s}`, priority: '0.9', changefreq: 'weekly' })),
];

const urls = routes
  .map(
    r => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n');

await writeFile(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
);

await writeFile(
  'public/robots.txt',
  `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`
);

console.log(`sitemap.xml: ${routes.length} routes`);
routes.forEach(r => console.log(`  ${SITE}${r.path}`));

// --- structured data in index.html -----------------------------------------

const accommodationJson = stays
  .map(s => `{
          "@type": "Accommodation",
          "name": ${JSON.stringify(s.name)},
          "url": "${SITE}/stays/${s.slug}",
          "numberOfBedrooms": ${s.bedrooms},
          "numberOfBathroomsTotal": ${s.bathrooms},
          "occupancy": {"@type": "QuantitativeValue", "maxValue": ${s.guests}}
        }`)
  .join(',\n        ');

const [whole, ...parts] = stays;
const staysSentence =
  `The River House can be booked as the entire property ` +
  `(up to ${whole.guests} guests, ${whole.bedrooms} bedrooms, ${whole.beds} beds), ` +
  parts
    .map((s, i) =>
      `${i === parts.length - 1 ? 'or as the ' : 'as the '}${s.name} ` +
      `(up to ${s.guests} guests, ${s.bedrooms} bedroom${s.bedrooms > 1 ? 's' : ''})`
    )
    .join(', ') +
  `. Every option includes the river, dock, kayaks and pool.`;

// Both replacements are anchored to surrounding structure rather than to a
// one-shot placeholder, so re-running the build is a no-op rather than an
// error, and index.html stays valid JSON-LD in the repo.
let html = await readFile('index.html', 'utf8');

// Guard on whether the anchor matched, not on whether the text changed:
// a build where the data is already in sync is a success, not a failure.
const PLACES = /("containsPlace": \[\n)[\s\S]*?(\n      \])/;
const SENTENCE =
  /("What are the three ways to stay at the River House\?"[\s\S]{0,120}?"text": ")(?:[^"\\]|\\.)*(")/;

if (!PLACES.test(html)) throw new Error('build-seo: containsPlace block not found in index.html');
if (!SENTENCE.test(html)) throw new Error('build-seo: stays FAQ answer not found in index.html');

html = html
  .replace(PLACES, `$1        ${accommodationJson}$2`)
  .replace(SENTENCE, `$1${staysSentence.replace(/"/g, '\\"')}$2`);

await writeFile('index.html', html);
console.log(`structured data: ${stays.length} accommodations -> index.html`);
stays.forEach(s => console.log(`  ${s.name} (${s.guests} guests) /stays/${s.slug}`));
