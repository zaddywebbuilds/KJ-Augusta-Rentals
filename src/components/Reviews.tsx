import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Star, ExternalLink } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

export default function Reviews() {
  const { ref, inView } = useInView();

  return (
    <section id="reviews" ref={ref as React.RefObject<HTMLElement>} className="py-24 md:py-36 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-champagne mb-4">
            Guest Reviews
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ivory">
            Guests remember the river.
          </h2>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Rating card */}
          <div className="col-span-1 md:col-span-1 bg-ivory/5 border border-ivory/10 rounded-sm p-8 text-center">
            <div className="flex justify-center gap-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={20}
                  className={i <= 4 ? 'text-champagne fill-champagne' : 'text-champagne fill-champagne/50'}
                />
              ))}
            </div>
            <p className="font-cormorant text-6xl text-ivory mb-1">
              {businessConfig.trustSignals.airbnbRating}
            </p>
            <p className="font-manrope text-xs tracking-widest uppercase text-ivory/50 mb-2">Overall rating</p>
            <p className="font-manrope text-sm text-ivory/70">
              {businessConfig.trustSignals.airbnbReviewCount} verified Airbnb reviews
            </p>
          </div>

          {/* Airbnb Guest Favourite */}
          <div className="col-span-1 md:col-span-1 bg-ivory/5 border border-champagne/20 rounded-sm p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-champagne/20 flex items-center justify-center mb-4">
              <Star className="text-champagne fill-champagne/50" size={28} />
            </div>
            <p className="font-cormorant text-2xl text-ivory mb-2">Guest Favourite</p>
            <p className="font-manrope text-xs tracking-wider uppercase text-champagne">on Airbnb</p>
          </div>

          {/* Superhost */}
          <div className="col-span-1 md:col-span-1 bg-ivory/5 border border-ivory/10 rounded-sm p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-champagne/20 flex items-center justify-center mb-4">
              <span className="font-cormorant text-3xl text-champagne">S</span>
            </div>
            <p className="font-cormorant text-2xl text-ivory mb-2">Superhost</p>
            <p className="font-manrope text-xs text-ivory/60 leading-relaxed text-center">
              Recognised by Airbnb for exceptional hospitality, fast communication,
              and consistently high guest ratings.
            </p>
          </div>
        </motion.div>

        {/* Review highlight */}
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-champagne font-cormorant text-7xl leading-none mb-4">"</div>
          <p className="font-cormorant text-2xl md:text-3xl text-ivory leading-relaxed italic">
            Guests consistently recognise the home for its setting, communication,
            check-in experience and location.
          </p>
          <p className="font-manrope text-sm text-ivory/50 mt-6 tracking-wider">
            — Summarised from 41 verified Airbnb guest reviews
          </p>
        </motion.div>

        {/* What guests highlight */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { label: 'Setting', score: '4.9' },
            { label: 'Communication', score: '4.9' },
            { label: 'Check-In', score: '4.9' },
            { label: 'Location', score: '4.8' },
          ].map(({ label, score }) => (
            <div key={label} className="bg-ivory/5 border border-ivory/10 rounded-sm p-5 text-center">
              <p className="font-cormorant text-3xl text-champagne">{score}</p>
              <p className="font-manrope text-xs tracking-widest uppercase text-ivory/50 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a
            href={businessConfig.booking.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 border border-champagne text-champagne font-manrope text-sm tracking-widest uppercase hover:bg-champagne hover:text-ink transition-all duration-300 rounded-sm"
          >
            <ExternalLink size={16} />
            Read Verified Airbnb Reviews
          </a>
        </motion.div>
      </div>
    </section>
  );
}
