import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, Calendar, Users, Phone, Mail, Zap } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { businessConfig } from '../data/businessConfig';
import { poolImages, dockImages } from '../data/mediaConfig';
import Photo from './Photo';

const faqs = [
  {
    q: 'What are the three ways to stay?',
    a: 'The River House can be booked as the entire property (up to 16 guests, 3 bedrooms, 9 beds), as the Upstairs Terrace on its own (up to 14 guests, 2 bedrooms), or as the Riverside Lower Level (up to 4 guests, 1 bedroom). Every option includes the river, dock, kayaks and pool.',
  },
  {
    q: 'What is shared if I only book one level?',
    a: 'Your indoor space is entirely private — separate entrance, own kitchen, own bathrooms. The outdoor amenities (saltwater pool, dock, kayaks, fire pit and grounds) are shared only if the other level happens to be booked at the same time. Book the entire River House and all three acres are exclusively yours.',
  },
  {
    q: 'Is the pool available year-round?',
    a: 'The saltwater pool is open seasonally, roughly April through October, and is closed with an automatic hardtop cover from November to late March. It is not heated. Off-season guests still have the full river, dock, kayaks and interior. There is no lifeguard — swimming is at your own risk and children must be supervised outdoors at all times.',
  },
  {
    q: 'Can I access the Savannah River directly from the property?',
    a: 'Yes. The property has private Savannah River frontage with its own dock, so you can fish or paddle straight from the grounds. Six kayaks are provided — four adult, two child — along with life vests.',
  },
  {
    q: 'How far is the property from Augusta National Golf Club?',
    a: 'About seven minutes by car. The property also sits adjacent to the IRONMAN 70.3 Augusta start line, and the Augusta Riverwalk is roughly a ten-minute walk, with downtown dining and attractions a few minutes further.',
  },
  {
    q: 'What is the check-in and check-out process?',
    a: 'Check-in is from 4:00 PM and check-out is by 10:00 AM. Full arrival details, including access codes and directions, are shared once your booking is confirmed.',
  },
  {
    q: 'Is the property pet-friendly?',
    a: 'No — pets are not allowed at the property. Please review the full house rules before booking.',
  },
  {
    q: 'Is the exact address available before booking?',
    a: 'For privacy and security, the exact street address is shared only after a confirmed booking. The property is on the Savannah River in Augusta, Georgia.',
  },
  {
    q: 'How do I book and confirm availability?',
    a: 'Choose your stay, then send your dates through the enquiry form on that page or call KJ directly. Booking direct means no third-party platform commission. Each listing is also on Airbnb if you would rather book there.',
  },
  {
    q: 'Who do I contact if I have a question before or during my stay?',
    a: `KJ Augusta Rentals is available directly by phone at ${businessConfig.contact.phoneDisplay} or by email at ${businessConfig.contact.email}.`,
  },
];

const leftQuotes = [
  { text: "Didn't want to leave this beautiful secluded river front paradise!", author: 'Brian F.' },
  { text: "This place is like a dream come true. So peaceful with a beautiful view of the Savannah River.", author: 'Cheryl W.' },
  { text: "Beautiful sunrises from the deck with your morning coffee. Very private and quiet.", author: 'Ryan K.' },
];

