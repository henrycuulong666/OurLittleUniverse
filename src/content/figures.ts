import { ratioOf } from './helpers';

/**
 * The 13 small Twinkle Twinkle – Crush On You figures.
 * Images: public/media/figures/twinkle/<id>.webp (built by scripts/media/build-media.py).
 * Display names come straight from the original file names.
 *
 * `anim` is the idle animation (not every figure moves — most stay still):
 *   still · bob · tilt · sway · float · breathe
 */
export type FigureAnim = 'still' | 'bob' | 'tilt' | 'sway' | 'float' | 'breathe';

export interface Figure {
  id: string;
  name: string;
  src: string;
  /** Short description for screen readers (used when the figure is interactive). */
  alt: string;
  anim: FigureAnim;
}

const f = (id: string, name: string, alt: string, anim: FigureAnim): Figure => ({ id, name, alt, anim, src: `figures/twinkle/${id}.webp` });

export const figures: Figure[] = [
  f('secret-sweet-memories', 'Secret · Sweet Memories', 'Bé cupid ôm trái tim vàng đỏ trên cột đá nhỏ', 'still'),
  f('nerdy-cupid', 'Nerdy Cupid', 'Bé cupid đội trái tim đỏ trên đầu', 'tilt'),
  f('when-you-call', 'When You Call', 'Bé ôm chiếc điện thoại bàn có dây đỏ', 'sway'),
  f('i-hear-you', 'I Hear You', 'Bé đội nơ caro đứng trên chân đèn nến nhỏ', 'tilt'),
  f('blushing-moment', 'Blushing Moment', 'Bé đội mũ dâu tây, ôm bó hoa trắng', 'still'),
  f('candy-words', 'Candy Words', 'Bé đội mũ sô cô la, cầm bánh trái tim Be Mine', 'bob'),
  f('heart-unlocked', 'Heart Unlocked', 'Bé ngủ trong vỏ sò hình trái tim', 'breathe'),
  f('light-up', 'Light Up', 'Bé giơ cao cây kẹo hình trái tim', 'bob'),
  f('albatross-vow', "Albatross's Vow", 'Bé mặc bộ đồ chim hải âu trắng, cầm găng đỏ', 'still'),
  f('flower-bearer', 'Flower Bearer', 'Bé đội vòng hoa xanh, ôm chú thiên nga', 'float'),
  f('hold-myself-with-love', 'Hold Myself With Love', 'Bé thiên thần ôm một bé nhỏ hơn', 'float'),
  f('grow-grey-together', 'Grow Grey Together', 'Bé tóc bạc xù bông, đeo kính, có chú mèo bên cạnh', 'still'),
  f('till-were-old', "Till We're Old", 'Bé ông cụ đội mũ sinh nhật, râu trắng', 'tilt'),
];

export const figureById = Object.fromEntries(figures.map((x) => [x.id, x])) as Record<string, Figure>;

/** Natural width/height of a figure image (from the media manifest). */
export function figureRatio(fig: Figure): number {
  const [w, h] = ratioOf(fig.src, '1/1').split('/').map(Number);
  return w / h;
}

/* ───────────── where each figure lives ───────────── */

export interface Placement {
  figure: string;
  /** Which edge of the slot's container the figure is anchored to. */
  side: 'left' | 'right' | 'center';
  /** Height in px on phones (grows a little on wide screens). */
  size: number;
  /** px from that edge (center: offset from the middle; negative = peek outside). */
  x?: number;
  /** Sit on the container's top edge instead of its bottom edge. */
  onTop?: boolean;
  /** px up from the container's bottom edge (or from its top edge when onTop). */
  y?: number;
  rotate?: number;
  /** Mirror horizontally so the figure faces the other way. */
  flip?: boolean;
  enter?: 'pop' | 'rise' | 'peek';
  /** Tappable: hops, throws a heart, shows its name. Keep these few. */
  tap?: boolean;
  /** Entrance delay in seconds. */
  delay?: number;
}

/**
 * Curated, not everywhere: each slot is a spot in a scene.
 * Chapter breaks (`break:<chapter id>`) sit beside the pearl string between chapters.
 */
export const slots: Record<string, Placement[]> = {
  welcome: [
    { figure: 'nerdy-cupid', side: 'left', size: 92, x: 14, y: 96, rotate: -4, enter: 'peek', tap: true, delay: 3.4 },
    { figure: 'light-up', side: 'right', size: 104, x: 12, y: 120, rotate: 3, flip: true, enter: 'peek', tap: true, delay: 3.8 },
  ],

  'break:hoi-do': [{ figure: 'when-you-call', side: 'center', size: 96, x: 62, y: 4, rotate: 4, enter: 'rise' }],
  'break:di-dau-co-nhau': [{ figure: 'flower-bearer', side: 'center', size: 84, x: -66, y: 4, rotate: -3, enter: 'rise' }],
  'break:she-said-yes': [{ figure: 'secret-sweet-memories', side: 'center', size: 90, x: 64, y: 4, rotate: 3, enter: 'rise', tap: true }],
  'break:em-gioi-lam': [{ figure: 'hold-myself-with-love', side: 'center', size: 88, x: -64, y: 4, rotate: -3, enter: 'rise' }],
  'break:almost-married': [{ figure: 'i-hear-you', side: 'center', size: 100, x: 62, y: 4, rotate: 3, enter: 'rise' }],

  dress: [{ figure: 'blushing-moment', side: 'right', size: 82, x: 4, y: -4, rotate: 4, enter: 'pop' }],
  countdown: [{ figure: 'albatross-vow', side: 'right', size: 78, x: 10, y: 2, onTop: true, rotate: 4, enter: 'pop' }],

  'moments:1': [{ figure: 'candy-words', side: 'center', size: 92, x: 0, y: 4, enter: 'pop', tap: true }],
  'moments:2': [
    { figure: 'grow-grey-together', side: 'center', size: 96, x: -56, y: 4, enter: 'pop' },
    { figure: 'till-were-old', side: 'center', size: 100, x: 56, y: 4, enter: 'pop', delay: 0.15 },
  ],

  surprise: [{ figure: 'heart-unlocked', side: 'right', size: 64, x: -8, y: 6, enter: 'pop', tap: true, delay: 0.3 }],
};
