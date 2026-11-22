# Film « Comment ça marche » d'Apply

Film en motion design de 46 secondes, en français et en anglais, fait avec Remotion à partir de vraies
captures du site. Il remplace l'ancienne section animée de la page d'accueil
(`src/components/landing/FilmPresentation.jsx` lit `public/video/apply-<langue>.mp4` et `.jpg`).

- Choix créatifs, minutage, storyboard, plan sonore et revues : [DESIGN_SPEC.md](DESIGN_SPEC.md)
- Minutage (seule source de vérité, calé sur le tempo de la musique) : `src/timeline.ts`
- Plans : `src/shots/`, sons : `src/Sons.tsx`, textes FR/EN : `src/textes.ts`
- Police : Inter 4.001, fichiers dans `public/fonts/` (licence SIL OFL), chargés par `src/lib/polices.ts` : le rendu ne dépend pas du réseau

## Sons

Les fichiers audio ne sont pas dans le dépôt : leur licence Mixkit autorise l'usage commercial mais
interdit de redistribuer les fichiers seuls. La liste, avec l'adresse de chaque fichier, est dans
[public/audio/LICENCES.md](public/audio/LICENCES.md) : les recopier dans `public/audio/` avant un rendu.

## Refaire les captures

Avec l'API (port 8001) et le site (port 5174) lancés en local :

```bash
cd ../../cvgen-backend; PYTHONPATH=. venv/Scripts/python ../cvgen-frontend/video/scripts/demo_accounts.py create ../cvgen-frontend/video/scripts/.demo.json
```

```bash
node scripts/capture.mjs fr en
```

```bash
python scripts/pdf_vers_png.py public/textures/fr public/textures/en
```

```bash
cd ../../cvgen-backend; PYTHONPATH=. venv/Scripts/python ../cvgen-frontend/video/scripts/demo_accounts.py delete
```

Les comptes sont fictifs et supprimés à la fin ; l'analyse, les questions et les documents sont
produits par la vraie IA, dans la langue de l'interface.

## Rendre le film

```bash
npm run studio
```

```bash
npm run render:fr
```

```bash
npm run render:en
```

Versions sans musique (bruitages conservés) : `--props=props/fr-sans-musique.json` et
`--props=props/en-sans-musique.json`. Le rendu utilise Chrome (voir `remotion.config.ts`).

Images de contrôle sans rendre tout le film :

```bash
node scripts/images-controle.mjs fr out/controle 300 640 1300
```

## Contrôles du son

- Grille de tempo de la musique : `python scripts/analyse_musique.py public/audio/house-vibez.mp3 grille.json`
- Retard du pic de chaque bruitage : `python scripts/analyse_bruitages.py public/audio/*.mp3`
- Décalage de la piste audio d'un rendu : `python scripts/mesure_decalage.py out/apply-fr.mp4 public/audio/click-camera.mp3:<image>`
