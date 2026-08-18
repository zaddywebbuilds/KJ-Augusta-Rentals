import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Star, ExternalLink } from 'lucide-react';
import { row1, row2, type Review } from '../data/reviews';
import { businessConfig } from '../data/businessConfig';

const { googleRating, googleReviewCount } = businessConfig.trustSignals;

/**
 * Draws the headline rating to scale rather than always filling five stars.
 *
 * The aggregate used to be five solid stars beside a hard-coded "5.0". Now the
 * figure tracks the Google Business Profile, five filled stars next to a 4.8
 * would be its own small overclaim — the exact inconsistency KJ asked us to
 * clear up. A clipped overlay fills the true proportion instead.
 */
function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (filled: boolean) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={`flex-shrink-0 ${filled ? 'text-champagne fill-champagne' : 'text-champagne/25'}`}
      />
    ));

  return (
    <div
      className="relative inline-flex"
      role="img"
      aria-label={`${rating} out of 5 stars from ${googleReviewCount} Google reviews`}
    >
      <div className="flex gap-1">{row(false)}</div>
      <div
        className="absolute inset-y-0 left-0 flex gap-1 overflow-hidden"
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      >
        {row(true)}
      </div>
    </div>
  );
}

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/KJ+Augusta+Rentals/@33.4411849,-81.9172333,17z/data=!4m17!1m10!3m9!1s0x88f9c97d6cfd07e1:0x9104739615c98f62!2sKJ+Augusta+Rentals!8m2!3d33.441904!4d-81.9164924!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11b5pj7rx5!3m5!1s0x88f9c97d6cfd07e1:0x9104739615c98f62!8m2!3d33.441904!4d-81.9164924!16s%2Fg%2F11b5pj7rx5';

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
              <div className="flex justify-end mb-1">
                <RatingStars rating={googleRating} size={16} />
              </div>
              <p className="font-cormorant text-5xl text-ivory leading-none">
                {googleRating.toFixed(1)}
              </p>
              <p className="font-manrope text-[10px] tracking-widest uppercase text-ivory/50 mt-1">
                {googleReviewCount} Google Reviews
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
          Read all {googleReviewCount} reviews on Google
        </a>
      </motion.div>
    </section>
  );
}
