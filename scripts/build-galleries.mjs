/**
 * Orders each listing's photos for the web galleries.
 *
 * KJ's brief: river, pool, dock, kayak and outdoor-lifestyle shots lead —
 * those are what distinguish the property. Repetitive interiors follow.
 *
 * Writes src/data/galleries.json.  Run: node scripts/build-galleries.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const LISTINGS = ['entire-house', 'upstairs-terrace'];

// Earlier rule wins. Order here IS the gallery order.
const RULES = [
  ['river',   /river|waterfront|water view|dock|kayak|boat|fish|savannah/],
  ['pool',    /\bpool|saltwater|swim/],
  ['outdoor', /patio|deck|fire ?pit|grill|bbq|outdoor|terrace|balcony|yard|garden|lawn|acre|cornhole|ping.?pong|golf/],
  ['living',  /living|lounge|sunroom|sofa|sitting|great room|vaulted/],
  ['kitchen', /kitchen|dining|bar seating|appliance/],
  ['bedroom', /bedroom|\bbed\b|sleep|bunk/],
  ['bath',    /bath|shower|tub|vanity|jacuzzi/],
];

const classify = (alt = '') => {
  const a = alt.toLowerCase();
  for (const [name, re] of RULES) if (re.test(a)) return name;
  return 'other';
};

const out = {};

for (const slug of LISTINGS) {
  const file = path.join('photos', slug, 'listing.json');
  const listing = JSON.parse(await readFile(file, 'utf8'));

  const photos = listing.photos
    .filter(p => p.file)
    .map(p => ({
      id: path.basename(p.file, path.extname(p.file)),
      alt: p.alt,
      category: classify(p.alt),
    }));

  const rank = Object.fromEntries(RULES.map(([n], i) => [n, i]));
  rank.other = RULES.length;

  photos.sort((a, b) => rank[a.category] - rank[b.category]);

  const byCategory = {};
  for (const p of photos) (byCategory[p.category] ??= []).push(p.id);

  out[slug] = { photos, byCategory, count: photos.length };
  console.log(
    `${slug.padEnd(18)} ${photos.length} photos  ` +
    Object.entries(byCategory).map(([k, v]) => `${k}:${v.length}`).join(' ')
  );
}

await writeFile('src/data/galleries.json', JSON.stringify(out, null, 1) + '\n');
