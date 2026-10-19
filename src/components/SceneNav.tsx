import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../lib/hooks';

export const SCENES = [
  { id: 'welcome', label: 'Mở đầu' },
  { id: 'story', label: 'Chuyện của mình' },
  { id: 'moments', label: 'Khoảnh khắc nhỏ' },
  { id: 'twinkle', label: 'Góc Twinkle' },
  { id: 'surprise', label: 'Bất ngờ nhỏ' },
  { id: 'end', label: 'To be continued' },
] as const;

/** Thin scroll-progress line (all sizes) + dot navigation (wide screens). */
export function SceneNav() {
  const [active, setActive] = useState<string>('welcome');
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const els = SCENES.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const bar = document.getElementById('progress');
    if (!bar) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  return (
    <>
      <div className="progress" aria-hidden="true">
        <div id="progress" className="progress__bar" />
      </div>
      <nav className="dots" aria-label="Các phần của trang">
        <ul>
          {SCENES.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className={`dots__btn ${active === s.id ? 'is-active' : ''}`}
                onClick={() => go(s.id)}
                aria-label={s.label}
                aria-current={active === s.id ? 'true' : undefined}
              >
                <span className="dots__label">{s.label}</span>
                <span className="dots__pip" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
