import type { MediaItem } from './types';
import { photo, video } from './helpers';

/**
 * "Little Moments" scrapbook. Order here = order on screen.
 * New photo? Add it to PHOTOS in scripts/media/build-media.py, run the script,
 * then add a line here.
 */
export const gallery: MediaItem[] = [
  photo('m-01', { alt: 'Pé giơ hai món đồ chơi nhỏ trước mặt', caption: 'hai bé này ở đâu ra zị' }),
  photo('m-02', { alt: 'Đĩa sashimi cá hồi', caption: 'omakase' }),
  photo('m-03', { alt: 'Pé đeo kính râm, tay ôm má', date: 'Hàn Quốc' }),
  video('m-04', { alt: 'Video quay pé đi phía trước' }),
  photo('m-05', { alt: 'Ox trong bộ đồ đua kart', caption: 'dắt đi lấy bằng đua xe' }),
  photo('m-06', { alt: 'Pé cầm đĩa cua sống', date: 'Hàn Quốc' }),
  photo('m-07', { alt: 'Pé quàng khăn xanh trên tàu' }),
  photo('m-08', { alt: 'Pé chu môi bên cạnh mấy bé capybara', caption: 'pé vs capybara', date: 'Thái Lan' }),
  photo('m-09', { alt: 'Hai đứa với filter khủng long', caption: '2 con khủm long' }),
  video('m-10', { alt: 'Hai ly nước cụng nhau lúc hoàng hôn', caption: 'zôoo', date: 'Đà Lạt' }),
  photo('m-11', { alt: 'Bát mì tôm', caption: 'tô mì quá đã' }),
  photo('m-12', { alt: 'Pé cười, tay ox đặt lên đầu pé' }),
  photo('m-13', { alt: 'Ox trên đỉnh núi giơ điện thoại có ảnh pé', caption: 'đưa pé lên đỉnh Hoàng Ngưu Sơn' }),
  photo('m-14', { alt: 'Pé trong bộ hanbok ở cổng xanh', caption: 'nàng hanbok', date: 'Hàn Quốc' }),
  video('m-15', { alt: 'Video pé với filter cún' }),
  photo('m-16', { alt: 'Ox cầm giấy chứng nhận kart bên cạnh xe' }),
  photo('m-17', { alt: 'Pé ôm bó hoa lớn trong xe' }),
  photo('m-18', { alt: 'Pé ngủ trên vai ox trên máy bay', caption: 'khò khò', date: 'Hàn Quốc' }),
  photo('m-19', { alt: 'Món ăn đường phố' }),
  video('m-20', { alt: 'Hai đứa selfie trong xe', caption: 'đi xe với pé', date: 'Thái Lan' }),
  photo('m-24', { alt: 'Pé nhăn mặt cầm món đồ lưu niệm bằng gỗ ở chợ Thái Lan', caption: 'Cái gì z trừi', date: 'Thái Lan' }),
  photo('m-21', { alt: 'Quán game với dàn máy tính', caption: 'chơi game nè' }),
  photo('m-22', { alt: 'Pé đứng rửa chén, quay lại nhìn máy ảnh', caption: 'nên phát huy' }),
  photo('m-23', { alt: 'Pé đắp mặt nạ nằm trên giường nhìn máy ảnh', caption: 'kkk' }),
];
