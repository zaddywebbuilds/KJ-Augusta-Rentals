import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useInView } from '../hooks/useInView';

export type VideoClip = { src: string; poster: string; label: string };

interface Props {
  clips: VideoClip[];
}

export default function StayVideos({ clips }: Props) {
  const { ref, inView } = useInView();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [activeClip, setActiveClip] = useState(0);

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
    if (playing) { videoRef.current.pause(); } else { videoRef.current.play(); }
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
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-3">
            See It First
          </p>
          <h2 className="font-cormorant text-3xl md:text-4xl text-ink">
            Walk through before you arrive.
          </h2>
        </motion.div>

        {clips.length > 1 && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {clips.map((clip, i) => (
              <button
                key={clip.label}
                onClick={() => switchClip(i)}
                className={`px-4 min-h-[44px] md:min-h-0 md:py-2 font-manrope text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${
                  i === activeClip
                    ? 'bg-ink text-ivory'
                    : 'bg-ivory text-sage border border-linen hover:border-champagne'
                }`}
              >
                {clip.label}
              </button>
            ))}
          </div>
        )}

        <motion.div
          className="relative rounded-sm overflow-hidden shadow-xl bg-ink max-w-3xl"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
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

          <div className="absolute inset-0 flex items-center justify-center bg-ink/20 hover:bg-ink/30 transition-colors group">
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-ivory/20 backdrop-blur-sm border border-ivory/30 flex items-center justify-center hover:bg-champagne hover:border-champagne transition-all duration-300 group-hover:scale-110"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing
                ? <Pause className="text-ivory" size={22} />
                : <Play className="text-ivory ml-1" size={22} />
              }
            </button>
          </div>

          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 flex items-center justify-center w-11 h-11 bg-ink/50 backdrop-blur-sm rounded-full text-ivory hover:bg-champagne transition-all"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
