import { Fragment, type CSSProperties } from 'react';
import { site } from '../content/site';
import { chapters } from '../content/timeline';
import type { Chapter, ChapterGroup, MediaItem } from '../content/types';
import { Pixel } from '../components/Pixel';
import { sprites } from '../components/sprites';
import { Polaroid } from '../components/Polaroid';
import { Reveal } from '../components/Reveal';
import { useMediaQuery } from '../lib/hooks';
import { Countdown } from '../components/Countdown';
import { FigureBreak, TwinkleDecoration } from '../components/TwinkleDecoration';

const ICONS = { star: sprites.star, heart: sprites.heart, ring: sprites.ring, hat: sprites.hat, bow: sprites.bow } as const;

function ChapterHead({ c, flip }: { c: Chapter; flip: boolean }) {
  return (
    <header className={`chead ${flip ? 'chead--flip' : ''}`}>
      <Reveal className="chead__top">
        <span className="chead__num">
          <span className="chead__label">chapter</span> {c.number}
        </span>
        <Pixel art={ICONS[c.icon]} size={4} className="chead__icon" />
      </Reveal>
      <Reveal as="h3" delay={0.06} className="chead__title">
        {c.title}
      </Reveal>
      {c.date && (
        <Reveal as="p" delay={0.1} className="chead__date">
          {c.date}
        </Reveal>
      )}
      {c.blurb && (
        <Reveal as="p" delay={0.14} className="chead__blurb">
          {c.blurb}
        </Reveal>
      )}
    </header>
  );
}

type Frame = 'polaroid' | 'postcard' | 'arch' | 'sticker' | 'plain';

/** 'land' for landscape media, 'port' for portrait/square — layouts size slots by this. */
function orientation(m: MediaItem): 'land' | 'port' {
  const [w, h] = m.ratio.split('/').map(Number);
  return w > h * 1.05 ? 'land' : 'port';
}

function Items({ media, frame, emphasis = 'quiet' }: { media: MediaItem[]; frame: Frame; emphasis?: 'quiet' | 'feature' }) {
  return (
    <>
      {media.map((m, i) => (
        <Reveal
          key={m.id}
          delay={(i % 3) * (emphasis === 'feature' ? 0.14 : 0.06)}
          variant={emphasis === 'feature' ? 'feature' : 'quiet'}
          className={`slot slot--${i + 1} slot--${orientation(m)}`}
        >
          <Polaroid item={m} group={media} index={i} frame={frame} />
        </Reveal>
      ))}
    </>
  );
}

function Scatter({ c }: { c: Chapter }) {
  return (
    <div className="lay lay--scatter">
      <Items media={c.media} frame="polaroid" emphasis={c.emphasis} />
    </div>
  );
}

/**
 * Spread the cards over `cols` columns so the columns end at nearly the same height.
 * Heights come from each photo's real aspect ratio (+ frame and caption), so a tall video beside a small
 * landscape no longer leaves a hole. Cards keep their order inside each column.
 * Tries every assignment (a handful of cards → at most a few hundred combinations).
 */
function balanceColumns(media: MediaItem[], cols: number): { m: MediaItem; i: number }[][] {
  const est = media.map((m) => {
    const [w, h] = m.ratio.split('/').map(Number);
    return h / w + 0.16 + (m.caption || m.date ? 0.1 : 0);
  });
  const stagger = (k: number) => (k % 2 ? 0.16 : 0); // every other column starts a little lower (scrapbook feel)
  const n = media.length;
  let best: number[] = new Array(n).fill(0);
  let bestCost = Infinity;
  const cur: number[] = new Array(n).fill(0);
  const walk = (i: number) => {
    if (i === n) {
      const hs = Array.from({ length: cols }, (_, k) => stagger(k));
      cur.forEach((k, j) => (hs[k] += est[j]));
      // "reading order" tie-break: prefer assignments that stay close to left-to-right, top-to-bottom
      let disorder = 0;
      for (let j = 1; j < n; j++) if (cur[j] < cur[j - 1]) disorder += 0.01;
      const cost = Math.max(...hs) - Math.min(...hs) + disorder;
      if (cost < bestCost - 1e-9) {
        bestCost = cost;
        best = cur.slice();
      }
      return;
    }
    for (let k = 0; k < cols; k++) {
      cur[i] = k;
      walk(i + 1);
    }
  };
  if (cols ** n <= 20000) walk(0);
  else media.forEach((_, j) => (best[j] = j % cols));
  const out: { m: MediaItem; i: number }[][] = Array.from({ length: cols }, () => []);
  media.forEach((m, i) => out[best[i]].push({ m, i }));
  return out;
}

