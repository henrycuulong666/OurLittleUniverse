/**
 * Tiny pixel-art sprites, drawn as text. One character = one pixel.
 * '.' is transparent. Letters map to the palette in Pixel.tsx:
 *   K charcoal · Y butter · y gold · R cherry · r deep cherry · W white · C champagne
 * Want a new decoration? Add a grid here and render <Pixel art={sprites.yours} />.
 */
export type Sprite = readonly string[];

export const sprites = {
  star: [
    '....Y....',
    '....Y....',
    '...YYY...',
    '.YYYYYYY.',
    'YYYYWYYYY',
    '.YYYYYYY.',
    '...YYY...',
    '....Y....',
    '....Y....',
  ],
  sparkle: [
    '..Y..',
    '..Y..',
    'YYWYY',
    '..Y..',
    '..Y..',
  ],
  heart: [
    '.RR...RR.',
    'RWRR.RRRR',
    'RRRRRRRRR',
    'RRRRRRRRR',
    '.RRRRRRR.',
    '..RRRRR..',
    '...RRR...',
    '....R....',
  ],
  ring: [
    '...W.W...',
    '..WWWWW..',
    '...WWW...',
    '....C....',
    '..yyyyy..',
    '.yY...Yy.',
    'yY.....Yy',
    'yY.....Yy',
    '.yY...Yy.',
    '..yyyyy..',
  ],
  hat: [
    '...KKKKK...',
    '...KWKKK...',
    '...KKKKK...',
    '...RRRRR...',
    '...KKKKK...',
    'KKKKKKKKKKK',
    '.KKKKKKKKK.',
  ],
  bow: [
    '.RR.....RR.',
    'RRRR...RRRR',
    'RRrRR.RRrRR',
    'RRRRRrRRRRR',
    'RRrRR.RRrRR',
    'RRRR...RRRR',
    '.RR.....RR.',
  ],
  camera: [
    '..KKK......',
    'KKKKKKKKKKK',
    'KKKKKCCKKKK',
    'KKKKCWWCKKK',
    'KKKKCWWCKKK',
    'KKKKKCCKKKK',
    'KKKKKKKKKKK',
  ],
  play: [
    'KK....',
    'KKKK..',
    'KKKKKK',
    'KKKKKK',
    'KKKK..',
    'KK....',
  ],
  moon: [
    '....YY.....',
    '..YYY......',
    '.YYY.......',
    '.YYY.......',
    'YYYY.......',
    'YYYY.......',
    'YYYY.......',
    '.YYYY......',
    '.YYYYYY..Y.',
    '..YYYYYYY..',
    '....YYY....',
  ],
} satisfies Record<string, Sprite>;

export type SpriteName = keyof typeof sprites;
