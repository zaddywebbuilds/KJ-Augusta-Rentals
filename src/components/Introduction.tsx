import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { riverViews, exteriorImages } from '../data/mediaConfig';
import Photo from './Photo';

export default function Introduction() {
  const { ref, inView } = useInView();

  return (
    <section id="property" ref={ref as React.RefObject<HTMLElement>} className="py-12 md:py-16 bg-ivory">
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
                <span className="font-cormorant text-3xl text-ink">5.0</span>
                <span className="font-manrope text-sm text-sage">· Google Reviews</span>
              </div>
              <span className="w-px h-8 bg-linen" />
              <span className="font-manrope text-sm text-sage">22+ guest reviews</span>
              <span className="w-px h-8 bg-linen" />
              <span className="font-manrope text-sm font-medium text-champagne">Verified Host</span>
            </div>
          </motion.div>

          {/* Images — full-frame, nothing cropped */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <Photo
                id={riverViews[4]}
                alt="Savannah River view from the property"
                sizes="(max-width: 1024px) 45vw, 300px"
                className="w-full aspect-[4/3] object-contain bg-linen rounded-sm shadow-xl"
              />
              <Photo
                id={exteriorImages[3]}
                alt="KJ Augusta Rentals exterior"
                sizes="(max-width: 1024px) 45vw, 300px"
                className="w-full aspect-[4/3] object-contain bg-linen rounded-sm shadow-lg"
              />
            </div>
            <div className="mt-4 bg-ink rounded-sm px-6 py-5 flex items-center gap-4">
              <span className="font-cormorant text-5xl text-ivory leading-none">~3</span>
              <div>
                <p className="font-manrope text-[9px] tracking-[0.2em] uppercase text-champagne">Private Acres</p>
                <p className="font-manrope text-[9px] tracking-[0.15em] uppercase text-ivory/50 mt-1">On the Savannah River</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