function Postcards({ c }: { c: Chapter }) {
  const wide = useMediaQuery('(min-width: 820px)');
  const columns = balanceColumns(c.media, wide ? 3 : 2);
  return (
    <div className="lay lay--postcards">
      {columns.map((col, ci) => (
        <div className="pc__col" key={ci}>
          {col.map(({ m, i }) => (
            <Reveal key={m.id} delay={(i % 3) * 0.06} variant={c.emphasis === 'feature' ? 'feature' : 'quiet'} className={`slot slot--${i + 1}`}>
              <Polaroid item={m} group={c.media} index={i} frame="postcard" />
            </Reveal>
          ))}
        </div>
      ))}
    </div>
  );
}

function Spotlight({ c }: { c: Chapter }) {
  return (
    <div className="lay lay--spotlight">
      <Items media={c.media} frame="plain" emphasis={c.emphasis} />
      <Pixel art={sprites.ring} size={7} className="lay__ring" />
      <Pixel art={sprites.heart} size={4} className="lay__deco lay__deco--a" />
    </div>
  );
}

function Arches({ c }: { c: Chapter }) {
  return (
    <div className="lay lay--arches">
      <div className="arches__row">
        <Items media={c.media} frame="arch" emphasis={c.emphasis} />
      </div>
      {c.countdown && (
        <Reveal delay={0.1}>
          <Countdown />
        </Reveal>
      )}
    </div>
  );
}

function MileGroups({ groups, emphasis }: { groups: ChapterGroup[]; emphasis?: 'quiet' | 'feature' }) {
  return (
    <div className="lay--milestones">
      {groups.map((g, gi) => (
        <section className={`mile ${gi % 2 ? 'mile--flip' : ''}`} key={g.title}>
          <Reveal className={`mile__label ${g.slot ? 'mile__label--deco' : ''}`}>
            {g.slot && <TwinkleDecoration slot={g.slot} />}
            {g.date && <span className="mile__date">{g.date}</span>}
            <h4 className="mile__title">{g.title}</h4>
            {g.text && <p className="mile__text">{g.text}</p>}
          </Reveal>
          <div className="mile__photos">
            <Items media={g.media} frame="sticker" emphasis={emphasis} />
          </div>
        </section>
      ))}
    </div>
  );
}

function Milestones({ c }: { c: Chapter }) {
  return (
    <div className="lay">
      <MileGroups groups={c.groups ?? []} emphasis={c.emphasis} />
    </div>
  );
}

const LAYOUTS = { scatter: Scatter, postcards: Postcards, spotlight: Spotlight, milestones: Milestones, arches: Arches } as const;

/** Scene 2 — data-driven chapters (see src/content/timeline.ts). */
export function Story() {
  return (
    <section id="story" className="scene scene--ivory story" aria-labelledby="story-title">
      <div className="wrap">
        <header className="shead">
          <Reveal as="p" className="eyebrow">
            {site.story.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={0.06} className="shead__title" >
            <span id="story-title">{site.story.title}</span>
          </Reveal>
          <Reveal as="p" delay={0.12} className="shead__blurb">
            {site.story.blurb}
          </Reveal>
        </header>

        {chapters.map((c, i) => {
          const Layout = LAYOUTS[c.layout];
          return (
            <Fragment key={c.id}>
            <FigureBreak slot={`break:${c.id}`} />
            <article className={`chapter chapter--${c.layout}`} style={{ '--i': i } as CSSProperties}>
              <ChapterHead c={c} flip={i % 2 === 1} />
              <Layout c={c} />
              {c.layout !== 'milestones' && c.groups && <MileGroups groups={c.groups} emphasis={c.emphasis} />}
            </article>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
