import { useMemo, type CSSProperties } from 'react';
import { seeded } from '../lib/hooks';

interface StarFieldProps {
  count?: number;
  seed?: number;
  className?: string;
}

/**
 * Twinkling stars in 3 depth layers. Each layer shifts slightly with the
 * pointer (via the --px/--py CSS vars set by usePointerParallax on a parent).
 */
export function StarField({ count = 60, seed = 7, className = '' }: StarFieldProps) {
  const layers = useMemo(() => {
    const rnd = seeded(seed);
    const out: { x: number; y: number; s: number; d: number; t: number; cross: boolean; warm: boolean }[][] = [[], [], []];
    for (let i = 0; i < count; i++) {
      const layer = i % 3;
      const cross = rnd() > 0.72;
      out[layer].push({
        x: rnd() * 100,
        y: rnd() * 100,
        s: (layer === 0 ? 2 : layer === 1 ? 3 : 4) + (cross ? 5 : 0) + rnd() * 2,
        d: rnd() * 5,
        t: 2.6 + rnd() * 3.4,
        cross,
        warm: rnd() > 0.45,
      });
    }
    return out;
  }, [count, seed]);

  return (
    <div className={`starfield ${className}`} aria-hidden="true">
      {layers.map((stars, li) => (
        <div className={`starfield__layer starfield__layer--${li}`} key={li}>
          {stars.map((st, i) => (
            <i
              key={i}
              className={`star ${st.cross ? 'star--cross' : ''} ${st.warm ? 'star--warm' : ''}`}
              style={
                {
                  left: `${st.x}%`,
                  top: `${st.y}%`,
                  width: st.s,
                  height: st.s,
                  animationDelay: `${st.d}s`,
                  animationDuration: `${st.t}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
