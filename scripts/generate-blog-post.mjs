/**
 * Daily Blog Post Generator — KJ Augusta Rentals
 * ─────────────────────────────────────────────────
 * 1. Picks a fresh keyword cluster from a rotating topic pool
 * 2. Fetches Google Autocomplete suggestions for real search demand signals
 * 3. Scrapes the top 3 ranking pages for each keyword — reads their H1/H2/H3
 *    structure, word count, and topic coverage
 * 4. Calls DeepSeek Chat to write a superior, fully SEO-optimised article
 * 5. Saves the post JSON to public/posts/{slug}.json
 * 6. Prepends the new post to public/posts/index.json
 *
 * Run:  node scripts/generate-blog-post.mjs
 * Env:  DEEPSEEK_API_KEY  (required)
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT  = join(__dir, '..');
const POSTS = join(ROOT, 'public', 'posts');
const INDEX = join(POSTS, 'index.json');

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_KEY) { console.error('DEEPSEEK_API_KEY not set'); process.exit(1); }

// ── Topic pool ───────────────────────────────────────────────────────────────
// Rotated daily by index (day-of-year mod pool size).
// Each entry = { seed, intent, internalSlug }
// intent: 'informational' | 'transactional' | 'navigational'

const TOPIC_POOL = [
  { seed: 'things to do in Augusta GA', intent: 'informational' },
  { seed: 'Augusta GA vacation rentals', intent: 'transactional' },
  { seed: 'Masters Week Augusta accommodation', intent: 'transactional' },
  { seed: 'Savannah River activities Augusta', intent: 'informational' },
  { seed: 'best restaurants Augusta GA', intent: 'informational' },
  { seed: 'Augusta National Golf Club visitor guide', intent: 'informational' },
  { seed: 'waterfront vacation rental Augusta Georgia', intent: 'transactional' },
  { seed: 'what to do in Augusta GA with family', intent: 'informational' },
  { seed: 'Augusta GA weekend getaway', intent: 'transactional' },
  { seed: 'Savannah River kayaking Augusta GA', intent: 'informational' },
  { seed: 'Masters Tournament ticket tips Augusta', intent: 'informational' },
  { seed: 'private pool vacation rental Augusta GA', intent: 'transactional' },
  { seed: 'Augusta GA local guide', intent: 'informational' },
  { seed: 'golf vacation Augusta Georgia', intent: 'transactional' },
  { seed: 'large group rental Augusta GA', intent: 'transactional' },
  { seed: 'bachelorette party Augusta Georgia', intent: 'transactional' },
  { seed: 'corporate retreat Augusta GA', intent: 'transactional' },
  { seed: 'historic downtown Augusta GA', intent: 'informational' },
  { seed: 'Riverwalk Augusta GA guide', intent: 'informational' },
  { seed: 'Augusta GA spring travel guide', intent: 'informational' },
  { seed: 'best neighbourhoods in Augusta GA', intent: 'informational' },
  { seed: 'pet friendly vacation rental Augusta', intent: 'transactional' },
  { seed: 'Augusta GA fishing spots', intent: 'informational' },
  { seed: 'plan a Masters Week trip Augusta', intent: 'informational' },
  { seed: 'what is Augusta GA known for', intent: 'informational' },
  { seed: 'Augusta GA outdoor activities', intent: 'informational' },
  { seed: 'rent a house for Masters Week', intent: 'transactional' },
  { seed: 'Augusta GA nightlife and dining', intent: 'informational' },
  { seed: 'scenic drives near Augusta Georgia', intent: 'informational' },
  { seed: 'South Carolina day trips from Augusta', intent: 'informational' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function todayDayOfYear() {
  const now  = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function pickTopic() {
  const idx = todayDayOfYear() % TOPIC_POOL.length;
  return TOPIC_POOL[idx];
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

async function fetchJson(url, opts = {}) {
  const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(10000) });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.json();
}

async function fetchText(url) {
  const r = await fetch(url, {
    signal: AbortSignal.timeout(12000),
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KJBlogBot/1.0)' },
  });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}

// ── Google Autocomplete ───────────────────────────────────────────────────────

async function getAutocompleteSuggestions(keyword) {
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`;
    const data = await fetchJson(url);
    return (data[1] || []).slice(0, 8);
  } catch {
    return [];
  }
}

// ── SERP scraping (top 3 organic) ────────────────────────────────────────────
// Uses DuckDuckGo HTML (no JS required, no API key) to get competitor URLs.

async function getCompetitorUrls(keyword) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(keyword)}`;
    const html = await fetchText(url);
    // Extract result links
    const matches = [...html.matchAll(/href="(https?:\/\/[^"]+)"/g)]
      .map(m => m[1])
      .filter(u =>
        !u.includes('duckduckgo') &&
        !u.includes('bing.com') &&
        !u.includes('youtube.com') &&
        !u.includes('facebook.com') &&
        !u.includes('instagram.com') &&
        !u.includes('twitter.com') &&
        !u.includes('pinterest.com') &&
        !u.includes('kjaugustarentals.com')
      );
    // Deduplicate and take first 3
    return [...new Set(matches)].slice(0, 3);
  } catch {
    return [];
  }
}

// ── Competitor page analysis ──────────────────────────────────────────────────

async function analyseCompetitorPage(url) {
  try {
    const html = await fetchText(url);
    const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = textContent.split(' ').length;

    const h1Match  = [...html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g,'').trim());
    const h2Match  = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g,'').trim());
    const h3Match  = [...html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g,'').trim());
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    return {
      url,
      title: titleMatch ? titleMatch[1].trim() : '',
      h1: h1Match.slice(0, 2),
      h2: h2Match.slice(0, 8),
      h3: h3Match.slice(0, 6),
      wordCount,
      snippet: textContent.slice(0, 500),
    };
  } catch {
    return null;
  }
}

// ── DeepSeek call ─────────────────────────────────────────────────────────────

async function callDeepSeek(systemPrompt, userPrompt) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(90000),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.7,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${err}`);
  }
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// ── Build the full article ────────────────────────────────────────────────────

async function generatePost(topic, autocomplete, competitorData) {
  const competitorSummary = competitorData
    .filter(Boolean)
    .map((c, i) => `
Competitor ${i + 1}: ${c.url}
  Title: ${c.title}
  H1: ${c.h1.join(' | ')}
  H2s: ${c.h2.slice(0,6).join(' | ')}
  Word count: ~${c.wordCount}
  Snippet: ${c.snippet.slice(0, 300)}
`).join('\n');

  const systemPrompt = `You are an expert SEO content writer and local travel specialist for Augusta, Georgia.
You write for KJ Augusta Rentals (kjaugustarentals.com) — a premium waterfront vacation rental on the Savannah River in Augusta, GA.

PROPERTY FACTS (use these specifically, never generically):
- 3 private acres directly on the Savannah River
- Saltwater pool overlooking the river
- 6 kayaks included, private dock and boat slip
- Sleeps up to 16 — entire property, NO shared guests or other parties on site
- 4 bedrooms, fire pit, propane + charcoal grills, ping pong, cornhole, golf tee-off area
- 15 minutes from Augusta National Golf Club via KJ's private back route (avoids Masters traffic)
- Book direct — no Airbnb/VRBO platform fees, pay the owner directly
- Three stay options: Entire River House (up to 16), Upstairs River House (smaller groups), River Suite (couples)

YOUR DUAL PURPOSE: (1) Write genuinely useful, authoritative content that earns top Google rankings. (2) Every article must make KJ Augusta Rentals feel like the OBVIOUS, SUPERIOR choice for anyone visiting Augusta — not one option among many, but the clear winner over downtown hotels, generic Airbnbs, and chain accommodations. Use real comparisons and specific property details to show why.

You write authoritative, locally specific, long-form content that outranks competitors on Google.
Every article must feel genuinely useful — not generic, not padded, not promotional-sounding.
ALWAYS respond with valid JSON only. No markdown fences, no preamble.`;

  const userPrompt = `TODAY'S DATE: ${todayISO()} — the current year is ${new Date().getFullYear()}.
Never reference a year earlier than this as if it were current. If you mention
a year at all (titles, "best of" framing, hashtags, upcoming events), it must be
${new Date().getFullYear()} or later. Prefer evergreen phrasing over a year.

TARGET KEYWORD: "${topic.seed}"
SEARCH INTENT: ${topic.intent}
AUTOCOMPLETE SUGGESTIONS (real user searches): ${autocomplete.join(', ')}

COMPETITOR ANALYSIS (what currently ranks — you must beat this):
${competitorSummary || 'No competitor data available — write the definitive guide.'}

TASK: Write a complete, SEO-optimised blog post that outranks all competitors.

REQUIREMENTS:
- Word count: 1,400–1,800 words
- Primary keyword in first 100 words, H1, and meta title
- Use autocomplete terms naturally throughout (LSI/related keywords)
- Structure: compelling H1, 5–8 H2 sections, mix of H3 sub-sections, numbered/bullet lists
- Include specific Augusta local details (street names, real venues, Riverwalk, Augusta National, etc.)
- REQUIRED: Include a dedicated H2 section titled something like "Where to Stay in Augusta" or "Best Place to Stay Near [topic]" (match the topic naturally). This section MUST:
  * Position KJ Augusta Rentals as the superior choice over downtown Augusta hotels and generic short-term rentals
  * Name specific competitors' weaknesses (hotel parking nightmares during Masters, shared Airbnb spaces, no waterfront access, platform fees) without naming them
  * Highlight KJ's specific advantages: private 3-acre waterfront, no other guests on-site, saltwater pool, kayaks, direct river access, back-road to Augusta National
  * Link naturally to /stays/entire-river-house for groups, /stays/upstairs-river-house for smaller groups, /stays/river-suite for couples
  * End with a direct, confident call to action: "Check availability and book direct at kjaugustarentals.com — no platform fees, you pay the owner directly."
- Weave 1–2 additional natural mentions of KJ Augusta Rentals into other relevant sections (e.g. if writing about kayaking, mention the 6 included kayaks; if writing about Masters Week, mention the back-road tip and proximity)
- Internal links should feel like genuine editorial recommendations, not ads
- NO fluff, NO generic travel clichés — every sentence must earn its place

SOCIAL CAPTIONS: also write Instagram and Facebook captions for this post.
- Open with a hook, not the title. No "Check out our new blog post"
- Carry the same booking intent as the article: name a concrete KJ advantage
- Instagram: punchier, line breaks between thoughts, no URL
- Facebook: a little more context, no URL
- Never use emoji

SEO META (strict character limits):
- metaTitle: 50–60 characters, keyword-first
- metaDescription: 145–160 characters, includes keyword + compelling reason to click

OUTPUT — respond with this exact JSON structure:
{
  "slug": "url-friendly-slug-here",
  "title": "Full Article Title (H1)",
  "metaTitle": "SEO meta title ≤60 chars",
  "metaDescription": "SEO meta description 145-160 chars",
  "excerpt": "2-3 sentence preview shown on the blog index page",
  "keywords": ["primary keyword", "secondary keyword 1", "secondary keyword 2", "secondary keyword 3", "secondary keyword 4"],
  "readingMinutes": 7,
  "content": "<h2>First Section</h2><p>Content...</p><h2>Second Section</h2>...",
  "social": {
    "instagram": "2-3 short punchy paragraphs for an Instagram caption. Hook first line. Specific Augusta detail, then why KJ's river house beats a hotel. No link (IG kills reach on links) — end before the CTA, the script appends 'link in bio'.",
    "facebook": "2-3 short paragraphs for a Facebook post. Slightly more informative than Instagram, conversational, ends on a reason to click through. No URL — the script appends it.",
    "hashtags": ["#augustaga", "#visitaugusta", "#5 to 9 relevant lowercase hashtags mixing location, topic and travel intent"]
  },
  "schema": {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Full Article Title",
    "description": "Same as metaDescription",
    "datePublished": "${todayISO()}",
    "dateModified": "${todayISO()}",
    "author": {"@type": "Organization", "name": "KJ Augusta Rentals"},
    "publisher": {"@type": "LocalBusiness", "name": "KJ Augusta Rentals", "url": "https://kjaugustarentals.com"},
    "mainEntityOfPage": {"@type": "WebPage", "@id": "https://kjaugustarentals.com/blog/SLUG_PLACEHOLDER"}
  }
}`;

  const raw = await callDeepSeek(systemPrompt, userPrompt);

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/,'').trim();
  const post = JSON.parse(cleaned);

  // Fix schema URL placeholder
  if (post.schema?.mainEntityOfPage) {
    post.schema.mainEntityOfPage['@id'] =
      `https://kjaugustarentals.com/blog/${post.slug}`;
  }

  post.publishedAt = todayISO();
  post.updatedAt   = todayISO();

  return post;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const topic = pickTopic();
  console.log(`📝 Today's topic: "${topic.seed}"`);

  // Check if we already published something today
  const existingIndex = JSON.parse(readFileSync(INDEX, 'utf8'));
  if (existingIndex.some(p => p.publishedAt === todayISO())) {
    console.log('⏭  Already published a post today — skipping.');
    process.exit(0);
  }

  console.log('🔍 Fetching autocomplete suggestions…');
  const autocomplete = await getAutocompleteSuggestions(topic.seed);
  console.log(`   Found: ${autocomplete.join(', ')}`);

  console.log('🌐 Finding competitor pages…');
  const urls = await getCompetitorUrls(topic.seed);
  console.log(`   URLs: ${urls.join(', ')}`);

  console.log('📊 Analysing competitor content…');
  const competitorData = await Promise.all(urls.map(analyseCompetitorPage));
  const analysed = competitorData.filter(Boolean);
  console.log(`   Analysed ${analysed.length} competitor pages`);
  analysed.forEach(c => console.log(`   - ${c.url} (~${c.wordCount} words)`));

  console.log('🤖 Generating post with DeepSeek…');
  const post = await generatePost(topic, autocomplete, competitorData);
  console.log(`   Title: ${post.title}`);
  console.log(`   Slug:  ${post.slug}`);

  // Save individual post file
  const postFile = join(POSTS, `${post.slug}.json`);
  writeFileSync(postFile, JSON.stringify(post, null, 2), 'utf8');
  console.log(`✅ Saved: public/posts/${post.slug}.json`);

  // Update index (newest first)
  const summary = {
    slug:           post.slug,
    title:          post.title,
    metaTitle:      post.metaTitle,
    metaDescription:post.metaDescription,
    excerpt:        post.excerpt,
    publishedAt:    post.publishedAt,
    keywords:       post.keywords,
    readingMinutes: post.readingMinutes,
  };
  existingIndex.unshift(summary);
  writeFileSync(INDEX, JSON.stringify(existingIndex, null, 2), 'utf8');
  console.log(`📋 Index updated (${existingIndex.length} total posts)`);

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `slug=${post.slug}\n`);
  }

  console.log('🎉 Done!');
}

main().catch(err => { console.error('❌ Failed:', err); process.exit(1); });
