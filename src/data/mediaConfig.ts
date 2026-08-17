// Photo identifiers, resolved by <Photo> to a responsive WebP srcset via
// src/data/imageManifest.json.
//
// These arrays used to point at photo_01..photo_70, the set inherited from the
// previous website. KJ flagged those as out of date — the interiors have since
// been refurbished — and they were still driving ten components, so most of the
// homepage was showing the old house while the stay pages showed the current
// one. Everything now derives from galleries.json, which is built from the live
// Airbnb listings plus the 2026 set the owner supplied directly.
//
// Regenerate after changing photos/ with:  npm run images

import galleries from './galleries.json';
import duplicates from './duplicatePhotos.json';

const BASE = '/KJ-Augusta-Rentals/assets';

type GalleryPhoto = { id: string; alt: string; category: string };
const g = galleries as Record<string, { photos: GalleryPhoto[] }>;

const dropped = new Set(duplicates as string[]);

// The owner's 2026 photographs lead: they are the most current and the best
// quality. Whole-house next, then the single-level listings.
const ORDER = ['new-2026', 'entire-house', 'upstairs-terrace', 'downstairs-river-house'];

const pool: GalleryPhoto[] = ORDER.flatMap(k => g[k]?.photos ?? []).filter(
  p => !dropped.has(p.id)
);

/** Every photo, deduplicated, best-quality first. */
export const allPhotos = pool.map(p => p.id);

/** Look up a photo's own description — used for alt text. */
export const altFor = (id: string): string =>
  pool.find(p => p.id === id)?.alt ?? '';

const byCategory = (...cats: string[]) =>
  pool.filter(p => cats.includes(p.category)).map(p => p.id);

export const riverViews = byCategory('river');
export const poolImages = byCategory('pool');
export const outdoorImages = byCategory('outdoor');
export const exteriorImages = byCategory('river', 'outdoor');
export const livingImages = byCategory('living');
export const kitchenImages = byCategory('kitchen');
export const bedroomImages = byCategory('bedroom');
export const bathImages = byCategory('bath');
export const dockImages = byCategory('river');
export const detailImages = byCategory('bath', 'other');

export const videos = {
  hero: `${BASE}/videos/aerial-2026.mp4`,
  /** 960px cut of the hero — a phone gets 1.3 MB instead of 4 MB. */
  heroMobile: `${BASE}/videos/aerial-2026-mobile.mp4`,
  feature: `${BASE}/videos/video_02.mp4`,
  vertical: `${BASE}/videos/video_03.mp4`,
};

// Poster frames are drawn from the current set so the still a guest sees before
// a video plays matches the house they will actually arrive at.
export const videoPosters = {
  hero: `${BASE}/img/new-2026_01-800.webp`,
  feature: `${BASE}/img/entire-house_01-800.webp`,
  vertical: `${BASE}/img/new-2026_02-800.webp`,
};

export const galleryCategories = [
  { label: 'River & Dock', images: byCategory('river') },
  { label: 'Pool', images: byCategory('pool') },
  { label: 'Outdoors', images: byCategory('outdoor') },
  { label: 'Living', images: byCategory('living') },
  { label: 'Bedrooms', images: byCategory('bedroom') },
  { label: 'Kitchen', images: byCategory('kitchen') },
  { label: 'Bathrooms', images: byCategory('bath') },
].filter(c => c.images.length > 0);
