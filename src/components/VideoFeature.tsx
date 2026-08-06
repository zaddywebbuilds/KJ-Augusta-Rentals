import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { videos, videoPosters } from '../data/mediaConfig';

const clips = [
  { src: videos.hero, poster: videoPosters.hero, label: 'The Property' },
  { src: videos.feature, poster: videoPosters.feature, label: 'The River' },
  { src: videos.vertical, poster: videoPosters.vertical, label: 'The Pool & Deck' },
];

export default function VideoFeature() {
  const { ref, inView } = useInView();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [activeClip, setActiveClip] = useState(0);

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
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
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
        <div className="flex justify-center gap-3 mb-8">
          {clips.map((clip, i) => (
            <button
              key={clip.label}
              onClick={() => switchClip(i)}
              className={`px-5 py-2 font-manrope text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${
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
            className="w-full aspect-video object-cover"
            src={clips[activeClip].src}
            poster={clips[activeClip].poster}
            muted={muted}
            playsInline
            onEnded={() => setPlaying(false)}
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
            className="absolute bottom-4 right-4 p-2 bg-ink/50 backdrop-blur-sm rounded-full text-ivory hover:bg-champagne transition-all"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
