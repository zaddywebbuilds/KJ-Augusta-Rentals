import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { introImage1, introImage2 } from '../data/mediaConfig';

export default function Introduction() {
  const { ref, inView } = useInView();

  return (
    <section id="property" ref={ref as React.RefObject<HTMLElement>} className="py-24 md:py-36 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
              The River House
            </p>
            <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-8">
              Private enough to disappear.{' '}
              <em className="text-sage italic">Close enough to enjoy Augusta.</em>
            </h2>
            <div className="space-y-5 font-manrope text-base text-sage leading-relaxed">
              <p>
                Set on approximately three private acres along the Savannah River,
                KJ's River House is the kind of place that makes you rethink what
                a vacation can be. Wide decks overlook the water. A saltwater pool
                catches the afternoon sun. A private dock invites morning kayaking
                before the world wakes up.
              </p>
              <p>
                Inside, over 2,600 square feet of thoughtfully furnished space gives
                everyone room to gather or find a quiet corner of their own. Two full
                bedrooms, two bathrooms, a sunroom, and generous outdoor living make
                it ideal for families, couples, or small groups seeking something
                genuinely special.
              </p>
              <p>
                Downtown Augusta, Augusta National, and the historic Riverwalk are
                all within easy reach — making this the rare retreat that works as a
                home base for the city's biggest events, or simply as a place to do
                nothing at all beside a river that moves at its own pace.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-champagne text-xl">★</span>
                <span className="font-cormorant text-3xl text-ink">4.8</span>
                <span className="font-manrope text-sm text-sage">/ 5 on Airbnb</span>
              </div>
              <span className="w-px h-8 bg-linen" />
              <span className="font-manrope text-sm text-sage">41 guest reviews</span>
              <span className="w-px h-8 bg-linen" />
              <span className="font-manrope text-sm text-sage font-medium text-champagne">Superhost</span>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            className="relative h-[500px] lg:h-[600px]"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <img
              src={introImage1}
              alt="KJ Augusta Rentals pool area"
              className="absolute top-0 right-0 w-4/5 h-4/5 object-cover rounded-sm shadow-2xl"
            />
            <img
              src={introImage2}
              alt="KJ Augusta Rentals exterior"
              className="absolute bottom-0 left-0 w-3/5 h-3/5 object-cover rounded-sm shadow-xl border-4 border-ivory"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-champagne/20 backdrop-blur-sm border border-champagne/30 rounded-sm px-6 py-4 text-center">
              <span className="font-cormorant text-3xl text-ink">~3</span>
              <p className="font-manrope text-[9px] tracking-wider uppercase text-sage mt-1">Private Acres</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
