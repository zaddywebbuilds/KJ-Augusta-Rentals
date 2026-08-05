import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { galleryCategories, allPhotos } from '../data/mediaConfig';

export default function Gallery() {
  const { ref, inView } = useInView(0.05);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const categories = [{ label: 'All', images: allPhotos }, ...galleryCategories];
  const current = categories.find(c => c.label === activeCategory) ?? categories[0];
  const images = current.images;

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const prev = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + images.length) % images.length);
  }, [lightboxIdx, images.length]);

  const next = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % images.length);
  }, [lightboxIdx, images.length]);

  return (
    <section id="gallery" ref={ref as React.RefObject<HTMLElement>} className="py-24 md:py-36 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-champagne mb-4">
            Photo Gallery
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ivory">
            The house, the water and every space between.
          </h2>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(({ label }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`px-5 py-2 font-manrope text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${
                label === activeCategory
                  ? 'bg-champagne text-ink'
                  : 'text-ivory/60 border border-ivory/20 hover:border-champagne hover:text-ivory'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <motion.div
          className="columns-2 sm:columns-3 lg:columns-4 gap-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {images.map((src, idx) => (
            <motion.div
              key={src}
              className="break-inside-avoid mb-3 cursor-pointer group overflow-hidden rounded-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => openLightbox(idx)}
            >
              <img
                src={src}
                alt={`KJ Augusta Rentals - photo ${idx + 1}`}
                className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity duration-300"
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-ink/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button
              className="absolute top-4 right-4 p-2 text-ivory hover:text-champagne transition-colors"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-ivory hover:text-champagne transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={40} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-ivory hover:text-champagne transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={40} />
            </button>
            <motion.img
              key={lightboxIdx}
              src={images[lightboxIdx]}
              alt={`Photo ${lightboxIdx + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 text-ivory/50 font-manrope text-sm">
              {lightboxIdx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
