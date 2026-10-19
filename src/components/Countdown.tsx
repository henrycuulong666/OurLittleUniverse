import { useEffect, useState } from 'react';
import { site } from '../content/site';
import { Pixel } from './Pixel';
import { sprites } from './sprites';

const target = new Date(site.wedding.at).getTime();

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

/** Wedding countdown banner. Date lives in src/content/site.ts → wedding.at */
export function Countdown() {
  const [left, setLeft] = useState(() => target - Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const { d, h, m, s } = parts(left);
  const over = left <= 0;
  const cells: [number, string][] = [[d, 'ngày'], [h, 'giờ'], [m, 'phút'], [s, 'giây']];
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="count" role="timer" aria-label={over ? site.wedding.done : `Còn ${d} ngày nữa là đến đám cưới ${site.wedding.label}`}>
      <div className="count__head">
        <Pixel art={sprites.bow} size={3} />
        <span>
          {site.wedding.title} · {site.wedding.label}
        </span>
        <Pixel art={sprites.hat} size={3} />
      </div>
      {over ? (
        <p className="count__done">{site.wedding.done}</p>
      ) : (
        <div className="count__grid" aria-hidden="true">
          {cells.map(([n, unit]) => (
            <div className="count__cell" key={unit}>
              <span className="count__num">{unit === 'ngày' ? n : pad(n)}</span>
              <span className="count__unit">{unit}</span>
            </div>
          ))}
        </div>
      )}
      <p className="count__sub">{site.wedding.sub}</p>
    </div>
  );
}
