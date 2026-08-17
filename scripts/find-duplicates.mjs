/**
 * Finds visually duplicate photos across the three listing galleries.
 *
 * The same rooms were uploaded to more than one Airbnb listing, so the whole
 * house, upstairs and downstairs galleries repeat a lot of shots. Byte hashes
 * miss these because each upload was re-encoded, so this compares a perceptual
 * (average) hash of a 16x16 greyscale reduction instead: near-identical framing
 * lands within a few bits even when the files differ.
 *
 *   node scripts/find-duplicates.mjs           # report only
 *   node scripts/find-duplicates.mjs --write   # also write the drop list
 *
 * Writes src/data/duplicatePhotos.json — ids to hide from galleries, keeping
 * the copy that belongs to the most specific listing.
 */
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const IMG_DIR = 'public/assets/img';
const SIZE = 16;
// Bits of 256. At 12 this matched the two different property signs as one
// photo, so it is deliberately conservative: leaving a near-duplicate in is a
// cosmetic problem, dropping a distinct room is a missing photo.
const THRESHOLD = 6;

// Earlier wins when a group has several copies. The owner's 2026 set is newest
// and best quality so it is never the copy that gets dropped; after that keep
// the single-level listing, since a guest booking that unit needs to see it.
const PRIORITY = [
  'new-2026',
  'upstairs-terrace',
  'downstairs-river-house',
  'entire-house',
  'photo_',
];

async function hash(file) {
  const buf = await sharp(file)
    .greyscale()
    .resize(SIZE, SIZE, { fit: 'fill' })
    .raw()
    .toBuffer();
  const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
  const bits = new Uint8Array(buf.length);
  for (let i = 0; i < buf.length; i++) bits[i] = buf[i] > avg ? 1 : 0;
  return bits;
}

const distance = (a, b) => {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
};

const listingOf = id => PRIORITY.find(p => id.startsWith(p)) ?? 'other';

const files = (await readdir(IMG_DIR)).filter(f => f.endsWith('-400.webp'));
console.log(`hashing ${files.length} photos...`);

const entries = [];
for (const f of files) {
  const id = f.replace('-400.webp', '');
  entries.push({ id, listing: listingOf(id), bits: await hash(path.join(IMG_DIR, f)) });
}

// Union-find over near-identical pairs so a photo appearing in all three
// listings collapses to one group rather than three overlapping pairs.
const parent = new Map(entries.map(e => [e.id, e.id]));
const find = x => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb); };

for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    if (distance(entries[i].bits, entries[j].bits) <= THRESHOLD) union(entries[i].id, entries[j].id);
  }
}

const groups = new Map();
for (const e of entries) {
  const root = find(e.id);
  if (!groups.has(root)) groups.set(root, []);
  groups.get(root).push(e);
}

const dupes = [...groups.values()].filter(g => g.length > 1);
const drop = [];

console.log(`\n${dupes.length} duplicate group(s):\n`);
for (const g of dupes.sort((a, b) => b.length - a.length)) {
  const sorted = [...g].sort(
    (a, b) => PRIORITY.indexOf(a.listing) - PRIORITY.indexOf(b.listing)
  );
  const [keep, ...rest] = sorted;
  console.log(`  keep ${keep.id}`);
  rest.forEach(r => {
    console.log(`  drop   ${r.id}`);
    drop.push(r.id);
  });
  console.log('');
}

console.log(`${drop.length} photo(s) would be hidden as duplicates.`);

if (process.argv.includes('--write')) {
  await writeFile('src/data/duplicatePhotos.json', JSON.stringify(drop.sort(), null, 1) + '\n');
  console.log('-> src/data/duplicatePhotos.json');
}
