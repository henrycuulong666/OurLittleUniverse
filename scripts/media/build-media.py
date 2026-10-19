#!/usr/bin/env python3
"""
Builds the deployable media in public/media/ from the (git-ignored) originals in content-source/.

    python3 scripts/media/build-media.py            # only (re)builds files that are missing
    python3 scripts/media/build-media.py --force    # rebuild everything

macOS only (uses `sips`, AVFoundation and Vision through small Swift tools).
For every photo it writes two sizes:
    photos/<name>.jpg        1280px long side  -> what cards show (fast)
    photos/full/<name>.jpg   2000px long side  -> what the fullscreen viewer shows (sharp)
For every video:  videos/<name>.mp4 (≤960px, H.264)  +  posters/<name>.jpg
It also writes src/content/media-manifest.json (real pixel sizes, so the page reserves the right space).

To use a different photo: edit SELECTION below, run the script, then reference the new name in src/content/*.ts.
"""
import glob, io, json, os, subprocess, sys, tempfile
from PIL import Image, ImageCms, ImageOps

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'content-source')
OUT = os.path.join(ROOT, 'public', 'media')
BIN = os.path.join(os.path.dirname(__file__), '.bin')
FORCE = '--force' in sys.argv

CARD, FULL = 1280, 2000

# (out name, source file relative to content-source/)
PHOTOS = [
    # chapter 1 — hồi đó
    ('ch1-01', 'beginning/81C62BBF-F6B9-47BD-8BB1-D2869983172F.JPG'),
    ('ch1-02', 'beginning/IMG_7201.HEIC'),
    ('ch1-03', 'beginning/IMG_7242.HEIC'),
    # chapter 2 — đi đâu cũng có nhau
    ('ch2-01', 'da-lat_1-2023/CE22F045-010E-459B-8063-19E035C51C4F.jpg'),
    ('ch2-03', 'thailand_2025/DSCF3804.JPG'),
    ('ch2-04', 'thailand_2025/IMG_9970.HEIC'),
    ('ch2-05', 'korea_3-2026/DSCF5040.JPG'),
    ('ch2-06', 'korea_3-2026/DSCF5103.JPG'),
    # chapter 3 — she said yes
    ('ch3-01', 'proposal/DSCF4377.JPG'),
    ('ch3-02', 'proposal/DSCF4393.JPG'),
    ('ch3-03', 'proposal/DSCF4397.JPG'),
    # chapter 4 — em giỏi lắm luôn
    ('ch4-01', 'mymy-guest-house-openning/DSCF4447.JPG'),
    ('ch4-02', 'mymy-guest-house-openning/DSCF4450.JPG'),
    ('ch4-03', 'mymy-guest-house-openning/DSCF4474.JPG'),
    ('ch4-04', 'master-degree-graduation/DSCF5330.JPG'),
    ('ch4-05', 'master-degree-graduation/DSCF5379.JPG'),
    # chapter 5 — almost married
    ('ch5-01', 'dam-ngo/DSCF5527.JPG'),
    ('ch5-02', 'dam-ngo/DSCF5509.JPG'),
    ('ch5-03', 'dam-ngo/DSCF5493.JPG'),
    ('ch5-04', 'dam-ngo/DSCF5521.JPG'),
    # chapter 3 — thử váy cưới
    ('ch3-04', 'wedding-dress/NO_FUSION_1004_010.HEIC'),
    ('ch3-05', 'wedding-dress/NO_FUSION_1004_012.HEIC'),
    ('ch3-06', 'wedding-dress/NO_FUSION_1004_018.HEIC'),
    ('ch3-07', 'wedding-dress/NO_FUSION_1004_020.HEIC'),
    # the matching tattoos
    ('tattoo', 'tattoo/NO_FUSION_1010_004.HEIC'),
    # little moments
    ('m-01', 'nonsense-momments/IMG_0264.HEIC'),
    ('m-02', 'food-together/DSCF4891.JPG'),
    ('m-03', 'korea_3-2026/DSCF5184.JPG'),
    ('m-05', 'karting-liscense/DSCF5598.JPG'),
    ('m-06', 'korea_3-2026/DSCF5233.JPG'),
    ('m-07', 'nonsense-momments/IMG_0330.HEIC'),
    ('m-08', 'thailand_2025/IMG_9982.HEIC'),
    ('m-09', 'da-lat_1-2023/5AFFB545-B6E8-4564-926B-DFF4B1A59DB3.JPG'),
    ('m-11', 'food-together/IMG_9173.jpg'),
    ('m-12', 'nonsense-momments/IMG_3164.HEIC'),
    ('m-13', 'nonsense-momments/dji_mimo_20260612_122136_20260612122136_1781256590036_photo.JPG'),
    ('m-14', 'korea_3-2026/DSCF5126.JPG'),
    ('m-16', 'karting-liscense/DSCF5621.JPG'),
    ('m-17', 'nonsense-momments/IMG_0608.HEIC'),
    ('m-18', 'korea_3-2026/IMG_1500.HEIC'),
    ('m-19', 'food-together/DSCF6147.JPG'),
    ('m-21', 'da-lat_1-2023/IMG_7882.HEIC'),
    ('m-22', 'beginning/IMG_7210.JPG'),
    ('m-23', 'nonsense-momments/IMG_0885.HEIC'),
    ('m-24', 'thailand_2025/IMG_9978.HEIC'),
]
VIDEOS = [
    ('ch1-04', 'beginning/58fe06a2bcee43c1b046ff7616a90d79.MOV'),
    ('ch2-02', 'da-lat_1-2023/IMG_7883.MOV'),
    ('m-04', 'nonsense-momments/IMG_1104.MOV'),
    ('m-10', 'da-lat_1-2023/IMG_7909.MOV'),
    ('m-15', 'beginning/682bb174a7624f8e9c4b072f4ae6695d.MOV'),
    ('m-20', 'thailand_2025/ff59aaaf873545e8a1a0a378ece691e7.mov'),
]
# The 13 small Twinkle Twinkle figures (already cut out). out id -> file name inside content-source/twinkle-twinkle-crush-on-you/
FIGURES = {
    'secret-sweet-memories': '1768558213194____secret_sweet-memories____.png.webp',
    'nerdy-cupid': '1768558222047____nerdy-cupid____.png.webp',
    'when-you-call': '1768558230721____when-you-call____.png.webp',
    'i-hear-you': '1768558240374____i-hear-you____.png.webp',
    'blushing-moment': '1768558249363____blushing-moment____.png.webp',
    'candy-words': '1768558259828____candy-words____.png.webp',
    'heart-unlocked': '1768558268536____heart-unlocked____.png.webp',
    'light-up': '1768558276858____light-up____.png.webp',
    'albatross-vow': '1768558285630____albatross-s-vow____.png.webp',
    'flower-bearer': '1768558294609____flower-bearer____.png.webp',
    'hold-myself-with-love': '1768558304893____hold-myself-with-love____.png.webp',
    'grow-grey-together': '1768558315716____grow-grey-together____.png.webp',
    'till-were-old': '1768558324627____till-we-re-old____.png.webp',
}

