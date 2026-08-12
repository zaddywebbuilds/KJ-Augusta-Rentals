import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Photo from './Photo';
import type { Accommodation } from '../data/accommodations';

const LABELS: Record<string, string> = {
  river: 'River & Dock',
  pool: 'Pool',
  outdoor: 'Outdoors',
  living: 'Living',
  kitchen: 'Kitchen',
  bedroom: 'Bedrooms',
  bath: 'Bathrooms',
  other: 'More',
};

export default function StayGallery({ stay }: { stay: Accommodation }) {
  const [filter, setFilter] = useState<string>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const categories = [...new Set(stay.photos.map(p => p.category))];
  const shown = filter === 'all' ? stay.photos : stay.photos.filter(p => p.category === filter);

  const step = (dir: number) =>
    setLightbox(i => (i === null ? null : (i + dir + shown.length) % shown.length));

  return (
    <section className="py-14 md:py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
          The Gallery
        </p>
        <h2 className="font-cormorant text-3xl md:text-5xl text-ink mb-8">
          Every corner of {stay.name}.
        </h2>

        <div className="flex flex-wrap gap-2 mb-10">
          {['all', ...categories].map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 min-h-[40px] font-manrope text-[11px] tracking-widest uppercase rounded-sm transition-colors ${
                filter === c
                  ? 'bg-ink text-ivory'
                  : 'bg-linen text-sage border border-champagne/20 hover:border-champagne'
              }`}
            >
              {c === 'all' ? `All ${stay.photos.length}` : LABELS[c] ?? c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {shown.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setLightbox(i)}
              className="group relative bg-linen rounded-sm overflow-hidden aspect-[4/3]"
              aria-label={`View larger: ${p.alt}`}
            >
              <Photo
                id={p.id}
                alt={p.alt}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 p-3 text-ivory/70 hover:text-ivory transition-colors z-10"
              aria-label="Close"
            >
              <X size={26} />
            </button>

            <button
              onClick={e => { e.stopPropagation(); step(-1); }}
              className="absolute left-3 md:left-8 p-3 text-ivory/70 hover:text-ivory transition-colors z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft size={30} />
            </button>

            <button
              onClick={e => { e.stopPropagation(); step(1); }}
              className="absolute right-3 md:right-8 p-3 text-ivory/70 hover:text-ivory transition-colors z-10"
              aria-label="Next photo"
            >
              <ChevronRight size={30} />
            </button>

            <figure
              className="max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <Photo
                id={shown[lightbox].id}
                alt={shown[lightbox].alt}
                sizes="90vw"
                priority
                className="w-full max-h-[78vh] object-contain rounded-sm"
              />
              <figcaption className="text-center font-manrope text-xs text-ivory/70 mt-4 px-4">
                {shown[lightbox].alt}
                <span className="block text-ivory/40 mt-1.5">
                  {lightbox + 1} / {shown.length}
                </span>
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
