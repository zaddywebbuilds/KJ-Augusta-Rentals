import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { MapPin, ExternalLink } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

const landmarks = [
  { name: "KJ's River House", note: 'Your stay', x: 50, y: 50, highlight: true },
  { name: 'Savannah River', note: 'At your doorstep', x: 60, y: 42, highlight: false },
  { name: 'Downtown Augusta', note: 'Convenient access', x: 68, y: 35, highlight: false },
  { name: 'Augusta National Area', note: 'Convenient access', x: 30, y: 28, highlight: false },
  { name: 'Augusta Airport', note: 'Convenient access', x: 75, y: 62, highlight: false },
  { name: 'Augusta Riverwalk', note: 'Nearby', x: 70, y: 38, highlight: false },
];

export default function AugustaConnection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Where You'll Be
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink">
            The quiet side of Augusta.
          </h2>
          <p className="font-manrope text-base text-sage mt-6 max-w-xl mx-auto leading-relaxed">
            KJ's River House sits on the Savannah River at Augusta, Georgia —
            far enough from city noise to feel like an escape, close enough to
            everything that matters to be a perfect home base.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* SVG Map */}
          <motion.div
            className="relative bg-linen rounded-sm overflow-hidden shadow-lg border border-champagne/20"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <svg viewBox="0 0 400 300" className="w-full" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
              <rect width="400" height="300" fill="#E4D8C9" />

              {/* River (Savannah River — flowing roughly east-west) */}
              <path
                d="M 0 130 Q 60 120 100 135 Q 150 150 200 140 Q 250 130 300 145 Q 350 155 400 145"
                fill="none"
                stroke="#667466"
                strokeWidth="20"
                opacity="0.3"
              />
              <path
                d="M 0 130 Q 60 120 100 135 Q 150 150 200 140 Q 250 130 300 145 Q 350 155 400 145"
                fill="none"
                stroke="#667466"
                strokeWidth="12"
                opacity="0.4"
              />
              <text x="160" y="165" fontFamily="Manrope,sans-serif" fontSize="9" fill="#667466" opacity="0.7" textAnchor="middle">
                Savannah River
              </text>

              {/* Roads */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#CDB28A" strokeWidth="2" opacity="0.4" strokeDasharray="8,6" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="#CDB28A" strokeWidth="2" opacity="0.4" strokeDasharray="8,6" />

              {/* KJ River House — main pin */}
              <circle cx="200" cy="150" r="14" fill="#CDB28A" opacity="0.9" />
              <circle cx="200" cy="150" r="8" fill="#121412" />
              <circle cx="200" cy="150" r="4" fill="#F5EFE6" />
              {/* Pulse animation ring */}
              <circle cx="200" cy="150" r="20" fill="none" stroke="#CDB28A" strokeWidth="2" opacity="0.4">
                <animate attributeName="r" values="14;26;14" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <text x="200" y="180" fontFamily="Cormorant Garamond,serif" fontSize="11" fill="#121412" fontWeight="600" textAnchor="middle">
                KJ's River House
              </text>

              {/* Downtown Augusta */}
              <circle cx="272" cy="105" r="6" fill="#667466" opacity="0.8" />
              <text x="272" y="96" fontFamily="Manrope,sans-serif" fontSize="8" fill="#667466" textAnchor="middle">Downtown</text>
              <text x="272" y="86" fontFamily="Manrope,sans-serif" fontSize="8" fill="#667466" textAnchor="middle">Augusta</text>

              {/* Augusta National Area */}
              <circle cx="120" cy="84" r="6" fill="#B58B73" opacity="0.8" />
              <text x="120" y="75" fontFamily="Manrope,sans-serif" fontSize="8" fill="#B58B73" textAnchor="middle">Augusta National</text>
              <text x="120" y="65" fontFamily="Manrope,sans-serif" fontSize="8" fill="#B58B73" textAnchor="middle">Area</text>

              {/* Augusta Airport */}
              <circle cx="300" cy="186" r="6" fill="#667466" opacity="0.7" />
              <text x="300" y="200" fontFamily="Manrope,sans-serif" fontSize="8" fill="#667466" textAnchor="middle">Airport</text>

              {/* Augusta Riverwalk */}
              <circle cx="310" cy="125" r="5" fill="#B58B73" opacity="0.7" />
              <text x="310" y="116" fontFamily="Manrope,sans-serif" fontSize="7" fill="#B58B73" textAnchor="middle">Riverwalk</text>

              {/* Compass rose */}
              <text x="36" y="24" fontFamily="serif" fontSize="14" fill="#121412" opacity="0.4" textAnchor="middle">N</text>
              <line x1="36" y1="26" x2="36" y2="40" stroke="#121412" strokeWidth="1" opacity="0.3" />

              {/* Scale label */}
              <text x="200" y="292" fontFamily="Manrope,sans-serif" fontSize="8" fill="#667466" textAnchor="middle" opacity="0.6">
                Augusta, Georgia — Savannah River Area
              </text>
            </svg>
          </motion.div>

          {/* Location details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-8">
              {[
                {
                  label: 'Your address',
                  value: businessConfig.location.showExactAddressPublicly
                    ? businessConfig.location.streetAddress
                    : 'Augusta, Georgia • Savannah River',
                  note: 'Exact address shared upon confirmed booking.',
                },
                {
                  label: 'Downtown Augusta',
                  value: 'Convenient access',
                  note: 'Historic downtown, restaurants, entertainment.',
                },
                {
                  label: 'Augusta National Area',
                  value: 'Convenient access',
                  note: 'Home of the Masters Tournament.',
                },
                {
                  label: 'Augusta Regional Airport',
                  value: 'Convenient access',
                  note: 'Easy fly-in for group stays.',
                },
              ].map(({ label, value, note }) => (
                <div key={label} className="flex gap-4 border-b border-linen pb-6 last:border-0">
                  <MapPin className="text-champagne flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="font-manrope text-xs tracking-widest uppercase text-clay mb-1">{label}</p>
                    <p className="font-cormorant text-2xl text-ink mb-1">{value}</p>
                    {note && <p className="font-manrope text-xs text-sage">{note}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <a
                href={businessConfig.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-ink text-ink font-manrope text-xs tracking-widest uppercase hover:bg-ink hover:text-ivory transition-all duration-300 rounded-sm"
              >
                <ExternalLink size={14} />
                View on Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
