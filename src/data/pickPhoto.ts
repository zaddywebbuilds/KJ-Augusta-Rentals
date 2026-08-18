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

/**
 * Pairs each sleeping area with a photo of that same room.
 *
 * KJ asked twice for a thumbnail beside every sleeping area, so a guest reading
 * "Bedroom 2 — Downstairs Primary" can see which level it belongs to. Room
 * labels are free text, so each maps to a word that has to appear in the
 * photo's own description — the same contract pickPhoto enforces. A room with
 * no confident match renders without a thumbnail rather than borrowing another
 * room's picture, which is the failure she was already unhappy about.
 */
// `avoid` matters more than it looks: "Master Suite" happily matched "Master
// bathroom featuring double vanity", putting a sink beside a bed count.
const roomMatchers: { when: RegExp; needs: RegExp; avoid?: RegExp }[] = [
  { when: /master/i, needs: /master|primary/, avoid: /bath|shower|vanity/ },
  { when: /sunroom|sun room/i, needs: /sunroom|sun room/ },
  { when: /living/i, needs: /living/ },
  { when: /bedroom/i, needs: /bedroom/, avoid: /bath|shower|vanity/ },
];

export function pickRoomThumbs(
  photos: GalleryPhoto[],
  rooms: { room: string }[]
): Record<string, GalleryPhoto> {
  const used = new Set<string>();
  const out: Record<string, GalleryPhoto> = {};

  for (const { room } of rooms) {
    // Every rule the label satisfies, most specific first, so "Bedroom 1 —
    // Master Suite" falls back to any bedroom when the listing has no photo
    // captioned "master" that isn't the en suite.
    for (const matcher of roomMatchers.filter(m => m.when.test(room))) {
      const hit = photos.find(p => {
        const alt = p.alt.toLowerCase();
        if (used.has(p.id) || !matcher.needs.test(alt)) return false;
        return !matcher.avoid?.test(alt);
      });
      if (!hit) continue;
      used.add(hit.id);
      out[room] = hit;
      break;
    }
  }
  return out;
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
