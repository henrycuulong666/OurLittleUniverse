import { useState, type CSSProperties } from 'react';
import type { MediaItem } from '../content/types';
import { mediaUrl } from '../lib/assetUrl';
import { useInView } from '../lib/hooks';
import { Pixel } from './Pixel';
import { sprites } from './sprites';

function hashTone(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 3;
}

/** Friendly stand-in shown until the real file exists. Prints the expected path. */
export function Placeholder({ item }: { item: Pick<MediaItem, 'id' | 'kind' | 'src' | 'alt'> }) {
  return (
    <div className="ph" data-tone={hashTone(item.id)} role="img" aria-label={`Chỗ trống cho: ${item.alt}`}>
      <Pixel
        art={item.kind === 'video' ? sprites.play : sprites.camera}
        size={4}
        palette={{ K: 'var(--champagne-deep)', C: 'var(--ivory)', W: 'var(--white)' }}
      />
      <span className="ph__path">{item.src}</span>
      <Pixel art={sprites.sparkle} size={3} className="ph__spark ph__spark--a" />
      <Pixel art={sprites.sparkle} size={2} className="ph__spark ph__spark--b" />
    </div>
  );
}

interface MediaProps {
  item: MediaItem;
  /** Load immediately (first screen / lightbox). Default is lazy. */
  eager?: boolean;
  className?: string;
}

/**
 * Renders a photo — or a video's poster — inside a box with a fixed aspect
 * ratio (so nothing shifts), a soft skeleton while loading, and a placeholder
 * if the file is missing. Never shows a broken-image icon.
 *
 * Videos: poster → first video frame → placeholder, whichever exists first.
 */
export function Media({ item, eager = false, className = '' }: MediaProps) {
  const isVideo = item.kind === 'video';
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  // For videos without a working poster, try the video's own first frame.
  const [tier, setTier] = useState<'poster' | 'frame' | 'none'>(isVideo && !item.poster ? 'frame' : 'poster');
  const [boxRef, near] = useInView<HTMLDivElement>({ rootMargin: '300px 0px' });

  const imgSrc = isVideo ? item.poster : item.src;
  const showImg = tier === 'poster' && !!imgSrc && state !== 'error';
  const showFrame = isVideo && tier === 'frame' && (eager || near);
  const showPlaceholder = tier === 'none';

  const fail = () => {
    if (isVideo && tier === 'poster') {
      setTier('frame');
      setState('loading');
    } else {
      setState('error');
      setTier('none');
    }
  };

  const style: CSSProperties = { aspectRatio: item.ratio, objectPosition: item.focus };

  return (
    <div ref={boxRef} className={`media ${className}`} data-state={state} style={{ aspectRatio: item.ratio }}>
      {showImg && (
        <img
          src={mediaUrl(imgSrc!)}
          alt={item.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          style={style}
          onLoad={() => setState('ready')}
          onError={fail}
        />
      )}
      {showFrame && (
        <video
          src={`${mediaUrl(item.src)}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          aria-label={item.alt}
          style={style}
          onLoadedData={() => setState('ready')}
          onError={fail}
        />
      )}
      {showPlaceholder && <Placeholder item={item} />}
      {isVideo && state === 'ready' && (
        <span className="media__play" aria-hidden="true">
          <Pixel art={sprites.play} size={4} palette={{ K: 'var(--charcoal)' }} />
        </span>
      )}
    </div>
  );
}
