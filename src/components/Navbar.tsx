import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { accommodations } from '../data/accommodations';
import MastersBanner from './MastersBanner';

// `to` routes; `hash` scrolls within the home page.
const navLinks = [
  { label: 'Stays', hash: '#stays' },
  { label: 'Amenities', hash: '#amenities' },
  { label: 'Masters', to: '/masters' },
  { label: 'Reviews', hash: '#reviews' },
  { label: 'Location', hash: '#location' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Only the home page has a dark hero behind the bar; elsewhere the page
  // starts light, so the transparent state would render invisible text.
  const onHome = pathname === '/';
  const solid = scrolled || !onHome;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const goToHash = (hash: string) => {
    setMenuOpen(false);
    if (onHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/${hash}`);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          solid
            ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-linen'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <MastersBanner />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex flex-col leading-none">
              <span
                className={`font-cormorant font-bold text-3xl tracking-tight transition-colors duration-300 ${
                  solid ? 'text-ink' : 'text-ivory'
                }`}
              >
                KJ
              </span>
              <span
                className={`font-manrope text-[9px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  solid ? 'text-sage' : 'text-ivory/80'
                }`}
              >
                Augusta Rentals
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {navLinks.map(link =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`font-manrope text-sm tracking-wider uppercase transition-colors duration-300 hover:text-champagne ${
                      solid ? 'text-ink' : 'text-ivory/90'
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => goToHash(link.hash!)}
                    className={`font-manrope text-sm tracking-wider uppercase transition-colors duration-300 hover:text-champagne ${
                      solid ? 'text-ink' : 'text-ivory/90'
                    }`}
                  >
                    {link.label}
                  </button>
                )
              )}
              <button
                onClick={() => goToHash('#stays')}
                className="ml-2 px-5 py-2.5 bg-champagne text-ink font-manrope text-sm tracking-wider uppercase font-medium hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
              >
                Check Availability
              </button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className={solid ? 'text-ink' : 'text-ivory'} size={24} />
              ) : (
                <Menu className={solid ? 'text-ink' : 'text-ivory'} size={24} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink flex flex-col items-center justify-center overflow-y-auto py-24"
            initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-5">
              {accommodations.map((stay, i) => (
                <motion.div
                  key={stay.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  <Link
                    to={`/stays/${stay.slug}`}
                    className="font-cormorant text-3xl text-ivory hover:text-champagne transition-colors"
                  >
                    {stay.name}
                  </Link>
                </motion.div>
              ))}

              <span className="w-16 h-px bg-ivory/20 my-2" />

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="font-manrope text-base tracking-widest uppercase text-ivory/80 hover:text-champagne transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => goToHash(link.hash!)}
                      className="font-manrope text-base tracking-widest uppercase text-ivory/80 hover:text-champagne transition-colors"
                    >
                      {link.label}
                    </button>
                  )}
                </motion.div>
              ))}

              <motion.button
                onClick={() => goToHash('#stays')}
                className="mt-5 px-8 py-4 min-h-[44px] bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-medium rounded-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Check Availability
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
