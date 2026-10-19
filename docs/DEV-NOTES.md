# Ghi chú cho ox (để khỏi quên)

## Chạy local
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # kiểm tra build trước khi push
```

## Sửa chữ
- Chữ chung, lá thư trong hộp quà, ngày cưới, nhạc: `src/content/site.ts`
- Các chương + caption ảnh: `src/content/timeline.ts`
- Thư viện "Tủn tủn": `src/content/gallery.ts`
- Lời thoại 2 bé cô dâu chú rể: `src/content/twinkle.ts`
- Chỗ các bé Twinkle nhỏ đứng: `src/content/figures.ts`

## Thêm ảnh / video
Ảnh gốc để trong `content-source/` (không đưa lên GitHub). Thêm vào danh sách ở đầu file
`scripts/media/build-media.py`, chạy `python3 scripts/media/build-media.py` (chỉ macOS) để nén vào `public/media/`,
rồi khai báo trong `timeline.ts` hoặc `gallery.ts`.

## Nhạc nền
Một file duy nhất: `public/media/audio/music-box.m4a` (nhạc hộp tự tạo bằng `scripts/media/make-music-box.py`).
Muốn đổi bài: bỏ file mình có quyền dùng vào `public/media/audio/` rồi đổi `site.music.src`.

## Đưa lên web
Push lên nhánh `main` là GitHub tự build và cập nhật trang (khoảng 1–2 phút, xem ở tab Actions).

## Nhớ
- Đừng ghi ngày cầu hôn thật ở bất kỳ đâu trong code/chữ (trang này public).
- Commit trong `personal-projects/` tự dùng tên + email cá nhân (đã cấu hình trong `~/.gitconfig`).
