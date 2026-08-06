// Photo identifiers, not URLs. The <Photo> component resolves each id to a
// responsive WebP srcset via src/data/imageManifest.json, so a phone downloads
// the 400w file (~19 KB) where it used to pull the 2.2 MB original.
//
// Regenerate derivatives after changing photos/ with:  npm run images

const BASE = '/KJ-Augusta-Rentals/assets';

const id = (n: number) => `photo_${String(n).padStart(2, '0')}`;
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => id(from + i));

export const videos = {
  hero: `${BASE}/videos/video_01.mp4`,
  feature: `${BASE}/videos/video_02.mp4`,
  vertical: `${BASE}/videos/video_03.mp4`,
};

// Poster frames use the optimised 800w derivative rather than the original.
export const videoPosters = {
  hero: `${BASE}/img/photo_01-800.webp`,
  feature: `${BASE}/img/photo_06-800.webp`,
  vertical: `${BASE}/img/photo_16-800.webp`,
};

// River & exterior views
export const riverViews = range(1, 5);

// Pool area
export const poolImages = range(6, 15);

// Exterior / property
export const exteriorImages = range(16, 25);

// Interior / living spaces
export const livingImages = range(26, 35);

// Bedrooms
export const bedroomImages = range(36, 45);

// Kitchen & dining
export const kitchenImages = range(46, 50);

// Outdoor amenities
export const outdoorImages = range(51, 60);

// Dock, kayak & water access
export const dockImages = range(61, 65);

// Detail & interior shots
export const detailImages = range(66, 70);

// All 70 photos for the gallery
export const allPhotos = [
  ...riverViews,
  ...poolImages,
  ...exteriorImages,
  ...livingImages,
  ...bedroomImages,
  ...kitchenImages,
  ...outdoorImages,
  ...dockImages,
  ...detailImages,
];

export const galleryCategories = [
  { label: 'River', images: riverViews },
  { label: 'Pool', images: poolImages },
  { label: 'Outdoors', images: outdoorImages },
  { label: 'Living', images: livingImages },
  { label: 'Bedrooms', images: bedroomImages },
  { label: 'Kitchen', images: kitchenImages },
  { label: 'Details', images: [...dockImages, ...detailImages] },
];
