import { Calendar, ExternalLink } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';
import type { Accommodation } from '../data/accommodations';

/**
 * Live availability for one accommodation.
 *
 * Renders an embedded Google Calendar once `googleCalendarId` is set on the
 * accommodation. Until then it shows the enquiry path instead of an empty
 * frame — an availability widget that shows nothing reads as "no availability".
 */
export default function AvailabilityCalendar({ stay }: { stay: Accommodation }) {
  const mailto = buildMailto(stay);

  if (!stay.googleCalendarId) {
    return (
      <div className="bg-linen border border-champagne/30 rounded-sm p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <Calendar className="text-champagne" size={18} />
          <h3 className="font-cormorant text-2xl text-ink">Check availability</h3>
        </div>
        <p className="font-manrope text-sm text-sage leading-relaxed mb-5">
          Send us your dates and we'll confirm availability for {stay.name.toLowerCase()} the
          same day. Booking direct means no platform fees — you deal with us, not a middleman.
        </p>
        <a
          href={mailto}
          className="inline-flex items-center justify-center w-full px-6 py-3.5 min-h-[44px] bg-ink text-ivory font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay transition-colors rounded-sm"
        >
          Request these dates
        </a>
        <a
          href={`tel:${businessConfig.contact.phoneHref}`}
          className="inline-flex items-center justify-center w-full px-6 py-3.5 min-h-[44px] mt-3 border border-ink/25 text-ink font-manrope text-xs tracking-widest uppercase hover:border-champagne hover:text-clay transition-colors rounded-sm"
        >
          Call {businessConfig.contact.phoneDisplay}
        </a>
        {stay.airbnbUrl && (
          <a
            href={stay.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 min-h-[44px] mt-2 font-manrope text-[11px] text-sage/70 hover:text-clay transition-colors"
          >
            Prefer to book on Airbnb? View the listing
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    );
  }

  const src =
    `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(stay.googleCalendarId)}` +
    `&ctz=America%2FNew_York&mode=MONTH&showTitle=0&showNav=1&showPrint=0` +
    `&showTabs=0&showCalendars=0&showTz=0&bgcolor=%23FAF8F5`;

  return (
    <div className="bg-linen border border-champagne/30 rounded-sm p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <Calendar className="text-champagne" size={18} />
        <h3 className="font-cormorant text-2xl text-ink">Availability</h3>
      </div>
      <div className="rounded-sm overflow-hidden border border-champagne/20 bg-ivory">
        <iframe
          src={src}
          title={`Availability calendar for ${stay.name}`}
          className="w-full h-[420px] border-0"
          loading="lazy"
        />
      </div>
      <p className="font-manrope text-[11px] text-sage/70 mt-3 mb-4">
        Blocked dates are already booked. Everything else is open.
      </p>
      <a
        href={mailto}
        className="inline-flex items-center justify-center w-full px-6 py-3.5 min-h-[44px] bg-ink text-ivory font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay transition-colors rounded-sm"
      >
        Book these dates direct
      </a>
      {stay.airbnbUrl && (
        <a
          href={stay.airbnbUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 min-h-[44px] mt-2 font-manrope text-[11px] text-sage/70 hover:text-clay transition-colors"
        >
          Prefer to book on Airbnb? View the listing
          <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

function buildMailto(stay: Accommodation) {
  const subject = `Booking enquiry — ${stay.name}`;
  const body = [
    `Hi KJ Augusta Rentals,`,
    ``,
    `I'd like to check availability for ${stay.name}.`,
    ``,
    `Check-in:`,
    `Check-out:`,
    `Number of guests:`,
    ``,
    `Anything else you should know:`,
    ``,
    `Thank you.`,
  ].join('\n');

  return `mailto:${businessConfig.contact.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
