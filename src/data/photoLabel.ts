// Turns a photo's description into a short "where am I looking" badge, so a
// guest scrolling fifty gallery tiles can tell a downstairs bedroom from an
// upstairs one. KJ asked for this after the walk-through: the photos are good,
// but nothing on them says which part of the house they belong to.
//
// Three rules keep it honest:
//
//   1. Concrete subjects beat scenery. "Beautiful waterfront deck" is a deck —
//      "waterfront" is an adjective, so scenery words only decide a label when
//      nothing concrete matched anywhere in the caption.
//   2. Within a tier the earliest keyword wins, because these captions are
//      written subject-first: "Living room with doors onto the patio" is a
//      living room.
//   3. A floor is only claimed when something proves it. Interior rooms inherit
//      the listing's level; decks do not, because the shared covered patio sits
//      at ground level even though it appears in the upstairs listing. An
//      unplaceable photo shows the room alone rather than guessing.

type FloorSource = 'listing' | 'alt';

type Rule = {
  match: RegExp;
  room: string;
  /** Where a floor prefix may come from. Omitted means never show one. */
  floor?: FloorSource;
};

// Concrete subjects: an actual room, structure or feature.
const SUBJECT_RULES: Rule[] = [
  { match: /aerial|drone|birds[- ]eye/, room: 'Aerial view' },
  { match: /kayak/, room: 'Kayaks' },
  { match: /\bdock\b|boat slip/, room: 'Private dock' },
  { match: /fire pit|firepit/, room: 'Fire pit' },
  { match: /mini golf|putting green|putting area/, room: 'Putting green' },
  { match: /ping pong|table tennis|lawn games|games/, room: 'Games area' },
  { match: /spiral stair|staircase|stairway|\bstairs\b/, room: 'Staircase' },
  { match: /\bpool\b|swimming/, room: 'Pool' },
  { match: /\bbar\b/, room: 'Outdoor bar' },
  { match: /\bgrill|barbecue|\bbbq\b/, room: 'Grill area' },
  { match: /\blawn\b|\byard\b/, room: 'Lawn' },
  // Exterior has to outrank the scenery tier explicitly, because "waterfront
  // home" reads as scenery first and a house second.
  { match: /exterior|waterfront (home|house|property)|(home|house|property) featuring/, room: 'Exterior' },
  { match: /driveway|parking|entrance|entry way|\bsign\b/, room: 'Arrival' },
  { match: /sunroom|sun room/, room: 'Sunroom', floor: 'listing' },
  { match: /kitchenette/, room: 'Kitchenette', floor: 'listing' },
  { match: /kitchen/, room: 'Kitchen', floor: 'listing' },
  { match: /dining|dinner table|breakfast/, room: 'Dining', floor: 'listing' },
  { match: /coffee station|coffee maker|coffee bar/, room: 'Coffee station', floor: 'listing' },
  { match: /living|great room|lounge|family room|sitting area/, room: 'Living room', floor: 'listing' },
  { match: /bunk/, room: 'Bunk room', floor: 'listing' },
  { match: /bedroom|\bbeds?\b|sleeping/, room: 'Bedroom', floor: 'listing' },
  { match: /bathroom|shower|vanity|bathtub|\btub\b|toilet/, room: 'Bathroom', floor: 'listing' },
  { match: /laundry|washer|dryer/, room: 'Laundry', floor: 'listing' },
  { match: /walk-in closet|closet|wardrobe/, room: 'Closet', floor: 'listing' },
  { match: /workspace|\bdesk\b|work area/, room: 'Workspace', floor: 'listing' },
  { match: /balcony/, room: 'Balcony', floor: 'listing' },
  // Decks take a floor only from their own caption: the covered patio is shared
  // ground-level space that appears in the upstairs listing too.
  { match: /patio|\bdeck\b|porch|terrace/, room: 'Deck', floor: 'alt' },
];

// Scenery and last resorts: only consulted when nothing concrete matched.
const FALLBACK_RULES: Rule[] = [
  { match: /waterfront|riverfront|riverside|lakeside|river|lake|water view/, room: 'Riverfront' },
  { match: /\broom\b|open space|interior/, room: 'Interior', floor: 'listing' },
];

/** Which level a whole listing sits on. The entire house spans both, so it proves nothing. */
const LISTING_FLOOR: Record<string, string | undefined> = {
  'upstairs-terrace': 'Upstairs',
  'downstairs-river-house': 'Downstairs',
  'entire-house': undefined,
  'new-2026': undefined,
};

function floorFor(rule: Rule, alt: string, listing: string): string | undefined {
  if (!rule.floor) return undefined;
  // The caption outranks the listing: a photo that says "upstairs" is better
  // evidence than the folder it happens to sit in.
  if (/\bupstairs\b|upper level|second floor/.test(alt)) return 'Upstairs';
  if (/\bdownstairs\b|lower level|ground floor|first floor/.test(alt)) return 'Downstairs';
  return rule.floor === 'listing' ? LISTING_FLOOR[listing] : undefined;
}

function earliest(rules: Rule[], text: string): Rule | undefined {
  let best: { rule: Rule; at: number } | undefined;
  for (const rule of rules) {
    const at = text.search(rule.match);
    // Strictly-less keeps the earlier rule on a tie, so array order is the
    // documented tie-break.
    if (at !== -1 && (!best || at < best.at)) best = { rule, at };
  }
  return best?.rule;
}

/**
 * Returns a badge like "Upstairs · Bedroom", or just "Pool" for outdoor spaces
 * where a floor makes no sense. Returns undefined when the caption doesn't
 * place the photo at all, and callers render no badge.
 */
export function photoLabel(alt: string, listing: string): string | undefined {
  const text = alt.toLowerCase();
  const rule = earliest(SUBJECT_RULES, text) ?? earliest(FALLBACK_RULES, text);
  if (!rule) return undefined;

  const floor = floorFor(rule, text, listing);
  return floor ? `${floor} · ${rule.room}` : rule.room;
}

/**
 * Same thing from a photo id. Ids are "<listing>_<n>", so callers holding only
 * an id — the stay cards, for instance — don't have to thread the listing
 * through as a second prop.
 */
export function labelForPhoto(id: string, alt: string): string | undefined {
  return photoLabel(alt, id.replace(/_\d+$/, ''));
}
