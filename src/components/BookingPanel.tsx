import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ExternalLink } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { businessConfig } from '../data/businessConfig';

export default function BookingPanel() {
  const { ref, inView } = useInView();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const buildAirbnbUrl = () => {
    const base = businessConfig.booking.airbnbUrl;
    if (!checkIn || !checkOut) return base;
    const params = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      adults: String(guests),
    });
    return `${base}?${params.toString()}`;
  };

  return (
    <section id="book" ref={ref as React.RefObject<HTMLElement>} className="py-24 md:py-36 bg-linen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Book Your Stay
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
            {/* Check-in */}
            <div>
              <label className="flex items-center gap-2 font-manrope text-[10px] tracking-widest uppercase text-sage mb-2">
                <Calendar size={12} />
                Check-In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-4 py-3 border border-linen rounded-sm bg-white font-manrope text-sm text-ink focus:outline-none focus:border-champagne transition-colors"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Check-out */}
            <div>
              <label className="flex items-center gap-2 font-manrope text-[10px] tracking-widest uppercase text-sage mb-2">
                <Calendar size={12} />
                Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-3 border border-linen rounded-sm bg-white font-manrope text-sm text-ink focus:outline-none focus:border-champagne transition-colors"
                min={checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Guests */}
            <div>
              <label className="flex items-center gap-2 font-manrope text-[10px] tracking-widest uppercase text-sage mb-2">
                <Users size={12} />
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-3 border border-linen rounded-sm bg-white font-manrope text-sm text-ink focus:outline-none focus:border-champagne transition-colors"
              >
                {[1,2,3,4,5,6,7].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <a
              href={buildAirbnbUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
            >
              <ExternalLink size={16} />
              Check Airbnb Availability
            </a>
            <a
              href={businessConfig.booking.secondaryBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-8 py-3 border border-sage text-sage font-manrope text-sm tracking-widest uppercase hover:border-ink hover:text-ink transition-all duration-300 rounded-sm"
            >
              {businessConfig.booking.secondaryBookingLabel}
            </a>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-center font-manrope text-xs text-sage/70 leading-relaxed">
            Availability is confirmed on Airbnb, not on this website. Dates selected here
            are used to build a direct search link — final availability and pricing are shown
            on the Airbnb listing. No payment is taken on this site.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
