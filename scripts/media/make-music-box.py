#!/usr/bin/env python3
"""
Synthesizes the site's background loop: a slow music-box arrangement of "Twinkle, Twinkle, Little Star"
(the traditional 18th-century French melody "Ah! vous dirai-je, maman" — public domain).
Everything is generated here from scratch (additive synthesis + a small reverb): no samples, no recordings,
no copyrighted music. macOS only for the final AAC encode (afconvert).

    python3 scripts/media/make-music-box.py        ->  public/media/audio/music-box.m4a
"""
import math, os, random, struct, subprocess, tempfile, wave

SR = 24000
BPM = 70
BEAT = 60 / BPM
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'public', 'media', 'audio', 'music-box.m4a')

NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def hz(name, octave):  # equal temperament, A4 = 440
    return 440.0 * 2 ** ((NOTE[name] + 12 * (octave - 4) - 9) / 12)

# melody: (note, beats) — C5 register
A = [('C', 1), ('C', 1), ('G', 1), ('G', 1), ('A', 1), ('A', 1), ('G', 2)]
B = [('F', 1), ('F', 1), ('E', 1), ('E', 1), ('D', 1), ('D', 1), ('C', 2)]
C = [('G', 1), ('G', 1), ('F', 1), ('F', 1), ('E', 1), ('E', 1), ('D', 2)]
melody = A + B + C + C + A + B
# chords per 2 beats (root, third, fifth) in the C3-C4 area
CH = {'C': [('C', 3), ('E', 3), ('G', 3)], 'F': [('F', 3), ('A', 3), ('C', 4)], 'G': [('G', 2), ('B', 2), ('D', 3)]}
prog = (['C', 'C', 'F', 'C', 'F', 'C', 'G', 'C'] + ['C', 'F', 'C', 'G'] * 2 + ['C', 'C', 'F', 'C', 'F', 'C', 'G', 'C'])
# one chord per 2 beats; 6 phrases * 8 beats = 48 beats = 24 chords
prog = ['C', 'F', 'C', 'G',  'F', 'C', 'G', 'C',  'C', 'F', 'C', 'G',  'C', 'F', 'C', 'G',  'C', 'F', 'C', 'G',  'F', 'C', 'G', 'C']

TOTAL = 48 * BEAT + 5.0   # + reverb tail
buf = [0.0] * int(SR * TOTAL)

PARTIALS = [(1.0, 1.0, 1.0), (2.0, 0.42, 1.8), (3.01, 0.2, 2.6), (4.16, 0.1, 3.6)]  # (ratio, amp, decay speed-up)

def tine(freq, start, amp, tau, dur):
    n0 = int(start * SR)
    n = min(int(dur * SR), len(buf) - n0)
    for ratio, a, speed in PARTIALS:
        w = 2 * math.pi * freq * ratio / SR
        k = amp * a
        decay = math.exp(-speed / (tau * SR))
        env = 1.0
        for i in range(n):
            buf[n0 + i] += k * env * math.sin(w * i)
            env *= decay
    # tiny click-free fade at the cut-off
    fade = int(0.04 * SR)
    for i in range(max(0, n - fade), n):
        buf[n0 + i] *= max(0.0, (n - i) / fade) if False else 1.0

t = 0.0
for name, beats in melody:
    tine(hz(name, 5), t, 0.55, 0.85 * (1.4 if beats > 1 else 1), 2.4 if beats > 1 else 1.7)
    t += beats * BEAT

for idx, ch in enumerate(prog):
    start = idx * 2 * BEAT
    r, th, fi = CH[ch]
    seq = [r, th, fi, th]
    for j, (nm, oc) in enumerate(seq):
        tine(hz(nm, oc), start + j * 0.5 * BEAT, 0.22 if j else 0.3, 0.55, 1.5)

# ---- small Schroeder reverb
def comb(x, delay, gain):
    y = x[:]
    for i in range(delay, len(x)):
        y[i] += gain * y[i - delay]
    return y
def allpass(x, delay, gain):
    y = x[:]
    for i in range(delay, len(x)):
        y[i] = -gain * x[i] + x[i - delay] + gain * y[i - delay]
    return y

dry = buf
wet = [0.0] * len(dry)
for d, g in [(int(SR * 0.0297), 0.74), (int(SR * 0.0371), 0.72), (int(SR * 0.0411), 0.70), (int(SR * 0.0437), 0.68)]:
    c = comb(dry, d, g)
    for i, v in enumerate(c):
        wet[i] += v * 0.25
wet = allpass(allpass(wet, int(SR * 0.005), 0.5), int(SR * 0.0017), 0.5)
mix = [d * 0.78 + w * 0.16 for d, w in zip(dry, wet)]

peak = max(abs(v) for v in mix) or 1.0
scale = 0.82 / peak
# gentle fade-in/out so the loop restarts cleanly
fi, fo = int(0.02 * SR), int(0.6 * SR)
for i in range(fi):
    mix[i] *= i / fi
for i in range(fo):
    mix[-1 - i] *= i / fo

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with tempfile.TemporaryDirectory() as d:
    wav = os.path.join(d, 'mb.wav')
    with wave.open(wav, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v * scale)) * 32767)) for v in mix))
    subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-s', '3', wav, OUT], check=True)
print('wrote', os.path.relpath(OUT, ROOT), f'{os.path.getsize(OUT)//1024} KB', f'{TOTAL:.1f}s')
