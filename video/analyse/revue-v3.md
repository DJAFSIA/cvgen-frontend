# Revue finale indépendante : film « Comment ça marche » d'Apply (version française)

Fichier relu : `video/out/apply-fr.mp4`, 1920×1080, 30 i/s, 1 269 images (42,30 s), AAC 48 kHz stéréo, rendu le 16/11/2026 à 17:45. Dans ce rapport, « i » signifie image (1/30 s). Revue en lecture seule : j'ai seulement ajouté des fichiers dans `out/qa/v3/revue/` (agrandissements, images extraites, `mesures-audio.txt`).

Ce qui a été examiné :
- **Images** : les 11 planches et les 61 images `fNNNN.png` fournies (dont 16 ouvertes en pleine résolution), 20 images extraites en plus (`revue/gNNNN.png`), et le film entier décodé pour mesurer immobilité, coupes et mouvement (corrélation de phase sous-pixel).
- **Son** : `volumedetect`, `astats` et `ebur128`, puis piste extraite et analysée avec numpy. La musique source a été recalée par corrélation puis soustraite (résidu à −64 dB), ce qui isole les bruitages : 30 positions mesurées, plus une analyse par tiers d'octave. Chiffres dans `revue/mesures-audio.txt`.
- **Code et spécification** : `timeline.ts`, `Film.tsx`, `Sons.tsx`, `textes.ts`, les 10 plans, `lib/`, `layout.fr.json`, `remotion.config.ts`, `scripts/capture.mjs`, `DESIGN_SPEC.md`, `LICENCES.md`.
- **Skill** : `final-review.md`, `aesthetic-rules.md`, `sound-design.md` (§3.3, 4.1, 4.3, 4.5, 4.6), `music-beat-sync.md`, les 9 fiches, `library.json`, les démos (scanline et spotlight lues en entier ; typewriter, product-card, word-roll, outro et flock vérifiées sur les paramètres en cause) et 2 affiches de la galerie.
- **Affirmations produit** : vérifiées dans le code de l'application (`cvgen-backend`, `cvgen-frontend`).

## P — Objectif produit

P1 ✓ Le positionnement est clair dès l'ouverture (« Une candidature sur mesure pour chaque offre. », f0085). Le parcours suit ensuite : import (f0150), offre (f0400), score (f0520), questions (f0680), documents (f0840), langues (f0935), modèles (f1072), gratuit (f1220). Le public visé (chercheurs d'emploi, Afrique francophone) se lit dans les données (Douala, Mobile Money).
P2 ✓ L'attention suit les priorités consignées : le score est le plan héros (projecteur, envol, faisceau, f0520) et chaque fonction listée a son plan.
P3 ✓ Les affirmations sont vérifiées dans le code :
- six langues (`app/schemas/candidature.py` : fr, en, es, de, pt, it) ;
- trois modèles classique, moderne et ATS, et PDF téléchargeable (`GUIDE.md`, boutons « Télécharger » en f0790) ;
- gratuité (3 candidatures par mois) ;
- « Rien d'inventé » (consigne « N'invente RIEN » dans `ia_service.py`) ;
- extraction réelle de mots clés (`mots_cles`).

Deux mentions restent à confirmer avant diffusion (voir points non vérifiables).
P4 ✓ Le tableau besoin → décision est appliqué : captures réelles en 2x (textures de 3 840 px), compte fictif, analyse et documents produits par la vraie IA (score 92), 42,3 s en 1920×1080 à 30 i/s, timeline unique paramétrée par `lang` et `bgm`. Le film se comprend sans le son grâce aux sous-titres, ce qui convient à la lecture muette en boucle.

## F — Fonctions montrées

F1 ✓ Chaque fonction obligatoire a au moins un plan :
- import (f0125-f0230) ;
- lecture de l'offre (f0300-f0400) ;
- score (f0490-f0560) ;
- questions (f0625-f0680) ;
- CV et lettre (f0790-f0870) ;
- langues (f0908-f1000) ;
- trois modèles et PDF (f1045-f1100) ;
- offre gratuite (pastille du final, f1160-f1220).

F2 ✓ Chaque plan apporte une information nouvelle et aucun slogan n'est répété. La promesse d'ouverture ne réapparaît que dans la page d'accueil floutée derrière le final, lisible environ 4 i (f1125).
F3 ✗ Deux plans ne font pas comprendre leur fonction par l'image :
- **Offre (f0400)** : les filets pointillés ne mènent pas à leurs étiquettes. Celui de « Google Analytics » (y 466) aboutit sur MÉTHODE (y 431-483). OUTIL (y 492-544) n'a aucun filet. Ceux de « rituels agiles » et « paiement mobile » tombent entre deux étiquettes. Le spectateur lit donc une association fausse.
- **Questions (f0680)** : questions, réponses et diagnostic font 13 à 15 px à l'écran, sur une carte qui n'occupe que 44 % de la largeur. Ils sont illisibles une fois le film intégré à la page ou vu sur téléphone : la fonction n'est comprise que par le sous-titre.

