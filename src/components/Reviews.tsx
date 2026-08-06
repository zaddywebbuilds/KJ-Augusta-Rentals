import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Star, ExternalLink } from 'lucide-react';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/KJ+Augusta+Rentals/@33.4411849,-81.9172333,17z/data=!4m17!1m10!3m9!1s0x88f9c97d6cfd07e1:0x9104739615c98f62!2sKJ+Augusta+Rentals!8m2!3d33.441904!4d-81.9164924!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11b5pj7rx5!3m5!1s0x88f9c97d6cfd07e1:0x9104739615c98f62!8m2!3d33.441904!4d-81.9164924!16s%2Fg%2F11b5pj7rx5';

interface Review {
  name: string;
  badge?: string;
  time: string;
  text: string;
}

const row1: Review[] = [
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
    text: "Have rented at the River House, and loved the sweeping river views and nature preserve feel, with its riverside salt water pool, fresh figs and plums in season, blooming crepe myrtles. Great place to watch osprey and herons from the deck!",
  },
  {
    name: 'Dorothy S.',
    time: '5 years ago',
    text: "We enjoyed our stay at the River House. My husband and I stayed for two weeks to have a change of scenery while working remotely. This home worked out perfectly for us. There was plenty of space for us to set up our workstations with beautiful river views.",
  },
  {
    name: 'Abby Lehmann',
    badge: 'Local Guide',
    time: '7 years ago',
    text: "Had a great stay! The place was clean and spacious. Loved the pool. We enjoyed hitting golf balls off the dock and grilling on the patio.",
  },
];

const row2: Review[] = [
  {
    name: 'Cheryl Williams',
    badge: 'Local Guide',
    time: '5 years ago',
    text: "This place is like a dream come true. So peaceful with a beautiful view of the Savannah River. You will love it here. Kj is such a sweet and awesome host. I just moved to Augusta, GA and her place made me feel comfortable here. I was not disappointed. I highly recommend staying here.",
  },
  {
    name: 'Brandon Haubner',
    time: '3 years ago',
    text: "The view of the river is beautiful. The kids really enjoyed the pool. The location is private. The family enjoyed our stay.",
  },
  {
    name: 'Brad Schilling',
    time: '4 years ago',
    text: "My wife and I stayed here as a kind of late anniversary. We mainly chose the property because of the seclusion it gave and the pool. KJ was always great at communication, even before we booked the place.",
  },
  {
    name: 'adrianne hardy',
    time: '5 years ago',
    text: "We will definitely be back for numerous stays at the river house. Upon arrival Debbie the housekeeper left us homemade treats that the entire family enjoyed! It was spacious and had so many fun things to do — swimming, golf and more.",
  },
  {
    name: 'Shawn Weeks',
    time: '3 years ago',
    text: "Loved this place! Completely private, beautiful views, lots of things to do.",
  },
  {
    name: 'Alison Tirschel',
    badge: 'Local Guide',
    time: '7 years ago',
    text: "Our company rented the Masters house. Lovely, clean accommodations with excellent amenities. I would highly recommend this rental for location and the wonderful lady that owns it. Such a pleasure to work with.",
  },
];

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={13} className="text-champagne fill-champagne" />
      ))}
    </div>
  );
}

function ReviewCard({ name, badge, time, text }: Review) {
  return (
    <div className="flex-shrink-0 w-[340px] flex flex-col bg-white/5 border border-white/8 rounded-sm p-6 hover:border-champagne/30 transition-colors duration-300">
      <Stars />
      <p className="font-cormorant text-[17px] text-ivory leading-snug mt-3 mb-4 line-clamp-4 flex-1">
        "{text}"
      </p>
      <div className="flex items-center justify-between gap-2 pt-4 border-t border-white/8">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-champagne/25 flex items-center justify-center flex-shrink-0">
            <span className="font-manrope text-[11px] text-champagne font-bold">
              {name[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-manrope text-[11px] text-ivory font-semibold leading-none truncate">
              {name}
            </p>
            {badge && (
              <p className="font-manrope text-[9px] text-champagne/70 mt-0.5">{badge}</p>
            )}
          </div>
        </div>
        <span className="font-manrope text-[9px] text-ivory/35 flex-shrink-0">{time}</span>
      </div>
    </div>
  );
}

export default function Reviews() {
  const { ref, inView } = useInView();

  return (
    <section
      id="reviews"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 md:py-20 bg-ink overflow-hidden"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div>
            <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-champagne mb-4">
              Guest Reviews · Google Maps
            </p>
            <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ivory">
              Guests remember<br />the river.
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="flex gap-1 justify-end mb-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={16} className="text-champagne fill-champagne" />
                ))}
              </div>
              <p className="font-cormorant text-5xl text-ivory leading-none">5.0</p>
              <p className="font-manrope text-[10px] tracking-widest uppercase text-ivory/50 mt-1">
                22+ Google Reviews
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured review */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-champagne/8 border border-champagne/20 rounded-sm p-8 md:p-10">
            <div className="text-champagne font-cormorant text-6xl leading-none mb-3">"</div>
            <p className="font-cormorant text-xl md:text-2xl text-ivory leading-relaxed italic mb-6">
              Waking up every morning to the beautiful river view was awesome. You can see them from every room in the house. Our favourite place to hang out was in the pool. Didn't want to leave this beautiful secluded river front paradise!
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-champagne/20 flex items-center justify-center flex-shrink-0">
                <span className="font-cormorant text-base text-champagne font-bold">B</span>
              </div>
              <div>
                <p className="font-manrope text-sm text-ivory font-semibold">Brian Ferguson</p>
                <p className="font-manrope text-xs text-ivory/50">Stayed 10 days · Google Review</p>
              </div>
              <div className="ml-auto">
                <Stars />
              </div>
            </div>
          </div>

          <div className="bg-ivory/5 border border-ivory/10 rounded-sm p-8 md:p-10">
            <div className="text-ivory/30 font-cormorant text-6xl leading-none mb-3">"</div>
            <p className="font-cormorant text-xl md:text-2xl text-ivory leading-relaxed italic mb-6">
              My family and I stayed for two weeks to have a change of scenery while working remotely. This home worked out perfectly. The river view made it all worth it.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-ivory/10 flex items-center justify-center flex-shrink-0">
                <span className="font-cormorant text-base text-ivory font-bold">D</span>
              </div>
              <div>
                <p className="font-manrope text-sm text-ivory font-semibold">Dorothy S.</p>
                <p className="font-manrope text-xs text-ivory/50">Stayed 2 weeks · Google Review</p>
              </div>
              <div className="ml-auto">
                <Stars />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Marquee rows */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.35 }}
      >
        {/* Row 1 — left */}
        <div className="marquee-outer overflow-hidden px-0">
          <div className="marquee-track flex gap-5 w-max">
            {[...row1, ...row1].map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
          </div>
        </div>

        {/* Row 2 — right */}
        <div className="marquee-outer overflow-hidden">
          <div className="marquee-track-reverse flex gap-5 w-max">
            {[...row2, ...row2].map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 border border-champagne text-champagne font-manrope text-sm tracking-widest uppercase hover:bg-champagne hover:text-ink transition-all duration-300 rounded-sm"
        >
          <ExternalLink size={16} />
          Read all 22+ reviews on Google
        </a>
      </motion.div>
    </section>
  );
}
