# Grille de tempo d'une musique (methode music-beat-sync : onsets -> ajustement d'une grille reguliere
# par moindres carres) et energie par mesure, sans librosa. Usage : python analyse_bgm.py musique.mp3
import json
import subprocess
import sys

import numpy as np

SR = 22050
HOP = 128  # 5,8 ms
NFFT = 1024


def lire(chemin):
    brut = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", chemin, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(brut, dtype=np.float32)


x = lire(sys.argv[1])
duree = len(x) / SR
n = 1 + (len(x) - NFFT) // HOP
fen = np.hanning(NFFT).astype(np.float32)
idx = np.arange(NFFT)[None, :] + HOP * np.arange(n)[:, None]
spec = np.abs(np.fft.rfft(x[idx] * fen, axis=1))
freqs = np.fft.rfftfreq(NFFT, 1 / SR)
logs = np.log1p(100 * spec)
flux = np.maximum(0, np.diff(logs, axis=0))
basse = flux[:, freqs[1:] < 160].sum(axis=1) if False else flux[:, (freqs < 160)].sum(axis=1)
total = flux.sum(axis=1)
fps_env = SR / HOP


def norm(v):
    v = v - np.convolve(v, np.ones(64) / 64, mode="same")
    v = np.maximum(v, 0)
    return v / (v.max() + 1e-9)


env_b = norm(basse)
env_t = norm(total)
env = 0.6 * env_b + 0.4 * env_t

# 1) tempo par autocorrelation (90-150 BPM)
ac = np.correlate(env, env, mode="full")[len(env) - 1:]
lags = np.arange(len(ac))
bpm_lag = 60 * fps_env / np.maximum(lags, 1)
masque = (bpm_lag > 90) & (bpm_lag < 150)
lag0 = lags[masque][np.argmax(ac[masque])]
T0 = lag0 / fps_env

# 2) phase et periode fines : peigne sur l'enveloppe (balayage)
t_env = np.arange(len(env)) / fps_env
meilleur = None
for T in np.linspace(T0 * 0.985, T0 * 1.015, 301):
    for phi in np.linspace(0, T, 120, endpoint=False):
        k = np.arange(int((duree - phi) / T))
        pos = ((phi + k * T) * fps_env).astype(int)
        pos = pos[pos < len(env)]
        s = env[pos].sum()
        if meilleur is None or s > meilleur[0]:
            meilleur = (s, T, phi)
_, T, phi = meilleur

# 3) moindres carres sur les attaques basses les plus proches de chaque temps
pics = []
for k in range(int((duree - phi) / T)):
    c = phi + k * T
    a, b = int((c - 0.06) * fps_env), int((c + 0.06) * fps_env)
    if a < 0 or b >= len(env_b):
        continue
    seg = env_b[a:b]
    if seg.max() > 0.25:
        i = a + int(np.argmax(seg))
        # interpolation parabolique du pic
        if 0 < i < len(env_b) - 1:
            y0, y1, y2 = env_b[i - 1], env_b[i], env_b[i + 1]
            dd = 0.5 * (y0 - y2) / (y0 - 2 * y1 + y2 + 1e-12)
        else:
            dd = 0
        pics.append((k, (i + dd) / fps_env))
K = np.array([p[0] for p in pics], dtype=float)
Tt = np.array([p[1] for p in pics])
A = np.vstack([np.ones_like(K), K]).T
(t0, Tls), *_ = np.linalg.lstsq(A, Tt, rcond=None)
res = Tt - (t0 + Tls * K)
couverture = len(pics) / int((duree - phi) / T)
print(f"duree {duree:.2f}s  BPM {60 / Tls:.3f}  T {Tls:.5f}s  t0 {t0:.4f}s  "
      f"residu max {np.abs(res).max() * 1000:.0f} ms, rms {np.sqrt(np.mean(res ** 2)) * 1000:.1f} ms, "
      f"couverture {couverture * 100:.0f} %")

# 4) energie par mesure (4 temps) pour reperer intro / montee / breaks
rms = np.sqrt(np.convolve(x ** 2, np.ones(SR // 10) / (SR // 10), mode="same"))
mesures = []
m = 0
while True:
    a = t0 + m * 4 * Tls
    b = a + 4 * Tls
    if b > duree:
        break
    if a >= 0:
        seg = x[int(a * SR): int(b * SR)]
        e = 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9)
        sb = np.abs(np.fft.rfft(seg[: 2 ** 16] if len(seg) > 2 ** 16 else seg))
        f = np.fft.rfftfreq(min(len(seg), 2 ** 16), 1 / SR)
        aigus = sb[f > 4000].sum() / (sb.sum() + 1e-9)
        graves = sb[f < 150].sum() / (sb.sum() + 1e-9)
        mesures.append((m, a, e, graves, aigus))
    m += 1
for m, a, e, g, h in mesures[:40]:
    print(f"mesure {m:3d}  {a:7.2f}s  {e:6.1f} dB  graves {g:4.2f}  aigus {h:4.2f}")
json.dump({"bpm": 60 / Tls, "T": Tls, "t0": t0, "duree": duree}, open(sys.argv[2], "w"))
