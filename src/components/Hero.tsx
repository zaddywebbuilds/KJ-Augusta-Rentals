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
    <section className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videos.hero}
        poster={videoPosters.hero}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/30 via-transparent to-ink/20" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-12">
        {/* Left: Main Text */}
        <div className="flex-1 max-w-2xl">
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
              href={businessConfig.booking.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm group"
            >
              Check Availability
            </a>
            <button
              onClick={scrollToProperty}
              className="inline-flex items-center justify-center px-8 py-4 border border-ivory/50 text-ivory font-manrope text-sm tracking-widest uppercase hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm"
            >
              Explore the House
            </button>
          </motion.div>

          {/* Trust strip */}
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

        {/* Right: Glass property card (desktop only) */}
        <motion.div
          className="hidden lg:block w-72 flex-shrink-0"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <div className="bg-ivory/10 backdrop-blur-md border border-ivory/20 rounded-sm p-8 hover:rotate-1 transition-transform duration-500">
            <p className="font-manrope text-[10px] tracking-[0.25em] uppercase text-champagne mb-6">
              Property at a Glance
            </p>
            {[
              { label: 'Guests', value: '7' },
              { label: 'Bedrooms', value: '2' },
              { label: 'Beds', value: '6' },
              { label: 'Bathrooms', value: '2' },
              { label: 'Setting', value: 'Riverfront' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-ivory/10 last:border-0">
                <span className="font-manrope text-xs text-ivory/60 uppercase tracking-wider">{label}</span>
                <span className="font-cormorant text-2xl text-ivory">{value}</span>
              </div>
            ))}
            <a
              href={businessConfig.booking.airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block text-center py-3 bg-champagne text-ink font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
            >
              View Dates
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll prompt */}
      <motion.button
        onClick={scrollToProperty}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/60 hover:text-champagne transition-colors"
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
