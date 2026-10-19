import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { site } from '../content/site';
import { twinkle } from '../content/twinkle';
import { Pixel } from '../components/Pixel';
import { sprites } from '../components/sprites';
import { Reveal } from '../components/Reveal';
import { StarField } from '../components/StarField';
import { mediaUrl } from '../lib/assetUrl';

type Who = 'groom' | 'bride';

/** Scene 4 — a tiny interactive diorama. Tap the groom or the bride. */
export function Twinkle() {
  const [taps, setTaps] = useState(0);
  const [bubble, setBubble] = useState<{ who: Who | 'both'; text: string; key: number } | null>(null);
  const [hop, setHop] = useState<{ who: Who; key: number } | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [shooting, setShooting] = useState(0);
  const counts = useRef({ groom: 0, bride: 0 });
  const heartId = useRef(0);
  const timers = useRef<number[]>([]);
  const bubbleEl = useRef<HTMLDivElement>(null);
  const [broken, setBroken] = useState(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // One persistent bubble: pop in, hold, fade out — restarted on every tap.
  useEffect(() => {
    const el = bubbleEl.current;
    if (!bubble || !el) return;
    el.getAnimations().forEach((a) => a.cancel());
    el.animate(
      [
        { opacity: 0, transform: 'translateX(-50%) translateY(10px) scale(0.5)', offset: 0 },
        { opacity: 1, transform: 'translateX(-50%) translateY(0) scale(1)', offset: 0.12, easing: 'ease-out' },
        { opacity: 1, transform: 'translateX(-50%) translateY(0) scale(1)', offset: 0.78 },
        { opacity: 0, transform: 'translateX(-50%) translateY(-8px) scale(0.9)', offset: 1 },
      ],
      { duration: 2800, fill: 'forwards' },
    );
  }, [bubble]);
  const later = (fn: () => void, ms: number) => void timers.current.push(window.setTimeout(fn, ms));

  const tap = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    // keyboard "click" has no position → alternate between the two
    const x = e.clientX ? Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) : taps % 2 ? 0.75 : 0.25;
    const who: Who = x < 0.47 ? 'groom' : 'bride';
    const lines = twinkle.lines[who];
    const n = taps + 1;
    const special = n % 5 === 0;
    const text = special ? twinkle.special : lines[counts.current[who]++ % lines.length];

    setTaps(n);
    setHop({ who, key: n });
    setBubble({ who: special ? 'both' : who, text, key: n });
    const fresh = Array.from({ length: special ? 4 : 2 }, (_, i) => ({ id: ++heartId.current, x: x * 100 + (i - 0.5) * 9 + (Math.random() * 6 - 3) }));
    setHearts((h) => [...h, ...fresh]);
    later(() => setHearts((h) => h.filter((v) => !fresh.includes(v))), 1900);
    if (special) setShooting((k) => k + 1);
  };

  return (
    <section id="twinkle" className="scene scene--ivory twinkle" aria-labelledby="twinkle-title">
      <div className="wrap">
        <header className="shead shead--center">
          <Reveal as="p" className="eyebrow">
            {site.twinkle.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={0.06} className="shead__title">
            <span id="twinkle-title">{site.twinkle.title}</span>
          </Reveal>
          <Reveal as="p" delay={0.12} className="shead__blurb">
            {site.twinkle.blurb}
          </Reveal>
        </header>

        <Reveal variant="pop" className="diorama-wrap">
          <div className="diorama">
            <StarField count={44} seed={5} />
            <Pixel art={sprites.moon} size={6} className="diorama__moon" />
            <Pixel art={sprites.star} size={3} className="diorama__px diorama__px--a" />
            <Pixel art={sprites.sparkle} size={3} className="diorama__px diorama__px--b" />
            <Pixel art={sprites.star} size={4} className="diorama__px diorama__px--c" />
            {shooting > 0 && <span key={shooting} className="shooting" aria-hidden="true" />}
            <div className="diorama__hill" aria-hidden="true" />

            <div className="pair">
              <div ref={bubbleEl} className={`pair__bubble pair__bubble--${bubble?.who ?? 'both'}`} aria-hidden="true">
                {bubble?.text}
              </div>
              <button
                type="button"
                className={`pair__btn ${hop ? `is-hop-${hop.who}` : ''}`}
                key={hop?.key ?? 0}
                onClick={tap}
                aria-label="Chạm vào hai bé Twinkle Twinkle"
              >
                {broken ? (
                  <span className="pair__missing">{twinkle.couple}</span>
                ) : (
                  <img src={mediaUrl(twinkle.couple)} alt={twinkle.coupleAlt} draggable={false} onError={() => setBroken(true)} />
                )}
              </button>
              <div className="pair__hearts" aria-hidden="true">
                {hearts.map((h) => (
                  <Pixel key={h.id} art={sprites.heart} size={4} className="pair__heart" style={{ left: `${h.x}%` } as CSSProperties} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <p className="twinkle__hint">{twinkle.hint}</p>
        <p className="sr-only" aria-live="polite">
          {bubble?.text}
        </p>

      </div>
    </section>
  );
}
