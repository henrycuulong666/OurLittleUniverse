import type { CSSProperties } from 'react';
import type { Sprite } from './sprites';

const COLORS: Record<string, string> = {
  K: 'var(--charcoal)',
  Y: 'var(--butter)',
  y: 'var(--gold)',
  R: 'var(--cherry)',
  r: 'var(--cherry-deep)',
  W: 'var(--white)',
  C: 'var(--champagne)',
};

interface PixelProps {
  art: Sprite;
  /** CSS pixels per art pixel. */
  size?: number;
  /** Override individual letters, e.g. { K: 'var(--champagne-deep)' }. */
  palette?: Partial<Record<string, string>>;
  /** Accessible name. Omit for purely decorative sprites. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Renders a text sprite as crisp SVG rects (horizontal runs merged). */
export function Pixel({ art, size = 4, palette, label, className, style }: PixelProps) {
  const rows = art.length;
  const cols = Math.max(...art.map((r) => r.length));
  const rects: React.ReactElement[] = [];
  art.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') {
        x++;
        continue;
      }
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      const fill = palette?.[ch] ?? COLORS[ch] ?? 'currentColor';
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={fill} />);
      x = end;
    }
  });
  return (
    <svg
      className={className}
      style={style}
      width={cols * size}
      height={rows * size}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {rects}
    </svg>
  );
}
