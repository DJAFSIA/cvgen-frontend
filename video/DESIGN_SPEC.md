# Film « Comment ça marche » d'Apply : spécification

Mode : création libre autonome (video-shotcraft, `references/pipeline.md`), choisi par l'utilisateur
le 16 novembre 2026. Les décisions ci-dessous sont prises par l'agent et consignées ici.

## 0. Brief produit et décisions

**Produit.** Apply crée un CV et une lettre de motivation adaptés à chaque offre d'emploi.
**Usage du film.** Remplacer la section « Comment ça marche » de la page d'accueil, puis servir de
base aux publicités du lancement.
**Public.** Personnes en recherche d'emploi, francophones et anglophones, dont l'Afrique francophone.

| Besoin | Décision d'exécution |
| --- | --- |
| Montrer le fonctionnement réel | Vraies captures du site local (2x), compte fictif « Amina Exemple », analyse et documents produits par la vraie IA |
| Fonctions à montrer | Import du CV, lecture de l'offre, score, questions, CV et lettre, langues, trois modèles et PDF, offre gratuite |
| Durée, format | ≈ 46 s, 1920×1080, 30 i/s |
| Langues | Deux rendus, français et anglais, depuis la même timeline (`lang` en inputProp) ; captures faites dans chaque langue |
| Son | Sur le site : lecture muette en boucle. Pour les publicités : SFX + BGM. Deux rendus : avec et sans BGM |
| Données | Uniquement fictives (comptes de démo supprimés après capture). Aucun vrai CV |

## 1. Direction visuelle (styleframe sautée : charte stricte existante)

La charte d'Apply est complète et appliquée sur le site (couleurs, police, rayons, ombres) : le film
la reprend telle quelle, et les captures réelles valent référence. Pas de styleframe HTML séparée.

| Token | Valeur |
| --- | --- |
| Fond | `#ffffff`, surface `#f5f5f7` ; noir `#000` pour les respirations sombres |
| Texte | encre `#1d1d1f`, secondaire `#6e6e73`, filet `#d2d2d7` |
| Accent | bleu `#0071e3`, lien sur noir `#2997ff` |
| Dégradé signature | `linear-gradient(90deg, #0894ff, #c959dd 38%, #ff2e54 68%, #ff9004)` : uniquement titres forts et lumière de scène |
| Police | Inter 400–700 (fichiers 4.001 dans `public/fonts/`, licence OFL, chargés par `src/lib/polices.ts` ; le rendu s’arrête si elle manque) ; titres 600, interlettrage −0,03 em ; annotations de l'offre en Inter capitales espacées (pas de police à chasse fixe) |
| Formes | cartes 18 px, tuiles 28 px, boutons pilule |
| Ombres | carte `0 2px 12px rgba(0,0,0,.05)`, flottante `0 20px 50px -12px rgba(0,0,0,.22)` |

**Personnalité du mouvement** (position : énergie basse-moyenne, ton sérieux-chaleureux ; préréglage
« premium » ajusté) : entrées `bezier(0.16, 1, 0.3, 1)` sur ≈ 24–36 i ; caméra `bezier(0.33, 0, 0.15, 1)` ;
pas de rebond sauf atterrissages (y1 > 1) ; pauses : logo ≥ 30 i, fin de groupe ≥ 15 i. Une seule
lumière de qualité par plan (faisceau du score, lumière de scène finale), aucune paillette en série.