function BookingWidget() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

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
    'w-full px-3 py-2.5 bg-ivory/8 border border-ivory/15 rounded-sm text-ivory text-sm font-manrope focus:outline-none focus:border-champagne transition-colors placeholder-ivory/30';
  const labelClass = 'flex items-center gap-1.5 font-manrope text-[9px] tracking-[0.2em] uppercase text-ivory/50 mb-1.5';

  return (
    <div className="bg-ink border border-ivory/10 rounded-sm p-6 sticky top-24">
      <p className="font-manrope text-[9px] tracking-[0.3em] uppercase text-champagne mb-1">
        Book Direct
      </p>
      <p className="font-cormorant text-2xl text-ivory mb-5 leading-tight">
        Reserve your river dates
      </p>

      <div className="space-y-3 mb-5">
        <div>
          <label className={labelClass}>
            <Calendar size={10} /> Check-In
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            <Calendar size={10} /> Check-Out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            <Users size={10} /> Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className={inputClass}
          >
            {[1,2,3,4,5,6,7].map(n => (
              <option key={n} value={n} className="bg-ink">
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <a
        href={buildMailto()}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-champagne text-ink font-manrope text-[11px] tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm mb-3"
      >
        <Mail size={13} />
        Request These Dates
      </a>

      <a
        href={`tel:${businessConfig.contact.phoneHref}`}
        className="w-full flex items-center justify-center gap-2 py-3 border border-ivory/20 text-ivory/70 font-manrope text-[11px] tracking-widest uppercase hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm mb-5"
      >
        <Phone size={13} />
        {businessConfig.contact.phoneDisplay}
      </a>

      <div className="flex items-start gap-2 p-3 bg-champagne/8 border border-champagne/15 rounded-sm">
        <Zap size={12} className="text-champagne flex-shrink-0 mt-0.5" />
        <p className="font-manrope text-[10px] text-ivory/50 leading-relaxed">
          Direct booking with no third-party commission. Dates are confirmed by KJ Augusta Rentals — no payment is collected on this website.
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-16 md:py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Common Questions
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl text-ink">
            Everything you want to know.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_280px] gap-8 xl:gap-12">

          {/* LEFT: Happy lodgers */}
          <motion.div
            className="hidden lg:flex flex-col gap-4"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="overflow-hidden rounded-sm bg-ivory">
              <Photo
                id={poolImages[5]}
                alt="Guests enjoying the pool"
                sizes="260px"
                className="w-full aspect-[4/3] object-contain"
              />
            </div>

            <div className="bg-ink rounded-sm p-5">
              <div className="text-champagne font-cormorant text-4xl leading-none mb-2">"</div>
              <p className="font-cormorant text-[17px] text-ivory leading-snug italic mb-3">
                {leftQuotes[0].text}
              </p>
              <p className="font-manrope text-[10px] text-champagne tracking-wider">
                — {leftQuotes[0].author}
              </p>
            </div>

            <div className="overflow-hidden rounded-sm bg-ivory">
              <Photo
                id={dockImages[0]}
                alt="Private dock on the Savannah River"
                sizes="260px"
                className="w-full aspect-[4/3] object-contain"
              />
            </div>

            <div className="bg-linen border border-champagne/20 rounded-sm p-5">
              <div className="text-clay font-cormorant text-4xl leading-none mb-2">"</div>
              <p className="font-cormorant text-[17px] text-ink leading-snug italic mb-3">
                {leftQuotes[1].text}
              </p>
              <p className="font-manrope text-[10px] text-clay tracking-wider">
                — {leftQuotes[1].author}
              </p>
            </div>
          </motion.div>

          {/* CENTER: FAQ accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <Accordion.Root type="single" collapsible className="space-y-2">
              {faqs.map(({ q, a }, i) => (
                <Accordion.Item
                  key={i}
                  value={`item-${i}`}
                  className="border border-linen rounded-sm overflow-hidden bg-linen/50 hover:border-champagne/30 transition-colors"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left group">
                      <span className="font-cormorant text-xl text-ink pr-4">{q}</span>
                      <ChevronDown
                        className="text-champagne flex-shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
                        size={18}
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-[slideDown_200ms_ease] data-[state=closed]:animate-[slideUp_200ms_ease]">
                    <div className="px-6 pb-5 pt-0">
                      <p className="font-manrope text-sm text-sage leading-relaxed">{a}</p>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </motion.div>

          {/* RIGHT: Booking widget */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <BookingWidget />
          </motion.div>
        </div>

        {/* Mobile booking CTA */}
        <motion.div
          className="lg:hidden mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href={`tel:${businessConfig.contact.phoneHref}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
          >
            <Phone size={16} />
            Call KJ to Book
          </a>
        </motion.div>
      </div>
    </section>
  );
}
