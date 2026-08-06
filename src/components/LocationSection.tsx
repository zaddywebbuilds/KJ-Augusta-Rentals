import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { MapPin, ExternalLink } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

export default function LocationSection() {
  const { ref, inView } = useInView();

  const mapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3321.0!2d${businessConfig.location.longitude}!3d${businessConfig.location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f9c97d6cfd07e1%3A0x9104739615c98f62!2sKJ%20Augusta%20Rentals!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus`;

  return (
    <section id="location" ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Find Us
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink">
            Augusta outside. The river at your door.
          </h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            <MapPin className="text-champagne" size={18} />
            <span className="font-manrope text-sm text-sage">
              {businessConfig.location.showExactAddressPublicly
                ? `${businessConfig.location.streetAddress}, ${businessConfig.location.city}, ${businessConfig.location.state}`
                : `Augusta, Georgia • Savannah River`}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="rounded-sm overflow-hidden shadow-xl border border-linen"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <iframe
            src={mapsEmbedUrl}
            title="KJ Augusta Rentals Location"
            className="w-full h-[420px] md:h-[520px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href={businessConfig.location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-ivory font-manrope text-sm tracking-widest uppercase hover:bg-champagne hover:text-ink transition-all duration-300 rounded-sm"
          >
            <ExternalLink size={14} />
            Open in Google Maps
          </a>
          <a
            href={`tel:${businessConfig.contact.phoneHref}`}
            className="inline-flex items-center gap-2 px-6 py-3 border border-ink text-ink font-manrope text-sm tracking-widest uppercase hover:bg-ink hover:text-ivory transition-all duration-300 rounded-sm"
          >
            Questions? Call KJ
          </a>
        </motion.div>
      </div>
    </section>
  );
}
