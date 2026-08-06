import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { bedroomImages, livingImages, kitchenImages, outdoorImages } from '../data/mediaConfig';
import Photo from './Photo';

const rooms = [
  {
    name: 'Master Suite',
    description: 'The primary bedroom is a generous retreat with a comfortable king bed, ample storage, and views that set the tone for the whole stay. Private and peaceful.',
    image: bedroomImages[0],
  },
  {
    name: 'Second Bedroom',
    description: 'Versatile and comfortable, the second bedroom features flexible sleeping arrangements — ideal for children, additional guests, or anyone who needs their own space.',
    image: bedroomImages[4],
  },
  {
    name: 'Great Room',
    description: 'The heart of the house. Open, warm, and well-furnished — the great room is where mornings start with coffee and evenings end with conversation.',
    image: livingImages[0],
  },
  {
    name: 'Sunroom',
    description: 'A rare feature that earns its name. The sunroom faces the river and floods with natural light throughout the day — perfect for reading, working, or simply watching the water.',
    image: livingImages[2],
  },
  {
    name: 'Kitchen',
    description: 'Fully equipped with everything you need to cook real meals. Counter space, quality appliances, and a dining area that seats the whole group.',
    image: kitchenImages[0],
  },
  {
    name: 'Outdoor Living',
    description: 'Wrap-around deck, patio seating, grill, and direct access to the pool and dock. When the weather cooperates, you may never want to go inside.',
    image: outdoorImages[7],
  },
];

export default function RoomTour() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(0);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            Room by Room
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink">
            Space to gather. Space to step away.
          </h2>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex overflow-x-auto pb-2 gap-2 mb-12 scrollbar-hide justify-start md:justify-center">
          {rooms.map((room, i) => (
            <button
              key={room.name}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 px-5 min-h-[44px] md:min-h-0 md:py-2.5 font-manrope text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${
                i === active
                  ? 'bg-ink text-ivory'
                  : 'text-sage border border-linen hover:border-champagne'
              }`}
            >
              {room.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="order-2 lg:order-1">
              <h3 className="font-cormorant text-3xl md:text-4xl text-ink mb-6">
                {rooms[active].name}
              </h3>
              <p className="font-manrope text-base text-sage leading-relaxed">
                {rooms[active].description}
              </p>
            </div>
            <div className="order-1 lg:order-2 rounded-sm overflow-hidden shadow-xl aspect-[4/3] bg-linen">
              <Photo
                id={rooms[active].image}
                alt={`${rooms[active].name} at KJ's River House`}
                sizes="(max-width: 1024px) 100vw, 560px"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
