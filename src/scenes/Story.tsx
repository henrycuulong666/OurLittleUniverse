import type { CSSProperties } from 'react';
import { site } from '../content/site';
import { chapters } from '../content/timeline';
import type { Chapter, ChapterGroup, MediaItem } from '../content/types';
import { Pixel } from '../components/Pixel';
import { sprites } from '../components/sprites';
import { Polaroid } from '../components/Polaroid';
import { Reveal } from '../components/Reveal';
import { Countdown } from '../components/Countdown';

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

function Items({ media, frame }: { media: MediaItem[]; frame: Frame }) {
  return (
    <>
      {media.map((m, i) => (
        <Reveal
          key={m.id}
          delay={(i % 3) * 0.09}
          variant={frame === 'postcard' ? 'rise' : 'pop'}
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
      <Items media={c.media} frame="polaroid" />
      <Pixel art={sprites.sparkle} size={4} className="lay__deco lay__deco--a" />
      <Pixel art={sprites.star} size={3} className="lay__deco lay__deco--b" />
    </div>
  );
}

function Postcards({ c }: { c: Chapter }) {
  return (
    <div className="lay lay--postcards">
      <Items media={c.media} frame="postcard" />
    </div>
  );
}

function Spotlight({ c }: { c: Chapter }) {
  return (
    <div className="lay lay--spotlight">
      <Items media={c.media} frame="plain" />
      <Pixel art={sprites.ring} size={7} className="lay__ring" />
      <Pixel art={sprites.heart} size={4} className="lay__deco lay__deco--a" />
      <Pixel art={sprites.sparkle} size={4} className="lay__deco lay__deco--b" />
    </div>
  );
}

function Arches({ c }: { c: Chapter }) {
  return (
    <div className="lay lay--arches">
      <div className="arches__row">
        <Items media={c.media} frame="arch" />
      </div>
      {c.countdown && (
        <Reveal delay={0.1}>
          <Countdown />
        </Reveal>
      )}
    </div>
  );
}

function MileGroups({ groups }: { groups: ChapterGroup[] }) {
  return (
    <div className="lay--milestones">
      {groups.map((g, gi) => (
        <section className={`mile ${gi % 2 ? 'mile--flip' : ''}`} key={g.title}>
          <Reveal className="mile__label">
            {g.date && <span className="mile__date">{g.date}</span>}
            <h4 className="mile__title">{g.title}</h4>
            {g.text && <p className="mile__text">{g.text}</p>}
          </Reveal>
          <div className="mile__photos">
            <Items media={g.media} frame="sticker" />
          </div>
        </section>
      ))}
    </div>
  );
}

function Milestones({ c }: { c: Chapter }) {
  return (
    <div className="lay">
      <MileGroups groups={c.groups ?? []} />
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
            <article key={c.id} className={`chapter chapter--${c.layout}`} style={{ '--i': i } as CSSProperties}>
              <ChapterHead c={c} flip={i % 2 === 1} />
              <Layout c={c} />
              {c.layout !== 'milestones' && c.groups && <MileGroups groups={c.groups} />}
            </article>
          );
        })}
      </div>
    </section>
  );
}
