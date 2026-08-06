import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { riverViews, poolImages, outdoorImages, detailImages } from '../data/mediaConfig';

const scenes = [
  {
    time: 'Morning',
    headline: 'Coffee, river, silence.',
    body: "The Savannah moves slowly at dawn. From the deck, you watch it catch the first light while the coffee brews. There's nothing to do yet — and that's exactly the point. The kayaks are ready when you are.",
    image: riverViews[2],
  },
  {
    time: 'Afternoon',
    headline: 'The pool owns your afternoon.',
    body: "The saltwater pool is open April through October, catching the full sun through the long afternoon. Float. Read. Let the kids burn off energy. Wander down to the private dock when the river calls.",
    image: poolImages[2],
  },
  {
    time: 'Evening',
    headline: 'Dinner, then the river turns gold.',
    body: "The kitchen is well-equipped — cook together, or grab dinner in downtown Augusta just minutes away. As the sun drops, the river goes amber and the deck becomes the best seat in the house.",
    image: outdoorImages[0],
  },
  {
    time: 'Night',
    headline: 'Still water. Real rest.',
    body: "Away from city noise, nights here are genuinely quiet. The bedrooms are comfortable and the beds are generous — six of them across the house. Sleep comes easy beside a river that never hurries.",
    image: detailImages[0],
  },
];

export default function StorySection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-12 md:py-16 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-champagne mb-4">
            A Day at the River House
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ivory">
            A stay shaped by the water.
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: tabs + copy */}
          <div>
            <div className="flex flex-wrap gap-2 mb-10">
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

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
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

          {/* RIGHT: Foreground image — surface element */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="relative overflow-hidden rounded-sm shadow-2xl"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={scenes[active].image}
                alt={scenes[active].time}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-ink/80 to-transparent">
                <span className="font-manrope text-[10px] tracking-[0.25em] uppercase text-champagne">
                  {scenes[active].time}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
