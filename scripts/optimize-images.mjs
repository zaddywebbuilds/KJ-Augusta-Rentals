/**
 * Generates responsive WebP derivatives from the master photos in photos/.
 *
 * The originals average 2.2 MB (largest 8.4 MB). Shipping them directly meant
 * ~154 MB of image payload, which is what made scrolling hang. Here we emit
 * three widths per photo so the browser downloads only what the viewport
 * actually needs — a phone pulls the 400w file, a retina desktop the 1600w.
 *
 * Run: npm run images
 */
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'photos';
const OUT = 'public/assets/img';
const WIDTHS = [400, 800, 1600];
const QUALITY = 80;

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter(f => /\.jpe?g$/i.test(f)).sort();
const manifest = {};
let totalOut = 0;

for (const file of files) {
  const key = path.basename(file, path.extname(file)); // photo_01
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();

  const variants = [];
  for (const w of WIDTHS) {
    // Never upscale — a 640px original stays 640px.
    const target = Math.min(w, meta.width);
    const outName = `${key}-${w}.webp`;
    const info = await sharp(input)
      .rotate() // honour EXIF orientation
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(path.join(OUT, outName));

    variants.push({ w: info.width, file: outName });
    totalOut += info.size;
  }

  // Deduplicate widths (small originals can collapse to the same size).
  const seen = new Set();
  const srcset = variants.filter(v => (seen.has(v.w) ? false : seen.add(v.w)));

  manifest[key] = {
    width: variants.at(-1).width ?? meta.width,
    height: Math.round((variants.at(-1).width ?? meta.width) / (meta.width / meta.height)),
    aspect: +(meta.width / meta.height).toFixed(4),
    srcset,
  };
}

// A social-card image must be a real absolute-URL JPEG for crawlers.
await sharp(path.join(SRC, 'photo_01.jpg'))
  .rotate()
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 82 })
  .toFile(path.join(OUT, 'social-card.jpg'));

await writeFile(
  'src/data/imageManifest.json',
  JSON.stringify(manifest, null, 1) + '\n'
);

console.log(
  `${files.length} photos -> ${files.length * WIDTHS.length} webp files, ` +
  `${(totalOut / 1024 / 1024).toFixed(1)} MB total on disk`
);
