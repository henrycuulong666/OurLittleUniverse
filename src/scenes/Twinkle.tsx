import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { site } from '../content/site';
import { twinkle } from '../content/twinkle';
import { Pixel } from '../components/Pixel';
import { sprites } from '../components/sprites';
import { Reveal } from '../components/Reveal';
import { StarField } from '../components/StarField';
import { mediaUrl } from '../lib/assetUrl';
import { figures } from '../content/figures';
import { TwinkleCharacter } from '../components/TwinkleCharacter';
import { useIsVisible } from '../lib/hooks';

const SHELVES = [figures.slice(0, 7), figures.slice(7)];

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
  const stage = useRef<HTMLDivElement>(null);
  const [broken, setBroken] = useState(false);
  const [shelfRef, shelfLive] = useIsVisible<HTMLDivElement>({ threshold: 0.1 });

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // One persistent bubble: pop in, hold, fade out — restarted on every tap.
  useEffect(() => {
    const el = bubbleEl.current;
    if (!bubble || !el) return;
    el.getAnimations().forEach((a) => a.cancel());
    // Keep the bubble fully inside the diorama (narrow phones!) and point its tail at the speaker.
    const stageEl = stage.current;
    const pairEl = el.parentElement;
    if (stageEl && pairEl) {
      const s = stageEl.getBoundingClientRect();
      const p = pairEl.getBoundingClientRect();
      const bw = el.offsetWidth;
      const focus = p.left + p.width * (bubble.who === 'groom' ? 0.27 : bubble.who === 'bride' ? 0.73 : 0.5);
      const left = Math.min(Math.max(focus - bw / 2, s.left + 10), s.right - 10 - bw);
      el.style.left = `${left - p.left}px`;
      el.style.setProperty('--tail', `${Math.min(Math.max(focus - left, 16), bw - 16)}px`);
    }
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.animate(
      [
        { opacity: 0, transform: calm ? 'none' : 'translateY(10px) scale(0.5)', offset: 0 },
        { opacity: 1, transform: 'none', offset: 0.12, easing: 'ease-out' },
        { opacity: 1, transform: 'none', offset: 0.78 },
        { opacity: 0, transform: calm ? 'none' : 'translateY(-8px) scale(0.9)', offset: 1 },
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
          <div className="diorama" ref={stage}>
            <StarField count={44} seed={5} />
            <Pixel art={sprites.moon} size={6} className="diorama__moon" />
            <Pixel art={sprites.star} size={3} className="diorama__px diorama__px--a" />
            <Pixel art={sprites.sparkle} size={3} className="diorama__px diorama__px--b" />
            <Pixel art={sprites.star} size={4} className="diorama__px diorama__px--c" />
            {shooting > 0 && <span key={shooting} className="shooting" aria-hidden="true" />}
            <div className="diorama__hill" aria-hidden="true" />

            <div className="pair">
              <div ref={bubbleEl} className="pair__bubble" aria-hidden="true">
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

        <header className="shead shead--center shead--sub">
          <Reveal as="p" className="eyebrow">
            {site.shelf.eyebrow}
          </Reveal>
          <Reveal as="h3" delay={0.06} className="shead__title shead__title--sm">
            {site.shelf.title}
          </Reveal>
          <Reveal as="p" delay={0.12} className="shead__blurb">
            {site.shelf.blurb}
          </Reveal>
        </header>

        <Reveal variant="pop">
          <div className="cabinet shelf" ref={shelfRef} data-active={shelfLive}>
            {SHELVES.map((row, ri) => (
              <div key={ri}>
                <div className="shelf__row">
                  {row.map((fig) => (
                    <div className="shelf__slot" key={fig.id}>
                      <TwinkleCharacter figure={fig} height={118} className={`tw-anim--${fig.anim}`} />
                    </div>
                  ))}
                </div>
                <div className="shelf__plank" aria-hidden="true" />
              </div>
            ))}
            <p className="shelf__swipe" aria-hidden="true">
              {site.shelf.swipe} →
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
