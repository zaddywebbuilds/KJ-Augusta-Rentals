import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, Loader2 } from 'lucide-react';
import type { Accommodation } from '../data/accommodations';
import { HOSPITABLE_IDS, MAX_GUESTS } from '../data/bookingConfig';

// ── Date helpers (no external library) ──────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function todayStr() {
  const d = new Date();
  return ymd(d.getFullYear(), d.getMonth(), d.getDate());
}

function ymd(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0 = Sun
}

function addMonths(year: number, month: number, n: number) {
  const d = new Date(year, month + n, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function isoAddDays(date: string, n: number) {
  const { year, month, day } = parseDate(date);
  const d = new Date(year, month, day + n);
  return ymd(d.getFullYear(), d.getMonth(), d.getDate());
}

function nightsBetween(from: string, to: string) {
  const a = new Date(from + 'T12:00:00');
  const b = new Date(to   + 'T12:00:00');
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function shortDate(s: string) {
  const { year, month, day } = parseDate(s);
  return `${MONTH_NAMES[month].slice(0, 3)} ${day}, ${year}`;
}

function hasBlockedInRange(from: string, to: string, blocked: Set<string>) {
  let cur = isoAddDays(from, 1); // day after checkin
  while (cur < to) {
    if (blocked.has(cur)) return true;
    cur = isoAddDays(cur, 1);
  }
  return false;
}

// ── Types ────────────────────────────────────────────────────────────────────

interface FinancialLine { amount: number; formatted: string; label: string }

interface QuoteResult {
  quote_id: string;
  booking_url: string;
  currency: string;
  financials: {
    taxes:     FinancialLine[];
    fees:      FinancialLine[];
    discounts: FinancialLine[];
    totals: {
      sub_total:  FinancialLine;
      total_fees: FinancialLine;
      total:      FinancialLine;
    };
  };
}

interface CalDay { date: string; available: boolean; noCheckin: boolean; noCheckout: boolean }

// ── Component ────────────────────────────────────────────────────────────────

export default function BookingWidget({ stay }: { stay: Accommodation }) {
  const propertyId = HOSPITABLE_IDS[stay.slug];
  const maxGuests  = MAX_GUESTS[stay.slug] ?? 20;

  const TODAY = todayStr();
  const now   = parseDate(TODAY);

  // Calendar state
  const [viewYear,  setViewYear]  = useState(now.year);
  const [viewMonth, setViewMonth] = useState(now.month);
  const [calDays,   setCalDays]   = useState<Map<string, CalDay>>(new Map());
  const [calLoading, setCalLoading] = useState(true);

  // Selection state
  const [phase,    setPhase]    = useState<'checkin' | 'checkout'>('checkin');
  const [checkin,  setCheckin]  = useState<string | null>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [adults,   setAdults]   = useState(2);

  // Quote state
  const [quote,       setQuote]       = useState<QuoteResult | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError,   setQuoteError]   = useState<string | null>(null);

  const quoteAbort = useRef<AbortController | null>(null);

  // Load 6 months of availability on mount
  useEffect(() => {
    if (!propertyId) return;
    const startDate = TODAY;
    const endDate   = isoAddDays(TODAY, 180);
    setCalLoading(true);
    fetch(`/api/calendar?propertyId=${propertyId}&startDate=${startDate}&endDate=${endDate}`)
      .then(r => r.json())
      .then((data: { days?: CalDay[] }) => {
        const map = new Map<string, CalDay>();
        for (const d of data.days ?? []) map.set(d.date, d);
        setCalDays(map);
      })
      .catch(() => {/* show widget without availability highlight */})
      .finally(() => setCalLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  // Auto-fetch quote when both dates are set
  useEffect(() => {
    if (!checkin || !checkout || !propertyId) { setQuote(null); return; }
    quoteAbort.current?.abort();
    quoteAbort.current = new AbortController();
    setQuoteLoading(true);
    setQuoteError(null);
    setQuote(null);
    fetch('/api/quote', {
      method: 'POST',
      signal: quoteAbort.current.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, checkinDate: checkin, checkoutDate: checkout, adults }),
    })
      .then(r => r.json())
      .then((data: { data?: QuoteResult; reason_phrase?: string }) => {
        if (data.data) {
          setQuote(data.data);
        } else {
          setQuoteError(data.reason_phrase ?? "These dates aren't available. Try different dates.");
        }
      })
      .catch(err => { if (err.name !== 'AbortError') setQuoteError('Unable to fetch price. Please try again.'); })
      .finally(() => setQuoteLoading(false));
  }, [checkin, checkout, adults, propertyId]);

  // ── Day click logic ────────────────────────────────────────────────────────

  const isUnavailable = (date: string) => {
    if (date < TODAY) return true;
    const cal = calDays.get(date);
    if (!cal) return false; // unknown = allow (calendar might not be loaded yet)
    return !cal.available;
  };

  const isNoCheckin = (date: string) => calDays.get(date)?.noCheckin ?? false;

  const handleDayClick = (date: string) => {
    if (isUnavailable(date)) return;

    if (phase === 'checkin' || !checkin) {
      if (isNoCheckin(date)) return;
      setCheckin(date);
      setCheckout(null);
      setQuote(null);
      setPhase('checkout');
      return;
    }

    // Selecting checkout
    if (date <= checkin) {
      if (isNoCheckin(date)) return;
      setCheckin(date);
      setCheckout(null);
      setQuote(null);
      setPhase('checkout');
      return;
    }

    // Blocked date inside range → restart
    const blocked = new Set<string>(
      [...calDays.entries()].filter(([, v]) => !v.available).map(([k]) => k)
    );
    if (hasBlockedInRange(checkin, date, blocked)) {
      if (isNoCheckin(date)) return;
      setCheckin(date);
      setCheckout(null);
      setQuote(null);
      setPhase('checkout');
      return;
    }

    setCheckout(date);
    setPhase('checkin');
  };

  const reset = () => {
    setCheckin(null);
    setCheckout(null);
    setPhase('checkin');
    setQuote(null);
    setQuoteError(null);
  };

  // ── Calendar navigation ────────────────────────────────────────────────────

  const prevMonth = () => {
    const { year, month } = addMonths(viewYear, viewMonth, -1);
    // Don't go before current month
    if (year < now.year || (year === now.year && month < now.month)) return;
    setViewYear(year); setViewMonth(month);
  };

  const nextMonth = () => {
    const { year, month } = addMonths(viewYear, viewMonth, 1);
    // Don't go past 6 months ahead
    const limit = addMonths(now.year, now.month, 6);
    if (year > limit.year || (year === limit.year && month > limit.month)) return;
    setViewYear(year); setViewMonth(month);
  };

  const isAtStart = viewYear === now.year && viewMonth === now.month;

  // ── Day cell classification ────────────────────────────────────────────────

  const effectiveEnd = phase === 'checkout' && checkin && hovered && hovered > checkin
    ? hovered
    : checkout;

  function dayClasses(date: string) {
    const past      = date < TODAY;
    const unavail   = isUnavailable(date);
    const noCI      = isNoCheckin(date);
    const isToday   = date === TODAY;
    const isCI      = date === checkin;
    const isCO      = date === checkout;
    const inRange   = checkin && effectiveEnd && date > checkin && date < effectiveEnd;
    const isEndHov  = date === effectiveEnd && effectiveEnd !== checkout;

    let base = 'relative h-9 w-full flex items-center justify-center text-sm font-manrope select-none rounded-sm transition-colors ';

    if (isCI || isCO) {
      return base + 'bg-ink text-ivory font-semibold cursor-pointer';
    }
    if (inRange) {
      return base + 'bg-champagne/20 text-ink cursor-pointer';
    }
    if (isEndHov && !isCO) {
      return base + 'bg-ink/10 text-ink cursor-pointer';
    }
    if (past || unavail) {
      return base + (noCI && !past && !unavail ? 'text-sage/40 cursor-not-allowed line-through' : 'text-sage/30 cursor-not-allowed');
    }
    if (phase === 'checkout' && checkin && date <= checkin) {
      return base + 'text-sage/40 cursor-not-allowed';
    }
    let cls = base + 'text-ink hover:bg-champagne/25 cursor-pointer';
    if (isToday) cls += ' ring-1 ring-champagne';
    return cls;
  }

  // ── Render a single month calendar ────────────────────────────────────────

  function renderMonth(year: number, month: number) {
    const leading = firstWeekday(year, month);
    const total   = daysInMonth(year, month);
    const cells: Array<{ date: string } | null> = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push({ date: ymd(year, month, d) });
    // Pad to full grid
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            disabled={isAtStart}
            className="p-1.5 rounded-sm hover:bg-champagne/20 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={15} className="text-ink" />
          </button>
          <span className="font-manrope text-sm font-semibold text-ink tracking-wide">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-sm hover:bg-champagne/20 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={15} className="text-ink" />
          </button>
        </div>

        {/* Day-of-week header */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map(l => (
            <div key={l} className="h-7 flex items-center justify-center font-manrope text-[10px] tracking-widest uppercase text-sage/60">
              {l}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((cell, idx) =>
            cell === null ? (
              <div key={`e${idx}`} />
            ) : (
              <button
                key={cell.date}
                className={dayClasses(cell.date)}
                onClick={() => handleDayClick(cell.date)}
                onMouseEnter={() => setHovered(cell.date)}
                onMouseLeave={() => setHovered(null)}
                aria-label={cell.date}
                aria-pressed={cell.date === checkin || cell.date === checkout}
              >
                {parseDate(cell.date).day}
              </button>
            )
          )}
        </div>
      </div>
    );
  }

  // ── Quote display ──────────────────────────────────────────────────────────

  function renderQuote() {
    if (!checkin || !checkout) return null;
    const nights = nightsBetween(checkin, checkout);

    return (
      <div className="mt-5 border-t border-champagne/25 pt-5">
        {quoteLoading && (
          <div className="flex items-center gap-2 text-sage font-manrope text-sm">
            <Loader2 size={15} className="animate-spin text-champagne" />
            Calculating price…
          </div>
        )}

        {quoteError && !quoteLoading && (
          <p className="font-manrope text-sm text-red-600 leading-snug">{quoteError}</p>
        )}

        {quote && !quoteLoading && (
          <>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-manrope text-sm">
                <span className="text-sage">Accommodation ({nights} night{nights !== 1 ? 's' : ''})</span>
                <span className="text-ink">{quote.financials.totals.sub_total.formatted}</span>
              </div>
              {quote.financials.fees.map(f => (
                <div key={f.label} className="flex justify-between font-manrope text-sm">
                  <span className="text-sage">{f.label}</span>
                  <span className="text-ink">{f.formatted}</span>
                </div>
              ))}
              {/* Taxes collapsed into one line */}
              {quote.financials.taxes.length > 0 && (
                <div className="flex justify-between font-manrope text-sm">
                  <span className="text-sage">Taxes &amp; fees</span>
                  <span className="text-ink">
                    {quote.financials.taxes
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-manrope text-sm font-semibold border-t border-champagne/20 pt-2 mt-2">
                <span className="text-ink">Total</span>
                <span className="text-ink">{quote.financials.totals.total.formatted}</span>
              </div>
            </div>

            <a
              href={quote.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3.5 min-h-[44px] bg-ink text-ivory font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay transition-colors rounded-sm"
            >
              Book now →
            </a>
            <p className="font-manrope text-[11px] text-sage/60 text-center mt-2 leading-snug">
              You'll complete your booking on Hospitable's secure checkout.
              No platform fees — you pay us directly.
            </p>
          </>
        )}
      </div>
    );
  }

  // ── No Hospitable ID: fallback ─────────────────────────────────────────────

  if (!propertyId) {
    return (
      <div className="bg-linen border border-champagne/30 rounded-sm p-6">
        <h3 className="font-cormorant text-2xl text-ink mb-3">Check availability</h3>
        <p className="font-manrope text-sm text-sage leading-relaxed mb-5">
          Send us your dates and we'll confirm availability the same day.
        </p>
        <a
          href={`mailto:hello@kjaugustarentals.com?subject=Booking enquiry — ${stay.name}`}
          className="inline-flex items-center justify-center w-full px-6 py-3.5 min-h-[44px] bg-ink text-ivory font-manrope text-xs tracking-widest uppercase font-semibold hover:bg-clay transition-colors rounded-sm"
        >
          Request these dates
        </a>
      </div>
    );
  }

  // ── Main widget ────────────────────────────────────────────────────────────

  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0;

  return (
    <div className="bg-linen border border-champagne/30 rounded-sm p-5">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-cormorant text-2xl text-ink">
          {phase === 'checkin' || !checkin ? 'Select check-in' : 'Select check-out'}
        </h3>
        {(checkin || checkout) && (
          <button
            onClick={reset}
            className="font-manrope text-[11px] text-sage/60 hover:text-clay underline underline-offset-2 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Selected dates summary */}
      {(checkin || checkout) && (
        <div className="flex gap-2 mb-4">
          <div className={`flex-1 border rounded-sm px-3 py-2 ${checkin ? 'border-ink' : 'border-champagne/30'}`}>
            <p className="font-manrope text-[10px] tracking-widest uppercase text-sage/60 mb-0.5">Check-in</p>
            <p className="font-manrope text-sm text-ink font-medium">
              {checkin ? shortDate(checkin) : '—'}
            </p>
          </div>
          <div className={`flex-1 border rounded-sm px-3 py-2 ${checkout ? 'border-ink' : 'border-champagne/30'}`}>
            <p className="font-manrope text-[10px] tracking-widest uppercase text-sage/60 mb-0.5">Check-out</p>
            <p className="font-manrope text-sm text-ink font-medium">
              {checkout ? shortDate(checkout) : nights ? `${nights} night${nights !== 1 ? 's' : ''}` : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="relative">
        {calLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-linen/70 z-10 rounded-sm">
            <Loader2 size={20} className="animate-spin text-champagne" />
          </div>
        )}
        {renderMonth(viewYear, viewMonth)}
      </div>

      {/* Guest count */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-champagne/20">
        <span className="font-manrope text-sm text-ink">Guests</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdults(a => Math.max(1, a - 1))}
            className="w-8 h-8 flex items-center justify-center border border-champagne/40 rounded-sm hover:border-champagne transition-colors text-ink"
            aria-label="Remove guest"
          >
            <Minus size={13} />
          </button>
          <span className="font-manrope text-sm text-ink w-4 text-center tabular-nums">{adults}</span>
          <button
            onClick={() => setAdults(a => Math.min(maxGuests, a + 1))}
            className="w-8 h-8 flex items-center justify-center border border-champagne/40 rounded-sm hover:border-champagne transition-colors text-ink"
            aria-label="Add guest"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* Price + Book button */}
      {renderQuote()}

      {/* Pre-selection nudge */}
      {!checkin && !calLoading && (
        <p className="font-manrope text-[11px] text-sage/60 mt-4 text-center leading-snug">
          Greyed dates are already booked. Select your check-in to get started.
        </p>
      )}
    </div>
  );
}