POSTER_AT = {'m-10': 0.5}   # seconds, default 1.0

SRGB = ImageCms.createProfile('sRGB')


def tool(name):
    """Compile (once) and return the path of a Swift helper."""
    os.makedirs(BIN, exist_ok=True)
    exe = os.path.join(BIN, name)
    srcf = os.path.join(os.path.dirname(__file__), name + '.swift')
    if not os.path.exists(exe) or os.path.getmtime(exe) < os.path.getmtime(srcf):
        print(f'compiling {name}…')
        subprocess.run(['swiftc', '-O', srcf, '-o', exe], check=True, capture_output=True)
    return exe


def load(path):
    """Open any photo (HEIC via sips), honour EXIF rotation, convert to sRGB."""
    tmp = None
    if path.lower().endswith(('.heic', '.heif')):
        tmp = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False).name
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '95', path, '--out', tmp], check=True, capture_output=True)
        path = tmp
    im = Image.open(path)
    icc = im.info.get('icc_profile')
    im = ImageOps.exif_transpose(im)
    if icc:
        try:
            im = ImageCms.profileToProfile(im.convert('RGB'), ImageCms.ImageCmsProfile(io.BytesIO(icc)), SRGB)
        except Exception:
            pass
    im = im.convert('RGB')
    if tmp:
        os.remove(tmp)
    return im


def save(im, path, long_side, quality):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    w, h = im.size
    s = min(1, long_side / max(w, h))
    out = im.resize((round(w * s), round(h * s)), Image.LANCZOS) if s < 1 else im
    out.save(path, 'JPEG', quality=quality, optimize=True, progressive=True)
    return out.size


