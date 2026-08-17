export const businessConfig = {
  businessName: "KJ Augusta Rentals",
  propertyName: "KJ's River House",
  tagline: "Where the river slows down, your stay begins.",
  contact: {
    phoneDisplay: "801-349-5711",
    phoneHref: "+18013495711",
    email: "KJAugustaRentals@gmail.com"
  },
  location: {
    city: "Augusta",
    state: "Georgia",
    streetAddress: "63 Alberclauss Drive",
    postalCode: "30901",
    showExactAddressPublicly: false,
    latitude: 33.441904,
    longitude: -81.9164924,
    googleMapsUrl: "https://www.google.com/maps/place/KJ+Augusta+Rentals/@33.4411849,-81.9172333,17z/data=!4m17!1m10!3m9!1s0x88f9c97d6cfd07e1:0x9104739615c98f62"
  },
  booking: {
    // Direct booking only — no third-party platforms, no third-party fees.
    // Each accommodation page renders a live availability calendar once its
    // `googleCalendarId` is set in accommodations.ts; until then the enquiry
    // form is the booking path.
    mode: "direct",
    calendarProvider: "google",
    calendarLive: false,
    collectsPaymentOnSite: false
  },
  // Whole-property figures. Per-accommodation numbers live in accommodations.ts.
  property: {
    guests: 16,
    bedrooms: 3,
    beds: 9,
    bathrooms: 3,
    squareFeet: 2638,
    acreage: 3,
    waterfront: true
  },
  trustSignals: {
    googleRating: 5.0,
    googleReviewCount: 22,
    airbnbRating: 5.0,
    airbnbReviewCount: 22,
    yearsHosting: 18
  },
  // The Masters is played the first full week of April. Update `year` each
  // spring; `enabled` hides the banner entirely once the week has passed.
  masters: {
    enabled: true,
    year: 2027,
    label: "Now booking Masters week 2027",
    detail: "Augusta fills up fast that week — enquire early to hold your dates."
  },
  social: {
    facebook: "https://www.facebook.com/KJRentals"
  }
};
