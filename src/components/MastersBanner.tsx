import { Trophy, ArrowRight } from 'lucide-react';
import { businessConfig } from '../data/businessConfig';

export default function MastersBanner() {
  const { enabled, label, detail } = businessConfig.masters;
  if (!enabled) return null;

  const toBook = () => {
    document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <aside className="bg-ink border-b border-champagne/25">
      <button
        onClick={toBook}
        className="group w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-x-3 gap-y-1 flex-wrap text-center"
      >
        <span className="inline-flex items-center gap-2">
          <Trophy size={14} className="text-champagne flex-shrink-0" />
          <span className="font-manrope text-[11px] sm:text-xs tracking-[0.18em] uppercase text-champagne font-semibold">
            {label}
          </span>
        </span>
        <span className="hidden sm:inline w-px h-3 bg-ivory/20" />
        <span className="font-manrope text-[11px] sm:text-xs text-ivory/65">
          {detail}
        </span>
        <span className="inline-flex items-center gap-1 font-manrope text-[11px] sm:text-xs text-champagne group-hover:gap-2 transition-all">
          Enquire
          <ArrowRight size={12} />
        </span>
      </button>
    </aside>
  );
}
