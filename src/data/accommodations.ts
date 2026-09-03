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
    name: 'Entire River House',
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
      { title: 'Under 15 minutes to Augusta National', detail: 'Via KJ\'s back route — no Masters traffic while others wait hours.' },
    ],
    heroPhoto: 'aerial-view',
    photos: g['entire-house'].photos,
    googleCalendarId: null,
    status: 'live',
  },
  {
    slug: 'upstairs-river-house',
    listingId: '1658162430407855672',
    airbnbUrl: 'https://www.airbnb.com/rooms/1658162430407855672',
    name: 'Upstairs River House',
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
      'The entire upper level — the downstairs is behind a locked door',
      'Full kitchen, living room and sunroom',
      'Master suite with en suite bath, jacuzzi tub and double-head shower',
      'Your own waterfront terrace and balcony, private in every configuration',
      'Both upstairs bathrooms, and the washer and dryer',
    ],
    sharedSpaces: [
      'Saltwater pool and covered pool deck',
      'Private dock, boat slip and all six kayaks',
      'Fire pit, propane and charcoal grills, outdoor bar',
      'Lawn, riverfront acreage, ping pong, cornhole and golf tee-off area',
    ],
    highlights: [
      { title: 'The best view on the property', detail: 'Sunroom and terrace face straight down the Savannah River' },
      { title: 'Completely private indoors', detail: 'Separate entrance, own kitchen, own living space' },
      { title: 'Full river access', detail: 'Pool, dock and kayaks, shared only if the lower level is booked' },
    ],
    heroPhoto: 'sunrise-fire-pit',
    photos: g['upstairs-terrace'].photos,
    googleCalendarId: null,
    status: 'live',
  },
  {
    slug: 'downstairs-river-house',
    listingId: '1658150118472079882',
    airbnbUrl: 'https://www.airbnb.com/rooms/1658150118472079882',
    name: 'Downstairs River House',
    tagline: 'Ground-floor living, straight onto the water',
    cardSummary:
      'The ground floor, opening onto its own waterfront patio — a king bedroom facing the river, kitchenette and living area, steps from the pool and dock.',
    guests: 5,
    bedrooms: 1,
    beds: 3,
    bathrooms: 1,
    rating: 4.43,
    reviewCount: 7,
    description: [
      'The ground floor of the River House, nestled on three secluded acres with direct river access, a private dock with boat slip, kayaks and the saltwater pool — all minutes from downtown Augusta.',
      'The master bedroom takes a king bed with panoramic river views, a smart TV and a dedicated workspace. The living room adds a twin bed and a twin pull-out sofa, and the kitchenette carries a double-burner cooktop, Cuisinart oven, microwave, refrigerator and coffee maker, so you can cook properly without going anywhere.',
      'Outside your door is a large waterfront garden patio with unobstructed views and its own seating — a completely private outdoor area that stays yours even when the upstairs is separately booked.',
      'Quiet mornings with water views, afternoons on the river or by the pool, evenings at the fire pit. Ideal for peaceful getaways, outdoor trips and Masters week.',
    ],
    sleeping: [
      { room: 'Master Bedroom', beds: '1 king bed' },
      { room: 'Living room', beds: '1 single bed, 1 single pull-out sofa' },
    ],
    privateSpaces: [
      'The entire ground floor — the upstairs is behind a locked door',
      'Master bedroom with king bed and panoramic river views',
      'Kitchenette and living room',
      'Full bathroom with tub/shower, washer and dryer',
      'Your own waterfront garden patio, private in every configuration',
      'Dedicated workspace with desktop setup',
    ],
    sharedSpaces: [
      'Saltwater pool and covered pool deck',
      'Private dock, boat slip and all six kayaks',
      'Fire pit, propane and charcoal grills, outdoor bar',
      'Lawn, riverfront acreage, ping pong, cornhole and golf tee-off area',
    ],
    highlights: [
      { title: 'Steps from the water', detail: 'Waterfront patio opening onto the lawn, pool and dock' },
      { title: 'Right-sized for couples', detail: 'King bedroom on the river, with room for three more' },
      { title: 'Cook for yourself', detail: 'Kitchenette with cooktop, oven, fridge and coffee maker' },
    ],
    heroPhoto: 'sunset-river',
    photos: g['downstairs-river-house'].photos,
    googleCalendarId: null,
    status: 'live',
  },
];

export const bySlug = (slug: string) => accommodations.find(a => a.slug === slug);

export const liveAccommodations = accommodations.filter(a => a.status === 'live');
