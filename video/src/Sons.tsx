// Sons du film (references/sound-design.md). Table unique de bruitages, chaque ligne commentee.
// On y ecrit l'image ou le PIC du son doit tomber, en relatif sur SHOTS (4.5) ; l'image de depart se
// calcule en retirant le retard propre au fichier et le decalage de la piste de sortie (4.6).
// La musique est un calque separe (inputProp bgm) : versions avec et sans musique, meme timeline.
// Tous les fichiers ont une source Mixkit tracable : voir public/audio/LICENCES.md.
import React from 'react';
import { Audio, interpolate, Sequence, staticFile } from 'remotion';
import { LAYOUTS } from './layout';
import { ciblesOffre } from './shots/Offre';
import { repereQuestion } from './shots/Questions';
import type { Lang } from './textes';
import { DUREE_TOTALE, FPS, SHOTS as S, SOURCE_BEAT0 } from './timeline';

// Retard de la piste audio a la sortie (amorce de l'encodeur AAC). Mesure le 16/11/2026 sur ce
// pipeline (Remotion 4.0.484, AAC 48 kHz, mp4) par correlation croisee de 6 sondes (click-camera,
// camera-lens-shutter, switch-tap, transition-snap) : +2048 a +2064 echantillons.
const DECALAGE_SORTIE = 1.29;

// Retard du pic d'energie dans chaque fichier, en images (enveloppe RMS 5 ms, mesure le 16/11/2026)
const PIC: Record<string, number> = {
  'transition-soft.mp3': 13.1,
  'whoosh-fast.mp3': 21.6,
  'swoosh-quick.mp3': 8.8,
  'switch-click-quick.mp3': 0.3,
  'click-camera.mp3': 5.9,
  'camera-lens-shutter.mp3': 0.9,
  'air-woosh-deep.mp3': 14.8,
  'sparkle-wand.mp3': 5.1,
  'transition-snap.mp3': 3.3,
  'pop-electric.mp3': 0.6,
  'typewriter-digital.mp3': 0,
  'switch-tap.mp3': 0.3,
  'switch-light.mp3': 2.1,
  'air-whoosh-powerful.mp3': 6.9,
  'swoosh-slow.mp3': 63.6,
  'impact-deep-whoosh.mp3': 16.7,
  'sparkle-touch.mp3': 14.1,
};

const depart = (pic: number, src: string) => Math.max(0, Math.round(pic - (PIC[src] ?? 0) - DECALAGE_SORTIE));

type Son = { pic: number; src: string; volume: number; duree?: number; boucle?: boolean; note: string };

const ETAPES_LANGUES = [0.16, 0.36, 0.56];

