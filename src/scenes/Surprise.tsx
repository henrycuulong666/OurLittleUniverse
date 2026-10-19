import { useEffect, useRef, useState } from 'react';
import { site } from '../content/site';
import { Pixel } from '../components/Pixel';
import { sprites } from '../components/sprites';
import { Reveal } from '../components/Reveal';
import { StarField } from '../components/StarField';
import { usePrefersReducedMotion } from '../lib/hooks';

type Phase = 'idle' | 'shake' | 'open';
const COLORS = ['#f8d878', '#fff7e0', '#d3303f', '#ebddbc', '#f8d878'];

function GiftBox() {
  return (
    <svg className="gift__svg" viewBox="0 0 240 250" aria-hidden="true">
      <defs>
        <linearGradient id="gBody" x1="0" x2="1">
          <stop offset="0" stopColor="#fff9ea" />
          <stop offset="0.7" stopColor="#fff3d3" />
          <stop offset="1" stopColor="#ebddbc" />
        </linearGradient>
        <linearGradient id="gLid" x1="0" x2="1">
          <stop offset="0" stopColor="#ffe9a8" />
          <stop offset="1" stopColor="#f3cf6c" />
        </linearGradient>
        <radialGradient id="gGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="238" rx="84" ry="9" fill="rgba(0,0,0,.35)" />
      <ellipse className="gift__glow" cx="120" cy="104" rx="120" ry="82" fill="url(#gGlow)" />

      {/* body */}
      <rect x="44" y="108" width="152" height="122" rx="13" fill="url(#gBody)" stroke="var(--champagne-deep)" strokeWidth="2" />
      <g fill="var(--butter)" opacity="0.9">
        {[[64, 140], [172, 150], [70, 192], [168, 204], [90, 168], [150, 178]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 6} l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z`} />
        ))}
      </g>
      <rect x="108" y="108" width="24" height="122" fill="var(--cherry)" />
      <rect x="127" y="108" width="5" height="122" fill="var(--cherry-deep)" opacity="0.35" />
      <rect x="44" y="108" width="152" height="12" rx="6" fill="#3b2a28" className="gift__inside" />

      {/* lid */}
      <g className="gift__lid">
        <rect x="32" y="80" width="176" height="40" rx="11" fill="url(#gLid)" stroke="#d8aa44" strokeWidth="2" />
        <rect x="108" y="80" width="24" height="40" fill="var(--cherry)" />
        <rect x="127" y="80" width="5" height="40" fill="var(--cherry-deep)" opacity="0.35" />
        {/* bow */}
        <path d="M120 78 C 96 40 62 54 72 72 C 80 84 108 82 120 78 Z" fill="var(--cherry)" stroke="var(--cherry-deep)" strokeWidth="2" />
        <path d="M120 78 C 144 40 178 54 168 72 C 160 84 132 82 120 78 Z" fill="var(--cherry)" stroke="var(--cherry-deep)" strokeWidth="2" />
        <path d="M84 62 Q100 66 114 76 M156 62 Q140 66 126 76" stroke="var(--cherry-deep)" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
        <rect x="109" y="68" width="22" height="18" rx="7" fill="var(--cherry)" stroke="var(--cherry-deep)" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** Scene 5 — the gift. Text lives in src/content/site.ts → surprise.message. */
export function Surprise() {
  const [phase, setPhase] = useState<Phase>('idle');
  const reduced = usePrefersReducedMotion();
  const burst = useRef<HTMLDivElement>(null);
  const msg = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const opened = phase === 'open';

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const confetti = () => {
    const host = burst.current;
    if (!host || reduced) return;
    const n = 30;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('i');
      const kind = i % 4 === 0 ? 'pt pt--dot' : 'pt';
      el.className = kind;
      el.style.background = COLORS[i % COLORS.length];
      const size = 6 + Math.random() * 9;
      el.style.width = el.style.height = `${size}px`;
      host.appendChild(el);
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
      const dist = 90 + Math.random() * 170;
      const x = Math.cos(ang) * dist;
      const y = Math.sin(ang) * dist;
      const anim = el.animate(
        [
          { transform: 'translate(-50%,-50%) scale(0) rotate(0deg)', opacity: 1 },
          { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1) rotate(${Math.random() * 200 - 100}deg)`, opacity: 1, offset: 0.55 },
          { transform: `translate(calc(-50% + ${x * 1.08}px), calc(-50% + ${y + 80}px)) scale(0.6) rotate(${Math.random() * 360}deg)`, opacity: 0 },
        ],
        { duration: 1500 + Math.random() * 900, easing: 'cubic-bezier(.2,.7,.3,1)', delay: Math.random() * 120, fill: 'forwards' },
      );
      anim.onfinish = () => el.remove();
    }
  };

  const openGift = () => {
    if (phase !== 'idle') return;
    setPhase(reduced ? 'open' : 'shake');
    const t1 = window.setTimeout(
      () => {
        setPhase('open');
        confetti();
        const t2 = window.setTimeout(() => msg.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }), 700);
        timers.current.push(t2);
      },
      reduced ? 0 : 650,
    );
    timers.current.push(t1);
  };

  const again = () => {
    setPhase('idle');
    document.getElementById('surprise')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section id="surprise" className={`scene scene--dark surprise is-${phase}`} aria-labelledby="surprise-title">
      <div className="scallop scallop--up scallop--night" aria-hidden="true" />
      <StarField count={48} seed={23} />
      <div className="wrap wrap--narrow surprise__inner">
        <Reveal as="p" className="eyebrow eyebrow--light">
          {site.surprise.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={0.06} className="surprise__prompt">
          <span id="surprise-title">{site.surprise.prompt}</span>
        </Reveal>

        <Reveal variant="pop" delay={0.12} className="gift-wrap">
          <div className="gift">
            <div className="gift__burst" ref={burst} aria-hidden="true" />
            <GiftBox />
          </div>
        </Reveal>

        {!opened && (
          <Reveal delay={0.2}>
            <button type="button" className="cta cta--gift" onClick={openGift} disabled={phase === 'shake'}>
              {site.surprise.cta}
            </button>
          </Reveal>
        )}

        <div className="msgbox" data-open={opened} ref={msg}>
          <div className="msgbox__clip" aria-live="polite">
            <div className="letter" aria-hidden={!opened}>
              <Pixel art={sprites.heart} size={3} className="letter__heart letter__heart--l" />
              <p className="letter__text">
                {site.surprise.message.map((line, i) => (
                  <span key={i} className={`letter__line ${line.startsWith('(') ? 'letter__line--aside' : ''}`} style={{ '--i': i } as React.CSSProperties}>
                    {line}
                  </span>
                ))}
              </p>
              <Pixel art={sprites.star} size={3} className="letter__heart letter__heart--r" />
            </div>
            <button type="button" className="linkbtn" onClick={again} tabIndex={opened ? 0 : -1}>
              {site.surprise.replay} ↺
            </button>
          </div>
        </div>
      </div>
      <div className="scallop scallop--down scallop--night" aria-hidden="true" />
    </section>
  );
}
