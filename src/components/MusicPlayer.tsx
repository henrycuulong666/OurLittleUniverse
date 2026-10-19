import { site } from '../content/site';
import { useMusic } from '../lib/music';

/** Tiny vinyl in the top-right corner. Hidden until a music file exists; off until tapped. */
export function MusicPlayer() {
  const { available, playing, blocked, toggle } = useMusic();
  if (!available) return null;
  const label = playing ? `${site.music.label}: đang bật, chạm để tắt` : `${site.music.label}: đang tắt, chạm để bật`;
  return (
    <button type="button" className={`music ${playing ? 'is-on' : ''} ${blocked ? 'is-blocked' : ''}`} onClick={toggle} aria-pressed={playing} aria-label={label} title={site.music.label}>
      <svg className="music__disc" viewBox="0 0 40 40" width="38" height="38" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#2f2825" />
        <circle cx="20" cy="20" r="14" fill="none" stroke="#4b403b" strokeWidth="1" />
        <circle cx="20" cy="20" r="10.5" fill="none" stroke="#4b403b" strokeWidth="1" />
        <path d="M7 14a14 14 0 0 1 8-7" stroke="#fffbf0" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <circle cx="20" cy="20" r="6.2" fill="#d3303f" />
        <path d="M21.6 15.8v6.1a2 2 0 1 1-1.1-1.8v-4.1l3.3.9v1.4l-2.2-.6z" fill="#fffbf0" />
      </svg>
      {playing && <span className="music__note" aria-hidden="true">♪</span>}
    </button>
  );
}