## V — Direction visuelle

V1 ✗ Couleurs, rayons, ombres et densité sont conformes : bleu mesuré (0,112,226) pour #0071e3 en f0085 et f0400, fond (245,244,246) pour #f5f5f7. Mais **tout le texte ajouté par le film est rendu en Segoe UI, pas en Inter**. `lib/theme.ts` déclare `Inter, -apple-system, "Segoe UI", sans-serif` sans jamais charger Inter, qui n'est pas installée sur la machine de rendu (Edge sous Windows, d'après `remotion.config.ts`). Preuves :
- `revue/police-legende-comparaison.png` : la légende de f0150 et un rendu Segoe UI de la même phrase ont des glyphes identiques ;
- f0085 (logo et promesse), à comparer avec `revue/accueil-titre.png` (même phrase sur le site, en Inter) ;
- g0556 (« 92% » rejoué, en Segoe UI), à comparer avec `revue/score-4x-anneau.png` (« 92% » réel, en Inter).

Sont touchés : le mot-symbole « Apply » d'ouverture et de fin (f0085, f1220), les sous-titres, le titre (f0760), la roue des langues (f0935) et les pastilles finales. Les étiquettes et la ligne d'état de l'Offre sont en Consolas.
V2 ✓ L'énergie, basse à moyenne, monte jusqu'au final, dont l'impact est le moment le plus fort (−10,4 dBFS sur 400 ms à l'image 1165). Les dépassements sont réservés aux atterrissages et à ceux que prévoient les cartes (cadres de l'Offre, roue des langues). Les pauses du logo durent 62 i à l'ouverture (images 36-97) et environ 55 i au final (1202-1257). Les fins de groupe durent au moins 15 i (Questions 34 i, Offre ≈ 27 i, Langues 27 i, Titre 15 i). Remarque : les entrées durent 14 à 20 i (sous-titres 14, mots 20, champs 16), alors que la spécification annonce 24 à 36 i.
V3 ✓ Aucune dérive vers Ink Press ou le néon : fond blanc ou gris très clair partout, vignette du projecteur limitée à 16 % de gris (f0520), lumières pastel (f1030, f1220).
V4 ✗ Deux interdits sont enfreints :
- « polices autres qu'Inter » : Segoe UI et Consolas (voir V1) ;
- « reflets en série » et « une seule lumière de qualité par plan » : au final, chacun des 9 éléments s'allume d'un halo bleu en se posant, avec 4 à 5 halos simultanés en f1140, sans que ce soit documenté dans `DESIGN_SPEC.md`.

Aucun fond sombre ; le violet n'apparaît que dans le dégradé.

## S — Cartes de plans et variantes

S1 ✓ Les 9 cartes retenues sont présentes à leur place : blur-slide (f0060, f0760), product-card-progressive-assemble (f0150), scanline-annotate-focus (f0330), spotlight-hero-card (f0490), ai-stream-response (f0650), document-typewriter-reveal (f0815), vertical-word-roll-blur-cycle (f0935), card-flock-tumble (f1045), outro-group-photo-launch (f1190).
S2 ✓ Une seule variante par carte (clé de style = nom de la carte dans `library.json`) ; index, fiche et démo désignent la même variante. La comparaison avec la vidéo de référence n'est pas vérifiable (voir plus bas).
S3 ✗ La plupart des temps clés sont fidèles :
- envol 48-58, vol plané de 54 i, oscillation de 4 px sur 40 i, élévation de 110, retour 112-130, tours de faisceau 60-74 et 80-100 ;
- balayage linéaire 0,06-0,66 avec écart minimal de 0,05, cadres de 1,75 à 1 en 0,13 ;
- questions aux repères 42 + 0/11/21/30, pastille à +3 i ;
- écriture par paires à 6 + 3,5 g, 8 i par bloc ;
- spline Catmull-Rom coupée à 0,55, rotation lente de 0,34° par image ;
- 9 éléments à 4 + 3 i, lettres du logo à 42 + 1,8 i.

Trois écarts de grammaire :
1. **spotlight-hero-card sans poussée.** La démo passe d'une vue pleine page à un gros plan (zoom 0,78 → 2,6). Le film passe de 1,6 à 1,495 : la carte occupe 64 % de la hauteur avant (f0436) et 66 % après (f0520), au lieu de grandir. L'affiche de la galerie montre bien un gros plan.
2. **product-card : les champs montent de 22 px au lieu de 6 px.** La fiche prévient qu'au-delà de 20 px le mouvement contredit la poussée ; ici il produit des dédoublements (f0125, `revue/g0186-zoom.png`).
3. **ai-stream-response : la synthèse n'est pas lisible.** La fiche exige qu'on puisse la lire à vitesse normale ; le diagnostic fait environ 13 px (f0680).

S4 ✗ Des pièges documentés par les fiches n'ont pas été évités :
- **document-typewriter-reveal, deux curseurs bleus en même temps** (f0790 : « Amin| » et « Amina E| »). La fiche et la démo n'en autorisent qu'un.
- **document-typewriter-reveal, puces de liste visibles avant leur texte** (f0790 aux points 493,951 et 493,1056 ; f0815 au point 503,889). `scripts/capture.mjs` ignore les `li` qui contiennent un `p` et enregistre le `p` intérieur avec la balise `p`. Le cache ne déborde alors que de 4 px au lieu de 28.
- **vertical-word-roll-blur-cycle, largeur de roue estimée au lieu d'être mesurée** : la phrase est décentrée de −156 px (f0908), −175 px (f0935), −124 px (f0955) et −71 px (f1000).

Conflit de sources, signalé sans l'imputer au film : les crochets de l'Offre (bras de 16 px sur des cadres de 29 px) forment des « [ ] » pleins (`revue/f0400-zoom-texte.png`). La fiche l'interdit (bras de plus d'un tiers du petit côté), mais la démo et l'affiche de la galerie montrent le même rendu sur leurs petites cibles.
S5 ✗ Plusieurs adaptations aux captures sont mal finies :
- filets et étiquettes décalés dans l'Offre (f0400) ;
- pastilles de validation posées sur le texte réel des questions (« notamm●nt », « Douala ● » : `revue/f0680-pastille-q3.png`, `revue/f0680-pastille-q1.png`) ;
- dédoublements pendant le remplissage du profil : libellé « Nom complet » en double en f0125 (`revue/f0125-dedoublement.png`), libellé « Expériences professionnelles » en double et texte d'exemple visible sous le nouveau texte à l'image 186 (`revue/g0186-zoom.png`) ;
- extraits rognés au final : « M » de MOTIVATION coupé, sans marge à gauche (`revue/f1220-carte-question.png`) ; dernière ligne de l'offre tranchée à mi-hauteur (`revue/f1140-carte-offre-bas.png`) ;
- ligne d'état de l'Offre posée sur le champ d'adresse (f0300).

