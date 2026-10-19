# mình. — Our Little Universe

Web quà 20/10 cho vợ. Một trang kể chuyện (storybook + scrapbook), tối ưu cho iPhone Safari.
React + TypeScript + Vite. Không backend, không database, không dịch vụ trả phí.

## Chạy local

```bash
npm install
npm run dev        # http://localhost:5173  (mở bằng iPhone: dùng địa chỉ Network in ra, cùng wifi)
npm run build      # build production vào dist/
npm run preview    # xem thử bản build
```

## 6 scene

| # | Scene | File | Nội dung chỉnh ở đâu |
|---|-------|------|----------------------|
| 1 | Welcome | `src/scenes/Welcome.tsx` | `src/content/site.ts` → `welcome` |
| 2 | Our Story (4 chapter) | `src/scenes/Story.tsx` | `src/content/timeline.ts` |
| 3 | Little Moments (scrapbook) | `src/scenes/Moments.tsx` | `src/content/gallery.ts` |
| 4 | Twinkle Corner | `src/scenes/Twinkle.tsx` | `src/content/twinkle.ts` |
| 5 | A Little Surprise (hộp quà) | `src/scenes/Surprise.tsx` | `src/content/site.ts` → `surprise.message` |
| 6 | To be continued | `src/scenes/End.tsx` | `src/content/site.ts` → `ending` |

## Ảnh / video: từ `content-source/` ra `public/media/`

- `content-source/` = bản gốc chất lượng cao (782 MB), **bị gitignore**, không bao giờ deploy.
- `public/media/` = bản đã nén để deploy (~33 MB), **được commit**.
- Script `scripts/media/build-media.py` làm cầu nối (chỉ macOS, không cần cài thêm gì):

```bash
python3 scripts/media/build-media.py            # chỉ build file còn thiếu
python3 scripts/media/build-media.py --force    # build lại tất cả
```

Mỗi ảnh ra 2 bản: `photos/<tên>.jpg` (1280px — hiện trong thẻ) và `photos/full/<tên>.jpg` (2000px — khi chạm xem to).
Video → `videos/<tên>.mp4` (≤960px, H.264, ~1 MB) + `posters/<tên>.jpg`.
Kích thước thật được ghi vào `src/content/media-manifest.json` để trang giữ chỗ đúng tỉ lệ (không giật).

**Đổi/thêm ảnh:** sửa danh sách `PHOTOS` / `VIDEOS` đầu file `build-media.py` (tên ra ← file gốc),
chạy script, rồi khai báo trong `src/content/timeline.ts` hoặc `gallery.ts`:

```ts
photo('ch1-01', { alt: 'mô tả ngắn', caption: 'chữ viết tay dưới ảnh', date: 'Đà Lạt · 1/2023', focus: 'center 30%' })
video('m-04',   { alt: '…', caption: '…' })
```

File thiếu ⇒ hiện placeholder in ra tên file, không bao giờ hiện icon ảnh vỡ. Video không tự phát, chỉ chạy khi chạm.

## Twinkle corner

Cặp Twinkle trong diorama là ảnh đã tách nền (`public/media/figures/couple.webp`), tạo bằng Vision framework của macOS từ
`content-source/twinkle-twinkle-crush-on-you.jpg` (ảnh trên mạng). Khi có ảnh chụp thật của hai bé, cắt nền rồi thay file đó,
và thêm ảnh vào `photos` trong `src/content/twinkle.ts`. Lời thoại khi chạm: `twinkle.lines`.

## Nhạc nền (tuỳ chọn)

Mặc định **không có nút nhạc**. Thả file vào `public/media/audio/` rồi sửa `site.music.src`
trong `src/content/site.ts` (vd `'audio/our-song.mp3'`). Nút bật/tắt sẽ hiện góc trên phải;
nhạc luôn tắt lúc đầu, chỉ phát khi chạm. Chỉ dùng nhạc bạn có quyền dùng.

## Đổi chữ

- Lời trong hộp quà: `src/content/site.ts` → `surprise.message` (mỗi phần tử là một dòng).
- Tiêu đề, mô tả từng scene: cùng file đó.
- Tiêu đề / blurb / ngày của từng chapter: `src/content/timeline.ts`.
- Ngày cưới chính xác chưa có nên **không** hiện countdown; khi có thì thêm vào scene `End.tsx`.

## Deploy lên GitHub Pages

Chưa push gì lên đâu — khi sẵn sàng:

1. Tạo repo trên GitHub, rồi:
   ```bash
   git init && git add . && git commit -m "mình."
   git branch -M main
   git remote add origin git@github.com:<username>/<ten-repo>.git
   git push -u origin main
   ```
2. GitHub → repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Mỗi lần push lên `main`, workflow `.github/workflows/deploy.yml` tự build và deploy.
   Link: `https://<username>.github.io/<ten-repo>/`.

`vite.config.ts` dùng `base: './'` (đường dẫn tương đối) nên chạy đúng ở mọi sub-path mà không cần
điền tên repo. Nếu cần base tuyệt đối: `VITE_BASE=/ten-repo/ npm run build`.
Trang có `noindex` để Google không lập chỉ mục. Lưu ý: Pages công khai nếu ai có link.

## Cấu trúc code

```
src/
  content/      ← DỮ LIỆU: site.ts, timeline.ts, gallery.ts, twinkle.ts, types.ts
  scenes/       ← mỗi scene một file
  components/   ← Media (ảnh/video + placeholder), Polaroid (khung scrapbook), Lightbox,
                  Pixel + sprites (pixel art vẽ bằng chữ), StarField, Seal, Characters, …
  lib/          ← hooks (IntersectionObserver, parallax, reduced-motion), mediaUrl
  styles/       ← tokens.css (màu/font) · base.css · components.css · scenes.css
```

- **Thêm scene mới** (mini-game, v.v.): tạo `src/scenes/TenScene.tsx` với `<section id="…">`, thêm vào `src/App.tsx`
  (và `SCENES` trong `components/SceneNav.tsx` nếu muốn có chấm điều hướng).
- **Pixel art mới**: thêm lưới ký tự vào `components/sprites.ts`, dùng `<Pixel art={sprites.xxx} />`.
- **Màu / font**: `src/styles/tokens.css`.
- Motion: chỉ CSS animation + Web Animations API + IntersectionObserver. Tôn trọng `prefers-reduced-motion`.
