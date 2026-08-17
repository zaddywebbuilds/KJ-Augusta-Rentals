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

// Source folder names under photos/. These are deliberately NOT the public
// slugs: photo files are named after their folder, so renaming a listing for
// marketing reasons would otherwise invalidate every derivative in
// public/assets/img. accommodations.ts maps a public slug to its source here.
const LISTINGS = ['entire-house', 'upstairs-terrace', 'downstairs-river-house', 'new-2026'];

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

// A photo's category is its SUBJECT, not everything its caption mentions.
// "Bedroom with large windows offering beautiful water views" is a bedroom
// shot; matching the whole string against the river rule filed it under
// river, which is how an interior ended up captioned "Down to the water".
// So the subject is read from the opening clause — what the photo is *of* —
// and only falls through to the whole-string rules when that finds nothing.
const SUBJECTS = [
  ['bedroom', /\b(bedroom|master suite|primary suite|guest room|bunk room)\b/],
  ['bath',    /\b(bathroom|en.?suite|shower|bathtub|vanity|jacuzzi)\b/],
  ['kitchen', /\b(kitchen|kitchenette|dining (room|area|table)|breakfast)\b/],
  ['living',  /\b(living room|lounge|sunroom|great room|family room|sitting area)\b/],
  ['pool',    /\b(pool|saltwater)\b/],
  ['river',   /\b(dock|kayak|boat slip|river ?bank|riverfront)\b/],
  ['outdoor', /\b(patio|deck|balcony|terrace|fire ?pit|grill|lawn|yard|garden)\b/],
];

/** The opening clause names the subject; the rest usually describes the view. */
const subjectOf = (alt) => alt.split(/[,;.]|\bwith\b|\bthat\b|\boffering\b/)[0];

const classify = (alt = '') => {
  const head = subjectOf(alt).toLowerCase();
  for (const [name, re] of SUBJECTS) if (re.test(head)) return name;

  const whole = alt.toLowerCase();
  for (const [name, re] of RULES) if (re.test(whole)) return name;
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
