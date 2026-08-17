import galleries from './galleries.json';

type GalleryPhoto = { id: string; alt: string; category: string };

const g = galleries as Record<string, { photos: GalleryPhoto[] }>;

/**
 * Finds a photo whose own alt text proves it shows what the caption claims.
 *
 * Picking by category alone was not safe enough: the first photo in the
 * "river" bucket is a waterfront exterior, so a slot captioned "The private
 * dock" showed the house. Captions here are paired with the word that has to
 * appear in the photo's description, so a caption cannot contradict its
 * image. Returns undefined when nothing matches, and callers drop the slot —
 * an honest gap beats a confident mislabel.
 */
// Photos claimed by a component that has already resolved. Modules evaluate in
// a fixed import order, so this is deterministic. It exists because several
// sections pick from the same categories independently and kept landing on the
// same shot — KJ asked for duplicates removed, and a page that shows one photo
// three times reads as a small property rather than a large one.
const claimed = new Set<string>();

export function pickPhoto(
  listing: string,
  test: RegExp,
  exclude: string[] = []
): GalleryPhoto | undefined {
  const photos = g[listing]?.photos ?? [];
  const free = photos.find(
    p => test.test(p.alt.toLowerCase()) && !exclude.includes(p.id) && !claimed.has(p.id)
  );
  // Fall back to a claimed match rather than showing nothing: a repeat is a
  // lesser fault than an empty slot where the subject genuinely exists.
  const photo = free ?? photos.find(p => test.test(p.alt.toLowerCase()) && !exclude.includes(p.id));
  if (photo) claimed.add(photo.id);
  return photo;
}

/** Resolves captioned slots in order, never reusing a photo across slots. */
export function pickCaptioned(
  listing: string,
  slots: { test: RegExp; caption: string }[]
): { id: string; alt: string; caption: string }[] {
  const used: string[] = [];
  const out: { id: string; alt: string; caption: string }[] = [];

  for (const { test, caption } of slots) {
    const photo = pickPhoto(listing, test, used);
    if (!photo) continue;
    used.push(photo.id);
    out.push({ id: photo.id, alt: photo.alt, caption });
  }
  return out;
}
