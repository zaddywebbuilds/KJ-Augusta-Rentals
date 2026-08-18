import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Users, Waves, Check } from 'lucide-react';
import { accommodations } from '../data/accommodations';
import { businessConfig } from '../data/businessConfig';
import Photo from '../components/Photo';
import MastersRouteMap from '../components/MastersRouteMap';
import PageMeta from '../components/PageMeta';
import galleries from '../data/galleries.json';

const g = galleries as Record<string, { photos: { id: string; alt: string; category: string }[] }>;
const riverShots = g['entire-house'].photos.filter(p => p.category === 'river').slice(0, 3);

const nearby = [
  { icon: Clock, title: 'Under 15 minutes to Augusta National', detail: 'Via the back route KJ gives every guest — while traffic from the main direction holds others up for two hours or more.' },
  { icon: MapPin, title: '10 minutes to downtown', detail: 'Dining, the Riverwalk and James Brown Arena for the evenings after play.' },
  { icon: Users, title: 'Sleeps up to 16', detail: 'Nine beds across the whole house — a full group under one roof.' },
  { icon: Waves, title: 'Somewhere to decompress', detail: 'Pool, dock and kayaks for the hours between rounds.' },
];

export default function MastersPage() {
  const { year } = businessConfig.masters;

  return (
    <>
      <PageMeta
        title={`Masters Week ${year} Rental — Riverfront House Under 15 Minutes from Augusta National`}
        description={`Private Savannah River home sleeping up to 16, under 15 minutes from Augusta National by KJ's back route. Saltwater pool, dock and kayaks. Now booking Masters week ${year} — direct, no platform fees.`}
        path="/masters"
        image={riverShots[0]?.id}
      />

      <section className="pt-28 md:pt-36 pb-14 bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-champagne mb-5">
              Masters Week {year} · Augusta, Georgia
            </p>
            <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl text-ivory leading-none mb-6">
              Under 15 minutes from the first tee.<br />
              <em className="text-champagne not-italic">Zero traffic from this direction.</em>
            </h1>
            <p className="font-manrope text-base md:text-lg text-ivory/75 leading-relaxed mb-9">
              Masters week traffic backs up for miles — but not from this side. The River House
              sits on the Savannah River and guests approach Augusta National on back roads KJ
              shares with every booking. While others sit in two hours of stop-start traffic, you're
              pulling into the grounds in under 15 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/#stays"
                className="inline-flex items-center justify-center px-8 py-4 min-h-[44px] bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-colors rounded-sm"
              >
                Check availability
              </Link>
              <a
                href={`tel:${businessConfig.contact.phoneHref}`}
                className="inline-flex items-center justify-center px-8 py-4 min-h-[44px] border border-ivory/40 text-ivory font-manrope text-sm tracking-widest uppercase hover:border-champagne hover:text-champagne transition-colors rounded-sm"
              >
                Call {businessConfig.contact.phoneDisplay}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {nearby.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="bg-linen border border-champagne/25 rounded-sm p-6">
                <Icon className="text-champagne mb-4" size={19} />
                <h2 className="font-cormorant text-xl text-ink mb-2 leading-tight">{title}</h2>
                <p className="font-manrope text-xs text-sage leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
            {riverShots.map(p => (
              <figure key={p.id} className="bg-linen rounded-sm overflow-hidden">
                <Photo
                  id={p.id}
                  alt={p.alt}
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="w-full aspect-[4/3] object-cover"
                />
              </figure>
            ))}
          </div>

          {/* The first question every Masters guest asks — KJ asked for it in
              map form rather than another line of prose. */}
          <div className="max-w-3xl mb-14">
            <h2 className="font-cormorant text-3xl md:text-5xl text-ink mb-6">
              How far out are you, really?
            </h2>
            <p className="font-manrope text-base text-sage leading-relaxed mb-7">
              The River House sits southeast of Augusta National, on the far side of the
              traffic. Guests coming from the main corridor can sit for two hours or more
              on tournament days; from here it is a back-road run of under fifteen minutes
              to the parking gates.
            </p>
            <MastersRouteMap />
          </div>

          <div className="max-w-3xl">
            <h2 className="font-cormorant text-3xl md:text-5xl text-ink mb-6">
              Why groups book the whole house for Masters week.
            </h2>
            <p className="font-manrope text-base text-sage leading-relaxed mb-5">
              Hotel rooms scatter a group across floors and charge tournament-week rates for the
              privilege. Entire River House puts everyone under one roof, with three
              bedrooms, nine beds, two kitchens and three riverfront acres to spread out on.
            </p>
            <p className="font-manrope text-base text-sage leading-relaxed mb-8">
              Cook properly, park freely, and end the day on the dock rather than in a lobby bar.
              For smaller parties, the upper and lower levels book separately.
            </p>

            <ul className="space-y-3 mb-10">
              {[
                'Under 15 minutes to Augusta National via KJ\'s back route — no traffic',
                'Adjacent to the IRONMAN 70.3 Augusta start line',
                'Free parking on site for the whole group',
                'Saltwater pool, private dock, six kayaks and a fire pit',
                'Book direct — no platform commission on top of your week',
              ].map(item => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={15} className="text-champagne flex-shrink-0 mt-1" />
                  <span className="font-manrope text-sm text-sage leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {accommodations.map(stay => (
                <Link
                  key={stay.slug}
                  to={`/stays/${stay.slug}`}
                  className="block border border-champagne/30 rounded-sm p-5 bg-linen hover:border-champagne transition-colors"
                >
                  <p className="font-cormorant text-lg text-ink leading-tight mb-1.5">{stay.name}</p>
                  <p className="font-manrope text-[11px] text-sage">
                    Up to {stay.guests} guests · {stay.beds} beds
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
