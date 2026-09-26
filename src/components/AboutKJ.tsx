import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { Phone, Mail, Star, Shield, Home } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';
import Photo from './Photo';

export default function AboutKJ() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 bg-linen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Photo
              id="new-2026_21"
              alt="The great room at KJ Augusta Rentals — vaulted beamed ceiling, sectional sofa and open kitchen"
              sizes="(max-width: 1024px) 100vw, 560px"
              className="w-full aspect-[4/3] object-contain bg-linen rounded-sm shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-ivory border border-champagne/20 rounded-sm p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <Star className="text-champagne fill-champagne/50" size={20} />
                <div>
                  <p className="font-cormorant text-xl text-ink">
                    {businessConfig.trustSignals.googleRating} Rated
                  </p>
                  <p className="font-manrope text-xs text-sage">
                    {businessConfig.trustSignals.yearsHosting} years hosting
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
              Your Host
            </p>
            <h2 className="font-cormorant text-4xl md:text-5xl text-ink leading-tight mb-8">
              Every stay feels like home.
            </h2>
            <div className="space-y-4 font-manrope text-base text-sage leading-relaxed mb-8">
              <p>
                We're Samantha and Katrina, owners of Home Sweet Luxe. We created
                Home Sweet Luxe with one goal in mind: to make every stay feel a
                little more like home — with all the comfort, style and thoughtful
                touches of a luxury getaway.
              </p>
              <p>
                We personally oversee our collection of handpicked vacation homes
                and take pride in creating spaces where guests can relax, celebrate,
                explore and make lasting memories. From thoughtfully designed
                interiors and carefully selected amenities to responsive
                communication and local recommendations, we're here to make your
                stay as seamless as possible.
              </p>
              <p>
                When you book directly with Home Sweet Luxe, you're booking with
                real hosts who genuinely care about your experience.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: Star, label: `${businessConfig.trustSignals.googleRating} on Google` },
                { icon: Shield, label: `${businessConfig.trustSignals.yearsHosting}+ Years Hosting` },
                { icon: Home, label: 'Direct Booking' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-4 py-2 bg-ivory rounded-full border border-champagne/20">
                  <Icon className="text-champagne" size={14} />
                  <span className="font-manrope text-xs text-sage">{label}</span>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${businessConfig.contact.phoneHref}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-ivory font-manrope text-sm tracking-widest uppercase hover:bg-champagne hover:text-ink transition-all duration-300 rounded-sm"
              >
                <Phone size={16} />
                Call Us
              </a>
              <a
                href={`mailto:${businessConfig.contact.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 border border-ink text-ink font-manrope text-sm tracking-widest uppercase hover:bg-ink hover:text-ivory transition-all duration-300 rounded-sm"
              >
                <Mail size={16} />
                Send Email
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
