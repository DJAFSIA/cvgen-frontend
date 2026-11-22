# Analyse des bruitages : duree, crete (dBFS), retard du pic d'energie (en images a 30 i/s),
# nombre d'attaques. Usage : python analyse_sfx.py fichier1.mp3 fichier2.mp3 ...
import subprocess
import sys

import numpy as np

SR = 48000
FPS = 30


def lire(chemin):
    brut = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", chemin, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(brut, dtype=np.float32)


def analyse(chemin):
    x = lire(chemin)
    duree = len(x) / SR
    crete = 20 * np.log10(np.max(np.abs(x)) + 1e-12)
    fen = SR // 200  # 5 ms
    n = len(x) // fen
    env = np.sqrt(np.mean(x[: n * fen].reshape(n, fen) ** 2, axis=1))
    lisse = np.convolve(env, np.ones(4) / 4, mode="same")
    i_pic = int(np.argmax(lisse))
    pic_f = i_pic * fen / SR * FPS
    # attaques : hausses franches de l'enveloppe (en dB) au-dessus de -30 dB sous le pic
    db = 20 * np.log10(lisse + 1e-9)
    seuil = db.max() - 30
    d = np.diff(db)
    attaques = [i for i in range(1, len(d)) if d[i] > 3 and d[i - 1] <= 3 and db[i + 1] > seuil]
    # duree utile : jusqu'a ce que l'enveloppe reste sous -40 dB du pic
    utile = np.where(db > db.max() - 40)[0]
    fin = (utile[-1] * fen / SR) if len(utile) else 0
    return duree, crete, pic_f, len(attaques), fin


for c in sys.argv[1:]:
    duree, crete, pic_f, n_att, fin = analyse(c)
    nom = c.replace("\\", "/").split("/")[-1]
    print(f"{nom:28s} duree {duree:5.2f}s  utile {fin:5.2f}s  crete {crete:6.1f} dB  pic a {pic_f:5.1f} i  attaques {n_att}")
