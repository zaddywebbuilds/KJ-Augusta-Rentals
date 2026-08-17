import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { videos, videoPosters } from '../data/mediaConfig';
import galleries from '../data/galleries.json';
import { pickPhoto } from '../data/pickPhoto';
import Photo from './Photo';

const g = galleries as Record<string, { photos: { id: string; alt: string; category: string }[] }>;

// The river and pool shots lead — they are what distinguish this property.
// Hero resolves first (App imports it before the lower sections), so claiming
// here reserves the four strongest shots for the top of the page and pushes
// every later section onto different photos.
const showcase = [
  pickPhoto('new-2026', /aerial/),
  pickPhoto('new-2026', /pool/),
  pickPhoto('entire-house', /dock/),
  pickPhoto('new-2026', /sign/),
].filter((p): p is NonNullable<typeof p> => Boolean(p));

export default function Hero() {
  const scrollToStays = () =>
    document.querySelector('#stays')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative bg-ink pt-28 pb-14 lg:pt-32 lg:pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[46%_1fr] gap-10 lg:gap-14 items-center">
          {/* Copy */}
          <div>
            <motion.p
              className="font-manrope text-xs tracking-[0.3em] uppercase text-champagne mb-6"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              Private Riverfront Retreat &bull; Augusta, Georgia
            </motion.p>

            <motion.h1
              className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-ivory leading-[0.95] mb-7"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Your private{' '}
              <em className="text-champagne not-italic">Savannah River</em>{' '}
              escape in Augusta.
            </motion.h1>

            <motion.p
              className="font-manrope text-base sm:text-lg text-ivory/75 leading-relaxed mb-9 max-w-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              A secluded riverfront retreat on three private acres — waterfront views,
              a private dock, kayaks, a seasonal saltwater pool and exceptional
              indoor-outdoor living, all minutes from the best of Augusta.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-9"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
            >
              <button
                onClick={scrollToStays}
                className="inline-flex items-center justify-center px-8 py-4 min-h-[44px] bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-colors rounded-sm"
              >
                Check availability
              </button>
              <Link
                to="/masters"
                className="inline-flex items-center justify-center px-8 py-4 min-h-[44px] border border-ivory/40 text-ivory font-manrope text-sm tracking-widest uppercase hover:border-champagne hover:text-champagne transition-colors rounded-sm"
              >
                Masters week
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-ivory/55 font-manrope text-xs tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
            >
              <span>3 riverfront acres</span>
              <span className="w-px h-3 bg-ivory/25" />
              <span>Private dock &amp; 6 kayaks</span>
              <span className="w-px h-3 bg-ivory/25" />
              <span>Saltwater pool</span>
              <span className="w-px h-3 bg-ivory/25" />
              <span>Sleeps up to 16</span>
            </motion.div>
          </div>

          {/* Video + river showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' }}
          >
            <div className="relative rounded-sm overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.65)]">
              {/* Phones take the 960px cut (1.3 MB) rather than the desktop
                  one (4 MB). The browser picks before it starts downloading,
                  so the saving is real bandwidth, not just decode work. */}
              <video
                className="w-full h-auto max-h-[46vh] lg:max-h-[62vh] object-cover"
                poster={videoPosters.hero}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={videos.heroMobile} type="video/mp4" media="(max-width: 768px)" />
                <source src={videos.hero} type="video/mp4" />
              </video>
              <div className="absolute inset-0 ring-1 ring-champagne/20 pointer-events-none" />
            </div>

            <div className="grid grid-cols-4 gap-2.5 mt-3">
              {showcase.map(p => (
                <div key={p.id} className="rounded-sm overflow-hidden bg-ink/40">
                  <Photo
                    id={p.id}
                    alt={p.alt}
                    sizes="(max-width: 1024px) 24vw, 160px"
                    priority
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={scrollToStays}
        className="mx-auto mt-12 flex flex-col items-center justify-center gap-2 min-h-[44px] px-4 text-ivory/50 hover:text-champagne transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <span className="font-manrope text-[10px] tracking-[0.3em] uppercase">
          Choose your stay
        </span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
