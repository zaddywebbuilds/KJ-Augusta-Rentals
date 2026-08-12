import manifest from '../data/imageManifest.json';

const BASE = '/KJ-Augusta-Rentals/assets/img';

type Manifest = Record<
  string,
  {
    width: number;
    height: number;
    aspect: number;
    srcset: { w: number; file: string }[];
    alt?: string;
  }
>;

const photos = manifest as Manifest;

interface PhotoProps {
  /** Manifest key, e.g. "photo_05" */
  id: string;
  /** Falls back to the host-written caption in the manifest when omitted. */
  alt?: string;
  className?: string;
  /**
   * Rendered width hint so the browser can pick the right file before layout.
   * Default assumes a full-width block on phones, half-width on desktop.
   */
  sizes?: string;
  /** Above-the-fold images load eagerly and skip lazy decoding. */
  priority?: boolean;
}

export default function Photo({
  id,
  alt,
  className,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px',
  priority = false,
}: PhotoProps) {
  const meta = photos[id];
  if (!meta) return null;

  const srcSet = meta.srcset.map(v => `${BASE}/${v.file} ${v.w}w`).join(', ');
  const fallback = `${BASE}/${meta.srcset[meta.srcset.length - 1].file}`;

  return (
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt ?? meta.alt ?? ''}
      width={meta.width}
      height={meta.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
    />
  );
}

/** Absolute URL for a given photo at the closest available width. */
export function photoUrl(id: string, width = 1600): string {
  const meta = photos[id];
  if (!meta) return '';
  const pick =
    meta.srcset.find(v => v.w >= width) ?? meta.srcset[meta.srcset.length - 1];
  return `${BASE}/${pick.file}`;
}

export function photoMeta(id: string) {
  return photos[id];
}
