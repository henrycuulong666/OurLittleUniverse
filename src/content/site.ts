/**
 * Global copy and settings. Everything the visitor reads that isn't a photo
 * caption lives here, so you can polish the wording without touching components.
 */
export const site = {
  title: 'mình.',
  tagline: 'Our Little Universe',

  welcome: {
    kicker: 'A little something, just for you.',
    cta: 'Zô coi có gì nè ✦',
  },

  story: {
    eyebrow: 'our story',
    title: 'Chuyện của mình',
    blurb: 'Vài chương nhỏ, kể theo trí nhớ của ox.',
  },

  moments: {
    eyebrow: 'little moments',
    title: 'Tủn tủn',
    blurb: 'Không dịp gì hết, toàn mấy khoảnh khắc tủn tủn. Bấm zô ảnh để xem nha pé.',
  },

  twinkle: {
    eyebrow: 'our little twinkle corner',
    title: 'Góc Twinkle của mình',
    blurb: 'Hai bé này ở nhà vẫn ngoan hông? Chạm vào từng bé coi.',
  },

  /** Scene 5 — the gift. Edit `message` freely; each string is one line. */
  surprise: {
    eyebrow: 'a little surprise',
    prompt: 'Ox có cái này cho pé.',
    cta: 'Mở thử đi ♡',
    replay: 'Xem lại lần nữa',
    message: [
      'Giờ pé tự mua được mọi thứ rùi.',
      'Nhưng lâu lâu ox vẫn muốn',
      'làm pé bất ngờ một chút.',
      'Chúc pé luôn xinh, luôn vui,',
      'luôn hạnh phúc bên ăm chã nhoaa,',
      'ráng kiếm thêm nhiều nhiều nửa để mua Bi em đúp cho ox nửa.',
      'Kkkk',
      '20/10 vui vẻ nha, mình. ♡',
    ],  },

  /** The big day. Drives the countdown banner (Vietnam time, UTC+7). */
  wedding: {
    at: '2027-02-20T00:00:00+07:00',
    label: '20/2/2027',
    title: 'Đám cưới',
    sub: 'Ox với pé về chung một nhà',
    done: 'Hôm nay là ngày cưới rồi nha!',
  },

  ending: {
    title: 'To be continued...',
    subtitle: '20/2/2027 — Our next chapter.',
    footer: ['Made for you.', 'By your favorite developer. ♡'],
    /** Why "mình"? Shown under the seal, with the photo of our matching tattoos. */
    minh: 'Đi xăm "mình" thiệt nè.',
  },

  /**
   * Background music: ONE local audio file, off until the listener taps the vinyl (top-right).
   * Default is an original music-box loop synthesized by scripts/media/make-music-box.py
   * (public-domain melody, no samples). To use your own track, put a file you have the rights to
   * in public/media/audio/ and change `src`. Leave `src` empty to hide the player.
   * (No YouTube/streaming: embeds can play ads, and ripping audio from YouTube isn't allowed.)
   */
  music: {
    src: 'audio/music-box.m4a' as string,
    label: 'Nhạc nền',
    volume: 0.5,
  },
} as const;
