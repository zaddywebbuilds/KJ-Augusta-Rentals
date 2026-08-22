import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Mail, Phone, Zap, CreditCard } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { businessConfig } from '../data/businessConfig';
import { directPayment } from '../data/bookingConfig';

export default function BookingPanel() {
  const { ref, inView } = useInView();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const takesDeposit = directPayment.enabled && Boolean(directPayment.depositUrl);

  const buildMailto = () => {
    const subject = encodeURIComponent("Booking Request — KJ's River House");
    const body = encodeURIComponent(
      [
        'Hi KJ,',
        '',
        "I'd like to request dates at the River House.",
        '',
        `Check-in:  ${checkIn || '—'}`,
        `Check-out: ${checkOut || '—'}`,
        `Guests:    ${guests}`,
        '',
        'Please confirm availability and next steps. Thank you!',
      ].join('\n')
    );
    return `mailto:${businessConfig.contact.email}?subject=${subject}&body=${body}`;
  };

  const inputClass =
    'w-full px-4 py-3 border border-linen rounded-sm bg-white font-manrope text-sm text-ink focus:outline-none focus:border-champagne transition-colors';
  const labelClass =
    'flex items-center gap-2 font-manrope text-[10px] tracking-widest uppercase text-sage mb-2';

  return (
    <section id="book" ref={ref as React.RefObject<HTMLElement>} className="py-16 md:py-20 bg-linen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Book Direct
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl text-ink">
            Your river dates are waiting.
          </h2>
        </motion.div>

        <motion.div
          className="bg-ivory border border-champagne/20 rounded-sm shadow-lg p-8 md:p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className={labelClass}>
                <Calendar size={12} /> Check-In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={inputClass}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className={labelClass}>
                <Calendar size={12} /> Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputClass}
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className={labelClass}>
                <Users size={12} /> Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className={inputClass}
              >
                {[1,2,3,4,5,6,7].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={buildMailto()}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
            >
              <Mail size={16} />
              Send Booking Request
            </a>
            <a
              href={`tel:${businessConfig.contact.phoneHref}`}
              className="w-full flex items-center justify-center gap-2 px-8 py-3 border border-sage text-sage font-manrope text-sm tracking-widest uppercase hover:border-ink hover:text-ink transition-all duration-300 rounded-sm"
            >
              <Phone size={16} />
              Call KJ — {businessConfig.contact.phoneDisplay}
            </a>

            {takesDeposit && (
              <>
                <div className="flex items-center gap-3 pt-1">
                  <span className="flex-1 h-px bg-linen" />
                  <span className="font-manrope text-[10px] tracking-widest uppercase text-sage">
                    or hold your dates now
                  </span>
                  <span className="flex-1 h-px bg-linen" />
                </div>
                <a
                  href={directPayment.depositUrl}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-ink text-ivory font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-sage transition-all duration-300 rounded-sm"
                >
                  <CreditCard size={16} />
                  {directPayment.depositLabel}
                </a>
                {directPayment.paypalUrl && (
                  <a
                    href={directPayment.paypalUrl}
                    className="w-full flex items-center justify-center gap-2 px-8 py-3 border border-sage text-sage font-manrope text-sm tracking-widest uppercase hover:border-ink hover:text-ink transition-all duration-300 rounded-sm"
                  >
                    Pay with PayPal instead
                  </a>
                )}
              </>
            )}
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 bg-champagne/10 border border-champagne/20 rounded-sm">
            <Zap size={14} className="text-champagne flex-shrink-0 mt-0.5" />
            <p className="font-manrope text-xs text-sage leading-relaxed">
              <strong className="text-ink">Booking direct saves you the platform commission.</strong>{' '}
              {takesDeposit
                ? "Send your dates and we'll confirm availability the same day, or hold them now with a deposit. Payments are processed securely by Stripe."
                : "Send your dates using the form above or call KJ directly and we'll confirm availability the same day. No payment is collected on this site."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
