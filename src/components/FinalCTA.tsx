import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Phone, ExternalLink } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { businessConfig } from '../data/businessConfig';
import { videos, videoPosters } from '../data/mediaConfig';

export default function FinalCTA() {
  const { ref, inView } = useInView(0.3);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
    >
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videos.feature}
        poster={videoPosters.feature}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-ink/65" />

      {/* Video toggle */}
      <button
        onClick={togglePlay}
        className="absolute bottom-6 left-6 p-2 bg-ivory/10 backdrop-blur-sm rounded-full text-ivory/60 hover:text-ivory transition-colors"
        aria-label={playing ? 'Pause background video' : 'Play background video'}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
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
          <a
            href={businessConfig.booking.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
          >
            <ExternalLink size={16} />
            Check Airbnb Availability
          </a>
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
