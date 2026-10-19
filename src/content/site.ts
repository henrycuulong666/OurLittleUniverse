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
   * Optional background music. Leave `src` empty to hide the toggle entirely.
   * Put your file in public/media/audio/ and set e.g. src: 'audio/our-song.mp3'.
   * Only use music you have the rights to — don't ship commercial tracks.
   */
  music: {
    src: '' as string,
    label: 'Nhạc nền',
    volume: 0.5,
  },
} as const;
