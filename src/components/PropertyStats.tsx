import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { useGoToStays } from '../hooks/useGoToStays';
import { Users, BedDouble, Bath, Ship, TreePine, Waves } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

// Whole-property figures — what a guest gets booking the entire River House.
const stats = [
  { label: 'Guests', value: 16, suffix: '', icon: Users },
  { label: 'Bedrooms', value: 3, suffix: '', icon: BedDouble },
  { label: 'Beds', value: 9, suffix: '', icon: BedDouble },
  { label: 'Bathrooms', value: 3, suffix: '', icon: Bath },
  { label: 'Kayaks', value: 6, suffix: '', icon: Ship },
  { label: 'Acres', value: 3, suffix: '~', icon: TreePine },
];

function StatItem({ label, value, suffix, icon: Icon, inView }: {
  label: string;
  value: number;
  suffix: string;
  icon: typeof Users;
  inView: boolean;
}) {
  const count = useCountUp(value, 2000, inView);
  return (
    <div className="flex flex-col items-center text-center group">
      <Icon className="text-champagne mb-3 group-hover:scale-110 transition-transform" size={28} />
      <div className="font-cormorant text-5xl md:text-6xl text-ink font-light">
        {suffix === '~' ? '~' : ''}{count.toLocaleString()}{suffix === '+' ? '+' : ''}
      </div>
      <p className="font-manrope text-xs tracking-widest uppercase text-sage mt-2">{label}</p>
    </div>
  );
}

export default function PropertyStats() {
  const { ref, inView } = useInView();
  const goToStays = useGoToStays();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-16 md:py-20 bg-linen border-y border-champagne/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {stats.map(({ label, value, suffix, icon }) => (
            <StatItem
              key={label}
              label={label}
              value={value}
              suffix={suffix}
              icon={icon}
              inView={inView}
            />
          ))}
        </motion.div>

        {/* Waterfront badge + booking CTA */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-ivory rounded-full border border-champagne/30">
            <Waves className="text-champagne" size={16} />
            <span className="font-manrope text-xs tracking-widest uppercase text-sage">
              Savannah River Waterfront Property
            </span>
            <Waves className="text-champagne" size={16} />
          </div>
          <button
            onClick={goToStays}
            className="inline-flex items-center gap-2 px-8 py-3 min-h-[44px] bg-champagne text-ink font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
          >
            Check Availability
          </button>
        </motion.div>
      </div>
    </section>
  );
}
