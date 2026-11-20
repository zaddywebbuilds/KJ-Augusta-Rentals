import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { leadCaptureEnabled, isValidEmail, submitLead } from '../lib/leadCapture';
import { trackEvent } from '../lib/analytics';

const SEEN_KEY = 'kj-guide-optin';
const DWELL_MS = 35000;

type Phase = 'hidden' | 'open' | 'sending' | 'done';

function alreadySeen() {
  try {
    return localStorage.getItem(SEEN_KEY) !== null;
  } catch {
    return false; // storage blocked — showing once is better than never
  }
}

function markSeen(value: 'dismissed' | 'subscribed') {
  try {
    localStorage.setItem(SEEN_KEY, value);
  } catch {
    /* storage blocked — the in-memory phase still hides it for this visit */
  }
}

export default function EmailCapture() {
  const [phase, setPhase] = useState<Phase>('hidden');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const armed = useRef(false);

  useEffect(() => {
    if (!leadCaptureEnabled || alreadySeen()) return;

    const open = () => {
      if (armed.current) return;
      armed.current = true;
      setPhase('open');
      trackEvent('optin_shown', { source: 'exit_intent_or_dwell' });
    };

    // Exit intent: pointer leaving through the top of the window, which on
    // desktop means heading for the tab bar or address bar.
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) open(); };

    // Touch devices have no exit intent, so dwell time is the only trigger.
    const timer = window.setTimeout(open, DWELL_MS);
    document.addEventListener('mouseout', onLeave);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseout', onLeave);
    };
  }, []);

  useEffect(() => {
    if (phase === 'open') inputRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    if (phase === 'hidden') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [phase]);

  function close() {
    markSeen(phase === 'done' ? 'subscribed' : 'dismissed');
    setPhase('hidden');
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError(null);
    setPhase('sending');
    try {
      await submitLead(email, 'augusta-guide');
    } catch {
      // Offline, or the request was blocked. Let them try again rather than
      // leaving the button stuck on "Sending…".
      setPhase('open');
      setError('Could not send just now. Please try again.');
      return;
    }
    markSeen('subscribed');
    trackEvent('sign_up', { method: 'augusta_guide' });
    setPhase('done');
  }

  if (phase === 'hidden') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={close}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="optin-heading"
          className="relative w-full max-w-[560px] bg-ivory rounded-sm overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.4)]"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-3 right-3 flex items-center justify-center w-10 h-10 text-ivory/50 hover:text-ivory transition-colors z-10"
          >
            <X size={16} />
          </button>

          <div className="bg-ink px-8 py-7">
            <span className="block w-9 h-[2px] bg-champagne mb-5" />
            <p className="font-manrope text-[10px] tracking-[0.24em] uppercase text-champagne mb-3">
              Free Augusta guide
            </p>
            <h2 id="optin-heading" className="font-cormorant text-[28px] leading-[1.16] text-ivory max-w-[26ch]">
              {phase === 'done'
                ? 'Your guide is on the way'
                : 'Know Augusta like a local before you arrive'}
            </h2>
          </div>

          <div className="px-8 py-7">
            {phase === 'done' ? (
              <p className="font-manrope text-[15px] leading-relaxed text-ink/80">
                Check your inbox — it should land within a minute. If it doesn't,
                look in Promotions. The river house books up fastest for spring.
              </p>
            ) : (
              <>
                <p className="font-manrope text-[15px] leading-relaxed text-ink/80 mb-5">
                  Local tips from the family who has lived on this river for years —
                  where to eat, when to go, and the back routes that skip Masters traffic.
                </p>

                <ul className="space-y-2.5 mb-6">
                  {[
                    'The restaurants locals actually book',
                    'Masters Week: parking, routes, what to skip',
                    'Best spots on the Savannah River, mapped',
                  ].map(point => (
                    <li key={point} className="flex items-start gap-3 font-manrope text-sm text-ink/85">
                      <span className="mt-[7px] w-1.5 h-1.5 bg-champagne flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>

                <form onSubmit={onSubmit} noValidate className="flex flex-col sm:flex-row gap-2.5 mb-3">
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (error) setError(null); }}
                    placeholder="your@email.com"
                    aria-label="Email address"
                    aria-invalid={!!error}
                    className="flex-1 min-h-[48px] px-4 bg-white border border-champagne/50 rounded-sm font-manrope text-[15px] text-ink placeholder:text-sage/50 focus:outline-none focus:border-ink transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={phase === 'sending'}
                    className="min-h-[48px] px-6 bg-ink text-ivory font-manrope text-[11px] tracking-[0.16em] uppercase font-semibold hover:bg-clay disabled:opacity-60 transition-colors rounded-sm whitespace-nowrap"
                  >
                    {phase === 'sending' ? 'Sending…' : 'Send me the guide'}
                  </button>
                </form>

                {error && (
                  <p role="alert" className="font-manrope text-xs text-clay mb-2">{error}</p>
                )}

                <p className="font-manrope text-[11.5px] text-sage/80">
                  No spam. Unsubscribe anytime. We never share your email.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
