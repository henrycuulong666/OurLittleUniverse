import { site } from '../content/site';
import { Pixel } from '../components/Pixel';
import { sprites } from '../components/sprites';
import { StarField } from '../components/StarField';
import { Seal } from '../components/Seal';
import { TwinkleDecoration } from '../components/TwinkleDecoration';
import { usePointerParallax, usePrefersReducedMotion } from '../lib/hooks';
import { twinkle } from '../content/twinkle';
import { mediaUrl } from '../lib/assetUrl';

const LETTERS = ['m', 'ì', 'n', 'h', '.'];

/** Scene 1 — one tap to enter. Everything animates with CSS delays (no loading screen). */
export function Welcome() {
  const ref = usePointerParallax<HTMLElement>();
  const reduced = usePrefersReducedMotion();

  const enter = () =>
    document.getElementById('story')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  return (
    <section id="welcome" ref={ref} className="scene scene--dark welcome" aria-label="Mở đầu">
      <div className="welcome__glow" aria-hidden="true" />
      <StarField count={64} seed={11} />

      <div className="welcome__sprites" aria-hidden="true">
        <Pixel art={sprites.moon} size={7} className="ws ws--moon" />
        <Pixel art={sprites.star} size={4} className="ws ws--star1" />
        <Pixel art={sprites.sparkle} size={4} className="ws ws--sp1" />
        <Pixel art={sprites.sparkle} size={3} className="ws ws--sp2" />
      </div>

      <div className="welcome__inner">
        <p className="welcome__kicker">{site.welcome.kicker}</p>

        <h1 className="welcome__title" aria-label={site.title}>
          <span className="welcome__hat" aria-hidden="true">
            <Pixel art={sprites.hat} size={5} />
          </span>
          {LETTERS.map((ch, i) => (
            <span key={i} className={`welcome__letter ${ch === '.' ? 'is-dot' : ''}`} style={{ animationDelay: `${1.1 + i * 0.1}s` }} aria-hidden="true">
              {ch}
            </span>
          ))}
        </h1>

        <p className="welcome__tagline">{site.tagline}</p>

        <button type="button" className="cta" onClick={enter}>
          {site.welcome.cta}
        </button>
      </div>

      <TwinkleDecoration slot="welcome" />

      <div className="welcome__seal" aria-hidden="true">
        <Seal size={58} />
      </div>
      <img className="welcome__pair" src={mediaUrl(twinkle.couple)} alt="" aria-hidden="true" draggable={false} onError={(e) => (e.currentTarget.hidden = true)} />
      <div className="scallop scallop--down scallop--night" aria-hidden="true" />
    </section>
  );
}
