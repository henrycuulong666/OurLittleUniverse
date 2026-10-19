import { useEffect, useRef, useState } from 'react';
import { site } from '../content/site';
import { mediaUrl } from '../lib/assetUrl';

/**
 * Optional background music. Hidden entirely until `site.music.src` is set.
 * Off by default; audio is only created on the first tap (autoplay-safe).
 */
export function MusicToggle() {
  const { src, volume, label } = site.music;
  const [on, setOn] = useState(false);
  const [broken, setBroken] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => audio.current?.pause(), []);
  if (!src || broken) return null;

  const toggle = async () => {
    if (!audio.current) {
      const a = new Audio(mediaUrl(src));
      a.loop = true;
      a.volume = volume;
      a.preload = 'none';
      a.addEventListener('error', () => setBroken(true));
      audio.current = a;
    }
    const a = audio.current;
    if (on) {
      a.pause();
      setOn(false);
    } else {
      try {
        await a.play();
        setOn(true);
      } catch {
        setOn(false);
      }
    }
  };

  return (
    <button type="button" className={`music ${on ? 'is-on' : ''}`} onClick={toggle} aria-pressed={on} aria-label={label}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        {on ? (
          <>
            <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
