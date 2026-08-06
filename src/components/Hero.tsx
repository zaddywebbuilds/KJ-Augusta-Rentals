import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';
import { videos, videoPosters } from '../data/mediaConfig';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToProperty = () => {
    document.querySelector('#property')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[680px] overflow-hidden bg-ink">

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex items-center max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* LEFT: Text content */}
        <div className="w-full lg:w-[44%] flex-shrink-0 flex flex-col justify-center">
          <motion.p
            className="font-manrope text-xs tracking-[0.3em] uppercase text-champagne mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Private Riverfront Stay &bull; Augusta, Georgia
          </motion.p>

          <motion.h1
            className="font-cormorant text-5xl sm:text-6xl lg:text-7xl text-ivory leading-none mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Where the river<br />
            slows down,{' '}
            <em className="text-champagne not-italic italic font-light">
              your stay begins.
            </em>
          </motion.h1>

          <motion.p
            className="font-manrope text-base sm:text-lg text-ivory/80 leading-relaxed mb-10 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
          >
            Wake up to wide Savannah River views, spend the day by the saltwater
            pool or private dock, and reach downtown Augusta whenever the city calls.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="#book"
              onClick={(e) => { e.preventDefault(); document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center px-8 py-4 bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm group"
            >
              Book Direct
            </a>
            <button
              onClick={scrollToProperty}
              className="inline-flex items-center justify-center px-8 py-4 border border-ivory/50 text-ivory font-manrope text-sm tracking-widest uppercase hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm"
            >
              Explore the House
            </button>
          </motion.div>

          <motion.div
            className="flex items-center gap-6 text-ivory/60 font-manrope text-xs tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <span>2 Bedrooms</span>
            <span className="w-px h-3 bg-ivory/30" />
            <span>2 Bathrooms</span>
            <span className="w-px h-3 bg-ivory/30" />
            <span>Up to 7 Guests</span>
          </motion.div>
        </div>

        {/* RIGHT: Foreground video — surface element, center + right wing */}
        <motion.div
          className="hidden lg:flex flex-1 items-center justify-center pl-10 h-full py-14"
          initial={{ opacity: 0, x: 60, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
        >
          <div className="relative w-full">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[78vh] object-contain rounded-sm shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
              src={videos.hero}
              poster={videoPosters.hero}
              autoPlay
              muted
              loop
              playsInline
            />
            {/* Thin champagne border accent */}
            <div className="absolute inset-0 rounded-sm ring-1 ring-champagne/20 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Scroll prompt */}
      <motion.button
        onClick={scrollToProperty}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/60 hover:text-champagne transition-colors z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span className="font-manrope text-[10px] tracking-[0.3em] uppercase">Follow the River</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>
    </section>
  );
}
