import type { CSSProperties } from 'react';
import { figureById, figureRatio, slots, type Placement } from '../content/figures';
import { mediaUrl } from '../lib/assetUrl';
import { useEffect, useState } from 'react';
import { useIsVisible } from '../lib/hooks';
import { TwinkleCharacter } from './TwinkleCharacter';

function Item({ p }: { p: Placement }) {
  const fig = figureById[p.figure];
  // `live` follows the viewport (idle animations only run on screen); `seen` latches the first time.
  const [ref, live] = useIsVisible<HTMLDivElement>({ threshold: 0 });
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (live) setSeen(true);
  }, [live]);
  if (!fig) return null;
  const h = p.size;
  const w = Math.round(h * figureRatio(fig));
  const style = {
    '--h': `${h}px`,
    '--w': `${w}px`,
    '--x': `${p.x ?? 0}px`,
    '--y': `${p.y ?? 0}px`,
    '--rot': `${p.rotate ?? 0}deg`,
    '--flip': p.flip ? -1 : 1,
    '--delay': `${p.delay ?? 0}s`,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`tw-deco tw-deco--${p.side} tw-enter--${p.enter ?? 'pop'} ${p.onTop ? 'tw-deco--ontop' : ''} tw-anim--${fig.anim} ${seen ? 'is-in' : ''}`}
      data-active={live}
      style={style}
    >
      {p.tap ? (
        <TwinkleCharacter figure={fig} height={h} className="tw-deco__body" />
      ) : (
        <img
          className="tw-fig tw-deco__body"
          src={mediaUrl(fig.src)}
          alt=""
          aria-hidden="true"
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
        />
      )}
    </div>
  );
}

/**
 * Renders the figures configured for `slot` (see src/content/figures.ts).
 * Position: absolute inside the nearest positioned parent — give that parent `position: relative`.
 */
export function TwinkleDecoration({ slot }: { slot: string }) {
  const list = slots[slot];
  if (!list) return null;
  return (
    <>
      {list.map((p, i) => (
        <Item key={`${p.figure}-${i}`} p={p} />
      ))}
    </>
  );
}

/** A small vertical break (pearl string) with a figure sitting beside it. Used between chapters. */
export function FigureBreak({ slot, pearls = true }: { slot: string; pearls?: boolean }) {
  return (
    <div className={`fbreak ${pearls ? '' : 'fbreak--plain'}`} role="presentation">
      {pearls && <span className="fbreak__pearls" aria-hidden="true" />}
      <TwinkleDecoration slot={slot} />
    </div>
  );
}
