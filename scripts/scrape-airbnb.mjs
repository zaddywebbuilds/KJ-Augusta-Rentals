// Pulls photo URLs + captions from the live Airbnb listings and downloads the
// originals into photos/<listing>/. Airbnb 403s plain fetches, so this replays
// the browser's own request headers.
//
//   node scripts/scrape-airbnb.mjs

import { writeFile, mkdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const LISTINGS = [
  { id: '1658102100640730741', slug: 'entire-house' },
  { id: '1658162430407855672', slug: 'upstairs-river-house' },
  { id: '1658150118472079882', slug: 'downstairs-river-house' },
];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

function extractPhotos(html, listingId) {
  const re = new RegExp(
    `"baseUrl":"(https://a0\\.muscache\\.com[^"]*Hosting-${listingId}[^"]+)"[^}]*?"(?:accessibilityLabel|caption)":\\{?"?(?:__typename":"[^"]*",")?(?:title":)?"([^"]{5,300})"`,
    'g'
  );
  const out = [];
  const seen = new Set();
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ url, alt: m[2].replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim() });
  }
  return out;
}

function extractField(html, label) {
  const m = html.match(new RegExp(`"${label}":"([^"]{2,400})"`));
  return m ? m[1].replace(/\\n/g, '\n').replace(/\\u002F/g, '/') : null;
}

async function scrapeListing({ id, slug }) {
  const res = await fetch(`https://www.airbnb.com/rooms/${id}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const html = await res.text();

  const photos = extractPhotos(html, id);
  const meta = {
    id,
    slug,
    url: `https://www.airbnb.com/rooms/${id}`,
    title: extractField(html, 'title') || extractField(html, 'name'),
    photoCount: photos.length,
  };

  const dir = path.join('photos', slug);
  await mkdir(dir, { recursive: true });

  let ok = 0;
  for (const [i, p] of photos.entries()) {
    const n = String(i + 1).padStart(2, '0');
    const ext = p.url.match(/\.(jpe?g|png|webp)/i)?.[1] ?? 'jpg';
    const file = path.join(dir, `${slug}_${n}.${ext.toLowerCase()}`);
    try {
      // Airbnb's CDN resizes on demand; the bare /original/ path caps at 1200w.
      const img = await fetch(`${p.url}?im_w=2560`, { headers: HEADERS });
      if (!img.ok) throw new Error(`HTTP ${img.status}`);
      await pipeline(img.body, createWriteStream(file));
      p.file = path.basename(file);
      ok++;
      process.stdout.write(`\r  ${slug}: ${ok}/${photos.length}`);
    } catch (err) {
      console.warn(`\n  ! ${p.url.slice(-40)} — ${err.message}`);
    }
  }
  console.log(`\n  ${slug}: ${ok} photos -> ${dir}`);

  await writeFile(
    path.join(dir, 'listing.json'),
    JSON.stringify({ ...meta, photos }, null, 2)
  );
  return { ...meta, downloaded: ok };
}

const summary = [];
for (const listing of LISTINGS) {
  console.log(`\n${listing.slug} (${listing.id})`);
  try {
    summary.push(await scrapeListing(listing));
  } catch (err) {
    console.error(`  failed: ${err.message}`);
  }
}
console.table(summary);
