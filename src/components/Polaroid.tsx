import type { CSSProperties } from 'react';
import type { MediaItem } from '../content/types';
import { Media } from './Media';
import { useLightbox } from './Lightbox';

export type FrameStyle = 'polaroid' | 'taped' | 'sticker' | 'postcard' | 'arch' | 'plain';

interface PolaroidProps {
  item: MediaItem;
  /** The list this item belongs to + its index, so the viewer can swipe through siblings. */
  group: MediaItem[];
  index: number;
  frame?: FrameStyle;
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
}

const FALLBACK_TILTS = [-2.6, 1.8, -1.2, 2.8, -3, 1.3, -1.9, 2.2];

/** A scrapbook card: tappable media in a decorative frame + handwritten caption. */
export function Polaroid({ item, group, index, frame = 'polaroid', eager, className = '', style }: PolaroidProps) {
  const { open } = useLightbox();
  const tilt = frame === 'arch' ? 0 : (item.tilt ?? FALLBACK_TILTS[index % FALLBACK_TILTS.length]);
  const label = item.kind === 'video' ? `Xem video: ${item.alt}` : `Xem ảnh: ${item.alt}`;
  return (
    <figure
      className={`card card--${frame} ${item.kind === 'video' ? 'card--video' : ''} ${className}`}
      style={{ ...style, '--tilt': `${tilt}deg` } as CSSProperties}
    >
      {frame === 'taped' && <span className="tape tape--a" aria-hidden="true" />}
      {frame === 'taped' && <span className="tape tape--b" aria-hidden="true" />}
      {frame === 'polaroid' && <span className="tape tape--top" aria-hidden="true" />}
      <button type="button" className="card__btn" onClick={() => open(group, index)} aria-label={label}>
        <Media item={item} eager={eager} />
      </button>
      {(item.caption || item.date) && (
        <figcaption className="card__cap">
          {item.caption}
          {item.date && <small>{item.date}</small>}
        </figcaption>
      )}
    </figure>
  );
}
