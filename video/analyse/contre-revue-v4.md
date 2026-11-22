# Contre-revue : corrections de la revue v3 dans le rendu v4 (version française)

Fichier relu : `out/apply-fr-v4.mp4` (1920×1080, 30 i/s, 1 387 images, 46,29 s, AAC 48 kHz), rendu le 22/11/2026 à 00:16. À 00:17, il était identique octet pour octet à `out/apply-fr.mp4`, que le rendu final a ensuite remplacé. « i » signifie image (1/30 s).

Ce qui a été fait :
- **Images** : les 8 planches et les 48 images de `out/qa/v4r/`, une trentaine d'images extraites en plus, et le film entier décodé (immobilité, coupes, mouvement de caméra par corrélation de phase).
- **Son** : musique recalée puis soustraite, 31 bruitages localisés. Leur audibilité a été mesurée par tiers d'octave, avec la même méthode sur la v3 et la v4. Crête et sonie mesurées.
- **A8** : vérifié sur les rendus finaux.

Revue en lecture seule. Mes pièces sont dans `out/qa/v4/contre-revue/` ; je n'ai pas touché aux fichiers du 16/11 déjà présents dans `out/qa/v4/`. Les chiffres bruts sont dans `contre-revue/mesures.txt`.

## Les 13 corrections obligatoires

1. ✓ **Police.** Tout le texte du film est en Inter :
   - légende de f0250 : glyphes identiques à Inter SemiBold rendue depuis `public/fonts`, nettement différents de la Segoe UI de la v3 (`contre-revue/police-legende-v4.png`) ;
   - logo et promesse (f0095), étiquettes et ligne d'état en capitales Inter (f0420), « 92% » (f0530), titre (f0800), langues (f1090), logo, adresse et pastilles du final (f1350).

   `theme.ts` : `POLICE = MONO = "Inter"`. `polices.ts` charge les quatre graisses et bloque le rendu tant qu'elles ne sont pas prêtes (il l'annule si l'une manque) : aucun repli possible.
2. ✓ **Offre** (f0420).
   - **Filets** : chacun aboutit au centre de sa propre étiquette, avec un coude vers x ≈ 1365 : rituels agiles → MÉTHODE, Google Analytics → OUTIL, paiement mobile → ATOUT.
   - **Coins** : quatre angles séparés de 10 px, trait de 2,5 px.
   - **Ligne d'état** : placée dans la bande libre au-dessus du cadre de texte, alignée à droite, hauteur de capitale 25 px, soit environ 34 px (f0290, f0420).