export const tableSons = (lang: Lang): Son[] => {
  const L = LAYOUTS[lang];
  // Ecriture du document : blocs par paires (Documents.tsx), dernier bloc + 8 images de balayage
  const paires = Math.max(...[0, 1].map((c) => L.documents.blocs.filter((b) => b.col === c).length));
  const finEcriture = 6 + (paires - 1) * Math.min(3.5, 64 / Math.max(1, paires)) + 8;
  return [
    { pic: S.ouverture.from + 18, src: 'transition-soft.mp3', volume: 0.45, note: 'le mot-symbole sort du flou' },
    // la puce tombe de 4 a 22 avec depassement : elle touche la carte a l'image 11 (38 % de la courbe)
    { pic: S.profil.from + 7, src: 'whoosh-fast.mp3', volume: 0.35, note: 'le fichier PDF tombe' },
    { pic: S.profil.from + 11, src: 'switch-click-quick.mp3', volume: 0.35, note: 'le fichier touche la carte' },
    { pic: S.profil.from + 26, src: 'swoosh-quick.mp3', volume: 0.3, note: 'les coordonnees se remplissent' },
    { pic: S.profil.from + 82, src: 'swoosh-quick.mp3', volume: 0.22, note: 'le parcours se remplit' },
    { pic: S.offre.from + 12, src: 'transition-soft.mp3', volume: 0.3, note: 'la ligne de lecture apparait' },
    // Cadre verrouille quand son echelle revient a 1 (outBack, ft + 0,048 du plan)
    ...ciblesOffre(lang).map((m, i) => ({
      pic: S.offre.from + (m.ft + 0.048) * (S.offre.dur - 1),
      src: i % 2 ? 'camera-lens-shutter.mp3' : 'click-camera.mp3',
      volume: 0.34 - i * 0.01, // decroissant, jamais sous 0,28 (sinon couvert par la musique)
      duree: 20,
      note: `cadre ${i + 1} verrouille sur un mot cle (deux echantillons alternes, volume decroissant)`,
    })),
    { pic: S.score.from + 48, src: 'air-woosh-deep.mp3', volume: 0.4, note: 'la carte score s eleve (envol 44-54, temps 32)' },
    { pic: S.score.from + 57, src: 'sparkle-wand.mp3', volume: 0.32, duree: 40, note: 'premier tour du faisceau' },
    { pic: S.score.from + 126, src: 'transition-snap.mp3', volume: 0.5, note: 'la carte se repose' },
    { pic: S.questions.from + 22, src: 'transition-soft.mp3', volume: 0.3, note: 'le diagnostic s ecrit' },
    // une question toutes les 16, 14, 12, 10 images : serie qu'on peut compter, volume decroissant
    ...L.analyse.questions.slice(0, 5).map((_, i) => ({
      pic: S.questions.from + repereQuestion(i) + 2, src: 'pop-electric.mp3', volume: 0.3 - i * 0.04, note: `question ${i + 1} posee`,
    })),
    { pic: S.titre.from + 6, src: 'swoosh-quick.mp3', volume: 0.35, note: 'carton de respiration' },
    {
      pic: S.documents.from + 6, src: 'typewriter-digital.mp3', volume: 0.85, boucle: true, duree: Math.round(finEcriture - 6),
      note: 'le CV et la lettre s ecrivent (s arrete avec le dernier bloc)',
    },
    ...ETAPES_LANGUES.map((s, i) => ({
      pic: S.langues.from + Math.round(s * (S.langues.dur - 1)) + 7,
      src: i % 2 ? 'switch-light.mp3' : 'switch-tap.mp3',
      volume: i % 2 ? 0.9 : 0.4,
      note: `la roue arrive sur la langue ${i + 2}`,
    })),
    { pic: S.modeles.from + 16, src: 'air-whoosh-powerful.mp3', volume: 0.42, note: 'les trois pages s envolent' },
    // riser -> impact -> sparkle (4.3) : le riser culmine sur l'impact, coupe juste apres son pic
    // la montee culmine 3 images avant l'impact et s'arrete juste avant lui : leurs cretes ne s'additionnent
    // plus (crete vraie a +0,1 dBTP au rendu v4)
    { pic: S.final.from + 42, src: 'swoosh-slow.mp3', volume: 0.6, duree: 66, note: 'montee vers le final (la musique s efface dessous)' },
    { pic: S.final.from + 45, src: 'impact-deep-whoosh.mp3', volume: 0.5, note: 'le logo se pose (pic sonore du film)' },
    { pic: S.final.from + 62, src: 'sparkle-touch.mp3', volume: 0.32, duree: 70, note: 'le filet degrade se trace' },
  ];
};

export const Sons: React.FC<{ lang: Lang; bgm: boolean }> = ({ lang, bgm }) => (
  <>
    {bgm ? (
      <Audio
        src={staticFile('audio/house-vibez.mp3')}
        // le premier temps de la musique doit s'entendre a l'image 0 malgre le decalage de sortie
        trimBefore={Math.round(SOURCE_BEAT0 * FPS + DECALAGE_SORTIE)}
        // la musique s'efface sous la montee finale et revient juste apres l'impact du logo
        volume={(f) =>
          interpolate(
            f,
            [0, 30, S.final.from - 36, S.final.from + 4, S.final.from + 46, S.final.from + 60, DUREE_TOTALE - 50, DUREE_TOTALE],
            [0, 0.3, 0.3, 0.15, 0.15, 0.3, 0.3, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
        }
      />
    ) : null}
    {tableSons(lang).map((s, i) => (
      <Sequence key={i} from={depart(s.pic, s.src)} durationInFrames={s.duree ?? 90} name={`son-${s.src}`}>
        <Audio src={staticFile(`audio/${s.src}`)} volume={s.volume} loop={s.boucle} />
      </Sequence>
    ))}
  </>
);
