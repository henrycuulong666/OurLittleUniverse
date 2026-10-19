import { useRef, type CSSProperties } from 'react';
import type { Figure } from '../content/figures';
import { figureRatio } from '../content/figures';
import { mediaUrl } from '../lib/assetUrl';
import { Pixel } from './Pixel';
import { sprites } from './sprites';

interface Props {
  figure: Figure;
  /** Rendered height in px. */
  height: number;
  className?: string;
  style?: CSSProperties;
  /** Called after the tap reaction (e.g. to also pop a bubble). */
  onTap?: () => void;
}

/**
 * A tappable little figure: a tiny hop, and a heart or star floats up.
 * Everything is imperative (Web Animations API) so nothing re-renders and several can be tapped at once.
 */
export function TwinkleCharacter({ figure, height, className = '', style, onTap }: Props) {
  const img = useRef<HTMLImageElement>(null);
  const fx = useRef<HTMLSpanElement>(null);
  const w = Math.round(height * figureRatio(figure));

  const react = () => {
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm) img.current?.animate(
      [
        { transform: 'translateY(0) scale(1, 1)' },
        { transform: 'translateY(-14px) scale(0.97, 1.05)', offset: 0.35 },
        { transform: 'translateY(0) scale(1.05, 0.94)', offset: 0.65 },
        { transform: 'translateY(0) scale(1, 1)' },
      ],
      { duration: 560, easing: 'cubic-bezier(.3,.9,.4,1)' },
    );
    const host = fx.current;
    if (host && !calm) {
      const h = document.createElement('i');
      h.className = Math.random() > 0.5 ? 'tw-char__heart' : 'tw-char__star';
      host.appendChild(h);
      const dx = (Math.random() - 0.5) * 26;
      const a = h.animate(
        [
          { opacity: 0, transform: 'translate(-50%, 6px) scale(0.4)' },
          { opacity: 1, transform: `translate(calc(-50% + ${dx / 2}px), -14px) scale(1)`, offset: 0.25 },
          { opacity: 0, transform: `translate(calc(-50% + ${dx}px), -52px) scale(0.9)` },
        ],
        { duration: 1300, easing: 'ease-out' },
      );
      a.onfinish = () => h.remove();
    }
    onTap?.();
  };

  return (
    <button
      type="button"
      className={`tw-char ${className}`}
      style={{ ...style, width: w, height }}
      onClick={react}
      aria-label={`Bé nhỏ: ${figure.alt}. Chạm để chào`}
    >
      <img
        ref={img}
        className="tw-fig"
        src={mediaUrl(figure.src)}
        alt=""
        width={w}
        height={height}
        loading="lazy"
        decoding="async"
        draggable={false}
        onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
      />
      <Pixel art={sprites.sparkle} size={3} className="tw-char__hint" />
      <span ref={fx} className="tw-char__fx" aria-hidden="true" />
    </button>
  );
}