3. ✓ **Questions.**
   - Zoom 2,175 ; diagnostic lisible (f0600, f0625).
   - Questions d'environ 30 px (interligne de 44 px), réponses d'environ 32 px (f0625, f0680).
   - Pastilles de 22 px (48 px à l'écran) sur la ligne du thème, à au moins 9 px du texte de la question (f0625 : pastille sur y 383-425, texte à partir de y 437 ; f0680).
   - Repères 42 + 0/16/30/42 : pops à 618,8 / 634,8 / 648,8 / 660,8.

   Voir le nouveau défaut N1.
4. ✓ **Profil.**
   - Libellé unique et texte d'exemple effacé (`contre-revue/g0126-champs.png`, `g0186-experiences.png`, `g0202-competences.png`).
   - Montée de 6 px.
   - Caméra immobile de 225 à 252 (75 % du plan atteint), puis fondu du sous-titre.
5. ✓ **Documents.**
   - Un seul curseur à la fois (g0849 : « Amin| » seul ; g0868 ; g0884).
   - Les puces apparaissent avec leur texte, aucune n'est en avance (g0884).
   - Caméra immobile de 905 à 975.
6. ✓ **Titre.** 89 images (752-841). Titre et sous-titre complets et immobiles de 797 à 835, soit 38 i (1,27 s) (f0800, f0835).
7. ✓ **Score.**
   - Départ sur toute la section d'analyse à zoom 1 : la carte fait environ 40 % de la hauteur (f0440). Poussée jusqu'à zoom 1,6 : environ 72 % (f0530).
   - Envol à l'image 472 ; le temps 32 tombe à 471,7 dans la piste de sortie (+0,3 i). Souffle à 475,9.
   - Caméra fixe après le retour de la carte (554).

   Voir le nouveau défaut N3.
8. ✓ **Puce PDF.** Suivi de l'icône dans la v4 : position de repos franchie entre les images 113 et 114, fond du rebond à 116. Le souffle culmine à 109,9 (pendant la chute, 107-114) et le clic à 113,5, sur le contact.
9. ✓ **Extraits du final.** La carte question a sa marge et le « M » de MOTIVATION est entier (`contre-revue/f1350-carte-question.png`). L'extrait d'offre finit en fondu, sans ligne tranchée (`contre-revue/f1350-carte-offre.png`).
10. ✓ **Langues.** La phrase est centrée sur chaque mot affiché (centre mesuré à 957,5 / 957,5 / 956 / 957 px en f1010, f1040, f1065, f1090). Voir le nouveau défaut N2.
11. ✓ **Tailles de texte.** Ligne d'état et étiquettes à environ 34 px (hauteur de capitale 25 px, f0420). Pastilles finales à 34 px × 1,035 (hauteur de capitale 26 px, f1350).
12. ✓ **Son.** Mesures sur la v4, comparées à la v3 par la même méthode :
    - **Machine à écrire** (gain mesuré 0,847) : −3,7 dB en large bande face à la musique, 5 tiers d'octave sur 15 au-dessus de +6 dB, médiane 1-8 kHz +7,6 dB. En v3 : −12,7 dB, 2/15, −1,0 dB. Gain d'environ 9 dB.
    - **Musique atténuée sous la montée** : de 0,30 à 0,15 entre les images 1203 et 1243 (gains mesurés 0,298 → 0,149), puis retour à 0,30 vers 1300.
    - **Montée finale** (gain 0,74) : audible sur sa dernière seconde (−3 dB à 1258-1264, jusqu'à +14 dB à 1282-1288), contre 0,4 s en v3.
    - **Déclics de l'Offre** : de 0,34 à 0,28 (mesurés de 0,33 à 0,27).
    - **Questions** : un pop par question, quatre au total, à volume décroissant (0,30 → 0,18), au lieu de 3 pops et un souffle.
    - Remarque : le dernier déclic (click-camera, image 366) gagne 2,1 dB mais n'émerge toujours qu'au-dessus de 12 kHz (4/15 bandes). Il reste le bruitage le plus discret.
13. ✓ **Lueur du final.** Une seule lueur, sur la carte score : halo bleu autour d'elle à l'image 1262, aucun autour du CV ni de la lettre (`contre-revue/g1262-lueur-score-et-cv.png`).

**Améliorations également vérifiées :**
- **Encodage** : JPEG 95 / CRF 16, flux en yuv420p plage TV avec matrice BT.709. Les primaires et la fonction de transfert restent non étiquetées.
- **Plan Modèles** : pages partant de 82-84°, avec une apparition sur 3 images (1137-1139). Elles ne se lisent plus comme des éclats crénelés (`contre-revue/modeles-tranche-1137-1144.png`, à comparer avec `contre-revue/v3-f1022-tranche.png`).
- **Archives** : la grille musicale et les mesures de la revue v3 sont archivées dans `video/analyse/`.
- **Coupes** : toutes sur les temps de la musique, de −0,05 à +0,88 i (9 coupes, plus l'envol au temps 32), avec une image blanche à chaque coupe et le flash à l'image 1239.

## Nouveaux défauts introduits par ces changements

**N1 — Gravité moyenne : à-coups de caméra dans le plan Questions.**
- **Constat** : la caméra qui suit les questions repart à pleine vitesse à chaque question. Déplacement mesuré dans la toute première image : −38, −65, −96 puis −112 px, aux images 614, 632, 648 et 662 ; elle freine ensuite sur environ 15 i. Cela fait quatre secousses en 1,6 s, pendant que le spectateur lit.
- **Cause** : chaque segment de caméra repart de zéro avec la courbe EASE `bezier(0.2, 0.75, 0.25, 1)`, dont le départ est rapide.
- **Référence** : la fiche ai-stream-response prévoit une caméra frontale presque fixe (zoom 1,04 → 1,0).
- **Correction proposée** : un seul déplacement continu de la première à la dernière question, ou une courbe lente au départ et à l'arrivée (par exemple CAMERA, `bezier(0.33, 0, 0.15, 1)`) pour ces clés.
- **Mesures** : `contre-revue/mesures.txt` §5.

**N2 — Gravité faible : la tige « Rédigés en » glisse à chaque changement de mot.**
- **Constat** : +27 px (images 1013-1020), −59 px (1042-1051), −55 px (1071-1079). La largeur de la roue suit désormais le mot affiché et le groupe reste centré, donc la tige se déplace.
- **Référence** : la fiche vertical-word-roll-blur-cycle exige une tige fixe ; si la roue s'adapte à la largeur du mot, la tige doit être ancrée, sinon elle balance de gauche à droite.
- **Correction proposée** : ancrer la tige en position absolue, quitte à un léger décentrage des mots courts, ou centrer une fois pour toutes sur le mot final (« six langues »).

**N3 — Gravité faible : bords de capture visibles au départ du plan Score.**
- **Constat** : la nouvelle vue large (zoom 1, centrée sur la section d'analyse, soit cx = 1080) coupe la barre latérale de l'application à gauche (« e bord », « candidature », « ent », « ote »). À droite, la barre d'en-tête de la capture s'arrête net à x ≈ 1800, suivie du fond. Visible environ 1 s (images 428 à ~460) avant la poussée.
- **Preuves** : f0440, `contre-revue/f0440-bord-gauche.png`, `contre-revue/f0440-bord-droit.png`.
- **Correction proposée** : recentrer la vue de départ sur la page (cx = 960, barre latérale entière) ou zoomer à environ 1,15.

**Remarques mineures, non comptées comme défauts :**
- **Profil** : léger double filet en haut de chaque champ pendant les 3 à 4 images de la montée, car le morceau monté inclut la bordure du champ (g0126, g0202).
- **Questions** : les questions font environ 30 px, un peu sous les 32 px visés. La colonne de texte passe à 40 px des bords de l'image (2 %) et la pastille à 42 px du bord droit (f0625, f0680) : cadrage très serré, hors de la marge de sécurité habituelle de 5 %.
- **Offre** : les filets pointillés traversent la fin de chaque ligne de texte, comme un barré (« et suivre les budgets », « en gestion de projet digital », f0420). C'était déjà le cas en v3 et la revue v3 ne l'avait pas relevé.
- **Code** : l'en-tête de `Documents.tsx` décrit encore « un seul curseur bleu par colonne » et une caméra qui « respire » ; commentaire périmé, sans effet sur le film.

## A8 — versions avec et sans musique (vérifié sur les rendus finaux)

- **Son** : la différence entre version avec musique et version sans musique est la musique seule. Gain 0,298 en FR et 0,299 en EN ; résidu à −56 dB pour une différence de −20 dB : les bruitages sont identiques. Les versions sans musique ne contiennent aucune musique (corrélation 0,0008, −63,6 dB entre 1,6 et 3,2 s).
- **Image** : mêmes images à l'œil, mais pas au bit près (580 images sur 1 387 identiques entre FR avec et sans musique). L'écart moyen ne dépasse jamais 0,48 niveau sur 255 et 0,62 % des pixels au plus dépassent 8 niveaux ; les plans Titre et Langues sont identiques. Entre v4 et rendu final, à l'image 376, seuls 2 pixels diffèrent de plus de 30 niveaux. C'est du bruit de rendu et d'encodage.
- **Rendu final** `apply-fr.mp4` : −20,6 LUFS, crête vraie −1,5 dBFS. La crête de la v4 (+0,1 dBTP à l'image 1284, montée et impact simultanés), annoncée comme connue, est bien corrigée et n'est pas comptée.
- **Versions sans musique** : FR −21,9 LUFS, EN −21,8 LUFS, crête −1,5 dBFS. `apply-en.mp4` : −20,6 LUFS.

## Points non vérifiables

- **Vidéos de référence de la galerie** : toujours absentes. Fidélité aux fiches et aux démos seulement.
- **Écoute réelle** : l'audibilité est estimée par analyse de spectre, sans écoute ; à confirmer sur haut-parleur de téléphone, notamment pour le dernier déclic de l'Offre.
- **Version anglaise** : seule sa structure a été vérifiée (mêmes 1 387 images, seule la musique diffère avec la version sans musique). Textes et captures anglaises ne sont pas relus.
- **Affirmations du final** : inchangées depuis la v3 et à confirmer avant diffusion : disponibilité de « Carte ou Mobile Money » au lancement, mise en ligne effective de apply.onrender.com.
- **Rendu final, image** : vérifiée par comparaison avec la v4 seulement. Le son du final n'a été mesuré qu'en sonie et en crête ; la nouvelle montée (pic 3 i avant l'impact) n'a pas été localisée.
