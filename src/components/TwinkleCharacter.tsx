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
  /** Show the figure's name on tap (default on). */
  showName?: boolean;
}

/**
 * A tappable little figure: tiny hop, a heart floats up, its name pops up for a moment.
 * Everything is imperative (Web Animations API) so nothing re-renders and several can be tapped at once.
 */
export function TwinkleCharacter({ figure, height, className = '', style, onTap, showName = true }: Props) {
  const img = useRef<HTMLImageElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
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
    const t = tag.current;
    if (t && showName) {
      t.getAnimations().forEach((a) => a.cancel());
      t.style.marginLeft = '0px';
      const r = t.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const shift = r.left < 8 ? 8 - r.left : r.right > vw - 8 ? vw - 8 - r.right : 0;
      t.style.marginLeft = `${shift}px`;
      const rise = calm ? 0 : 8;
      t.animate(
        [
          { opacity: 0, transform: `translate(-50%, ${rise}px) scale(${calm ? 1 : 0.6})`, offset: 0 },
          { opacity: 1, transform: 'translate(-50%, 0) scale(1)', offset: 0.12, easing: 'ease-out' },
          { opacity: 1, transform: 'translate(-50%, 0) scale(1)', offset: 0.8 },
          { opacity: 0, transform: `translate(-50%, ${-rise * 0.75}px) scale(${calm ? 1 : 0.95})`, offset: 1 },
        ],
        { duration: 2200, fill: 'forwards' },
      );
    }
    const host = fx.current;
    if (host && !calm) {
      const h = document.createElement('i');
      h.className = 'tw-char__heart';
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
      aria-label={`${figure.name} — chạm để chào`}
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
      {showName && (
        <span ref={tag} className="tw-char__tag" aria-hidden="true">
          {figure.name}
        </span>
      )}
    </button>
  );
}
