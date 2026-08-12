import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BedDouble, Bath, ArrowRight, Star } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { accommodations } from '../data/accommodations';
import Photo from './Photo';

export default function ChooseYourStay() {
  const { ref, inView } = useInView();

  return (
    <section
      id="stays"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 md:py-24 bg-linen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Three Ways to Stay
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink mb-5">
            Choose your River House stay.
          </h2>
          <p className="font-manrope text-base text-sage leading-relaxed">
            One riverfront property, three ways to experience it. Take the whole house,
            the upper level, or Downstairs River House — the river, pool, dock and
            kayaks come with all of them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {accommodations.map((stay, i) => (
            <motion.article
              key={stay.slug}
              className="group flex flex-col bg-ivory rounded-sm overflow-hidden border border-champagne/25 hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.12 * i }}
            >
              <Link to={`/stays/${stay.slug}`} className="block bg-ink/5 overflow-hidden">
                <Photo
                  id={stay.heroPhoto}
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
              </Link>

              <div className="flex flex-col flex-1 p-7">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="font-manrope text-[10px] tracking-[0.22em] uppercase text-clay">
                    {stay.tagline}
                  </p>
                  {stay.rating && (
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Star size={11} className="text-champagne fill-champagne" />
                      <span className="font-manrope text-[11px] text-sage">
                        {stay.rating.toFixed(2).replace(/\.?0+$/, '')}
                      </span>
                    </span>
                  )}
                </div>

                <h3 className="font-cormorant text-3xl text-ink mb-3 leading-tight">
                  {stay.name}
                </h3>

                <p className="font-manrope text-sm text-sage leading-relaxed mb-5 flex-1">
                  {stay.cardSummary}
                </p>

                <div className="flex items-center gap-4 pb-5 mb-5 border-b border-linen font-manrope text-xs text-sage">
                  <span className="flex items-center gap-1.5">
                    <Users size={13} className="text-champagne" />
                    {stay.guests}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BedDouble size={13} className="text-champagne" />
                    {stay.beds} beds
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath size={13} className="text-champagne" />
                    {stay.bathrooms}
                  </span>
                </div>

                <Link
                  to={`/stays/${stay.slug}`}
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3.5 min-h-[44px] bg-ink text-ivory font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay transition-colors rounded-sm"
                >
                  View this stay
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.p
          className="text-center font-manrope text-xs text-sage/70 mt-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          When the upper and lower levels are booked separately, the pool, dock, kayaks and
          grounds are shared between both sets of guests. Book Entire River House and
          all three acres are exclusively yours.
        </motion.p>
      </div>
    </section>
  );
}
