import { Phone } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';
import { useGoToStays } from '../hooks/useGoToStays';

export default function MobileBookingBar() {
  const goToStays = useGoToStays();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-ivory border-t border-linen shadow-lg">
      <div className="flex divide-x divide-linen">
        <button
          onClick={goToStays}
          className="flex-1 flex items-center justify-center py-4 bg-champagne text-ink font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all"
        >
          Check Availability
        </button>
        <a
          href={`tel:${businessConfig.contact.phoneHref}`}
          className="flex items-center justify-center px-5 py-4 text-sage hover:text-champagne transition-colors"
          aria-label="Call KJ"
        >
          <Phone size={20} />
        </a>
      </div>
    </div>
  );
}
