import { site } from '../content/site';
import { gallery } from '../content/gallery';
import { Pixel } from '../components/Pixel';
import { sprites } from '../components/sprites';
import { Polaroid, type FrameStyle } from '../components/Polaroid';
import { Reveal } from '../components/Reveal';
import { FigureBreak } from '../components/TwinkleDecoration';
import { Fragment } from 'react';

/** The scrapbook is laid out in clusters; a little figure sits between them. [from, to) indexes into gallery. */
const CLUSTERS: [number, number][] = [[0, 8], [8, 16], [16, gallery.length]];

const FRAMES: FrameStyle[] = ['polaroid', 'taped', 'sticker', 'polaroid', 'sticker', 'taped'];

/** Scene 3 — scrapbook of photos & short videos (see src/content/gallery.ts). */
export function Moments() {
  return (
    <section id="moments" className="scene scene--paper moments" aria-labelledby="moments-title">
      <div className="scallop scallop--up scallop--paper" aria-hidden="true" />
      <div className="wrap">
        <header className="shead">
          <Reveal as="p" className="eyebrow">
            {site.moments.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={0.06} className="shead__title">
            <span id="moments-title">{site.moments.title}</span>
          </Reveal>
          <Reveal as="p" delay={0.12} className="shead__blurb">
            {site.moments.blurb}
          </Reveal>
        </header>

        {CLUSTERS.map(([from, to], ci) => (
          <Fragment key={from}>
            <div className="scrap">
              {gallery.slice(from, to).map((m, k) => {
                const i = from + k;
                return (
                  <Reveal key={m.id} delay={(k % 2) * 0.06} variant="quiet" className="scrap__item">
                    <Polaroid item={m} group={gallery} index={i} frame={FRAMES[i % FRAMES.length]} />
                  </Reveal>
                );
              })}
            </div>
            {ci < CLUSTERS.length - 1 && <FigureBreak slot={`moments:${ci + 1}`} pearls={false} />}
          </Fragment>
        ))}
      </div>
      <Pixel art={sprites.heart} size={5} className="moments__deco moments__deco--a" />
      <Pixel art={sprites.star} size={4} className="moments__deco moments__deco--b" />
      <div className="scallop scallop--down scallop--paper" aria-hidden="true" />
    </section>
  );
}
