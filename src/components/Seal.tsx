import { mediaUrl } from '../lib/assetUrl';

interface SealProps {
  /** Rendered width in px (height follows the artwork's proportions). */
  size?: number;
  /** Play the "stamp down" animation (toggle true when scrolled into view). */
  stamped?: boolean;
  className?: string;
}

/**
 * The "mình." seal — the real design from our matching tattoos.
 * Artwork: public/media/figures/seal.webp (built from content-source/tattoo by build-media.py).
 */
export function Seal({ size = 96, stamped = true, className = '' }: SealProps) {
  return (
    <img
      className={`seal ${stamped ? 'is-stamped' : ''} ${className}`}
      src={mediaUrl('figures/seal.webp')}
      width={size}
      height={Math.round(size * (519 / 557))}
      alt="mình."
      draggable={false}
    />
  );
}
