// Real guest reviews from the KJ Augusta Rentals Google Maps listing.
// `time` is the actual relative age Google reports — do not substitute
// invented recency ("2 hours ago") here. These are genuine testimonials
// and the popup surfaces them as such.

export interface Review {
  name: string;
  badge?: string;
  time: string;
  text: string;
}

export const row1: Review[] = [
  {
    name: 'Ryan Kreicker',
    badge: 'Local Guide',
    time: '3 years ago',
    text: 'Beautiful, clean house on the river. Tons of activities to do from, kayaking, swimming in the pool, corn hole, fire pit. Right near downtown Augusta with lots of great restaurants. Beautiful sunrises from the deck with your morning coffee. Covered lower deck for the hot afternoons. Very private and quiet.',
  },
  {
    name: 'Heather Mills',
    time: '3 years ago',
    text: "Kj's river house was the most beautiful and peaceful getaway. I have a family of 5 and the house was perfect with lots of space. Our kids loved the pool so much while my husband and I loved relaxing with the view of the river. Highly recommended.",
  },
  {
    name: 'Steve Miller',
    time: '7 years ago',
    text: "What a GREAT host KJ was, would absolutely recommend to anyone that wants to visit Augusta and have a beautiful place to stay! Well kept home with all amenities and very close to grocery stores and food establishments. Nice deck off the back for grilling or a nice fire in the fire ring on a chilly night.",
  },
  {
    name: 'KRM MD',
    time: '8 years ago',
    text: 'Have rented at the River House, and loved the sweeping river views and nature preserve feel, with its riverside salt water pool, fresh figs and plums in season, blooming crepe myrtles. Great place to watch osprey and herons from the deck!',
  },
  {
    name: 'Dorothy S.',
    time: '5 years ago',
    text: 'We enjoyed our stay at the River House. My husband and I stayed for two weeks to have a change of scenery while working remotely. This home worked out perfectly for us. There was plenty of space for us to set up our workstations with beautiful river views.',
  },
  {
    name: 'Abby Lehmann',
    badge: 'Local Guide',
    time: '7 years ago',
    text: 'Had a great stay! The place was clean and spacious. Loved the pool. We enjoyed hitting golf balls off the dock and grilling on the patio.',
  },
];

export const row2: Review[] = [
  {
    name: 'Cheryl Williams',
    badge: 'Local Guide',
    time: '5 years ago',
    text: 'This place is like a dream come true. So peaceful with a beautiful view of the Savannah River. You will love it here. Kj is such a sweet and awesome host. I just moved to Augusta, GA and her place made me feel comfortable here. I was not disappointed. I highly recommend staying here.',
  },
  {
    name: 'Brandon Haubner',
    time: '3 years ago',
    text: 'The view of the river is beautiful. The kids really enjoyed the pool. The location is private. The family enjoyed our stay.',
  },
  {
    name: 'Brad Schilling',
    time: '4 years ago',
    text: 'My wife and I stayed here as a kind of late anniversary. We mainly chose the property because of the seclusion it gave and the pool. KJ was always great at communication, even before we booked the place.',
  },
  {
    name: 'adrianne hardy',
    time: '5 years ago',
    text: 'We will definitely be back for numerous stays at the river house. Upon arrival Debbie the housekeeper left us homemade treats that the entire family enjoyed! It was spacious and had so many fun things to do — swimming, golf and more.',
  },
  {
    name: 'Shawn Weeks',
    time: '3 years ago',
    text: 'Loved this place! Completely private, beautiful views, lots of things to do.',
  },
  {
    name: 'Alison Tirschel',
    badge: 'Local Guide',
    time: '7 years ago',
    text: 'Our company rented the Masters house. Lovely, clean accommodations with excellent amenities. I would highly recommend this rental for location and the wonderful lady that owns it. Such a pleasure to work with.',
  },
];

export const featuredReview: Review = {
  name: 'Brian Ferguson',
  time: 'Stayed 10 days',
  text: "Waking up every morning to the beautiful river view was awesome. You can see them from every room in the house. Our favourite place to hang out was in the pool. Didn't want to leave this beautiful secluded river front paradise!",
};

export const allReviews: Review[] = [featuredReview, ...row1, ...row2];
