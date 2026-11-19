/**
 * Social Auto-Poster — KJ Augusta Rentals
 * ────────────────────────────────────────────
 * Publishes a blog post's branded card to the Facebook Page and the
 * linked Instagram Business account via the Meta Graph API.
 *
 * Instagram requires a publicly reachable image URL, so this must run
 * AFTER the site has deployed and public/social/{slug}-ig.jpg is live.
 *
 * Run:  node scripts/post-to-social.mjs <slug>
 * Env:  FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN, IG_USER_ID
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const SITE = 'https://kjaugustarentals.com';
const GRAPH = 'https://graph.facebook.com/v21.0';

const { FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN, IG_USER_ID } = process.env;

async function graph(path, params) {
  const body = new URLSearchParams({ ...params, access_token: FB_PAGE_ACCESS_TOKEN });
  const r = await fetch(`${GRAPH}/${path}`, {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(60000),
  });
  const data = await r.json();
  if (!r.ok || data.error) {
    throw new Error(`Graph ${path} failed: ${JSON.stringify(data.error ?? data)}`);
  }
  return data;
}

function buildCaptions(post, url) {
  const tags = (post.social?.hashtags ?? [
    '#augustaga', '#visitaugusta', '#augustanational', '#mastersweek',
    '#savannahriver', '#vacationrental', '#riverfront',
  ]).join(' ');

  const ig = post.social?.instagram
    ?? `${post.excerpt}\n\nThree private acres on the Savannah River. Saltwater pool, six kayaks, your own dock. No other guests on site — 15 minutes from Augusta National.`;

  const fb = post.social?.facebook ?? post.excerpt;

  const tail = `\n\nFull guide + book direct, link in bio.\n\n${tags}`;
  // Instagram rejects captions over 2,200 characters outright.
  const body = ig.length + tail.length > 2200
    ? `${ig.slice(0, 2200 - tail.length - 1).trimEnd()}…`
    : ig;

  return {
    instagram: body + tail,
    facebook: `${fb}\n\nRead the guide, then book direct and skip the platform fees:\n${url}`,
  };
}

async function postToFacebook(caption, imageUrl) {
  const res = await graph(`${FB_PAGE_ID}/photos`, {
    url: imageUrl,
    message: caption,
    published: 'true',
  });
  console.log(`✅ Facebook posted — post_id ${res.post_id ?? res.id}`);
}

async function postToInstagram(caption, imageUrl) {
  const container = await graph(`${IG_USER_ID}/media`, {
    image_url: imageUrl,
    caption,
  });

  // A single image container is usually ready at once, but Meta documents
  // polling, and publishing an unfinished container errors out.
  for (let i = 0; i < 12; i++) {
    const r = await fetch(
      `${GRAPH}/${container.id}?fields=status_code&access_token=${FB_PAGE_ACCESS_TOKEN}`,
      { signal: AbortSignal.timeout(30000) },
    );
    const { status_code } = await r.json();
    if (status_code === 'FINISHED') break;
    if (status_code === 'ERROR') throw new Error('Instagram container processing failed');
    await new Promise(s => setTimeout(s, 5000));
  }

  const res = await graph(`${IG_USER_ID}/media_publish`, { creation_id: container.id });
  console.log(`✅ Instagram posted — media id ${res.id}`);
}

async function main() {
  const slug = process.argv[2];
  if (!slug) { console.error('Usage: node scripts/post-to-social.mjs <slug>'); process.exit(1); }

  for (const [k, v] of Object.entries({ FB_PAGE_ID, FB_PAGE_ACCESS_TOKEN, IG_USER_ID })) {
    if (!v) { console.error(`${k} not set`); process.exit(1); }
  }

  const post = JSON.parse(readFileSync(join(ROOT, 'public', 'posts', `${slug}.json`), 'utf8'));
  const url = `${SITE}/blog/${slug}`;
  const captions = buildCaptions(post, url);

  console.log(`📣 Posting "${post.title}"`);
  await postToFacebook(captions.facebook, `${SITE}/social/${slug}-fb.jpg`);
  await postToInstagram(captions.instagram, `${SITE}/social/${slug}-ig.jpg`);
  console.log('🎉 Social posting done');
}

main().catch(err => { console.error('❌ Social posting failed:', err.message); process.exit(1); });
