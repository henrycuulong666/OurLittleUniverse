/**
 * Shared content types.
 *
 * All media paths are RELATIVE to `public/media/`.
 * Example: src: 'photos/ch1-01.jpg'  →  public/media/photos/ch1-01.jpg
 *
 * Every slot below is pre-declared with the filename it expects. Just drop a
 * file with that exact name into the folder and it shows up — no code change.
 * Missing files fall back to a cute placeholder that prints the expected path.
 */

/** width/height, e.g. '3/4' or '853/1280'. Filled in automatically from media-manifest.json. */
export type Ratio = string;

export interface MediaItem {
  id: string;
  kind: 'photo' | 'video';
  /** Path under public/media/, e.g. 'photos/ch1-01.jpg' or 'videos/clip.mp4'. */
  src: string;
  /** Sharper version for the fullscreen viewer, e.g. 'photos/full/ch1-01.jpg' (falls back to src). */
  full?: string;
  /** Poster frame for videos, e.g. 'posters/clip.jpg'. */
  poster?: string;
  /** Accessible description of the picture. Keep it short and human. */
  alt: string;
  /** Handwritten caption shown under the photo. */
  caption?: string;
  /** Free-form date label, e.g. 'Mùa hè 2022'. Leave out when unknown. */
  date?: string;
  /** Optional extra info (shown in the fullscreen viewer). */
  place?: string;
  /** width/height of the media. Reserves space so nothing jumps while loading. */
  ratio: Ratio;
  /** CSS object-position, e.g. 'center 30%' to keep faces in frame when cropped. */
  focus?: string;
  /** Slight rotation (degrees) for the scrapbook look. Auto-picked if omitted. */
  tilt?: number;
}

export type ChapterLayout = 'scatter' | 'postcards' | 'spotlight' | 'milestones' | 'arches';

export interface Chapter {
  id: string;
  /** Shown as pixel numeral, e.g. '01'. */
  number: string;
  title: string;
  /** Short intro line under the title. */
  blurb?: string;
  /** Free-form date label. Leave undefined until you know it. */
  date?: string;
  /** Show the wedding countdown banner under the chapter (used by the 'arches' layout). */
  countdown?: boolean;
  layout: ChapterLayout;
  /** Which pixel icon decorates the chapter. */
  icon: 'star' | 'heart' | 'ring' | 'hat' | 'bow';
  media: MediaItem[];
  /** Used by the 'milestones' layout: dated blocks, each with its own photos. */
  groups?: ChapterGroup[];
}

export interface ChapterGroup {
  title: string;
  date?: string;
  text?: string;
  media: MediaItem[];
}
