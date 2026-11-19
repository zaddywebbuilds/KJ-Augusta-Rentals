/**
 * Social Card Generator — KJ Augusta Rentals
 * ─────────────────────────────────────────────
 * Renders branded title cards for a blog post, composited over a real
 * property photo:
 *   public/social/{slug}-ig.jpg   1080x1080  (Instagram feed)
 *   public/social/{slug}-fb.jpg   1200x630   (Facebook / OG)
 *
 * Run:  node scripts/generate-social-card.mjs <slug>
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const IMG = join(ROOT, 'public', 'assets', 'img');
const OUT = join(ROOT, 'public', 'social');

const INK = '#1C1C1A';
const CHAMPAGNE = '#C2A878';
const IVORY = '#FAF7F2';

const SERIF = 'Cormorant Garamond';
const SANS = 'Manrope';

// Hand-picked hero shots only. The wider photo set is mostly interiors,
// utility rooms and signage that read badly under a title overlay, so the
// pool is an explicit allowlist rather than a directory scan.
const PHOTOS = [
  'new-2026_01-1600.webp',  // aerial, dock and river
  'new-2026_02-1600.webp',  // house and pool
  'new-2026_03-1600.webp',  // house and pool
  'new-2026_04-1600.webp',  // house and pool, wide
  'new-2026_05-1600.webp',  // pool with river behind
  'new-2026_21-1600.webp',  // vaulted living room
  'new-2026_23-1600.webp',  // aerial, pool and dock
  'new-2026_24-1600.webp',  // aerial, river wide
  'new-2026_25-1600.webp',  // house from the lawn
  'new-2026_26-1600.webp',  // covered porch
  'new-2026_27-1600.webp',  // house and pool
  'new-2026_31-1600.webp',  // aerial through the trees
  'aerial-view-1600.webp',
  'sunset-river-1600.webp',
  'sunrise-fire-pit-1600.webp',
  'fire-pit-river-1600.webp',
  'back-river-view-1600.webp',
  'cornhole-by-dock-1600.webp',
];

const FONTS = [
  { name: SERIF, data: readFileSync(join(__dir, 'fonts', 'CormorantGaramond-SemiBold.ttf')), weight: 600, style: 'normal' },
  { name: SANS, data: readFileSync(join(__dir, 'fonts', 'Manrope-Medium.ttf')), weight: 500, style: 'normal' },
];

// Stable per-slug photo choice, so re-running a post yields the same card
// while different posts rotate through the set.
function pickPhoto(slug) {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PHOTOS[h % PHOTOS.length];
}

// Titles often carry a subtitle after a colon; the headline alone reads
// better at card size.
function cardTitle(title) {
  const head = title.split(/[:—]/)[0].trim();
  return head.length >= 24 ? head : title.trim();
}

function overlay({ width, height, title, readingMinutes, pad, titleSize, metaSize }) {
  return {
    type: 'div',
    props: {
      style: {
        width, height, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: pad,
        backgroundImage: `linear-gradient(to bottom, rgba(28,28,26,0.20) 0%, rgba(28,28,26,0.55) 45%, rgba(28,28,26,0.93) 100%)`,
      },
      children: [
        { type: 'div', props: { style: { width: pad * 0.78, height: 2, backgroundColor: CHAMPAGNE, display: 'flex' } } },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column' },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: SANS, fontSize: metaSize, letterSpacing: metaSize * 0.2,
                    textTransform: 'uppercase', color: CHAMPAGNE,
                    marginBottom: titleSize * 0.22, display: 'flex',
                  },
                  children: 'Augusta Travel Guide',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontFamily: SERIF, fontSize: titleSize, lineHeight: 1.1,
                    color: IVORY, display: 'flex',
                  },
                  children: title,
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    marginTop: titleSize * 0.34, paddingTop: titleSize * 0.24,
                    borderTop: `1px solid rgba(194,168,120,0.40)`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: SANS, fontSize: metaSize,
                          letterSpacing: metaSize * 0.09,
                          color: 'rgba(250,247,242,0.72)', display: 'flex',
                        },
                        children: 'kjaugustarentals.com',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: SANS, fontSize: metaSize,
                          letterSpacing: metaSize * 0.09,
                          color: CHAMPAGNE, display: 'flex',
                        },
                        children: `${readingMinutes} min read`,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function renderCard({ photo, width, height, title, readingMinutes, pad, titleSize, metaSize, outFile }) {
  const svg = await satori(
    overlay({ width, height, title, readingMinutes, pad, titleSize, metaSize }),
    { width, height, fonts: FONTS },
  );

  const overlayPng = new Resvg(svg, { fitTo: { mode: 'width', value: width } })
    .render().asPng();

  const base = await sharp(join(IMG, photo))
    .resize(width, height, { fit: 'cover', position: 'centre' })
    .toBuffer();

  await sharp(base)
    .composite([{ input: overlayPng, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outFile);

  return outFile;
}

async function main() {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: node scripts/generate-social-card.mjs <slug>'); process.exit(1); }

  const post = JSON.parse(readFileSync(join(ROOT, 'public', 'posts', `${slug}.json`), 'utf8'));
  const title = cardTitle(post.title);
  const readingMinutes = post.readingMinutes ?? 7;
  const photo = pickPhoto(slug);

  mkdirSync(OUT, { recursive: true });
  console.log(`🖼  Photo: ${photo}`);
  console.log(`📝 Card title: ${title}`);

  await renderCard({
    photo, width: 1080, height: 1080, title, readingMinutes,
    pad: 76, titleSize: 78, metaSize: 21,
    outFile: join(OUT, `${slug}-ig.jpg`),
  });
  console.log(`✅ public/social/${slug}-ig.jpg  (1080x1080)`);

  await renderCard({
    photo, width: 1200, height: 630, title, readingMinutes,
    pad: 60, titleSize: 62, metaSize: 19,
    outFile: join(OUT, `${slug}-fb.jpg`),
  });
  console.log(`✅ public/social/${slug}-fb.jpg  (1200x630)`);
}

main().catch(err => { console.error('❌ Card generation failed:', err); process.exit(1); });
