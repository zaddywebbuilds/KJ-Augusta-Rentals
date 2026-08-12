import { useEffect } from 'react';
import { photoUrl } from './Photo';

const SITE = 'https://kjaugustarentals.com';

/**
 * Per-route document head. The site is a static SPA, so titles, descriptions
 * and canonicals are set on mount rather than at build time.
 *
 * Crawlers that execute JavaScript (Google does) read these. The index.html
 * defaults cover crawlers that don't.
 */
export default function PageMeta({
  title,
  description,
  path,
  image,
  jsonLd,
}: {
  title: string;
  description: string;
  /** Route path, e.g. "/stays/upstairs-terrace". Canonicalised to kjaugustarentals.com. */
  path: string;
  /** Photo manifest id used for the social card. */
  image?: string;
  jsonLd?: Record<string, unknown>;
}) {
  useEffect(() => {
    document.title = title;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', SITE + path);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);

    if (image) {
      const abs = SITE + photoUrl(image, 1600);
      setMeta('property', 'og:image', abs);
      setMeta('name', 'twitter:image', abs);
    }

    setCanonical(SITE + path);

    if (!jsonLd) return;
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.dataset.route = 'true';
    tag.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(tag);
    return () => tag.remove();
  }, [title, description, path, image, jsonLd]);

  return null;
}

function setMeta(keyAttr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${keyAttr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(keyAttr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}
