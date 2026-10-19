import type { MediaItem, Ratio } from './types';
import manifest from './media-manifest.json';

const sizes = manifest as Record<string, { w: number; h: number }>;

/** Real width/height of a processed media file (so the page reserves the right space). */
export function ratioOf(path: string, fallback: Ratio = '4/5'): Ratio {
  const e = sizes[path];
  return e ? `${e.w}/${e.h}` : fallback;
}

type Extras = Pick<MediaItem, 'alt'> & Partial<Pick<MediaItem, 'caption' | 'date' | 'place' | 'focus' | 'tilt' | 'ratio'>>;

/**
 * photo('ch1-01', {...}) → public/media/photos/ch1-01.jpg (cards) + photos/full/ch1-01.jpg (viewer).
 * Both are produced by scripts/media/build-media.py.
 */
export function photo(id: string, o: Extras): MediaItem {
  const src = `photos/${id}.jpg`;
  return { id, kind: 'photo', src, full: `photos/full/${id}.jpg`, ...o, ratio: o.ratio ?? ratioOf(src) };
}

/** video('ch1-04', {...}) → videos/ch1-04.mp4 + posters/ch1-04.jpg */
export function video(id: string, o: Extras): MediaItem {
  const src = `videos/${id}.mp4`;
  return { id, kind: 'video', src, poster: `posters/${id}.jpg`, ...o, ratio: o.ratio ?? ratioOf(src, '9/16') };
}
