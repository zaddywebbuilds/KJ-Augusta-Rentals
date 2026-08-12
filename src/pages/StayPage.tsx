import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BedDouble, Bath, DoorClosed, Star, Waves, Check, ArrowLeft } from 'lucide-react';
import { bySlug } from '../data/accommodations';
import Photo from '../components/Photo';
import StayGallery from '../components/StayGallery';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import PageMeta from '../components/PageMeta';

export default function StayPage() {
  const { slug } = useParams<{ slug: string }>();
  const stay = slug ? bySlug(slug) : undefined;

  if (!stay) return <Navigate to="/" replace />;

  const stats = [
    { icon: Users, label: `Up to ${stay.guests} guests` },
    { icon: DoorClosed, label: `${stay.bedrooms} bedroom${stay.bedrooms > 1 ? 's' : ''}` },
    { icon: BedDouble, label: `${stay.beds} beds` },
    { icon: Bath, label: `${stay.bathrooms} bathroom${stay.bathrooms > 1 ? 's' : ''}` },
  ];

  return (
    <>
      <PageMeta
        title={`${stay.name} — Savannah Riverfront Stay in Augusta, GA | KJ Augusta Rentals`}
        description={stay.cardSummary}
        path={`/stays/${stay.slug}`}
        image={stay.heroPhoto}
      />

      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-10 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/#stays"
            className="inline-flex items-center gap-1.5 min-h-[44px] font-manrope text-[11px] tracking-widest uppercase text-sage hover:text-clay transition-colors mb-2"
          >
            <ArrowLeft size={13} />
            All three stays
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
              {stay.tagline}
            </p>
            <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl text-ink leading-none mb-6">
              {stay.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
              {stats.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 font-manrope text-sm text-sage">
                  <Icon size={15} className="text-champagne" />
                  {label}
                </span>
              ))}
              {stay.rating && (
                <span className="flex items-center gap-1.5 font-manrope text-sm text-sage">
                  <Star size={14} className="text-champagne fill-champagne" />
                  {stay.rating.toFixed(2).replace(/\.?0+$/, '')} · {stay.reviewCount} reviews
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            className="rounded-sm overflow-hidden bg-linen shadow-xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <Photo
              id={stay.heroPhoto}
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              className="w-full aspect-[16/9] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Body: description + booking rail */}
      <section className="py-12 md:py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <div>
            <div className="mb-12">
              {stay.description.map((para, i) => (
                <p
                  key={i}
                  className={`font-manrope text-sage leading-relaxed mb-5 ${
                    i === 0 ? 'text-lg text-ink/80' : 'text-base'
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
              {stay.highlights.map(h => (
                <div key={h.title} className="bg-linen border border-champagne/25 rounded-sm p-5">
                  <Waves className="text-champagne mb-3" size={17} />
                  <h3 className="font-cormorant text-xl text-ink mb-1.5 leading-tight">{h.title}</h3>
                  <p className="font-manrope text-xs text-sage leading-relaxed">{h.detail}</p>
                </div>
              ))}
            </div>

            {/* Sleeping arrangements */}
            <h2 className="font-cormorant text-3xl md:text-4xl text-ink mb-6">
              Where you'll sleep
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
              {stay.sleeping.map(s => (
                <div key={s.room} className="border border-linen rounded-sm p-5 bg-linen/40">
                  <p className="font-manrope text-sm text-ink font-semibold mb-1">{s.room}</p>
                  <p className="font-manrope text-sm text-sage">{s.beds}</p>
                </div>
              ))}
            </div>

            {/* Private vs shared — the distinction KJ asked to make explicit */}
            <h2 className="font-cormorant text-3xl md:text-4xl text-ink mb-3">
              What's private, what's shared
            </h2>
            <p className="font-manrope text-sm text-sage leading-relaxed mb-7 max-w-2xl">
              {stay.sharedSpaces.length === 0
                ? 'Booking the entire River House means the whole property is yours. Nothing on these three acres is shared with anyone.'
                : 'Your indoor space is completely private. The outdoor amenities below are shared only when the other level is separately booked — if you take the whole house, everything is exclusively yours.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="border border-champagne/40 rounded-sm p-6 bg-linen">
                <p className="font-manrope text-[10px] tracking-[0.22em] uppercase text-clay mb-4">
                  Private to your booking
                </p>
                <ul className="space-y-2.5">
                  {stay.privateSpaces.map(s => (
                    <li key={s} className="flex items-start gap-2.5">
                      <Check size={14} className="text-champagne flex-shrink-0 mt-0.5" />
                      <span className="font-manrope text-sm text-sage leading-snug">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {stay.sharedSpaces.length > 0 && (
                <div className="border border-sage/25 rounded-sm p-6 bg-ivory">
                  <p className="font-manrope text-[10px] tracking-[0.22em] uppercase text-sage mb-4">
                    Shared if the other level is booked
                  </p>
                  <ul className="space-y-2.5">
                    {stay.sharedSpaces.map(s => (
                      <li key={s} className="flex items-start gap-2.5">
                        <Waves size={14} className="text-sage flex-shrink-0 mt-0.5" />
                        <span className="font-manrope text-sm text-sage leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Booking rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <AvailabilityCalendar stay={stay} />
          </aside>
        </div>
      </section>

      <StayGallery stay={stay} />
    </>
  );
}