**Interdits.** Violet ou néon en aplat (le violet n'existe que dans le dégradé signature), fonds
sombres de type « cyber », matières papier ou encre (style Ink Press), polices autres qu'Inter,
paillettes et reflets en série, faux écrans redessinés à la main quand une capture réelle existe.

**Écarts assumés aux cartes et à la charte** (relevés par la revue v3, gardés et consignés) :
- entrées des textes et des champs sur 14 à 20 i au lieu de 24 à 36 i : le film montre beaucoup
  d'éléments en peu de temps, et les pauses de lecture sont gardées à la place ;
- vignette du projecteur à 0,16 au lieu de 0,42 (spotlight-hero-card) : charte claire, pas de fond sombre ;
- final allégé (outro-group-photo-launch) : sans traînées, prolongements du filet ni désaturation ;
  une seule lueur d'atterrissage, sur la carte score, au lieu d'une par élément (pas de reflets en série) ;
- étiquettes POSTE, LIVRABLE, MÉTHODE… de l'offre : mise en scène de l'extraction des mots clés
  (l'application extrait les mots clés mais n'affiche pas ces catégories).

## 2. Fonction → plan

| Fonction | Carte (style) | Raison |
| --- | --- | --- |
| Marque d'ouverture | blur-slide | Révélation sobre et premium, laisse la place aux plans forts |
| Import du CV, profil rempli | product-card-progressive-assemble | « Le formulaire se remplit tout seul » |
| Lecture de l'offre | scanline-annotate-focus | « La machine lit et nomme les mots clés » |
| Score de compatibilité | spotlight-hero-card | Héros du film : la carte score, avec chiffres qui roulent |
| Questions de l'IA | ai-stream-response | Diagnostic d'abord, questions ensuite |
| Titre de respiration | blur-slide | Annonce le plan document (C2) |
| CV et lettre rédigés | document-typewriter-reveal | Plan le plus dense, avant le final |
| Langues | vertical-word-roll-blur-cycle | Énumération lisible, seconde respiration |
| Trois modèles de CV | card-flock-tumble (vol + rotation lente, sans anneau ni mot géant) | Énergie haute avant le final |
| Final | outro-group-photo-launch | Tous les éléments vus entourent le logo (Q8) |

Transitions : fondu-poussé vers le blanc entre plans clairs, coupure blanche (flash) avant le final.

## 3. Storyboard

| # | Temps | Plan | Animation clé |
| --- | --- | --- | --- |
| 1 | 0,00–3,43 s (7 temps) | Logo « A Apply » + promesse | Tuile qui se pose, mots qui sortent du flou, pause |
| 2 | 3,43–8,87 s (11 temps) | Profil vide → champs remplis | Puce PDF qui tombe, chaque champ de saisie se remplit à sa place, poussée lente puis caméra immobile |
| 3 | 8,87–14,27 s (11 temps) | Offre collée | Ligne de lecture, cadres sur 7 mots clés reliés à leur étiquette, état 0/7 → terminé |
| 4 | 14,27–19,17 s (10 temps) | Analyse | Page entière, projecteur, poussée en biais jusqu'au gros plan, carte score qui s'élève (temps 32), anneau qui se remplit, faisceau, retour |
| 5 | 19,17–25,07 s (12 temps) | Questions | Diagnostic lisible en gros plan, puis la caméra suit chaque question et sa réponse |
| 6 | 25,07–28,03 s (6 temps) | Titre | « Un CV qui répond à l'offre. » |
| 7 | 28,03–32,97 s (10 temps) | CV et lettre | Écriture bloc par bloc avec un seul curseur bleu, cadrage large |
| 8 | 32,97–37,87 s (10 temps) | Langues | Roue : français → anglais → espagnol → six langues, phrase centrée sur le mot lu |
| 9 | 37,87–41,30 s (7 temps) | Trois modèles | Trois pages PDF qui virevoltent en escalier |
| 10 | 41,30–46,23 s (10 temps) | Final | Éléments qui volent autour du logo, lumière de scène, adresse du site, pause finale |

Durée totale : 1 387 images (46,2 s), 94 temps de musique. Toutes les coupes tombent sur un temps
(`src/timeline.ts`) ; le final commence au temps 84, début de mesure.

Sous-titres (≥ 56 px, Q11) sur les plans 2 à 5, 7 et 9. Le plan final reste sans sous-titre (C1).

## 4. Son

**Licences.** Seuls des fichiers Mixkit dont la source est tracée sont utilisés (liste et adresses :
`public/audio/LICENCES.md`). La musique d'origine du modèle (`bgm-tech-house.mp3`) et cinq bruitages
sans source connue (`whoosh-big`, `sparkle`, `keyboard`, `riser-cine`, `pop`) ont été écartés.

**Musique.** `house-vibez.mp3` (House Vibez, Lily J), grille mesurée : 121,998 BPM, premier temps à
0,0102 s (attaques graves, moindres carrés, résidu rms 3,7 ms). Volume 0,3, fondu d'entrée 30 i et de
sortie 50 i. La texture s'étoffe au temps 32 (15,75 s), au moment où la carte score s'élève.

**Bruitages.** Table unique `tableSons()` dans `src/Sons.tsx` : chaque ligne donne l'image où le pic
doit tomber, en relatif sur les plans. Le départ retire le retard du pic propre au fichier (mesuré)
et le retard de la piste de sortie AAC (1,29 i, mesuré par corrélation sur 6 sondes).

| Plan | Action | Son |
| --- | --- | --- |
| Ouverture | le mot-symbole sort du flou | transition-soft |
| Profil | la puce PDF tombe et touche la carte (image 11) ; les champs se remplissent | whoosh-fast, switch-click-quick, swoosh-quick ×2 |
| Offre | ligne de lecture ; chaque cadre se verrouille sur un mot | transition-soft ; click-camera / camera-lens-shutter alternés, volume décroissant (0,34 → 0,28) |
| Score | la carte s'élève ; premier tour du faisceau ; retour | air-woosh-deep, sparkle-wand, transition-snap |
| Questions | diagnostic ; chaque question (jusqu'à 5) | transition-soft, pop-electric par question (0,30 → 0,14) |
| Titre | carton | swoosh-quick |
| Documents | écriture des blocs | typewriter-digital (0,85 : sinon couvert par la musique), coupé avec le dernier bloc |
| Langues | la roue arrive sur chaque langue | switch-tap / switch-light |
| Modèles | envol des trois pages | air-whoosh-powerful |
| Final | riser → impact → scintillement | swoosh-slow (0,75, culmine sur l'impact, coupé après), impact-deep-whoosh (pic du film), sparkle-touch ; la musique descend de 0,3 à 0,15 sous la montée et revient après l'impact |

Choix assumés : `pop-electric` (son électronique) n'est utilisé qu'en série de trois, comme le permet
la note de `sound-design.md` 3.3 ; `typewriter-digital` (frappe numérique régulière) accompagne un
texte qui s'écrit à l'écran.

**Versions.** Avec musique et sans musique (bruitages gardés), en français et en anglais, toutes
rendues depuis la même timeline (`props/*.json`).

**Archives.** Grille de la musique : `analyse/grille-musique.json` (scripts `scripts/analyse_musique.py`,
`analyse_bruitages.py`, `mesure_decalage.py`). Mesures après rendu de la revue v3 (écarts des coupes et
des bruitages) : `analyse/mesures-audio-revue-v3.txt`.

## 5. Revues

- **v3 (16/11/2026)**, revue indépendante complète : `analyse/revue-v3.md`. Corrigés ensuite : police
  Inter chargée au rendu, filets coudés vers leurs étiquettes, plan Questions en gros plan qui suit
  les questions (pastilles hors du texte), champs du profil sans libellé dédoublé (montée 6 px),
  un seul curseur et puces masquées dans les documents, carton titre et roue des langues plus longs,
  poussée réelle du score avec envol sur le temps 32, sons de la puce sur le contact, bruitages
  couverts remontés, une seule lueur au final, extraits du final sans rognure, textes à 34 px au moins,
  pages des modèles sans tranche crénelée, rendu JPEG 95 / CRF 16 / BT.709.
