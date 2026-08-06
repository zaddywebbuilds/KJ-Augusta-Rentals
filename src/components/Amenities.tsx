import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { poolImages, riverViews, livingImages, bedroomImages } from '../data/mediaConfig';
import {
  Waves, Flame, Wind, Wifi, Car, Utensils, Tv, Dumbbell,
  Sun, Anchor, TreePine, Coffee, Sunset, Bath, BedDouble, Shirt
} from 'lucide-react';

const amenityGroups = [
  {
    category: 'On the Water',
    icon: Waves,
    image: riverViews[1],
    items: [
      { icon: Anchor, label: 'Private dock on the Savannah River' },
      { icon: Waves, label: 'Kayaks & river access' },
      { icon: Sunset, label: 'Panoramic river views from deck' },
      { icon: TreePine, label: '~3 acres of private waterfront land' },
    ],
  },
  {
    category: 'Outdoors',
    icon: Sun,
    image: poolImages[4],
    note: '🌊 Saltwater pool open April – October',
    items: [
      { icon: Sun, label: 'Saltwater pool (seasonal, Apr–Oct)' },
      { icon: Flame, label: 'Outdoor grill & fire pit area' },
      { icon: TreePine, label: 'Expansive private grounds' },
      { icon: Wind, label: 'Wrap-around deck & patio' },
    ],
  },
  {
    category: 'Inside',
    icon: Utensils,
    image: livingImages[1],
    items: [
      { icon: Utensils, label: 'Fully equipped kitchen' },
      { icon: Tv, label: 'Smart TV / streaming' },
      { icon: Coffee, label: 'Coffee station' },
      { icon: Wifi, label: 'High-speed WiFi' },
      { icon: Dumbbell, label: 'Spacious great room' },
    ],
  },
  {
    category: 'Rest & Refresh',
    icon: BedDouble,
    image: bedroomImages[1],
    items: [
      { icon: BedDouble, label: '6 beds across 2 bedrooms' },
      { icon: Bath, label: '2 full bathrooms' },
      { icon: Shirt, label: 'Washer & dryer' },
      { icon: Car, label: 'Free parking on premises' },
      { icon: Wind, label: 'Air conditioning & heating' },
    ],
  },
];

export default function Amenities() {
  const { ref, inView } = useInView();

  return (
    <section id="amenities" ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            What's Included
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink">
            Everything you came to the river for.
          </h2>
        </motion.div>

        {/* Seasonal pool banner */}
        <motion.div
          className="mb-12 p-4 bg-linen border border-champagne/30 rounded-sm text-center"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="font-manrope text-sm text-sage">
            <strong className="text-clay">Seasonal note:</strong> The saltwater pool is available
            April through October. Off-season stays still enjoy the full river, dock, and 2,600+ sq ft interior.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {amenityGroups.map(({ category, icon: Icon, image, note, items }, groupIdx) => (
            <motion.div
              key={category}
              className="bg-linen rounded-sm overflow-hidden border border-champagne/20 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * groupIdx }}
            >
              {image && (
                <div className="bg-ivory">
                  <img
                    src={image}
                    alt={category}
                    className="w-full aspect-[4/3] object-contain"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="text-champagne" size={20} />
                  <h3 className="font-cormorant text-2xl text-ink">{category}</h3>
                </div>
                {note && (
                  <p className="font-manrope text-xs text-clay mb-4 bg-ivory px-3 py-2 rounded-sm">
                    {note}
                  </p>
                )}
                <ul className="space-y-3">
                  {items.map(({ icon: ItemIcon, label }) => (
                    <li key={label} className="flex items-center gap-3">
                      <ItemIcon className="text-sage flex-shrink-0" size={16} />
                      <span className="font-manrope text-sm text-sage">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
