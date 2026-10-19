import type { Chapter } from './types';
import { photo, video } from './helpers';

/**
 * The story. One entry per chapter; each chapter has its own layout.
 * Photos come from scripts/media/build-media.py → public/media/.
 * `date` is free text — shown under the chapter title.
 */
export const chapters: Chapter[] = [
  {
    id: 'hoi-do',
    number: '01',
    title: 'Hồi mới quen',
    date: '1/4/2022',
    blurb: 'Hồi đó ox tính thuê pé chơi game thui. Ai ngờ thuê luôn cả đời, nhớ xuất hoá đơn.',
    layout: 'scatter',
    icon: 'star',
    media: [
      photo('ch1-01', { alt: 'Pé đội mũ gấu, chụp bằng filter', caption: 'pé gấu', tilt: -3 }),
      photo('ch1-02', { alt: 'Hai đứa selfie ôm nhau', caption: 'ôm cái là có ảnh', tilt: 2.5 }),
      video('ch1-04', { alt: 'Video pé chu môi với filter trái tim', caption: 'chu chu chu', tilt: -2 }),
      photo('ch1-03', { alt: 'Hai đứa selfie trước gương', caption: 'ôm dữ z trời', tilt: 1.8 }),
    ],
  },
  {
    id: 'di-dau-co-nhau',
    number: '02',
    title: 'Đi đâu cũng dính',
    blurb: 'Lần đầu lên Đà Lạt còn đi xe khách. Giờ đi Thái, Hàn lun rồi. Mốt còn đi đâu nửa ta?',
    layout: 'postcards',
    icon: 'heart',
    media: [
      photo('ch2-01', { alt: 'Hai đứa selfie trên đồi ở Đà Lạt', date: 'Đà Lạt · 1/2023', }),
      video('ch2-02', { alt: 'Ox dắt tay pé đi lên bậc thang buổi tối', date: 'Đà Lạt · 1/2023', caption: 'pé dắt ox đi chơi' }),
      photo('ch2-03', { alt: 'Hai đứa trên sân thượng nhìn ra thành phố', date: 'Thái Lan · 2025', caption: 'lần đầu đi Thái chơi' }),
      photo('ch2-04', { alt: 'Pé cười, ox mặt khó đăm đăm', date: 'Thái Lan · 2025', caption: 'pé cười quá zị' }),
      photo('ch2-05', { alt: 'Hai đứa mặc hanbok trước cung điện', date: 'Hàn Quốc · 3/2026', caption: 'Trẫm và ái khanh' }),
      photo('ch2-06', { alt: 'Ox diễn sâu trong bộ hanbok', date: 'Hàn Quốc · 3/2026', caption: 'Thần thiếp muốn sao?' }),
    ],
  },
  {
    id: 'she-said-yes',
    number: '03',
    title: 'She said yes!',
    date: 'Tháng 12/2025',
    blurb: 'Bí mật, không có kể cho ai nghe à',
    layout: 'spotlight',
    icon: 'ring',
    media: [
      photo('ch3-01', { alt: 'Pé che miệng ngạc nhiên' }),
      photo('ch3-02', { alt: 'Pé khoe chiếc nhẫn', caption: 'Trả lại là bị đòn' }),
      photo('ch3-03', { alt: 'Pé chỉ tay vào máy ảnh', caption: 'Lộn xộn' }),
    ],
    groups: [
      {
        title: 'Đi thử váy cưới',
        date: '4/10/2026',
        text: 'Chảy nước mín',
        media: [
          photo('ch3-04', { alt: 'Pé mặc váy cưới xòe lớn, đứng giữa tiệm váy' }),
          photo('ch3-05', { alt: 'Pé mặc váy ren, hai tay nâng tà váy' }),
          photo('ch3-06', { alt: 'Pé mặc váy trơn, liếc sang một bên', caption: 'Ê, nhìn thằng nào zị' }),
          photo('ch3-07', { alt: 'Pé mặc váy trơn, tay chống hông' }),
        ],
      },
    ],
  },
  {
    id: 'em-gioi-lam',
    number: '04',
    title: 'Bx hơm giỏi quá he',
    blurb: 'Năm nay vừa làm bà chủ vừa đậu thạc sĩ, vừa mới lấy bằng lái xe luôn he. Zỗ tay',
    layout: 'milestones',
    icon: 'hat',
    media: [],
    groups: [
      {
        title: 'Nhà nghỉ MyMy khai trương',
        date: '12/2/2026',
        text: 'Tự mở nhà nghỉ luôn zị bà chủ, cho 1 phòng 105 nhà vệ sinh không gián nha kkk.',
        media: [
          photo('ch4-01', { alt: 'Mặt tiền nhà nghỉ MyMy ngày khai trương', caption: 'Khai trương' }),
          photo('ch4-02', { alt: 'Pé ngồi ở quầy lễ tân', caption: 'bà chủ ngồi tính tiền' }),
          photo('ch4-03', { alt: 'Hai đứa chụp ảnh trong nhà nghỉ', caption: 'chụp ké bà chủ cái' }),
        ],
      },
      {
        title: 'Tốt nghiệp thạc sĩ UEH',
        date: '12/4/2026',
        text: 'Vừa làm chủ, vừa có bằng thạc sĩ, nhất bà xã iu vấu',
        media: [
          photo('ch4-04', { alt: 'Pé mặc áo cử nhân, cầm hoa', caption: 'thạc sĩ Nguyệt Lan' }),
          photo('ch4-05', { alt: 'Hai đứa cầm hoa chụp ảnh tốt nghiệp' }),
        ],
      },
    ],
  },
  {
    id: 'almost-married',
    number: '05',
    title: 'Almost married!',
    date: 'Lễ dạm ngõ · 27/4/2026',
    countdown: true,
    blurb: 'Hai bên gia đình gặp nhau xong, chính thức luôn rồi nha. Giờ đếm ngược tới ngày cưới nè.',
    layout: 'arches',
    icon: 'bow',
    media: [
      photo('ch5-01', { alt: 'Bảng Lễ Dạm Ngõ Hoàng và Lan', caption: 'Lên bảng đếm số' }),
      photo('ch5-02', { alt: 'Hai đứa cầm hoa trước bảng Lễ Dạm Ngõ', caption: 'Pé ôm pông' }),
      photo('ch5-03', { alt: 'Hai bên gia đình ngồi bên bàn tiệc' }),
      photo('ch5-04', { alt: 'Giỏ hoa và mâm quả' }),
    ],
  },
];
