// What's on around the River House, month by month.
//
// KJ asked for a calendar of what is happening near the house each month —
// sport, music, racing and the Masters — so guests can plan a stay around it.
// Every entry was checked against the organiser's own announcement or a dated
// listing on EVENTS_CHECKED; nothing is carried forward from last year's dates.
// Where an organiser has only committed to a month, `precision: 'month'` makes
// the card say so rather than inventing a day.
//
// Past events drop off the page on their own (WhatsOn filters by today's
// date), so a file that goes unrefreshed shows a shorter list, never a wrong
// one. To refresh: re-check each organiser's page, add the next dates, and
// bump EVENTS_CHECKED.

export type EventCategory =
  | 'Golf'
  | 'Sports'
  | 'Racing'
  | 'Arts & Music'
  | 'Food & Festivals'
  | 'Holidays'
  | 'Culture';

export type AreaEvent = {
  id: string;
  name: string;
  category: EventCategory;
  /** First day as YYYY-MM-DD. For a month-only listing, the 1st of that month. */
  start: string;
  /** Last day as YYYY-MM-DD. Omit for single-day events. */
  end?: string;
  /** 'day': exact dates announced. 'month': the organiser has committed to the month only. */
  precision: 'day' | 'month';
  /** Replaces the generated date text when neither form fits, e.g. an opening season. */
  dateLabel?: string;
  venue: string;
  blurb: string;
  /** Organiser or official listing, so a guest can confirm before booking. */
  url: string;
  /** A page on this site to send guests to instead, e.g. the Masters page. */
  internal?: string;
  featured?: boolean;
};

export const EVENTS_CHECKED = '2026-09-14';

