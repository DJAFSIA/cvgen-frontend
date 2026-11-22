"""Extrait des images d'un rendu et les assemble en planches de controle (verification image par image).
Usage : python planche.py <video.mp4> <dossier_sortie> <image1> <image2> ...  (numeros d'image a 30 i/s)"""
import pathlib
import subprocess
import sys

from PIL import Image, ImageDraw

video, sortie, *images = sys.argv[1:]
dossier = pathlib.Path(sortie)
dossier.mkdir(parents=True, exist_ok=True)
vignettes = []
for n in map(int, images):
    chemin = dossier / f"f{n:04d}.png"
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-i", video, "-vf", f"select=eq(n\\,{n})", "-vframes", "1", str(chemin)],
        check=True,
    )
    vignettes.append((n, Image.open(chemin).convert("RGB")))

largeur = 640
par_planche = 6
for p in range(0, len(vignettes), par_planche):
    lot = vignettes[p:p + par_planche]
    h = round(lot[0][1].height * largeur / lot[0][1].width)
    planche = Image.new("RGB", (largeur * 2 + 30, (h + 34) * ((len(lot) + 1) // 2) + 10), (40, 40, 44))
    dessin = ImageDraw.Draw(planche)
    for k, (n, img) in enumerate(lot):
        x = 10 + (k % 2) * (largeur + 10)
        y = 10 + (k // 2) * (h + 34)
        dessin.text((x, y), f"image {n}", fill=(230, 230, 235))
        planche.paste(img.resize((largeur, h)), (x, y + 18))
    planche.save(dossier / f"planche-{p // par_planche + 1}.jpg", quality=82)
    print("planche", p // par_planche + 1, [n for n, _ in lot])
