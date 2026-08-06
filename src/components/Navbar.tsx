import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';
import MastersBanner from './MastersBanner';

const navLinks = [
  { label: 'The Property', href: '#property' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Location', href: '#location' },
  { label: 'Book', href: '#book' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-linen'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Seasonal urgency strip — rides along inside the fixed header so it
            can't be overlapped by it */}
        <MastersBanner />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex flex-col leading-none group">
              <span
                className={`font-cormorant font-bold text-3xl tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-ink' : 'text-ivory'
                }`}
              >
                KJ
              </span>
              <span
                className={`font-manrope text-[9px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  scrolled ? 'text-sage' : 'text-ivory/80'
                }`}
              >
                Augusta Rentals
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`font-manrope text-sm tracking-wider uppercase transition-colors duration-300 hover:text-champagne ${
                    scrolled ? 'text-ink' : 'text-ivory/90'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo('#book')}
                className="ml-4 px-5 py-2.5 bg-champagne text-ink font-manrope text-sm tracking-wider uppercase font-medium hover:bg-clay hover:text-ivory transition-all duration-300 rounded-sm"
              >
                Book Direct
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className={scrolled ? 'text-ink' : 'text-ivory'} size={24} />
              ) : (
                <Menu className={scrolled ? 'text-ink' : 'text-ivory'} size={24} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-ink flex flex-col items-center justify-center"
            initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="font-cormorant text-4xl text-ivory hover:text-champagne transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                onClick={() => scrollTo('#book')}
                className="mt-4 px-8 py-4 bg-champagne text-ink font-manrope text-sm tracking-widest uppercase font-medium rounded-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Book Direct
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