export const areaEvents: AreaEvent[] = [
  {
    id: 'arts-in-the-heart-2026',
    name: 'Arts in the Heart of Augusta',
    category: 'Arts & Music',
    start: '2026-09-18',
    end: '2026-09-20',
    precision: 'day',
    venue: 'Augusta Exchange Club Fairgrounds',
    blurb:
      'Three days of fine art, international food and five stages of live music, with Avery*Sunshine and Whiskey Run headlining. The festival moves to the fairgrounds this year while downtown is under construction.',
    url: 'https://artsintheheartofaugusta.com/',
  },
  {
    id: 'ironman-703-augusta-2026',
    name: 'IRONMAN 70.3 Augusta',
    category: 'Sports',
    start: '2026-09-27',
    precision: 'day',
    venue: 'Downtown Augusta & the Savannah River',
    blurb:
      'One of the largest 70.3 races in North America, with the swim leg on the Savannah River — the same water the house sits on. Race weekend fills the city, so book early.',
    url: 'https://exploregeorgia.org/augusta/events/family-friendly/ironman-703-augusta',
  },
  {
    id: 'georgia-carolina-state-fair-2026',
    name: 'Georgia-Carolina State Fair',
    category: 'Food & Festivals',
    start: '2026-10-16',
    end: '2026-10-25',
    precision: 'day',
    venue: 'Georgia-Carolina State Fairgrounds',
    blurb:
      'Ten days of rides, livestock shows, arts and crafts and fair food. Tuesdays and Thursdays bring $2 admission and $2 rides.',
    url: 'https://www.georgiacarolinastatefair.com/',
  },
  {
    id: 'foodees-fest-2026',
    name: 'Foodees Fest',
    category: 'Food & Festivals',
    start: '2026-11-06',
    end: '2026-11-08',
    precision: 'day',
    venue: 'Downtown Augusta',
    blurb:
      'A free three-day weekend of food trucks, craft vendors and family-friendly fun across downtown.',
    url: 'https://www.foodeesfest.com/event/augusta-ga-2026',
  },
  {
    id: 'big-bucks-bracket-race-2026',
    name: 'Big Bucks Bracket Race',
    category: 'Racing',
    start: '2026-11-07',
    end: '2026-11-08',
    precision: 'day',
    venue: 'Carolina Dragway, Aiken SC',
    blurb:
      'The 22nd running of this big-money bracket drag race, on a quarter-mile that has been racing since 1957. Spectators $20, kids 10 and under free.',
    url: 'https://carolinadragway.com/schedule/category/big-bucks-bracket-races/',
  },
  {
    id: 'christmas-light-up-2026',
    name: 'Christmas Light Up Spectacular & Parade',
    category: 'Holidays',
    start: '2026-12-01',
    precision: 'month',
    venue: 'Augusta Common & Downtown',
    blurb:
      "The city's tree lighting with fireworks, Santa and a kids' Christmas village, alongside the downtown Christmas parade.",
    url: 'https://www.visitaugusta.com/events/annual-events-and-festivals/fall-winter/christmas-in-augusta/',
  },
  {
    id: 'augustacon-2027',
    name: 'AugustaCon',
    category: 'Culture',
    start: '2027-01-09',
    precision: 'day',
    venue: 'DoubleTree by Hilton Augusta',
    blurb:
      'A pop-culture convention for comics, games, cosplay and collectibles. $20 admission, kids free.',
    url: 'https://www.eventbrite.com/e/augustacon-pop-culture-show-tickets-1990686294294',
  },
  {
    id: 'st-patricks-2027',
    name: "St. Patrick's Day Parade",
    category: 'Culture',
    start: '2027-03-01',
    precision: 'month',
    venue: 'Downtown Augusta',
    blurb: "Downtown's annual St. Patrick's parade and Irish festivities.",
    url: 'https://www.visitaugusta.com/events/annual-events-and-festivals/',
  },
  {
    id: 'aiken-spring-steeplechase-2027',
    name: 'Aiken Spring Steeplechase',
    category: 'Racing',
    start: '2027-03-20',
    precision: 'day',
    venue: 'Aiken Steeplechase Racecourse, Aiken SC',
    blurb:
      'Jump racing and tailgating at the heart of the Aiken Triple Crown — three consecutive March weekends of horse racing just across the river.',
    url: 'https://aikensteeplechase.com/spring-steeplechase/',
  },
  {
    id: 'masters-2027',
    name: 'The Masters',
    category: 'Golf',
    start: '2027-04-05',
    end: '2027-04-11',
    precision: 'day',
    venue: 'Augusta National Golf Club',
    blurb:
      'Practice rounds and the Par 3 Contest open the week; tournament rounds run April 8–11. From the house it is a back-road run of under fifteen minutes, clear of the traffic.',
    url: 'https://www.visitaugusta.com/the-masters/',
    internal: '/masters',
    featured: true,
  },
  {
    id: 'augusta-pride-2027',
    name: 'Augusta Pride Festival',
    category: 'Culture',
    start: '2027-06-01',
    precision: 'month',
    venue: 'Downtown Augusta',
    blurb: 'A free downtown festival with live entertainment, local vendors and family-friendly activities.',
    url: 'https://www.visitaugusta.com/blog/post/festival-season-in-augusta-ga/',
  },
  {
    id: 'juneteenth-2027',
    name: 'Juneteenth Celebration',
    category: 'Culture',
    start: '2027-06-01',
    precision: 'month',
    venue: 'Downtown Augusta',
    blurb: "Downtown's Juneteenth celebration of music, colour and food.",
    url: 'https://www.visitaugusta.com/events/annual-events-and-festivals/',
  },
  {
    id: 'peach-jam-2027',
    name: 'Nike EYBL Peach Jam',
    category: 'Sports',
    start: '2027-07-01',
    precision: 'month',
    venue: 'Riverview Park Activities Center, North Augusta',
    blurb:
      "The championship of Nike's elite youth basketball circuit, drawing top teams and fans from across the country for a week each July.",
    url: 'https://www.northaugustasc.gov/government/city-departments/parks-recreation-tourism/nike-eybl-peach-jam',
  },
  {
    id: 'new-augusta-arena-2027',
    name: 'The New Augusta Arena opens',
    category: 'Arts & Music',
    start: '2027-09-01',
    precision: 'month',
    dateLabel: 'Opening 2027',
    venue: 'Downtown Augusta, beside the Bell Auditorium',
    blurb:
      'A 10,500-seat arena on the site of the old James Brown Arena, built for major concerts — and bringing ECHL hockey back as the Augusta Lynx for 2027–28.',
    url: 'https://newaugustaarena.com/the-new-augusta-arena/',
  },
];
