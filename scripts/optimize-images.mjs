/**
 * Generates responsive WebP derivatives from the master photos in photos/.
 *
 * Sources:
 *   photos/*.jpg                    -> legacy shared library (photo_01 ...)
 *   photos/<listing>/*.jpeg         -> per-listing sets scraped from Airbnb,
 *                                      each with a listing.json carrying the
 *                                      host-written caption we reuse as ALT.
 *
 * Emits three widths per photo so the browser downloads only what the viewport
 * needs, plus a manifest mapping each id to its srcset, dimensions and alt.
 *
 * Run: npm run images
 */
import sharp from 'sharp';
import { readdir, mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'photos';
const OUT = 'public/assets/img';
const WIDTHS = [400, 800, 1600];
const QUALITY = 80;

await mkdir(OUT, { recursive: true });

const manifest = {};
let totalOut = 0;
let count = 0;

async function emit(key, input, alt) {
  const meta = await sharp(input).metadata();
  const variants = [];

  for (const w of WIDTHS) {
    const outName = `${key}-${w}.webp`;
    const info = await sharp(input)
      .rotate() // honour EXIF orientation
      .resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(path.join(OUT, outName));

    variants.push({ w: info.width, file: outName });
    totalOut += info.size;
  }

  // Small originals can collapse several widths onto the same size.
  const seen = new Set();
  const srcset = variants.filter(v => (seen.has(v.w) ? false : seen.add(v.w)));
  const widest = variants.at(-1).width ?? meta.width;

  manifest[key] = {
    width: widest,
    height: Math.round(widest / (meta.width / meta.height)),
    aspect: +(meta.width / meta.height).toFixed(4),
    srcset,
    ...(alt ? { alt } : {}),
  };
  count++;
}

const entries = await readdir(SRC, { withFileTypes: true });

// Legacy flat library: photos/photo_01.jpg -> id "photo_01"
for (const e of entries.filter(e => e.isFile() && /\.jpe?g$/i.test(e.name))) {
  await emit(path.basename(e.name, path.extname(e.name)), path.join(SRC, e.name));
}

// Per-listing sets: photos/entire-house/entire-house_01.jpeg -> id "entire-house_01"
for (const dir of entries.filter(e => e.isDirectory())) {
  const dirPath = path.join(SRC, dir.name);
  const files = (await readdir(dirPath)).filter(f => /\.(jpe?g|png)$/i.test(f)).sort();

  let alts = {};
  try {
    const listing = JSON.parse(await readFile(path.join(dirPath, 'listing.json'), 'utf8'));
    for (const p of listing.photos ?? []) if (p.file) alts[p.file] = p.alt;
  } catch {
    // No listing.json — photos still get processed, just without captions.
  }

  for (const f of files) {
    await emit(path.basename(f, path.extname(f)), path.join(dirPath, f), alts[f]);
  }
}

// Social card must be a real absolute-URL JPEG for crawlers.
const socialSource = path.join(SRC, 'entire-house', 'entire-house_01.jpeg');
const social = await stat(socialSource).then(() => socialSource).catch(() => path.join(SRC, 'photo_01.jpg'));
await sharp(social)
  .rotate()
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 82 })
  .toFile(path.join(OUT, 'social-card.jpg'));

await writeFile('src/data/imageManifest.json', JSON.stringify(manifest, null, 1) + '\n');

console.log(
  `${count} photos -> ${count * WIDTHS.length} webp files, ` +
  `${(totalOut / 1024 / 1024).toFixed(1)} MB total on disk`
);
