import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { allReviews, type Review } from '../data/reviews';

const DISMISS_KEY = 'kj-review-popup-dismissed';
const FIRST_DELAY = 7000;   // let the page settle before the first toast
const VISIBLE_MS = 7000;    // long enough to actually read the quote
const GAP_MS = 9000;        // breathing room between toasts

function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ReviewPopup() {
  // Order is randomised per visit so repeat visitors don't see the same run.
  const queue = useMemo<Review[]>(() => shuffle(allReviews), []);

  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(-1);
  const [dismissed, setDismissed] = useState(true); // assume off until storage says otherwise
  const shownCount = useRef(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) !== '1') setDismissed(false);
    } catch {
      setDismissed(false); // private mode / storage blocked — still show
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    // Each review appears at most once per visit, then the toasts stop.
    if (!active && shownCount.current >= queue.length) return;

    const delay = active ? VISIBLE_MS : shownCount.current === 0 ? FIRST_DELAY : GAP_MS;

    const t = window.setTimeout(() => {
      if (active) {
        setActive(false);
      } else {
        setIdx(i => (i + 1) % queue.length);
        shownCount.current += 1;
        setActive(true);
      }
    }, delay);

    return () => window.clearTimeout(t);
  }, [active, dismissed, queue.length]);

  const dismiss = () => {
    setActive(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* storage blocked — dismissal still holds for this render */
    }
  };

  const goToReviews = () => {
    document.querySelector('#reviews')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (dismissed || idx < 0) return null;
  const review = queue[idx];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={idx}
          role="status"
          aria-live="polite"
          className="fixed z-30 bottom-24 md:bottom-6 left-4 md:left-6 w-[calc(100%-2rem)] max-w-[330px]"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="relative bg-ivory border border-champagne/40 rounded-sm shadow-[0_18px_50px_rgba(0,0,0,0.28)] overflow-hidden">
            {/* Accent edge */}
            <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-champagne" />

            <button
              onClick={dismiss}
              aria-label="Dismiss guest reviews"
              className="absolute top-2.5 right-2.5 p-1 text-sage/50 hover:text-ink transition-colors rounded-sm"
            >
              <X size={14} />
            </button>

            <button
              onClick={goToReviews}
              className="w-full text-left pl-5 pr-9 py-4 hover:bg-linen/50 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-8 rounded-full bg-champagne/25 flex items-center justify-center flex-shrink-0">
                  <span className="font-manrope text-[12px] text-clay font-bold">
                    {review.name[0].toUpperCase()}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-manrope text-[12px] text-ink font-semibold leading-tight truncate">
                    {review.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="flex gap-px">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={9} className="text-champagne fill-champagne" />
                      ))}
                    </span>
                    <span className="font-manrope text-[9px] text-sage/70">{review.time}</span>
                  </div>
                </div>
              </div>

              <p className="font-cormorant text-[15px] text-ink/85 leading-snug italic line-clamp-3">
                "{review.text}"
              </p>

              <p className="font-manrope text-[8.5px] tracking-[0.18em] uppercase text-clay/70 mt-2.5">
                {review.badge ? `${review.badge} · ` : ''}Verified Google review
              </p>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
