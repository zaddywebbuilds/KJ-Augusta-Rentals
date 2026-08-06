// NOTE TO OWNER: Photos are assigned sequentially by likely category.
// Please verify which photo is which and update the assignments if needed.
// All 70 photos are used across the site.

const BASE = '/KJ-Augusta-Rentals/assets';

export const videos = {
  hero: `${BASE}/videos/video_01.mp4`,
  feature: `${BASE}/videos/video_02.mp4`,
  vertical: `${BASE}/videos/video_03.mp4`,
};

export const videoPosters = {
  hero: `${BASE}/images/photo_01.jpg`,
  feature: `${BASE}/images/photo_06.jpg`,
  vertical: `${BASE}/images/photo_16.jpg`,
};

// River & exterior views
export const riverViews = [
  `${BASE}/images/photo_01.jpg`,
  `${BASE}/images/photo_02.jpg`,
  `${BASE}/images/photo_03.jpg`,
  `${BASE}/images/photo_04.jpg`,
  `${BASE}/images/photo_05.jpg`,
];

// Pool area
export const poolImages = [
  `${BASE}/images/photo_06.jpg`,
  `${BASE}/images/photo_07.jpg`,
  `${BASE}/images/photo_08.jpg`,
  `${BASE}/images/photo_09.jpg`,
  `${BASE}/images/photo_10.jpg`,
  `${BASE}/images/photo_11.jpg`,
  `${BASE}/images/photo_12.jpg`,
  `${BASE}/images/photo_13.jpg`,
  `${BASE}/images/photo_14.jpg`,
  `${BASE}/images/photo_15.jpg`,
];

// Exterior / property
export const exteriorImages = [
  `${BASE}/images/photo_16.jpg`,
  `${BASE}/images/photo_17.jpg`,
  `${BASE}/images/photo_18.jpg`,
  `${BASE}/images/photo_19.jpg`,
  `${BASE}/images/photo_20.jpg`,
  `${BASE}/images/photo_21.jpg`,
  `${BASE}/images/photo_22.jpg`,
  `${BASE}/images/photo_23.jpg`,
  `${BASE}/images/photo_24.jpg`,
  `${BASE}/images/photo_25.jpg`,
];

// Interior / living spaces
export const livingImages = [
  `${BASE}/images/photo_26.jpg`,
  `${BASE}/images/photo_27.jpg`,
  `${BASE}/images/photo_28.jpg`,
  `${BASE}/images/photo_29.jpg`,
  `${BASE}/images/photo_30.jpg`,
  `${BASE}/images/photo_31.jpg`,
  `${BASE}/images/photo_32.jpg`,
  `${BASE}/images/photo_33.jpg`,
  `${BASE}/images/photo_34.jpg`,
  `${BASE}/images/photo_35.jpg`,
];

// Bedrooms
export const bedroomImages = [
  `${BASE}/images/photo_36.jpg`,
  `${BASE}/images/photo_37.jpg`,
  `${BASE}/images/photo_38.jpg`,
  `${BASE}/images/photo_39.jpg`,
  `${BASE}/images/photo_40.jpg`,
  `${BASE}/images/photo_41.jpg`,
  `${BASE}/images/photo_42.jpg`,
  `${BASE}/images/photo_43.jpg`,
  `${BASE}/images/photo_44.jpg`,
  `${BASE}/images/photo_45.jpg`,
];

// Kitchen & dining
export const kitchenImages = [
  `${BASE}/images/photo_46.jpg`,
  `${BASE}/images/photo_47.jpg`,
  `${BASE}/images/photo_48.jpg`,
  `${BASE}/images/photo_49.jpg`,
  `${BASE}/images/photo_50.jpg`,
];

// Outdoor amenities
export const outdoorImages = [
  `${BASE}/images/photo_51.jpg`,
  `${BASE}/images/photo_52.jpg`,
  `${BASE}/images/photo_53.jpg`,
  `${BASE}/images/photo_54.jpg`,
  `${BASE}/images/photo_55.jpg`,
  `${BASE}/images/photo_56.jpg`,
  `${BASE}/images/photo_57.jpg`,
  `${BASE}/images/photo_58.jpg`,
  `${BASE}/images/photo_59.jpg`,
  `${BASE}/images/photo_60.jpg`,
];

// Dock, kayak & water access
export const dockImages = [
  `${BASE}/images/photo_61.jpg`,
  `${BASE}/images/photo_62.jpg`,
  `${BASE}/images/photo_63.jpg`,
  `${BASE}/images/photo_64.jpg`,
  `${BASE}/images/photo_65.jpg`,
];

// Detail & interior shots
export const detailImages = [
  `${BASE}/images/photo_66.jpg`,
  `${BASE}/images/photo_67.jpg`,
  `${BASE}/images/photo_68.jpg`,
  `${BASE}/images/photo_69.jpg`,
  `${BASE}/images/photo_70.jpg`,
];

// All 70 photos for gallery
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

// Video poster frames are the only place photo_01 / photo_06 / photo_16 appear
// outside the full gallery — no section reuses them.