S6 ✓ Aucune des 9 variantes n'est marquée « référence seulement » ou « sans aperçu » dans `library.json`, et la spécification ne prétend pas reproduire les vidéos de référence.

## B — Conformité au storyboard

B1 ✓ Ordre et durées conformes. Les coupes sont mesurées aux images 103, 266, 428, 575, 723, 782, 900, 1018 et 1121 (3,43 / 8,87 / 14,27 / 19,17 / 24,10 / 26,07 / 30,00 / 33,93 / 37,37 s), pour 1 269 images au total.
B2 ✗ Les sous-titres (plans 2 à 5, 7 et 9, aucun au final), les transitions et les sources sont conformes. Les transitions sont des fondus vers le blanc avec une image blanche pure sur chaque coupe, puis un flash qui culmine à l'image 1120. Quatre écarts subsistent avec le storyboard et le plan sonore :
- « la puce PDF tombe et se pose » sonne 9 à 11 i après le contact : contact aux images 114-116, souffle et clic à 124,9 et 124,5 (f0111, f0125) ;
- « la carte score s'élève (temps 32) » démarre à l'image 476, soit 4,3 i après le temps 32, avec un pic sonore à +8 i ;
- le « curseur bleu » est devenu deux curseurs (f0790) ;
- la « poussée en biais » ne pousse pas (f0436 → f0520).

B3 ✓ Le mot-symbole reste immobile 62 i à l'ouverture (images 36-97). Le logo et l'adresse restent quasi immobiles environ 55 i au final (1202-1257) ; le fond poursuit sa poussée lente par construction. Les fins de groupe sont immobiles au moins 0,5 s : Questions 34 i (676-709), Offre ≈ 27 i, Langues 27 i.
B4 ✓ Aucun plan ajouté, retiré ou remplacé par rapport au storyboard.

## D — Données et sources

