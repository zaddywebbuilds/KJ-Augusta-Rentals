import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Waves, Building2, Trophy, Plane, ExternalLink } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';
import { dockImages, exteriorImages, detailImages } from '../data/mediaConfig';
import { pickCaptioned } from '../data/pickPhoto';
import Photo from './Photo';

const destinations = [
  {
    icon: Waves,
    name: 'The Savannah River',
    detail: 'At your doorstep — private dock and kayak access.',
    tone: 'champagne',
  },
  {
    icon: Building2,
    name: 'Downtown Augusta',
    detail: 'Historic riverfront district: restaurants, music, the Riverwalk.',
    tone: 'sage',
  },
  {
    icon: Trophy,
    name: 'Augusta National Area',
    detail: 'Home of the Masters — a practical base for tournament week.',
    tone: 'clay',
  },
  {
    icon: Plane,
    name: 'Augusta Regional Airport',
    detail: 'Easy fly-in for groups travelling in together.',
    tone: 'sage',
  },
];

const DOCK_VIDEO = '/KJ-Augusta-Rentals/assets/video/dock-fishing.mp4';

// Photo slots: approach (driveway sign) and acres aerial (shows the 3-acre scope).
// The dock slot is a video — dock-fishing.mp4 — so no photo claim needed there.
const photoScenes = pickCaptioned('new-2026', [
  { test: /front exterior|driveway|approach/, caption: 'The approach' },
  { test: /acre/, caption: 'Room to breathe' },
]);

type SceneItem =
  | { type: 'photo'; id: string; alt: string; caption: string }
  | { type: 'video'; src: string; caption: string };

const sceneItems: SceneItem[] = [
  { type: 'photo', ...photoScenes[0] },
  { type: 'video', src: DOCK_VIDEO, caption: 'Down to the water' },
  { type: 'photo', ...photoScenes[1] },
];

