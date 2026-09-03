import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { videos, videoPosters } from '../data/mediaConfig';

const REEL = '/KJ-Augusta-Rentals/assets/video';

const clips = [
  { src: videos.hero, poster: videoPosters.hero, label: 'The Property' },
  { src: videos.feature, poster: videoPosters.feature, label: 'The River' },
  { src: videos.vertical, poster: videoPosters.vertical, label: 'The Pool & Deck' },
  { src: videos.interiorTour, poster: videoPosters.interiorTour, label: 'Inside the House' },
  { src: videos.aerialWide, poster: videoPosters.aerialWide, label: 'From the Air' },
  // 8-scene UGC reel (9:16 vertical, 6 sec each)
  { src: `${REEL}/reel-living-room.mp4`,   poster: '', label: 'Reel · Living Room' },
  { src: `${REEL}/reel-open-plan.mp4`,     poster: '', label: 'Reel · Great Room' },
  { src: `${REEL}/reel-master-suite.mp4`,  poster: '', label: 'Reel · Master Suite' },
  { src: `${REEL}/reel-guest-bedroom.mp4`, poster: '', label: 'Reel · Guest Bedroom' },
  { src: `${REEL}/reel-kitchen.mp4`,       poster: '', label: 'Reel · Kitchen' },
  { src: `${REEL}/reel-river-doorway.mp4`, poster: '', label: 'Reel · River Doorway' },
  { src: `${REEL}/reel-spa-shower.mp4`,    poster: '', label: 'Reel · Spa Shower' },
  { src: `${REEL}/reel-exterior-cta.mp4`,  poster: '', label: 'Reel · Full Property' },
];

export default function VideoFeature() {
  const { ref, inView } = useInView();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [activeClip, setActiveClip] = useState(0);

  // Autoplay (muted) once the section scrolls into view, and pause when it
  // leaves — an off-screen decoding video is wasted CPU and battery, which is
  // what makes long pages feel janky on phones.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }, [inView, activeClip]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const switchClip = (idx: number) => {
    setActiveClip(idx);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <section className="py-12 md:py-16 bg-linen" ref={ref as React.RefObject<HTMLElement>}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            See It First
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink">
            See the river before you arrive.
          </h2>
        </motion.div>

        {/* Clip selector */}
        {/* Wraps because the clip list grew past what one phone-width row holds */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {clips.map((clip, i) => (
            <button
              key={clip.label}
              onClick={() => switchClip(i)}
              className={`px-5 min-h-[44px] md:min-h-0 md:py-2 font-manrope text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${
                i === activeClip
                  ? 'bg-ink text-ivory'
                  : 'bg-ivory text-sage border border-linen hover:border-champagne'
              }`}
            >
              {clip.label}
            </button>
          ))}
        </div>

        {/* Video player */}
        <motion.div
          className="relative rounded-sm overflow-hidden shadow-2xl bg-ink max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <video
            ref={videoRef}
            key={activeClip}
            className="w-full aspect-video object-contain bg-ink"
            src={clips[activeClip].src}
            poster={clips[activeClip].poster}
            muted={muted}
            loop
            playsInline
            preload="metadata"
          />

          {/* Overlay controls */}
          <div className="absolute inset-0 flex items-center justify-center bg-ink/20 hover:bg-ink/30 transition-colors group">
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-ivory/20 backdrop-blur-sm border border-ivory/30 flex items-center justify-center hover:bg-champagne hover:border-champagne transition-all duration-300 group-hover:scale-110"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing
                ? <Pause className="text-ivory" size={24} />
                : <Play className="text-ivory ml-1" size={24} />
              }
            </button>
          </div>

          {/* Mute control */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 flex items-center justify-center w-12 h-12 bg-ink/50 backdrop-blur-sm rounded-full text-ivory hover:bg-champagne transition-all"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
