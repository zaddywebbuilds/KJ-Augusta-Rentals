import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { useGoToStays } from '../hooks/useGoToStays';
import { businessConfig } from '../data/businessConfig';
import galleries from '../data/galleries.json';
import Photo from './Photo';

const g = galleries as Record<string, { photos: { id: string; alt: string; category: string }[] }>;
const pick = (cat: string) => g['entire-house'].photos.find(p => p.category === cat)!;

const parting = [
  { src: pick('river').id, caption: 'The private dock' },
  { src: pick('pool').id, caption: 'The saltwater pool' },
  { src: pick('outdoor').id, caption: 'Room to spread out' },
];

export default function FinalCTA() {
  const { ref, inView } = useInView(0.2);
  const goToStays = useGoToStays();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 md:py-24 bg-ink"
    >
      {/* Parting images — full frame, nothing cropped */}
      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9 }}
      >
        {parting.map(({ src, caption }, i) => (
          <motion.figure
            key={src}
            className="rounded-sm overflow-hidden bg-ivory/5 border border-ivory/10"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 * i }}
          >
            <Photo
              id={src}
              alt={caption}
              sizes="(max-width: 640px) 100vw, 400px"
              className="w-full aspect-[4/3] object-contain"
            />
            <figcaption className="px-4 py-3 border-t border-ivory/10 font-manrope text-[10px] tracking-[0.2em] uppercase text-champagne">
              {caption}
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>

      <div className="text-center px-4 max-w-3xl mx-auto">
        <motion.p
          className="font-manrope text-[10px] tracking-[0.35em] uppercase text-champagne mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Ready When You Are
        </motion.p>
        <motion.h2
          className="font-cormorant text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          Come for Augusta.{' '}
          <em className="italic text-champagne">Stay for the river.</em>
        </motion.h2>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <button
            onClick={goToStays}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[44px] bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
          >
            Check Availability
          </button>
          <a
            href={`tel:${businessConfig.contact.phoneHref}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-ivory/50 text-ivory font-manrope text-sm tracking-widest uppercase hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm"
          >
            <Phone size={16} />
            Call KJ
          </a>
        </motion.div>
        <motion.p
          className="mt-8 font-manrope text-xs text-ivory/40"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {businessConfig.contact.phoneDisplay} &bull; {businessConfig.contact.email}
        </motion.p>
      </div>
    </section>
  );
}