D1 ✓ Données fictives uniquement : Amina Exemple, amina.exemple@example.com, +237 600 000 000, Société Exemple, Agence Horizon, Boutique Sahel (`scripts/donnees.mjs`). La vitrine de la page d'accueil (Northwind, Acme, Amina Diallo), visible floutée au début du final, est l'exemple fictif codé en dur dans `HeroShowcase.jsx`.
D2 ✓ Aucune clé, adresse interne, adresse locale ni donnée client visible sur les images fournies et extraites.
D3 ✓ Les pages réelles sont capturées en 2x (3 840 px de large), CV et lettre viennent des vrais PDF. Les éléments faits main (puce PDF, étiquettes, pastilles) ne recopient aucune page existante.
D4 ✗ Les captures sont complètes (Inter chargée par le site, images et analyse présentes), mais la police du film lui-même n'est pas chargée au rendu : repli sur Segoe UI (même cause que V1, `revue/police-legende-comparaison.png`).
D5 ✓ Comptes de démonstration supprimés après capture (README), aucune donnée en direct, numéro de téléphone manifestement fictif.

## A — Son et rythme

A1 ✓ Musique house aux temps marqués (House Vibez). Gain mesuré 0,299 (0,3 dans le code), montée sur 30 i, sortie sur 50 i (images 1219-1268). La plupart des bruitages dominent la musique dans leurs bandes de fréquence (`revue/mesures-audio.txt`). Sonie intégrée −20,7 LUFS, crête vraie −1,1 dBFS.
A2 ✗ 28 bruitages sur 30 culminent à moins d'une image de leur cible et de l'action visible : cadres de l'Offre au premier retour à l'échelle 1, envol, faisceau et retour de la carte, roue des langues, impact du logo. Les deux exceptions sont les sons de la chute du PDF. D'après le suivi de l'icône rouge, le contact visuel a lieu entre les images 113 et 114 et le fond du rebond à 116. Le souffle culmine à 124,9 et le clic à 124,5, soit 9 à 11 i de retard (f0111, f0125). La cible a été posée sur la fin de la courbe d'atterrissage, alors que celle-ci atteint sa position dès 38 % de sa durée.
A3 ✓ Les 9 coupes tombent entre +0,00 et +0,85 i après leur temps. Grille contrôlée : décalage musique/sortie mesuré par corrélation, grille à 121,998 BPM confirmée à ±1 ms aux temps 16, 32, 64, 76 et 86.
A4 ✓ La séquence montée → impact → scintillement est en place. Le swoosh-slow culmine à 1165,7 ; l'impact à 1165,8, moment le plus fort du film ; le sparkle-touch à 1183,6, sur le filet dégradé. La montée n'est toutefois audible que sur ses 0,4 dernières secondes (voir A6).
A5 ✓ Le seul fichier de plus de 5 s, swoosh-slow (5,5 s), est borné à 68 i. Aucun bruitage ne déborde de son action : les fins coupées sont entre −78 et −107 dBFS, l'impact est coupé à 3 s sous −87 dBFS, et la coupure du riser ne produit aucun clic.
A6 ✗ Pas d'écrêtage (crête à −1,1 dBFS, aucun palier) et aucun fichier sous −12 dB de crête. Mais trois bruitages sont en grande partie masqués par la musique dans le rendu :
- la machine à écrire des Documents : −13,2 dB en large bande, seulement 2 tiers d'octave au-dessus de +6 dB (images 788-831) ;
- la montée finale : 18 à 41 dB sous la musique pendant 1,4 s sur 2,3 s (images 1102-1144) ;
- les déclics 5 et 7 de l'Offre : −8,8 et −11,6 dB, avec une émergence seulement entre 12 et 16 kHz, mal restituée par les haut-parleurs de téléphone (images 350 et 366).

Mesures dans `revue/mesures-audio.txt`, à confirmer à l'écoute.
A7 ✓ Les bruitages d'interface sont réalistes (interrupteurs switch-*, déclencheurs photo). pop-electric (liste ⚠ de sound-design §3.3) n'apparaît qu'en série décroissante de trois, et ce choix est consigné dans `DESIGN_SPEC.md`. Aucun fichier de la liste ❌.
A8 — Non vérifiable à ce stade, conformément au brief : les versions anglaise et sans musique ne sont pas rendues. La structure est prête : les props fr, en, fr-sans-musique et en-sans-musique existent, et la musique est un calque séparé dans `Sons.tsx`.
A9 ✗ Le décalage de sortie est mesuré et consigné avec la version de Remotion, le codec, la fréquence, le conteneur, les sondes, la méthode et la date. Ma mesure concorde : 42,3 à 43,0 ms sur 30 bruitages, 42,3 ms par la musique. SOURCE_BEAT0 garde sa valeur d'analyse et la compensation passe par la formule de départ. En revanche, ni l'analyse de la grille (`beat_data.json`, `grid_drift.json`) ni le tableau d'erreurs après rendu ne sont archivés dans le projet. Mon tableau (`revue/mesures-audio.txt` §3, coupes 103 à 1121) montre un léger décalage systématique de +0,37 i en moyenne, dû à `trimBefore` arrondi de 1,596 à 2 i ; sans conséquence perceptible.

