// GA4 Measurement ID — Google Analytics → Admin → Data Streams → Web.
// Until a real ID is pasted here, every function below is a no-op and the
// gtag script is never loaded, so an unconfigured deploy sends nothing.
const PLACEHOLDER = 'G-XXXXXXXXXX';
const MEASUREMENT_ID = PLACEHOLDER;

// The placeholder is itself a syntactically valid ID, so it has to be ruled
// out by value — a shape check alone would load gtag against a dead property.
const isConfigured =
  MEASUREMENT_ID !== PLACEHOLDER && /^G-[A-Z0-9]{6,}$/.test(MEASUREMENT_ID);

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function initAnalytics() {
  if (!isConfigured || window.gtag) return;

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(tag);

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => { window.dataLayer.push(args); };
  window.gtag('js', new Date());
  // Routing is client-side, so page views are sent per route instead.
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', name, params);
}
