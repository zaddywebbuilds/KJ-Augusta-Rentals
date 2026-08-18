/**
 * Schematic of the drive from the River House to Augusta National.
 *
 * KJ asked for "maybe even a map in there to show the distance", because the
 * question every Masters guest asks first is how far out they are. It is drawn
 * inline rather than embedded: LocationSection already carries a Google Maps
 * iframe, and she raised video and image load cost in the same breath, so a
 * second third-party frame on this page would cost her twice over. Inline SVG
 * also keeps the exact street address off the page, which
 * businessConfig.location.showExactAddressPublicly asks for.
 *
 * The viewBox is deliberately narrow and the type deliberately large within it.
 * SVG text scales with the rendered width, so a wide viewBox that reads well on
 * a desktop collapses to unreadable four-pixel labels on a phone — and she asked
 * how the site holds up on mobile. Capping the figure keeps the same type from
 * ballooning on a large screen.
 *
 * Deliberately schematic, and labelled as such — it conveys direction and
 * relative distance, not turn-by-turn navigation.
 */
export default function MastersRouteMap() {
  return (
    <figure className="border border-champagne/30 rounded-sm bg-linen p-4 sm:p-6 max-w-[480px]">
      <svg
        viewBox="0 0 440 330"
        className="w-full h-auto"
        role="img"
        aria-labelledby="route-title route-desc"
      >
        <title id="route-title">
          Route from KJ&apos;s River House to Augusta National Golf Club
        </title>
        <desc id="route-desc">
          A schematic map. The River House sits on the Savannah River southeast of
          Augusta National. KJ&apos;s back route covers the distance in under 15 minutes,
          while the main corridor into the tournament can hold traffic for two hours or
          more.
        </desc>

        {/* Savannah River */}
        <path
          d="M436 28 C 402 84, 424 128, 392 172 C 366 208, 380 246, 358 300"
          className="stroke-champagne/45"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
        />
        {/* Anchored well inside the right edge: the 60° rotation runs the label
            down-and-right, so a start point any further over clips it. */}
        <text
          x="366"
          y="90"
          className="fill-sage"
          fontSize="12"
          transform="rotate(60 366 90)"
        >
          Savannah River
        </text>

        {/* Congested main corridor, for contrast */}
        <path
          d="M40 268 C 108 252, 150 232, 196 200"
          className="stroke-clay/60"
          strokeWidth="2"
          strokeDasharray="3 4"
          fill="none"
        />
        <text x="24" y="292" className="fill-clay" fontSize="12.5">
          Main corridor · 2+ hrs
        </text>

        {/* KJ's back route */}
        <path
          d="M346 214 C 288 198, 236 172, 186 148 C 148 130, 124 116, 104 104"
          className="stroke-ink"
          strokeWidth="2.2"
          strokeDasharray="6 4"
          fill="none"
        />

        {/* Augusta National */}
        <circle cx="90" cy="96" r="7" className="fill-ink" />
        <circle cx="90" cy="96" r="13" className="fill-none stroke-ink/25" strokeWidth="1.3" />
        <text x="108" y="90" className="fill-ink" fontSize="15.5" fontWeight="600">
          Augusta National
        </text>
        <text x="108" y="107" className="fill-sage" fontSize="12.5">
          Tournament parking
        </text>

        {/* Downtown, the landmark between the two */}
        <circle cx="222" cy="166" r="4" className="fill-sage" />
        <text x="232" y="170" className="fill-sage" fontSize="12.5">
          Downtown
        </text>

        {/* The River House */}
        <circle cx="354" cy="220" r="7" className="fill-champagne" />
        <circle cx="354" cy="220" r="13" className="fill-none stroke-champagne/50" strokeWidth="1.3" />
        <text x="344" y="250" className="fill-ink" fontSize="15.5" fontWeight="600" textAnchor="end">
          The River House
        </text>
        <text x="344" y="267" className="fill-sage" fontSize="12.5" textAnchor="end">
          Three riverfront acres
        </text>

        {/* Drive time, sitting on the back route */}
        <g transform="translate(150 30)">
          <rect
            x="0"
            y="0"
            width="146"
            height="32"
            rx="3"
            className="fill-ivory stroke-champagne/50"
            strokeWidth="1"
          />
          <text
            x="73"
            y="21"
            className="fill-ink"
            fontSize="14.5"
            fontWeight="600"
            textAnchor="middle"
          >
            Under 15 minutes
          </text>
        </g>
      </svg>

      <figcaption className="font-manrope text-[11px] text-sage leading-relaxed mt-3">
        Schematic, not to scale. KJ shares the back route with every guest at booking —
        it approaches from the opposite side to the main tournament traffic.
      </figcaption>
    </figure>
  );
}
