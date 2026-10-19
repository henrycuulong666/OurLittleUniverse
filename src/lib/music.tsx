import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { site } from '../content/site';
import { mediaUrl } from './assetUrl';

interface MusicApi {
  /** A playable file exists (site.music.src). The control stays hidden otherwise. */
  available: boolean;
  /** The listener asked for music (it can still be ducked while a video plays). */
  playing: boolean;
  /** True when something blocked playback (autoplay policy, bad file…). */
  blocked: boolean;
  toggle: () => void;
  /** Call when a gallery video starts / stops — music steps aside and comes back by itself. */
  videoStarted: () => void;
  videoStopped: () => void;
}

const Ctx = createContext<MusicApi>({ available: false, playing: false, blocked: false, toggle: () => {}, videoStarted: () => {}, videoStopped: () => {} });
export const useMusic = () => useContext(Ctx);

/**
 * One <audio> element for the whole site (local licensed file only — no streaming/embeds).
 * Off by default; only starts after a tap; pauses while a gallery video plays.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const { src, volume } = site.music;
  const [available, setAvailable] = useState(false);
  const [want, setWant] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [videos, setVideos] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef<number>(0);

  // Is there really an audio file? (A missing file on a dev server answers with index.html.)
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    fetch(mediaUrl(src), { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') ?? '';
        if (!cancelled && r.ok && /audio|mp4|mpeg|ogg|wav/i.test(type) && !/html/i.test(type)) setAvailable(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  const ramp = useCallback((el: HTMLAudioElement, to: number, then?: () => void) => {
    cancelAnimationFrame(fade.current);
    const from = el.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / 450);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) fade.current = requestAnimationFrame(step);
      else then?.();
    };
    fade.current = requestAnimationFrame(step);
  }, []);

  // Keep the element in sync with: the listener's wish && no video playing.
  const shouldPlay = want && videos === 0;
  useEffect(() => {
    if (!available) return;
    if (shouldPlay) {
      if (!audio.current) {
        const a = new Audio(mediaUrl(src));
        a.loop = true;
        a.preload = 'auto';
        a.volume = 0;
        a.addEventListener('error', () => {
          setAvailable(false);
          setWant(false);
        });
        audio.current = a;
      }
      const a = audio.current;
      a.play().then(
        () => {
          setBlocked(false);
          ramp(a, volume);
        },
        () => {
          setBlocked(true);
          setWant(false);
        },
      );
    } else if (audio.current && !audio.current.paused) {
      const a = audio.current;
      ramp(a, 0, () => a.pause());
    }
  }, [shouldPlay, available, src, volume, ramp]);

  useEffect(
    () => () => {
      cancelAnimationFrame(fade.current);
      audio.current?.pause();
    },
    [],
  );

  const api = useMemo<MusicApi>(
    () => ({
      available,
      playing: want,
      blocked,
      toggle: () => setWant((w) => !w),
      videoStarted: () => setVideos((n) => n + 1),
      videoStopped: () => setVideos((n) => Math.max(0, n - 1)),
    }),
    [available, want, blocked],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

/** Handlers for a <video>: pauses the background music while it plays. Safe to call twice / on unmount. */
export function useVideoDuck() {
  const { videoStarted, videoStopped } = useMusic();
  const on = useRef(false);
  const start = useCallback(() => {
    if (!on.current) {
      on.current = true;
      videoStarted();
    }
  }, [videoStarted]);
  const stop = useCallback(() => {
    if (on.current) {
      on.current = false;
      videoStopped();
    }
  }, [videoStopped]);
  useEffect(() => stop, [stop]);
  return { onPlay: start, onPause: stop, onEnded: stop };
}
