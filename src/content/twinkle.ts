/**
 * Scene 4 — the Twinkle corner.
 *
 * `couple` is a background-removed cut-out of the Twinkle Twinkle wedding pair
 * (made by scripts/media/build-media.py with Apple's Vision framework).
 * Replace it with a cut-out of your own figures any time (transparent PNG/WebP).
 */
export const twinkle = {
  couple: 'figures/couple.webp',
  coupleAlt: 'Hai bé Twinkle Twinkle: chú rể đội nón và cô dâu thắt nơ lớn, nắm tay nhau',
  hint: 'chạm vào từng bé nhé',

  /** Speech bubbles. Tap the left bé → groom lines; tap the right bé → bride lines. */
  lines: {
    groom: ['Chào bè chẽ hơm!', 'Ox đẹp trai hơm?', 'Nón này hợp ox dữ chưa?', 'Nắm tay ox nè, coi chừng đi lạc', 'Bè chẽ hơm của ox đây rồi!'],
    bride: ['Chào ăm chã húi!', 'Nơ này to hơm nè?', 'Ăm chã húi, đứng gần xíu coi.', 'Ox có thương pé hăm?', 'Hun mín coi'],
  },
  /** Every 5th tap: a shooting star and this line. */
  special: 'twinkle twinkle ✦',
};
