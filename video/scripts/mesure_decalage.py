# Mesure du decalage de la piste audio d'un rendu (sound-design 4.6) : correlation croisee normalisee
# entre l'echantillon d'origine et la piste rendue, autour de l'instant ou la Sequence le declenche.
# Usage : python decalage.py rendu.mp4 fichier.mp3:image_de_depart [fichier.mp3:image ...]
import subprocess
import sys

import numpy as np

SR = 48000
FPS = 30


def lire(chemin):
    brut = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", chemin, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(brut, dtype=np.float32).astype(np.float64)


piste = lire(sys.argv[1])
for arg in sys.argv[2:]:
    chemin, image = arg.rsplit(":", 1)
    sonde = lire(chemin)
    sonde = sonde[: int(0.25 * SR)]  # attaque seulement : 250 ms
    debut = int(float(image) / FPS * SR)
    marge = int(0.2 * SR)
    a, b = max(0, debut - marge), debut + marge + len(sonde)
    seg = piste[a:b]
    meilleur = (-2, 0)
    ns = np.linalg.norm(sonde)
    for lag in range(0, len(seg) - len(sonde)):
        fen = seg[lag: lag + len(sonde)]
        c = float(np.dot(fen, sonde) / (np.linalg.norm(fen) * ns + 1e-12))
        if c > meilleur[0]:
            meilleur = (c, lag)
    c, lag = meilleur
    reel = a + lag
    ecart = reel - debut
    print(f"{chemin.split('/')[-1]:26s} prevu {debut / SR:7.3f}s  mesure {reel / SR:7.3f}s  "
          f"ecart {ecart:+6d} ech = {ecart / SR * FPS:+.2f} i  (correlation {c:.2f})")
