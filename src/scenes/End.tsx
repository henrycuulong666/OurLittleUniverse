import { site } from '../content/site';
import { Pixel } from '../components/Pixel';
import { sprites } from '../components/sprites';
import { Reveal } from '../components/Reveal';
import { Seal } from '../components/Seal';
import { StarField } from '../components/StarField';
import { useInView } from '../lib/hooks';
import { Polaroid } from '../components/Polaroid';
import { photo } from '../content/helpers';

const tattoo = photo('tattoo', { alt: 'Hai cổ tay chụp sát nhau, mỗi tay một con dấu "mình" màu đỏ', tilt: -2 });

/** Scene 6 — a calm ending. No exact wedding date or countdown yet (by design). */
export function End() {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.5 });
  const { title, subtitle, footer } = site.ending;
  const dots = title.endsWith('...') ? title.slice(0, -3) : title;
  return (
    <section id="end" className="scene scene--cream end" aria-labelledby="end-title">
      <StarField count={22} seed={31} className="starfield--soft" />
      <div className="wrap wrap--narrow end__inner" ref={ref}>
        <Reveal className="end__sprites" variant="pop">
          <Pixel art={sprites.hat} size={5} className="end__hat" />
          <Pixel art={sprites.heart} size={4} className="end__heart" />
          <Pixel art={sprites.bow} size={5} className="end__bow" />
        </Reveal>

        <Reveal as="h2" delay={0.1} className="end__title">
          <span id="end-title">
            {dots}
            <span className="end__dots" aria-hidden="true">
              <i>.</i>
              <i>.</i>
              <i>.</i>
            </span>
            <span className="sr-only">...</span>
          </span>
        </Reveal>
        <Reveal as="p" delay={0.2} className="end__sub">
          {subtitle}
        </Reveal>

        <div className="end__seal">
          <Seal size={110} stamped={seen} />
        </div>
        <Reveal as="p" className="end__minh" delay={0.1}>
          {site.ending.minh}
        </Reveal>
        <Reveal className="end__tattoo" variant="pop" delay={0.15}>
          <Polaroid item={tattoo} group={[tattoo]} index={0} frame="polaroid" />
        </Reveal>

        <Reveal as="footer" delay={0.1} className="end__footer">
          {footer.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
