import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DISMISS_KEY = 'kj-activity-popup-dismissed';
const FIRST_DELAY = 5_000;
const VISIBLE_MS = 7_000;
const GAP_MS = 14_000;
const BASE_IMG = '/KJ-Augusta-Rentals/assets/img';

const activities = [
  {
    photo: 'photo_03',
    headline: 'A returning guest from Atlanta',
    detail: 'booked their 3rd summer stay',
    ago: '2 days ago',
  },
  {
    photo: 'photo_08',
    headline: 'A family from Nashville',
    detail: 'reserved Masters Week 2027',
    ago: '4 days ago',
  },
  {
    photo: 'photo_62',
    headline: 'A group from Miami',
    detail: 'booked the full property',
    ago: '5 days ago',
  },
  {
    photo: 'photo_29',
    headline: 'A couple from Charlotte',
    detail: 'extended their stay by 2 nights',
    ago: '1 week ago',
  },
  {
    photo: 'photo_16',
    headline: 'A guest from Washington, D.C.',
    detail: 'enquired about New Year\'s weekend',
    ago: '3 days ago',
  },
];

export default function BookingActivityPopup() {
  const [dismissed, setDismissed] = useState(true);
  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(-1);
  const shownCount = useRef(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) !== '1') setDismissed(false);
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    if (!active && shownCount.current >= activities.length) return;

    const delay = active ? VISIBLE_MS : shownCount.current === 0 ? FIRST_DELAY : GAP_MS;

    const t = window.setTimeout(() => {
      if (active) {
        setActive(false);
      } else {
        setIdx(i => (i + 1) % activities.length);
        shownCount.current += 1;
        setActive(true);
      }
    }, delay);

    return () => window.clearTimeout(t);
  }, [active, dismissed]);

  const dismiss = () => {
    setActive(false);
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* storage blocked */ }
  };

  if (dismissed || idx < 0) return null;
  const item = activities[idx];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={idx}
          role="status"
          aria-live="polite"
          // Hidden on mobile — ReviewPopup already handles that real estate.
          // Desktop: bottom-right, opposite side from the review toast.
          className="hidden md:block fixed z-30 bottom-6 right-6 w-[300px]"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="relative bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.22)] border border-gray-100 overflow-hidden">
            <button
              onClick={dismiss}
              aria-label="Dismiss notification"
              className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-gray-700 transition-colors z-10 rounded-full hover:bg-gray-100"
            >
              <X size={13} />
            </button>

            <div className="flex items-center gap-3 p-4 pr-8">
              <img
                src={`${BASE_IMG}/${item.photo}-400.webp`}
                alt=""
                aria-hidden="true"
                width={56}
                height={56}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />

              <div className="min-w-0 flex-1">
                <p className="font-manrope text-[13px] text-ink font-semibold leading-tight">
                  {item.headline}
                </p>
                <p className="font-manrope text-[11px] text-sage leading-snug mt-0.5">
                  {item.detail} &middot;{' '}
                  <span className="text-clay font-medium">KJ's River House</span>
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-champagne/20 text-clay font-manrope text-[10px] font-semibold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-clay/70 inline-block" />
                  {item.ago}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
