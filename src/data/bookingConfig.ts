// Direct payment wiring.
//
// KJ takes card payments through her own Stripe account (PayPal optional as a
// second button), instead of losing Airbnb's host fee on every booking. There
// is no monthly software cost and no backend: a Stripe Payment Link is just a
// URL, which is why this works on a static build.
//
// Flow: guest sends dates through the request form -> KJ confirms against her
// calendar -> KJ sends the balance link. The deposit button below is the
// optional shortcut for guests who want to hold dates immediately.
//
// SETUP: create the links in Stripe (Payments -> Payment Links), paste the URLs
// here, and flip `enabled` to true. Money settles into KJ's account directly;
// nothing routes through us.

export const directPayment = {
  /** Leave false until the Stripe account is live and a test charge has been refunded. */
  enabled: false,

  /**
   * Fixed-amount Stripe Payment Link used to hold dates. Keep this in step with
   * `depositLabel` below so the button never promises a different number than
   * the checkout page charges.
   */
  depositUrl: '',
  depositLabel: 'Reserve your dates with a $500 deposit',

  /**
   * Optional PayPal button for guests who would rather not hand over a card.
   * Card via Stripe stays the default; this is a second option, not a
   * replacement. Leave empty to hide it.
   */
  paypalUrl: '',
} as const;
