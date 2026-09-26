import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flag, Trophy, Car, Music, Utensils, Gift, Sparkles,
  MapPin, ExternalLink, ArrowRight, ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { areaEvents, EVENTS_CHECKED, type AreaEvent, type EventCategory } from '../data/events';

const CATEGORY_ICON: Record<EventCategory, LucideIcon> = {
  Golf: Flag,
  Sports: Trophy,
  Racing: Car,
  'Arts & Music': Music,
  'Food & Festivals': Utensils,
  Holidays: Gift,
  Culture: Sparkles,
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// The homepage stays short: the next few months show by default and the rest
// of the year is one tap away.
const INITIAL_MONTHS = 3;

// 'YYYY-MM-DD' read as a local calendar date. new Date('2026-09-18') is UTC
// midnight, which renders as the 17th for anyone west of Greenwich — which is
// every guest this site is for.
function parseDay(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function lastDay(e: AreaEvent): Date {
  const end = parseDay(e.end ?? e.start);
  return e.precision === 'day' ? end : new Date(end.getFullYear(), end.getMonth() + 1, 0);
}

function whenLabel(e: AreaEvent): string {
  if (e.dateLabel) return e.dateLabel;
  const s = parseDay(e.start);
  const short = (d: Date) => MONTHS[d.getMonth()].slice(0, 3);
  if (e.precision === 'month') return 'Date to be announced';
  if (!e.end) return `${short(s)} ${s.getDate()}`;
  const end = parseDay(e.end);
  return end.getMonth() === s.getMonth()
    ? `${short(s)} ${s.getDate()}–${end.getDate()}`
    : `${short(s)} ${s.getDate()} – ${short(end)} ${end.getDate()}`;
}

function EventCard({ event }: { event: AreaEvent }) {
  const Icon = CATEGORY_ICON[event.category];

  if (event.featured) {
    return (
      <article className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center bg-ink rounded-sm p-7 md:p-9">
        <div>
          <p className="flex items-center gap-2 font-manrope text-[10px] tracking-[0.2em] uppercase text-champagne mb-3">
            <Icon size={13} />
            {event.category} · {whenLabel(event)}
          </p>
          <h4 className="font-cormorant text-3xl md:text-4xl text-ivory leading-tight mb-2">{event.name}</h4>
          <p className="flex items-center gap-1.5 font-manrope text-xs text-ivory/70 mb-3">
            <MapPin size={12} className="flex-shrink-0" />
            {event.venue}
          </p>
          <p className="font-manrope text-sm text-ivory/85 leading-relaxed max-w-2xl">{event.blurb}</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          {event.internal && (
            <Link
              to={event.internal}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] bg-champagne text-ink font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay hover:text-ivory transition-colors rounded-sm"
            >
              Masters week at the River House
              <ArrowRight size={14} />
            </Link>
          )}
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 min-h-[44px] font-manrope text-[11px] tracking-[0.16em] uppercase text-ivory/80 hover:text-champagne transition-colors"
          >
            Tournament information
            <ExternalLink size={12} />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="flex flex-col bg-ivory border border-champagne/25 rounded-sm p-5 hover:border-champagne/60 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 font-manrope text-[10px] tracking-[0.16em] uppercase text-ink/70">
          <Icon size={13} className="text-champagne" />
          {event.category}
        </span>
        <span className="font-manrope text-[11px] font-semibold text-ink whitespace-nowrap">
          {whenLabel(event)}
        </span>
      </div>
      <h4 className="font-cormorant text-2xl text-ink leading-tight mb-2">{event.name}</h4>
      <p className="flex items-start gap-1.5 font-manrope text-xs text-ink/65 mb-3">
        <MapPin size={12} className="flex-shrink-0 mt-0.5" />
        {event.venue}
      </p>
      <p className="font-manrope text-[13px] text-ink/75 leading-relaxed mb-4 flex-1">{event.blurb}</p>
      <a
        href={event.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 self-start min-h-[44px] font-manrope text-[11px] tracking-[0.16em] uppercase text-ink hover:text-clay transition-colors"
      >
        Event details
        <ExternalLink size={12} />
      </a>
    </article>
  );
}

export default function WhatsOn() {
  const { ref, inView } = useInView();
  const [expanded, setExpanded] = useState(false);

  const months = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = areaEvents
      .filter(e => lastDay(e) >= today)
      .sort((a, b) => +parseDay(a.start) - +parseDay(b.start));

    const groups = new Map<string, { label: string; events: AreaEvent[] }>();
    for (const e of upcoming) {
      // An event already under way belongs to this month, not the one it began in.
      const start = parseDay(e.start);
      const at = start < today ? today : start;
      const key = `${at.getFullYear()}-${at.getMonth()}`;
      if (!groups.has(key)) {
        groups.set(key, { label: `${MONTHS[at.getMonth()]} ${at.getFullYear()}`, events: [] });
      }
      groups.get(key)!.events.push(e);
    }
    return [...groups.values()];
  }, []);

  // Once every listed date has passed, show nothing rather than an empty shell.
  if (months.length === 0) return null;

  const visible = expanded ? months : months.slice(0, INITIAL_MONTHS);
  const checked = parseDay(EVENTS_CHECKED);

  return (
    <section
      id="whats-on"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-14 md:py-20 bg-linen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-clay mb-4">
            What's On Nearby
          </p>
          <h2 className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
            Augusta, month by month.
          </h2>
          <p className="font-manrope text-base text-sage mt-5 leading-relaxed">
            The river is the reason to come; these are the reasons to pick your dates.
            Festivals, racing, big-time sport and Masters week — all within easy reach of
            the house.
          </p>
        </motion.div>

        <div className="space-y-12">
          {visible.map((month, i) => (
            <motion.div
              key={month.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + Math.min(i, 3) * 0.1 }}
            >
              <div className="flex items-baseline gap-4 mb-5">
                <h3 className="font-cormorant text-3xl text-ink whitespace-nowrap">{month.label}</h3>
                <span className="h-px flex-1 bg-champagne/40" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {month.events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {months.length > INITIAL_MONTHS && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setExpanded(v => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[44px] border border-ink/30 text-ink font-manrope text-xs tracking-widest uppercase hover:border-ink hover:bg-ink hover:text-ivory transition-colors rounded-sm"
            >
              {expanded ? 'Show fewer months' : 'Show the full year'}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-champagne/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="font-manrope text-xs text-ink/65 leading-relaxed max-w-2xl">
            Dates checked {checked.getDate()} {MONTHS[checked.getMonth()]} {checked.getFullYear()} against
            each organiser's announcements. Confirm with the organiser before booking around an event.
          </p>
          <button
            onClick={() => document.querySelector('#stays')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] bg-ink text-ivory font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay transition-colors rounded-sm flex-shrink-0"
          >
            Plan your stay around it
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
