import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import Photo from './Photo';
import { pickPhoto } from '../data/pickPhoto';
import {
  Waves, Flame, Wind, Wifi, Car, Utensils, Tv, Dumbbell,
  Sun, Anchor, TreePine, Coffee, Sunset, Bath, BedDouble, Shirt
} from 'lucide-react';

const ON_WATER_VIDEO = '/KJ-Augusta-Rentals/assets/video/dock-fishing.mp4';

const amenityGroups = [
  {
    category: 'On the Water',
    icon: Waves,
    match: /dock/,
    video: ON_WATER_VIDEO,
    items: [
      { icon: Anchor, label: 'Private dock & boat slip on the Savannah River' },
      { icon: Waves, label: '6 kayaks (4 adult, 2 child) with life vests' },
      { icon: Sunset, label: 'Sunrise and sunset over the water' },
      { icon: TreePine, label: '3 secluded acres of private waterfront' },
    ],
  },
  {
    category: 'Outdoors',
    icon: Sun,
    match: /fire pit/,
    note: '🌊 Saltwater pool open April – October',
    items: [
      { icon: Sun, label: 'Saltwater pool (seasonal, Apr–Oct)' },
      { icon: Flame, label: 'Smokeless fire pit, propane & charcoal grills' },
      { icon: TreePine, label: 'Outdoor bar, ping pong & cornhole' },
      { icon: Wind, label: 'Covered deck, patios & private golf tee-off area' },
    ],
  },
  {
    // Back in service on new-2026_21, the great room shot KJ sent after being
    // asked for one: the walk-through video never entered this room, so until
    // it arrived the only living-room photos on file predated her work here.
    category: 'Inside',
    icon: Utensils,
    match: /kitchen|great room/,
    items: [
      { icon: Utensils, label: 'Fully equipped kitchen' },
      { icon: Tv, label: 'Smart TV / streaming' },
      { icon: Coffee, label: 'Coffee station' },
      { icon: Wifi, label: 'High-speed WiFi' },
      { icon: Dumbbell, label: 'Spacious great room' },
    ],
  },
  {
    // Back in service: new-2026_17 is a frame from the walk-through video KJ sent
    // after her review, so this card now shows the master suite as it stands
    // rather than the pre-renovation shot she asked to have pulled.
    category: 'Rest & Refresh',
    icon: BedDouble,
    match: /bedroom|master/,
    items: [
      { icon: BedDouble, label: '9 beds across 3 bedrooms' },
      { icon: Bath, label: '3 full bathrooms, jacuzzi tub in the master' },
      { icon: Shirt, label: 'Washer & dryer' },
      { icon: Car, label: 'Free parking on premises' },
      { icon: Wind, label: 'Air conditioning & heating' },
    ],
  },
];

// Each card resolves to a photo whose own description contains the matching
// word, so a card can never illustrate itself with the wrong room. The 2026
// owner-supplied set is preferred over the older Airbnb scrape so cards show
// the house as it stands today. A null match renders text-only rather than
// reaching for a photo KJ has withdrawn.
const groups = amenityGroups.map(({ match, video, ...rest }) => ({
  ...rest,
  video: video ?? undefined,
  photo: !video && match
    ? pickPhoto('new-2026', match) ?? pickPhoto('entire-house', match)
    : undefined,
}));

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
          {groups.map(({ category, icon: Icon, photo, note, video, items }, groupIdx) => (
            <motion.div
              key={category}
              className="bg-linen rounded-sm overflow-hidden border border-champagne/20 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * groupIdx }}
            >
              {video ? (
                <video
                  src={video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full aspect-[4/3] object-cover"
                />
              ) : photo ? (
                <div className="bg-ivory">
                  <Photo
                    id={photo.id}
                    alt={photo.alt}
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="w-full aspect-[4/3] object-contain"
                  />
                </div>
              ) : null}
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