## Q — Qualité visuelle technique (règles de `aesthetic-rules.md`)

### Rythme (R)
R1 ✗ Le logo est bien tenu (62 i à l'ouverture, environ 55 i au final). Mais le carton « Un CV qui répond à l'offre. Vos vraies expériences. Rien d'inventé. » n'est complet et immobile que 15 i (0,5 s, images 762-776) avant son fondu. « Rien d'inventé. » n'est complet et opaque que 0,27 s (f0760, f0779).
R2 ✓ Aucun mouvement uniforme, hors le balayage de lecture (linéaire par construction de la carte) et les dérives d'ambiance. Les entrées suivent des courbes de sortie. Les questions arrivent de plus en plus vite (11, 10, 9 i), puis 34 i d'immobilité.
R3 ✗ Trois passages sont trop rapides pour une première vision :
- le carton Titre : 2 s pour 11 mots, 4 images blanches comprises (f0760) ;
- la roue des langues : environ 10,5 i d'arrêt par langue, contre 13 i dans la fiche (f0935) ;
- les 4 questions-réponses, posées en 1,1 s.

R4 ✓ Un seul choc plein cadre : le flash avant le final (images 1116-1126). Les poussées de sortie (1 → 1,025 sur 6 i) accompagnent les fondus et ne battent pas la mesure ; aucun tremblement calé sur le rythme.

### Texture, caméra, composition (Q)
Q1 ✓ Toutes les pages existantes viennent de captures réelles. Les éléments faits main sont nets et sans ambiguïté. L'anneau de score rejoué suit le tracé réel, mais pas sa police (voir V1).
Q2 ✓ Captures en 2x, score en 4x, zoom par la propriété CSS `zoom` : le texte reste net en 3D (f0520, g0556) et en agrandissement (`revue/f0400-zoom-texte.png`, `revue/f0680-zoom-question.png`).
Q3 ✓ Aucune secousse de caméra : la corrélation de phase donne 0,00 px sur les images immobiles 680-706. Une micro-vibration sous-pixel de ±0,3 à 0,7 px apparaît pendant les poussées lentes (Profil 228-243, Documents 850-880) ; voir les améliorations.
Q4 ✗ Le faisceau du score est la seule lumière héroïque (deux tours sur le bord arrondi de 18 px). Mais le final allume un halo bleu à l'atterrissage de chacun des 9 éléments (f1140), plus fort que dans la démo (0,5 contre 0,35) et non documenté. Conflit à signaler : la fiche outro prévoit cette lueur, alors que la règle Q4 et `DESIGN_SPEC.md` l'excluent en série.
Q5 ✓ L'ouverture n'a qu'un sujet (tuile et mot-symbole), avec un arc complet (f0006 → f0085).
Q6 ✓ Les pages denses sont vues de face. La seule vue oblique (score, rotation de 34°) est latérale et le texte reste lisible (g0556).
Q7 ✓ Le gros plan du score a son inclinaison et son élévation. Il n'a ni orbite ni matière sombre, conformément à l'interdit « fonds sombres » de la spécification : écart volontaire et documenté.
Q8 ✓ Le final est une photo de groupe : profil, offre, score, CV, question, lettre, gratuit, paiement et langues autour du logo (f1220), avec grue, lumière de scène, bande lumineuse et pic sonore sur le logo.
Q9 ✓ Les champs du profil, les questions et les blocs des documents se posent dans leurs vrais emplacements de page.
Q10 ✓ Les documents sont les vrais documents générés par l'application, avec les deux colonnes entières dans le cadre (f0840).
Q11 ✗ Sous-titres à 56 px, adresse à 40 px et étiquettes de l'Offre à environ 34 px : conformes. Deux textes sont sous le seuil :
- la ligne d'état de l'Offre, 26 px (f0300) ;
- les pastilles du final, 30 px × 1,035 ≈ 31 px (f1220).

D'autres textes sont nets mais trop petits pour être lus, l'état intermédiaire que la règle interdit :
- questions et réponses, 13 à 15 px environ (f0680) ;
- mots encadrés de l'offre, environ 21 px (f0400) ;
- valeurs du profil, environ 17 px (f0230) ;
- documents en plan large, environ 12 à 14 px (f0840).

### Son (S)
S1 (son) ✓ Musique house aux temps marqués et vocabulaire whoosh / impact / montée / scintillement / transition. Aucun son de jeu ; déclics et interrupteurs réalistes.
S2 (son) ✓ Table déclarative commentée ligne à ligne. Les séries sont traitées : déclics alternés à volume décroissant (0,34 → 0,22), pops de 0,30 à 0,20, cascade fondue en un seul souffle, interrupteurs alternés.
S3 (son) ✓ Les repères sont relatifs aux plans (SHOTS) et les positions mesurées correspondent à la timeline actuelle. Le retard du PDF vient d'une cible mal choisie, pas d'un changement de timeline.
S4 (son) ✗ Chaque action a son bruitage (écriture → machine à écrire, cadres → déclencheur, puce → déclic, roue → interrupteur). Mais l'écriture des documents s'entend à peine (images 788-831, voir A6), et le déclic de la puce tombe 10 i après le contact (image 124,5 contre 114, voir A2).
S5 (son) ✓ Le décalage de sortie (1,29 i) et le retard de pic de chaque fichier sont compensés dans la formule de départ. Résidus mesurés de −0,62 à +0,90 i, dus à l'arrondi entier.

### Texte (C)
C1 ✓ Chaque sous-titre correspond à son plan. Aucun passage sans texte de plus de 3 s, hors le final de marque (exception prévue).
C2 ✓ Les phrases sont concrètes (« Votre compatibilité, avant même de postuler. », « Trois modèles. Un PDF en un clic. ») et un carton annonce les documents.
C3 ✓ Les annotations de l'Offre sont dans l'espace de la page, sous la même caméra ; les sous-titres sont plats par choix.

### Méthode (P)
P1 (méthode) ✓ Images de contrôle et planches présentes dans `out/qa/v3`.
P2 (méthode) ✓ Aucun film de référence fourni par l'utilisateur ; cartes et raisons consignées dans `DESIGN_SPEC.md`. Plusieurs écarts aux cartes ne sont toutefois pas consignés (voir les améliorations).
P3 (méthode) ✓ Sans objet pour cette version : aucun retour ambigu à interpréter.
P4 (méthode) ✓ Chaque fonction a son plan et aucune information n'est répétée ; blur-slide sert deux fois, ce que la fiche permet. Profil, Questions et Documents partagent pourtant la même grammaire (page blanche où apparaissent des blocs) ; voir les améliorations.

### Contrôles techniques demandés par `final-review.md`
Q-a Netteté du texte ✓ Bords nets, sans blocs de compression, sur les agrandissements (`revue/f0400-zoom-texte.png`, `revue/f0680-zoom-question.png`).
Q-b Composition ✗
- carte des questions à 44 % de la largeur, entourée de gris vide (f0680) ;
- phrase des langues décentrée jusqu'à −175 px (f0935) ;
- après la « poussée » du score, tiers gauche vide et carte héros pas plus grande (f0520) ;
- ligne d'état posée sur le champ d'adresse (f0300) ;
- ligne de texte tranchée en haut du cadre (f0436) ;
- fin de la capture visible à gauche : le filet de la barre latérale s'arrête à y ≈ 975 (`revue/g0183.png`).

Q-c Coins arrondis ✓ Les extraits du final, les pages des modèles et la carte score sont découpés à leurs rayons ; le faisceau suit le rayon de 18 px.
Q-d Textures 3D ✓ Score en 4x et pages de CV de 1 240 px pour environ 500 px affichés. Seul défaut : les pages vues par la tranche montrent un pointillé crénelé pendant environ 5 i (f1022).
Q-e Position des éléments ✗ Voir S5 : f0400, f0680, f0125, `revue/g0186-zoom.png`, f0790, f0815, f1140, f1220.
Q-f Tremblement de caméra ✓ Voir Q3.
Q-g Raccords de transition ✓ Une image blanche pure (luminance 255) sur chaque coupe musicale (103, 266, 428, 575, 723, 782, 900, 1018) et un flash avant le final : raccords réguliers et sans saut.
Q-h Effets de lumière ✗ Halos bleus en série au final (f1140) ; voir Q4.
Q-i Durée de lecture ✗ Carton Titre immobile 0,5 s (f0760) et roue des langues à environ 0,35 s par langue (f0935) ; voir R1 et R3.
Q-j Rendu déterministe ✓ Aucun appel à `Math.random` ni à l'horloge ; pseudo-hasard à graine (`rand`) ; fonctions pures de l'image.

---

## Corrections obligatoires, par gravité

### Gravité haute
1. **La police de marque est absente** (V1, V4, D4). Preuves : f0085, f0150, f0760, f0935, f1220, g0556, `revue/police-legende-comparaison.png`.
   - Charger Inter (400 à 800) dans le projet Remotion, par exemple avec `@remotion/google-fonts/Inter` ou des fichiers woff2 locaux chargés avant le rendu.
   - Vérifier les glyphes sur une image rendue (le « t » et le « f » diffèrent nettement de Segoe UI).
   - Remplacer Consolas (étiquettes et ligne d'état de l'Offre) par Inter, ou consigner l'exception.
2. **Les étiquettes de l'Offre sont mal reliées** (F3, S5). Preuves : f0400, f0360. Tracer chaque filet jusqu'à son étiquette (filet coudé, ou étiquette alignée sur son mot) pour que « Google Analytics » mène à OUTIL et que chaque filet aboutisse au centre de son étiquette.
3. **Le plan Questions est illisible et ses pastilles couvrent le texte** (F3, S3, Q11, S5). Preuves : f0680, `revue/f0680-pastille-q1.png`, `revue/f0680-pastille-q3.png`.
   - Cadrer plus serré : la synthèse, puis une ou deux questions lisibles à 32 px réels au moins ; ou mettre en avant une seule question agrandie.
   - Placer les pastilles dans la marge droite, hors du texte.

### Gravité moyenne
4. **Dédoublements pendant le remplissage du profil** (S3, S5). Preuves : f0125, `revue/f0125-dedoublement.png`, `revue/g0186-zoom.png`. Découper les morceaux sur le seul champ de saisie, sans le libellé ; masquer le texte d'exemple de la page vide sous le morceau ; ramener la montée à 6 px.
5. **Plan Documents : deux curseurs et puces visibles trop tôt** (S4). Preuves : f0790, f0815.
   - Un seul curseur, sur le bloc le plus récent, toutes colonnes confondues.
   - Dans `scripts/capture.mjs`, noter `li` pour un `p` situé dans un `li`, ou élargir le cache de 28 px pour ces blocs, puis régénérer `layout.fr.json` et `layout.en.json`.
6. **Le carton Titre est trop bref** (R1, R3). Preuves : f0760, f0779 ; immobile 15 i seulement. Lui donner au moins 1 s d'immobilité une fois complet : par exemple 6 temps au lieu de 4, en reprenant 2 temps sur un plan voisin, ou démarrer les mots plus tôt.
7. **Le plan Score ne pousse pas** (S3). Preuves : f0436 et f0520. Ouvrir sur la page entière (zoom 0,8 à 1 environ), puis pousser vers la carte (1,5 à 1,6 environ, la carte faisant 428 px de haut), comme dans la démo.
8. **Le son de la puce PDF arrive 9 à 11 i en retard** (A2, B2). Preuves : contact aux images 113-116, sons à 124,5 et 124,9. Viser le contact (plan Profil + 11) pour le clic, et la phase de chute pour le souffle.

### Gravité faible
9. **Extraits rognés au final** (S5). Preuves : `revue/f1220-carte-question.png`, `revue/f1140-carte-offre-bas.png`. Ajouter une marge intérieure à la carte question ; couper l'extrait d'offre entre deux lignes.
10. **Phrase des langues décentrée** (S4). Preuves : f0908, f0935, f0955, f1000 (−71 à −175 px). Mesurer la largeur réelle des mots, ou centrer la phrase sur le mot affiché.
11. **Textes sous le seuil Q11.** Preuves : f0300 (26 px), f1220 (environ 31 px). Passer la ligne d'état et les pastilles finales à 34 px au moins.
12. **Bruitages masqués par la musique** (A6, S4 son). Preuves : images 788-831, 1102-1144, 350 et 366.
   - Remonter la machine à écrire d'environ 8 à 10 dB, ou utiliser un fichier pré-normalisé.
   - Remonter la montée, ou la démarrer plus près de sa partie audible.
   - Ne pas descendre les derniers déclics sous 0,28.
   - Valider à l'écoute sur un téléphone.
13. **Halos en série au final** (Q4, V4). Preuve : f1140. Supprimer la lueur d'atterrissage ou la réserver à un seul élément ; à défaut, consigner l'exception dans `DESIGN_SPEC.md`.

## Améliorations conseillées

- **Envol du score :** il démarre 4,3 i après le temps 32 (image 476 contre 471,7) et son souffle culmine 8 i après. Avancer l'action de 4 i.
- **Crochets de l'Offre :** avec des bras de 16 px sur des cadres de 29 px, les crochets deviennent des « [ ] » pleins qui mordent sur les lettres voisines (« ave[c », `revue/f0400-zoom-texte.png`). Fiche et démo se contredisent sur ce point ; à trancher, par exemple bras de 9-10 px et trait de 2 px.
- **Micro-vibration sous-pixel** (±0,3 à 0,7 px d'une image à l'autre) en fin de Profil et pendant la « respiration » des Documents : figer la caméra une fois l'action finie, comme le prévoit la fiche product-card (poussée arrêtée à 75 %).
- **Encodage :** le rendu est en `yuvj420p` plage complète, matrice BT.601, primaires non étiquetées. La couleur est juste si l'étiquette est respectée (bleu 0,112,226), mais un lecteur qui supposerait BT.709 donne 0,107,233. Préférer `yuv420p` en plage TV avec étiquettes BT.709 et 8 à 10 Mbit/s au lieu de 4,2 pour du texte d'interface ; envisager des images intermédiaires PNG plutôt que JPEG (`remotion.config.ts`).
- **Mixage publicitaire :** sonie intégrée −20,7 LUFS, alors que les plateformes visent environ −14 LUFS et ne relèvent pas les contenus plus faibles. Prévoir un mixage plus fort pour les publicités, avec une crête vraie de −1 dBTP au plus.
- **Textes « texture » nets** (profil environ 17 px, documents en plan large, mots de l'offre environ 21 px) : les flouter ou les atténuer s'ils ne sont pas à lire, ou resserrer le cadre (règle Q11).
- **Ligne d'état de l'Offre :** la poser dans une bande libre plutôt que sur le champ d'adresse (f0300).
- **Roue des langues :** viser environ 13 i d'arrêt par langue, comme dans la fiche, si la durée du plan le permet.
- **Variété :** Profil, Questions et Documents partagent la même grammaire (page blanche où apparaissent des blocs). La varier, par exemple en cadrant une seule question en gros plan.
- **Documenter dans `DESIGN_SPEC.md` les écarts assumés aux cartes et à la charte :**
  - entrées de 14 à 20 i au lieu de 24 à 36 i ;
  - vignette du projecteur à 0,16 au lieu de 0,42 ;
  - éléments retirés du final (traînées, prolongements du filet, désaturation) ;
  - halos d'atterrissage.
- **Archives du rythme :** archiver l'analyse de la grille musicale et le tableau d'erreurs après rendu (music-beat-sync §3 et §5b). Le tableau de `revue/mesures-audio.txt` peut servir de base.
- **Pages vues par la tranche (Modèles) :** partir de 80 à 85°, ou faire apparaître les pages en 2 i, pour éviter le pointillé crénelé de f1022.
- **Cadre de départ du score :** l'abaisser légèrement pour ne pas trancher la ligne « Analysez l'offre… » en haut (f0436).
- **Étiquettes POSTE, LIVRABLE, etc. :** l'application extrait bien des mots clés, mais n'affiche pas ces catégories. Acceptable comme mise en scène ; à éviter si le film doit ne montrer que l'écran réel.
- **README :** le film dure 42,3 s, pas 40 s.

## Points non vérifiables

- **Vidéos de référence de la galerie :** absentes en local. Le mouvement a été comparé aux fiches, au code des démos et aux deux affiches consultées (spotlight-hero-card, scanline-annotate-focus). La fidélité aux vidéos elles-mêmes (S2, S3, S6) n'est pas vérifiable.
- **A8, versions anglaise et sans musique :** non produites à ce stade. Un fichier `out/apply-en.mp4` daté du 16/11 à 17:53 existe, mais il est hors du périmètre de cette revue et n'a pas été examiné.
- **« Carte ou Mobile Money » :** le paiement est codé (Stripe, Flutterwave), mais `GUIDE.md` précise que ces moyens restent indisponibles sans clés de paiement, et Stripe n'ouvre de compte que dans certains pays. La disponibilité au lancement est à confirmer.
- **apply.onrender.com :** adresse « prévue » dans `DEPLOIEMENT.md` ; la mise en ligne n'a pas été constatée.
- **Audibilité réelle des bruitages :** mesurée par analyse de spectre, sans écoute possible. À confirmer sur haut-parleur de téléphone et au casque.
- **S1 (son) :** aucune trace montrant que la musique a été essayée dans le film avant d'être choisie.
- **Texte anglais** (`textes.ts`, `layout.en.json`) : hors du périmètre de cette version.
