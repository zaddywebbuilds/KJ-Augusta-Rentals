import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { riverViews, poolImages, outdoorImages, detailImages } from '../data/mediaConfig';

const scenes = [
  {
    time: 'Morning',
    headline: 'Coffee, river, silence.',
    body: "The Savannah moves slowly at dawn. From the deck, you watch it catch the first light while the coffee brews. There's nothing to do yet — and that's exactly the point. The kayaks are ready when you are.",
    image: riverViews[2],
    accent: '#CDB28A',
  },
  {
    time: 'Afternoon',
    headline: 'The pool owns your afternoon.',
    body: "The saltwater pool is open April through October, catching the full sun through the long afternoon. Float. Read. Let the kids burn off energy. Wander down to the private dock when the river calls.",
    image: poolImages[2],
    accent: '#667466',
  },
  {
    time: 'Evening',
    headline: 'Dinner, then the river turns gold.',
    body: "The kitchen is well-equipped — cook together, or grab dinner in downtown Augusta just minutes away. As the sun drops, the river goes amber and the deck becomes the best seat in the house.",
    image: outdoorImages[0],
    accent: '#B58B73',
  },
  {
    time: 'Night',
    headline: 'Still water. Real rest.',
    body: "Away from city noise, nights here are genuinely quiet. The bedrooms are comfortable and the beds are generous — six of them across the house. Sleep comes easy beside a river that never hurries.",
    image: detailImages[0],
    accent: '#CDB28A',
  },
];

export default function StorySection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-24 md:py-36 bg-ink overflow-hidden">
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={scenes[active].image}
            alt={scenes[active].time}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/70" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-champagne mb-4">
            A Day at the River House
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ivory">
            A stay shaped by the water.
          </h2>
        </div>

        {/* Time tabs */}
        <div className="flex justify-center gap-2 mb-16">
          {scenes.map((scene, i) => (
            <button
              key={scene.time}
              onClick={() => setActive(i)}
              className={`px-5 py-2 font-manrope text-xs tracking-widest uppercase transition-all duration-300 rounded-sm ${
                i === active
                  ? 'bg-champagne text-ink'
                  : 'text-ivory/60 hover:text-ivory border border-ivory/20 hover:border-ivory/40'
              }`}
            >
              {scene.time}
            </button>
          ))}
        </div>

        {/* Scene content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-cormorant text-3xl md:text-4xl text-ivory mb-6">
              {scenes[active].headline}
            </h3>
            <p className="font-manrope text-base text-ivory/75 leading-relaxed">
              {scenes[active].body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
