import galleries from './galleries.json';

export type Accommodation = {
  slug: string;
  /** Airbnb listing id — also the Hospitable/child-property key once configured. */
  listingId: string | null;
  airbnbUrl: string | null;
  name: string;
  tagline: string;
  /** Shown on the homepage "Choose Your River House Stay" cards. */
  cardSummary: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number | null;
  reviewCount: number;
  description: string[];
  sleeping: { room: string; beds: string }[];
  /** Spaces this booking has exclusively. */
  privateSpaces: string[];
  /** Grounds shared when the other unit is separately booked. */
  sharedSpaces: string[];
  highlights: { title: string; detail: string }[];
  heroPhoto: string;
  photos: { id: string; alt: string; category: string }[];
  /** Set once Samantha/Katrina configure the calendar. */
  googleCalendarId: string | null;
  status: 'live' | 'pending-content';
};

const g = galleries as Record<
  string,
  { photos: { id: string; alt: string; category: string }[] }
>;

export const accommodations: Accommodation[] = [
  {
    slug: 'entire-river-house',
    listingId: '1658102100640730741',
    airbnbUrl: 'https://www.airbnb.com/rooms/1658102100640730741',
    name: 'The Entire River House',
    tagline: 'The whole property, the complete experience',
    cardSummary:
      'Both levels, every room and the full run of the grounds. Built for families, reunions and groups who want the whole River House to themselves.',
    guests: 16,
    bedrooms: 3,
    beds: 9,
    bathrooms: 3,
    rating: 5.0,
    reviewCount: 11,
    description: [
      'The complete River House: both levels, every bedroom, and exclusive use of all three riverfront acres. Nothing is shared, because nothing else is booked.',
      'Upstairs opens into a bright, vaulted living space with a fully equipped kitchen, a sunroom of floor-to-ceiling windows facing the water, and glass doors onto the waterfront terrace. The master suite holds a king bed, en suite bath with jetted tub and double-head walk-in shower, and its own panoramic river view.',
      'Downstairs runs as its own retreat — a second king bedroom on the water, a full kitchenette, a living area, and a garden patio that opens straight onto the lawn and dock.',
      'Outside is the part guests remember: a saltwater pool overlooking the river, six kayaks, a private dock for fishing or paddling, a smokeless fire pit, propane and charcoal grills, an outdoor bar, ping pong, cornhole, and a private golf tee-off area.',
    ],
    sleeping: [
      { room: 'Bedroom 1 — Master Suite', beds: '1 king bed, 1 double futon, 1 single pull-out' },
      { room: 'Bedroom 2 — Downstairs Primary', beds: '1 king bed, 1 airbed' },
      { room: 'Bedroom 3', beds: '2 double beds' },
      { room: 'Living room 1', beds: '2 floor mattresses' },
      { room: 'Living room 2', beds: '2 single beds' },
      { room: 'Sunroom', beds: '1 single pull-out, 1 airbed' },
    ],
    privateSpaces: [
      'Both levels of the house — nothing is shared',
      'Saltwater pool, exclusively yours',
      'Private dock and all six kayaks',
      'All three riverfront acres',
      'Both kitchens, all three bathrooms',
      'Fire pit, grills, outdoor bar and games',
    ],
    sharedSpaces: [],
    highlights: [
      { title: 'The whole property', detail: 'Three acres, both levels, no other guests on site' },
      { title: 'Sleeps up to 16', detail: 'Nine beds across three bedrooms and shared living spaces' },
      { title: 'Seven minutes to Augusta National', detail: 'And ten minutes on foot to the Augusta Riverwalk' },
    ],
    heroPhoto: g['entire-house'].photos[0].id,
    photos: g['entire-house'].photos,
    googleCalendarId: null,
    status: 'live',
  },
  {
    slug: 'upstairs-terrace',
    listingId: '1658162430407855672',
    airbnbUrl: 'https://www.airbnb.com/rooms/1658162430407855672',
    name: 'The Upstairs Terrace',
    tagline: 'The upper level, with the best of the view',
    cardSummary:
      'The entire upper floor to yourself — vaulted living space, sunroom, master suite and a private waterfront terrace looking straight down the river.',
    guests: 14,
    bedrooms: 2,
    beds: 6,
    bathrooms: 2,
    rating: 4.82,
    reviewCount: 11,
    description: [
      'The complete upper level of the River House, private from the moment you walk in. Its own entrance, its own kitchen, and the best sightline on the property.',
      'The living space opens under vaulted ceilings to a wall of glass, with a ceiling-mounted fireplace, a large sectional and a dining table that seats six plus a nook for six more. The sunroom beyond it is floor-to-ceiling glass on three sides, facing straight out over the Savannah River.',
      'The master suite pairs a king bed with an en suite bath — jetted jacuzzi tub, double-head walk-in shower, double vanity — and its own river view. A second bedroom holds two full beds under quiet forest views.',
      'Step out onto the private waterfront terrace for unobstructed river views, then down to the pool, the dock, the kayaks and the fire pit below.',
    ],
    sleeping: [
      { room: 'Bedroom 1 — Master Suite', beds: '1 king bed, 1 double futon, 1 single pull-out' },
      { room: 'Bedroom 2', beds: '2 double beds' },
      { room: 'Living room', beds: '2 floor mattresses' },
      { room: 'Sunroom', beds: '1 single pull-out, 1 airbed' },
    ],
    privateSpaces: [
      'The entire upper level, with its own entrance',
      'Full kitchen, living room and sunroom',
      'Master suite with en suite bath and jacuzzi tub',
      'Private waterfront terrace and balcony',
      'Both upstairs bathrooms',
    ],
    sharedSpaces: [
      'Saltwater pool',
      'Private dock and kayaks',
      'Fire pit, grills and outdoor bar',
      'Lawn, riverfront acreage and games',
    ],
    highlights: [
      { title: 'The best view on the property', detail: 'Sunroom and terrace face straight down the Savannah River' },
      { title: 'Completely private indoors', detail: 'Separate entrance, own kitchen, own living space' },
      { title: 'Full river access', detail: 'Pool, dock and kayaks, shared only if the lower level is booked' },
    ],
    heroPhoto: g['upstairs-terrace'].photos[0].id,
    photos: g['upstairs-terrace'].photos,
    googleCalendarId: null,
    status: 'live',
  },
  {
    slug: 'riverside-lower-level',
    listingId: null,
    airbnbUrl: null,
    name: 'The Riverside Lower Level',
    tagline: 'Ground-floor living, straight onto the lawn',
    cardSummary:
      'The lower level opens directly onto the garden patio and the water — a king bedroom on the river, kitchenette and living area, steps from the dock.',
    guests: 4,
    bedrooms: 1,
    beds: 3,
    bathrooms: 1,
    rating: null,
    reviewCount: 0,
    description: [
      'The ground floor of the River House, with the water right outside the door.',
      'A king bedroom faces the river with panoramic views, a smart TV and a dedicated workspace. The living area adds a twin bed and a full pull-out sofa, and the kitchenette carries a double-burner cooktop, oven, microwave, refrigerator and coffee maker — enough to cook properly without going upstairs.',
      'The garden patio opens straight onto the lawn, a few steps from the pool, the dock and the kayaks.',
    ],
    sleeping: [
      { room: 'Primary Bedroom', beds: '1 king bed' },
      { room: 'Living area', beds: '1 single bed, 1 double pull-out sofa' },
    ],
    privateSpaces: [
      'Lower level with its own entrance',
      'King bedroom with river views',
      'Kitchenette and living area',
      'Private bathroom with washer and dryer',
      'Waterfront garden patio',
    ],
    sharedSpaces: [
      'Saltwater pool',
      'Private dock and kayaks',
      'Fire pit, grills and outdoor bar',
      'Lawn, riverfront acreage and games',
    ],
    highlights: [
      { title: 'Steps from the water', detail: 'Patio opens onto the lawn, pool and dock' },
      { title: 'Right-sized for couples', detail: 'King bedroom on the river, with room for two more' },
      { title: 'Cook for yourself', detail: 'Full kitchenette with cooktop, oven and fridge' },
    ],
    // Content is accurate (taken from the whole-house listing's downstairs
    // section) but this unit has no live listing of its own yet — so it has
    // no dedicated photo set. Reuses whole-house lower-level shots for now.
    heroPhoto: g['entire-house'].photos[0].id,
    photos: g['entire-house'].photos.filter(p =>
      ['river', 'pool', 'outdoor'].includes(p.category)
    ).slice(0, 18),
    googleCalendarId: null,
    status: 'pending-content',
  },
];

export const bySlug = (slug: string) => accommodations.find(a => a.slug === slug);

export const liveAccommodations = accommodations.filter(a => a.status === 'live');
