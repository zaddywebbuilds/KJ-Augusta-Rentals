import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, ExternalLink, ChevronDown } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

export default function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ivory/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-cormorant font-bold text-4xl text-ivory">KJ</span>
              <br />
              <span className="font-manrope text-[9px] tracking-[0.2em] uppercase text-champagne">
                Augusta Rentals
              </span>
            </div>
            <p className="font-manrope text-sm text-ivory/50 leading-relaxed mb-4 italic font-cormorant text-base">
              "Where the river slows down, your stay begins."
            </p>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-champagne flex-shrink-0" />
              <span className="font-manrope text-xs">Augusta, Georgia • Savannah River</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Phone size={14} className="text-champagne flex-shrink-0" />
              <a href={`tel:${businessConfig.contact.phoneHref}`} className="font-manrope text-xs hover:text-champagne transition-colors">
                {businessConfig.contact.phoneDisplay}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-champagne flex-shrink-0" />
              <a href={`mailto:${businessConfig.contact.email}`} className="font-manrope text-xs hover:text-champagne transition-colors">
                {businessConfig.contact.email}
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-manrope text-[10px] tracking-[0.25em] uppercase text-champagne mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: 'The Property', href: '#property' },
                { label: 'Amenities', href: '#amenities' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Reviews', href: '#reviews' },
                { label: 'Location', href: '#location' },
                { label: 'Book Your Stay', href: '#book' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="font-manrope text-sm text-ivory/60 hover:text-champagne transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Book / Links */}
          <div>
            <h4 className="font-manrope text-[10px] tracking-[0.25em] uppercase text-champagne mb-6">Book & Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={businessConfig.booking.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-manrope text-sm text-ivory/60 hover:text-champagne transition-colors"
                >
                  <ExternalLink size={12} />
                  Book on Airbnb
                </a>
              </li>
              <li>
                <a
                  href={businessConfig.booking.secondaryBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-manrope text-sm text-ivory/60 hover:text-champagne transition-colors"
                >
                  <ExternalLink size={12} />
                  {businessConfig.booking.secondaryBookingLabel}
                </a>
              </li>
              <li>
                <a
                  href={businessConfig.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-manrope text-sm text-ivory/60 hover:text-champagne transition-colors"
                >
                  <MapPin size={12} />
                  Google Maps
                </a>
              </li>
              <li>
                <a
                  href={businessConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-manrope text-sm text-ivory/60 hover:text-champagne transition-colors"
                >
                  <Facebook size={12} />
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-ivory/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="font-manrope text-xs text-ivory/30">
              © {year} KJ Augusta Rentals. All rights reserved.
            </p>

            {/* Privacy drawer trigger */}
            <button
              onClick={() => setPrivacyOpen(!privacyOpen)}
              className="inline-flex items-center gap-1 font-manrope text-xs text-ivory/40 hover:text-ivory/60 transition-colors"
            >
              Privacy & Disclaimer
              <ChevronDown
                size={12}
                className={`transition-transform ${privacyOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {/* Privacy drawer */}
          <AnimatePresence>
            {privacyOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 p-6 bg-ivory/5 border border-ivory/10 rounded-sm">
                  <p className="font-manrope text-xs text-ivory/50 leading-relaxed mb-3">
                    <strong className="text-ivory/70">Privacy:</strong> This website does not collect personal data, use tracking cookies, or share information with third parties. Contact information submitted via email or phone is used solely to respond to your enquiry about KJ Augusta Rentals.
                  </p>
                  <p className="font-manrope text-xs text-ivory/50 leading-relaxed mb-3">
                    <strong className="text-ivory/70">Booking Disclaimer:</strong> Availability and pricing displayed on this website are for informational purposes only. All bookings are confirmed through Airbnb or Expedia. KJ Augusta Rentals is not responsible for discrepancies between this site and third-party booking platforms.
                  </p>
                  <p className="font-manrope text-xs text-ivory/50 leading-relaxed">
                    <strong className="text-ivory/70">Property:</strong> The saltwater pool is available seasonally, April–October. Property amenities are subject to change. Photos are representative of the property. No exact address is published on this site for privacy reasons.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </footer>
  );
}
