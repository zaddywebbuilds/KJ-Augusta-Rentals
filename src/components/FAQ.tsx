import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { businessConfig } from '../data/businessConfig';

const faqs = [
  {
    q: 'How many guests can the property accommodate?',
    a: 'KJ\'s River House accommodates up to 7 guests across 2 bedrooms and 6 beds. The space is well-suited for families, friend groups, or small corporate teams.',
  },
  {
    q: 'Is the pool available year-round?',
    a: 'The saltwater pool is available seasonally, typically April through October, when temperatures in Augusta are suited for swimming. Off-season guests still enjoy the full river, dock, kayaks, and 2,600+ sq ft of interior space.',
  },
  {
    q: 'Can I access the Savannah River directly from the property?',
    a: 'Yes. The property includes a private dock on the Savannah River with direct water access. Kayaks are available for guests to use.',
  },
  {
    q: 'How far is the property from Augusta National Golf Club?',
    a: 'The property is in the Augusta area and Augusta National Golf Club is conveniently accessible. Exact driving time depends on traffic and your specific route. We recommend using Google Maps for real-time directions.',
  },
  {
    q: 'What is the check-in and check-out process?',
    a: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Detailed check-in instructions, including access codes and arrival directions, are provided through Airbnb after booking is confirmed.',
  },
  {
    q: 'Is the property pet-friendly?',
    a: 'The property is not pet-friendly. Please review the full house rules on the Airbnb listing before booking.',
  },
  {
    q: 'Is the exact address available before booking?',
    a: 'For privacy and security, the exact street address is shared only after a confirmed booking. The property is located in Augusta, Georgia on the Savannah River.',
  },
  {
    q: 'How do I book and confirm availability?',
    a: 'All bookings are made through Airbnb or Expedia. Use the "Check Availability" button on this page to visit the live listing and confirm dates. Availability shown on this website is not guaranteed — the Airbnb listing is the authoritative source.',
  },
  {
    q: 'Who do I contact if I have a question before or during my stay?',
    a: `KJ is available directly by phone at ${businessConfig.contact.phoneDisplay} or by email at ${businessConfig.contact.email}. Airbnb messaging is also available for booking-related questions.`,
  },
];

export default function FAQ() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-24 md:py-36 bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion.Root type="single" collapsible className="space-y-3">
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
                      size={20}
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
      </div>
    </section>
  );
}
