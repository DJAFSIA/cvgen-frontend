#!/usr/bin/env bash
# Versions web du film pour la page d'accueil (public/video du site) : 1280 x 720, H.264 CRF 24,
# BT.709 plage TV etiquetee, AAC 128 kbit/s, lecture progressive (faststart), et une affiche tiree
# du final (logo, elements autour, adresse). Usage : bash scripts/encoder-web.sh fr en
set -euo pipefail
cd "$(dirname "$0")/.."
SORTIE=../public/video
AFFICHE=1335 # image du final : logo pose, adresse visible, avant le fondu de fin
mkdir -p "$SORTIE"
for L in "$@"; do
  ffmpeg -loglevel error -y -i "out/apply-$L.mp4" \
    -vf "scale=1280:-2:flags=lanczos" \
    -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -profile:v high -level 4.0 \
    -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
    -movflags +faststart -c:a aac -b:a 128k "$SORTIE/apply-$L.mp4"
  ffmpeg -loglevel error -y -i "out/apply-$L.mp4" \
    -vf "select=eq(n\,$AFFICHE),scale=1280:-2:flags=lanczos" -frames:v 1 -q:v 3 "$SORTIE/apply-$L.jpg"
  ls -la "$SORTIE/apply-$L.mp4" "$SORTIE/apply-$L.jpg"
done
