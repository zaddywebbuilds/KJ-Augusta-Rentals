import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import Photo from './Photo';
import { poolImages, riverViews, bedroomImages, dockImages } from '../data/mediaConfig';
import { Trophy, Briefcase, Users, Waves } from 'lucide-react';

const cards = [
  {
    icon: Trophy,
    title: 'Masters Week',
    body: "Located minutes from Augusta National, KJ's River House is one of the most sought-after retreats during the Masters Tournament. Space, privacy, and a river view make the week unforgettable.",
    image: riverViews[3],
    cta: 'Reserve Your Dates',
  },
  {
    icon: Briefcase,
    title: 'Corporate Stays',
    body: "Team retreats, client entertainment, or off-site strategy sessions — the River House offers the space, amenities, and setting to make work feel less like work.",
    image: poolImages[3],
    cta: 'Book Direct',
  },
  {
    icon: Users,
    title: 'Family Getaways',
    body: "Seven guests across six beds means everyone has a place. The pool, the dock, the kayaks, and the grounds give kids (and adults) more than enough to explore.",
    image: bedroomImages[2],
    cta: 'Book Direct',
  },
  {
    icon: Waves,
    title: 'Water Lovers',
    body: "A private dock, kayaks, and the wide Savannah River at your door. Whether you're on the water at dawn or watching it turn gold at dusk, this is the riverfront escape you've been looking for.",
    image: dockImages[2],
    cta: 'Check Availability',
  },
];

export default function WhoItsFor() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 bg-linen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Who Stays Here
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink">
            One river house. More than one reason to come.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ icon: Icon, title, body, image, cta }, i) => (
            <motion.div
              key={title}
              className="group bg-ivory rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-champagne/10"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="bg-ivory">
                <Photo
                  id={image}
                  alt={title}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 300px"
                  className="w-full aspect-[4/3] object-contain"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-champagne/20 rounded-full flex items-center justify-center">
                    <Icon className="text-champagne" size={16} />
                  </div>
                  <h3 className="font-cormorant text-xl text-ink">{title}</h3>
                </div>
                <p className="font-manrope text-sm text-sage leading-relaxed mb-5">{body}</p>
                <a
                  href="#book"
                  onClick={(e) => { e.preventDefault(); document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="font-manrope text-xs tracking-widest uppercase text-champagne hover:text-clay transition-colors"
                >
                  {cta} →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
