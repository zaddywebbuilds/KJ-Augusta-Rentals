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

// Read slugs straight from the data file so a new stay can't be forgotten here.
const src = await readFile('src/data/accommodations.ts', 'utf8');
const slugs = [...src.matchAll(/^\s{4}slug: '([^']+)'/gm)].map(m => m[1]);

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