def main():
    manifest_path = os.path.join(ROOT, 'src', 'content', 'media-manifest.json')
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}

    for name, rel in PHOTOS:
        card = os.path.join(OUT, 'photos', f'{name}.jpg')
        full = os.path.join(OUT, 'photos', 'full', f'{name}.jpg')
        if not FORCE and os.path.exists(card) and os.path.exists(full) and f'photos/{name}.jpg' in manifest:
            continue
        im = load(os.path.join(SRC, rel))
        w, h = save(im, card, CARD, 80)
        save(im, full, FULL, 82)
        manifest[f'photos/{name}.jpg'] = {'w': w, 'h': h}
        print(f'photo  {name:8s} {w}x{h}  {os.path.getsize(card)//1024}KB / {os.path.getsize(full)//1024}KB')

    transcode, frame = None, None
    for name, rel in VIDEOS:
        mp4 = os.path.join(OUT, 'videos', f'{name}.mp4')
        poster = os.path.join(OUT, 'posters', f'{name}.jpg')
        if not FORCE and os.path.exists(mp4) and os.path.exists(poster) and f'videos/{name}.mp4' in manifest:
            continue
        transcode = transcode or tool('transcode')
        frame = frame or tool('frame')
        os.makedirs(os.path.dirname(mp4), exist_ok=True)
        os.makedirs(os.path.dirname(poster), exist_ok=True)
        subprocess.run([transcode, os.path.join(SRC, rel), mp4, '960', '1800'], check=True, capture_output=True)
        for junk in glob.glob(mp4 + '.sb-*'):   # AVFoundation leaves temp copies next to the output
            os.remove(junk)
        subprocess.run([frame, mp4, poster, str(POSTER_AT.get(name, 1.0))], check=True, capture_output=True)
        w, h = Image.open(poster).size
        manifest[f'videos/{name}.mp4'] = {'w': w, 'h': h}
        print(f'video  {name:8s} {w}x{h}  {os.path.getsize(mp4)//1024}KB')

    # Twinkle couple cut-out (background removed with Apple's Vision framework)
    couple = os.path.join(OUT, 'figures', 'couple.webp')
    if FORCE or not os.path.exists(couple):
        os.makedirs(os.path.dirname(couple), exist_ok=True)
        with tempfile.TemporaryDirectory() as d:
            subprocess.run([tool('cutout'), os.path.join(SRC, 'twinkle-twinkle-crush-on-you.jpg'), d], check=True, capture_output=True)
            im = Image.open(os.path.join(d, 'all.png')).convert('RGBA')
        im.save(couple, 'WEBP', quality=92, method=6)
        manifest['figures/couple.webp'] = {'w': im.size[0], 'h': im.size[1]}
        print('figure couple.webp', im.size)

    # Small Twinkle figures: drop the faint baked-in watermark (alpha <= 30), trim empty margins, keep colours as-is.
    for fid, fname in FIGURES.items():
        out = os.path.join(OUT, 'figures', 'twinkle', f'{fid}.webp')
        key = f'figures/twinkle/{fid}.webp'
        if not FORCE and os.path.exists(out) and key in manifest:
            continue
        os.makedirs(os.path.dirname(out), exist_ok=True)
        im = Image.open(os.path.join(SRC, 'twinkle-twinkle-crush-on-you', fname)).convert('RGBA')
        alpha = im.getchannel('A').point(lambda v: 0 if v <= 30 else v)
        im.putalpha(alpha)
        im = im.crop(alpha.getbbox())
        pad = 4
        canvas = Image.new('RGBA', (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
        canvas.alpha_composite(im, (pad, pad))
        canvas.save(out, 'WEBP', quality=94, method=6)
        manifest[key] = {'w': canvas.width, 'h': canvas.height}
        print(f'figure {fid:24s} {canvas.width}x{canvas.height}  {os.path.getsize(out)//1024}KB')

    # The "mình" tattoo design -> transparent seal (red ink on transparent), used instead of a drawn logo
    seal = os.path.join(OUT, 'figures', 'seal.webp')
    if FORCE or not os.path.exists(seal):
        src = Image.open(os.path.join(SRC, 'tattoo', 'EE5C77D2-3961-47E8-B47D-9E49C3C2912A.JPG')).convert('RGB')
        g = src.split()[1]                                   # white paper = 255, red ink = ~0
        alpha = g.point(lambda v: 0 if v > 215 else min(255, int((255 - v) * 1.3)))   # ignore paper noise
        ink = Image.new('RGBA', src.size, (211, 48, 63, 0))  # site's cherry red
        ink.putalpha(alpha)
        ink = ink.crop(ink.getchannel('A').point(lambda a: 255 if a > 90 else 0).getbbox())
        pad = round(max(ink.size) * 0.04)
        out = Image.new('RGBA', (ink.width + 2 * pad, ink.height + 2 * pad), (0, 0, 0, 0))
        out.alpha_composite(ink, (pad, pad))
        out.save(seal, 'WEBP', quality=95, method=6)
        out.resize((64, 64), Image.LANCZOS).save(os.path.join(ROOT, 'public', 'favicon-seal.png'))
        manifest['figures/seal.webp'] = {'w': out.width, 'h': out.height}
        print('seal.webp', out.size)

    json.dump(dict(sorted(manifest.items())), open(manifest_path, 'w'), indent=1)
    print('manifest ->', os.path.relpath(manifest_path, ROOT))


if __name__ == '__main__':
    main()