export default function AugustaConnection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="max-w-2xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Where You'll Be
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
            The quiet side of Augusta.
          </h2>
          <p className="font-manrope text-base text-sage mt-5 leading-relaxed">
            Far enough from city noise to feel like an escape — close enough to
            everything that matters to be a perfect home base.
          </p>
        </motion.div>

        {/* Map + destinations */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 items-stretch">
          {/* Cartographic map card */}
          <motion.div
            className="relative rounded-sm overflow-hidden bg-ink shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <svg viewBox="0 0 480 360" className="w-full block" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#667466" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#CDB28A" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#667466" stopOpacity="0.35" />
                </linearGradient>
                <radialGradient id="pinGlow">
                  <stop offset="0%" stopColor="#CDB28A" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#CDB28A" stopOpacity="0" />
                </radialGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F5EFE6" strokeWidth="0.5" opacity="0.05" />
                </pattern>
              </defs>

              <rect width="480" height="360" fill="#121412" />
              <rect width="480" height="360" fill="url(#grid)" />

              {/* River — wide glow then defined ribbon */}
              <path
                d="M -10 175 Q 70 158 130 178 Q 195 202 260 186 Q 330 168 400 192 Q 445 206 490 196"
                fill="none" stroke="url(#riverGrad)" strokeWidth="34" strokeLinecap="round" opacity="0.4"
              />
              <path
                d="M -10 175 Q 70 158 130 178 Q 195 202 260 186 Q 330 168 400 192 Q 445 206 490 196"
                fill="none" stroke="url(#riverGrad)" strokeWidth="14" strokeLinecap="round"
              />
              <text x="118" y="218" fontFamily="Cormorant Garamond,serif" fontSize="13" fill="#CDB28A" opacity="0.75" fontStyle="italic">
                Savannah River
              </text>

              {/* Roads */}
              <path d="M 0 108 Q 240 96 480 116" fill="none" stroke="#F5EFE6" strokeWidth="1" opacity="0.14" strokeDasharray="7,7" />
              <path d="M 236 0 L 236 360" stroke="#F5EFE6" strokeWidth="1" opacity="0.1" strokeDasharray="7,7" />

              {/* Landmarks */}
              <g fontFamily="Manrope,sans-serif" fontSize="9" letterSpacing="1">
                <circle cx="330" cy="112" r="4.5" fill="#667466" />
                <circle cx="330" cy="112" r="9" fill="none" stroke="#667466" strokeWidth="1" opacity="0.4" />
                <text x="344" y="110" fill="#F5EFE6" opacity="0.75">DOWNTOWN</text>
                <text x="344" y="122" fill="#F5EFE6" opacity="0.45">AUGUSTA</text>

                <circle cx="118" cy="92" r="4.5" fill="#B58B73" />
                <circle cx="118" cy="92" r="9" fill="none" stroke="#B58B73" strokeWidth="1" opacity="0.4" />
                <text x="132" y="90" fill="#F5EFE6" opacity="0.75">AUGUSTA</text>
                <text x="132" y="102" fill="#F5EFE6" opacity="0.45">NATIONAL</text>

                <circle cx="372" cy="268" r="4.5" fill="#667466" />
                <circle cx="372" cy="268" r="9" fill="none" stroke="#667466" strokeWidth="1" opacity="0.4" />
                <text x="386" y="272" fill="#F5EFE6" opacity="0.6">AIRPORT</text>

                <circle cx="392" cy="146" r="3.5" fill="#B58B73" opacity="0.8" />
                <text x="404" y="150" fill="#F5EFE6" opacity="0.5">RIVERWALK</text>
              </g>

              {/* Property pin */}
              <circle cx="236" cy="192" r="46" fill="url(#pinGlow)" />
              <circle cx="236" cy="192" r="20" fill="none" stroke="#CDB28A" strokeWidth="1.5" opacity="0.5">
                <animate attributeName="r" values="18;40;18" dur="3.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="3.6s" repeatCount="indefinite" />
              </circle>
              <circle cx="236" cy="192" r="13" fill="#CDB28A" />
              <circle cx="236" cy="192" r="6" fill="#121412" />
              <text x="236" y="232" fontFamily="Cormorant Garamond,serif" fontSize="17" fill="#F5EFE6" textAnchor="middle">
                KJ's River House
              </text>
              <text x="236" y="248" fontFamily="Manrope,sans-serif" fontSize="8" fill="#CDB28A" textAnchor="middle" letterSpacing="2.5">
                YOUR STAY
              </text>

              {/* Compass */}
              <g opacity="0.35">
                <path d="M 440 34 L 435 50 L 440 46 L 445 50 Z" fill="#F5EFE6" />
                <text x="440" y="28" fontFamily="Cormorant Garamond,serif" fontSize="12" fill="#F5EFE6" textAnchor="middle">N</text>
              </g>
            </svg>

            <div className="px-6 py-4 border-t border-ivory/10 flex items-center justify-between gap-4">
              <span className="font-manrope text-[9px] tracking-[0.25em] uppercase text-ivory/40">
                Augusta, Georgia
              </span>
              <span className="font-manrope text-[9px] tracking-[0.25em] uppercase text-ivory/30">
                Illustrative — not to scale
              </span>
            </div>
          </motion.div>

          {/* Destination list */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            {destinations.map(({ icon: Icon, name, detail, tone }, i) => (
              <motion.div
                key={name}
                className="group flex-1 flex items-start gap-4 bg-linen border border-champagne/20 rounded-sm p-5 hover:border-champagne/60 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.08 }}
              >
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    tone === 'champagne'
                      ? 'bg-champagne/20 text-champagne group-hover:bg-champagne group-hover:text-ink'
                      : tone === 'clay'
                      ? 'bg-clay/15 text-clay group-hover:bg-clay group-hover:text-ivory'
                      : 'bg-sage/15 text-sage group-hover:bg-sage group-hover:text-ivory'
                  }`}
                >
                  <Icon size={17} />
                </span>
                <div>
                  <p className="font-cormorant text-2xl text-ink leading-tight mb-1">{name}</p>
                  <p className="font-manrope text-[13px] text-sage leading-relaxed">{detail}</p>
                </div>
              </motion.div>
            ))}

            <a
              href={businessConfig.location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 mt-1 px-6 py-4 bg-ink text-ivory font-manrope text-xs tracking-[0.2em] uppercase hover:bg-champagne hover:text-ink transition-all duration-300 rounded-sm"
            >
              <ExternalLink size={14} />
              View on Google Maps
            </a>
          </motion.div>
        </div>

        {/* Scene strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {sceneItems.map((item, i) => (
            <motion.figure
              key={item.type === 'photo' ? item.id : item.src}
              className="rounded-sm overflow-hidden bg-linen border border-champagne/20"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.1 }}
            >
              {item.type === 'video' ? (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full aspect-[4/3] object-cover"
                />
              ) : (
                <Photo
                  id={item.id}
                  alt={item.alt}
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="w-full aspect-[4/3] object-contain"
                />
              )}
              <figcaption className="px-4 py-3 border-t border-champagne/20 font-manrope text-[10px] tracking-[0.2em] uppercase text-clay">
                {item.caption}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
