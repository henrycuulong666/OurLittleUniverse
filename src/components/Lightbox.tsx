import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { MediaItem } from '../content/types';
import { mediaUrl } from '../lib/assetUrl';
import { Placeholder } from './Media';
import { useVideoDuck } from '../lib/music';

interface LightboxApi {
  open: (items: MediaItem[], index: number) => void;
}
const Ctx = createContext<LightboxApi>({ open: () => {} });
export const useLightbox = () => useContext(Ctx);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ items: MediaItem[]; index: number } | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((items: MediaItem[], index: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setState({ items, index });
  }, []);
  const close = useCallback(() => {
    setState(null);
    opener.current?.focus?.({ preventScroll: true });
  }, []);
  const api = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {state && <Viewer items={state.items} start={state.index} onClose={close} />}
    </Ctx.Provider>
  );
}

/** Sharp version first; if it's missing fall back to the card-size file, then to the placeholder. */
function FullImage({ item, onFail }: { item: MediaItem; onFail: () => void }) {
  const [useCard, setUseCard] = useState(!item.full);
  const src = useCard ? item.src : item.full!;
  return (
    <img
      className="lb__media"
      src={mediaUrl(src)}
      alt={item.alt}
      draggable={false}
      onError={() => (useCard ? onFail() : setUseCard(true))}
    />
  );
}

function Viewer({ items, start, onClose }: { items: MediaItem[]; start: number; onClose: () => void }) {
  const [index, setIndex] = useState(start);
  const [dir, setDir] = useState<'next' | 'prev' | 'none'>('none');
  const [failed, setFailed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number; t: number } | null>(null);
  const [dragDx, setDragDx] = useState(0);
  const duck = useVideoDuck();
  const item = items[index];
  const many = items.length > 1;

  const go = useCallback(
    (delta: number) => {
      if (items.length < 2) return;
      setDir(delta > 0 ? 'next' : 'prev');
      setFailed(false);
      setIndex((i) => (i + delta + items.length) % items.length);
    },
    [items.length],
  );

  // Lock page scroll + keyboard + focus handling.
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const f = rootRef.current?.querySelectorAll<HTMLElement>('button, video');
        if (!f || !f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [go, onClose]);

  // Warm the neighbours' images so swiping feels instant.
  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const n = items[(i + items.length) % items.length];
      if (n && n.kind === 'photo') new Image().src = mediaUrl(n.full ?? n.src);
    });
  }, [index, items]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('video, button')) return;
    drag.current = { x: e.clientX, y: e.clientY, t: Date.now() };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setDragDx(e.clientX - drag.current.x);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    setDragDx(0);
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) onClose();
  };

  return (
    <div
      className="lb"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        drag.current = null;
        setDragDx(0);
      }}
    >
      <button ref={closeRef} className="lb__btn lb__close" onClick={onClose} aria-label="Đóng">
        <span aria-hidden="true">✕</span>
      </button>
      {many && (
        <>
          <button className="lb__btn lb__nav lb__nav--prev" onClick={() => go(-1)} aria-label="Ảnh trước">
            <span aria-hidden="true">‹</span>
          </button>
          <button className="lb__btn lb__nav lb__nav--next" onClick={() => go(1)} aria-label="Ảnh sau">
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}

      <figure
        className={`lb__figure lb__figure--${dir}`}
        key={item.id}
        style={{ transform: dragDx ? `translateX(${dragDx * 0.5}px)` : undefined, transition: dragDx ? 'none' : undefined }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {item.kind === 'video' ? (
          failed ? (
            <div className="lb__ph"><Placeholder item={item} /></div>
          ) : (
            <video
              className="lb__media"
              src={mediaUrl(item.src)}
              poster={item.poster ? mediaUrl(item.poster) : undefined}
              controls
              playsInline
              preload="metadata"
              onPlay={duck.onPlay}
              onPause={duck.onPause}
              onEnded={duck.onEnded}
              onError={() => setFailed(true)}
            />
          )
        ) : failed ? (
          <div className="lb__ph"><Placeholder item={item} /></div>
        ) : (
          <FullImage key={item.id} item={item} onFail={() => setFailed(true)} />
        )}
        {(item.caption || item.date || item.place) && (
          <figcaption className="lb__cap">
            {item.caption && <span className="lb__caption">{item.caption}</span>}
            {(item.date || item.place) && <span className="lb__meta">{[item.date, item.place].filter(Boolean).join(' · ')}</span>}
          </figcaption>
        )}
      </figure>
      {many && (
        <p className="lb__count" aria-live="polite">
          {index + 1} / {items.length}
        </p>
      )}
    </div>
  );
}
