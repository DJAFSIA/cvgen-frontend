# Extraction en une passe d'images d'un rendu (fNNNN.png) + planches de 6 vignettes.
# Usage : python planches.py video.mp4 dossier n1 n2 ...
import pathlib
import subprocess
import sys

from PIL import Image, ImageDraw

video, sortie, *nums = sys.argv[1:]
nums = sorted(set(int(n) for n in nums))
d = pathlib.Path(sortie)
d.mkdir(parents=True, exist_ok=True)
expr = "+".join(f"eq(n\\,{n})" for n in nums)
subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-y", "-i", video, "-vf", f"select={expr}", "-fps_mode", "passthrough",
     str(d / "tmp_%04d.png")],
    check=True,
)
tmp = sorted(d.glob("tmp_*.png"))
assert len(tmp) == len(nums), (len(tmp), len(nums))
for n, f in zip(nums, tmp):
    f.replace(d / f"f{n:04d}.png")
larg = 640
for p in range(0, len(nums), 6):
    lot = nums[p:p + 6]
    imgs = [Image.open(d / f"f{n:04d}.png").convert("RGB") for n in lot]
    h = round(imgs[0].height * larg / imgs[0].width)
    pl = Image.new("RGB", (larg * 2 + 30, (h + 34) * ((len(lot) + 1) // 2) + 10), (40, 40, 44))
    dr = ImageDraw.Draw(pl)
    for k, (n, im) in enumerate(zip(lot, imgs)):
        x, y = 10 + (k % 2) * (larg + 10), 10 + (k // 2) * (h + 34)
        dr.text((x, y), f"image {n}", fill=(230, 230, 235))
        pl.paste(im.resize((larg, h)), (x, y + 18))
    pl.save(d / f"planche-{p // 6 + 1:02d}.jpg", quality=82)
print(len(nums), "images,", (len(nums) + 5) // 6, "planches")
