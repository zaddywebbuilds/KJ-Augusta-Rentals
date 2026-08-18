/**
 * Writes a real index.html for every route.
 *
 * GitHub Pages has no rewrite rule, so /stays/upstairs-river-house would fall
 * through to 404.html — it renders correctly for a human (the SPA boots and
 * the router resolves the path) but answers HTTP 404, and Google will not
 * index a 404. Emitting dist/stays/upstairs-river-house/index.html makes the URL
 * answer 200 with its own title, description and canonical already in the
 * markup, so crawlers get the right metadata without executing JavaScript.
 *
 * Runs after `vite build`.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://kjaugustarentals.com';
const shell = await readFile('dist/index.html', 'utf8');
const src = await readFile('src/data/accommodations.ts', 'utf8');

// Pull the fields the head needs straight from the data file, so a new stay
// can't be added without getting a prerendered page.
const stays = [...src.matchAll(
  /slug: '([^']+)',[\s\S]*?name: '([^']+)',[\s\S]*?cardSummary:\s*\n?\s*'([^']+)'/g
)].map(m => ({ slug: m[1], name: m[2], summary: m[3] }));

const mastersYear = (await readFile('src/data/businessConfig.ts', 'utf8'))
  .match(/year:\s*(\d{4})/)?.[1] ?? new Date().getFullYear() + 1;

const routes = [
  ...stays.map(s => ({
    path: `/stays/${s.slug}`,
    title: `${s.name} — Savannah Riverfront Stay in Augusta, GA | KJ Augusta Rentals`,
    description: s.summary,
  })),
  {
    path: '/masters',
    title: `Masters Week ${mastersYear} Rental — Riverfront House Under 15 Minutes from Augusta National`,
    description: `Private Savannah River home sleeping up to 16, under 15 minutes from Augusta National by KJ's back route. Saltwater pool, dock and kayaks. Now booking Masters week ${mastersYear} — direct, no platform fees.`,
  },
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

for (const r of routes) {
  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`)
    .replace(
      /(<meta name="description" content=")[^"]*(")/,
      `$1${esc(r.description)}$2`
    )
    .replace(
      /(<link rel="canonical" href=")[^"]*(")/,
      `$1${SITE}${r.path}$2`
    )
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${SITE}${r.path}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(
      /(<meta property="og:description" content=")[^"]*(")/,
      `$1${esc(r.description)}$2`
    )
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
    .replace(
      /(<meta name="twitter:description" content=")[^"]*(")/,
      `$1${esc(r.description)}$2`
    );

  const dir = path.join('dist', r.path);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), html);
  console.log(`  200 ${r.path}`);
}

console.log(`prerender: ${routes.length} routes`);
