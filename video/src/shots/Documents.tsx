// Plan 7 : le CV et la lettre s'ecrivent (carte document-typewriter-reveal). Les blocs des deux
// colonnes s'ecrivent par paires (le n-ieme bloc du CV avec le n-ieme de la lettre) ; un cache blanc
// se retire de gauche a droite ; un seul curseur bleu, sur le bloc le plus recent (le CV d'abord) ;
// les puces des listes sont masquees avec leur texte ; la camera part du nom en gros plan, s'ouvre sur
// la page entiere (image 64) puis reste immobile.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { cadrer, LAYOUTS, tex, union } from '../layout';
import { PageCam } from '../lib/PageCam';
import { C } from '../lib/theme';
import type { Lang } from '../textes';

const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const REVEAL = Easing.bezier(0.4, 0, 0.6, 1);
const WIPE = 8;

export const Documents: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const L = LAYOUTS[lang].documents;
  const parCol = [0, 1].map((c) => L.blocs.filter((b) => b.col === c).sort((a, b) => a.y - b.y || a.x - b.x));
  const paires = Math.max(parCol[0].length, parCol[1].length);
  const pas = Math.min(3.5, 64 / Math.max(1, paires));
  const blocs = parCol.flatMap((liste) => liste.map((b, i) => ({ ...b, cue: 6 + i * pas })));
  const vue = cadrer(union([L.barre, ...L.colonnes]), { hautUtile: 800, centreY: 465, max: 1.4 });
  const premier = parCol[0][0];
  const keys = [
    { frame: 0, cx: premier.x + 320, cy: premier.y + 80, zoom: 1.5 },
    { frame: 22, cx: premier.x + 330, cy: premier.y + 110, zoom: 1.44 },
    { frame: 64, cx: vue.cx, cy: vue.cy, zoom: vue.zoom },

  ];
  // Un seul curseur : sur le bloc le plus recent, toutes colonnes confondues (le CV d'abord a egalite)
  let curseur = -1;
  blocs.forEach((b, i) => {
    if (f < b.cue || f > b.cue + WIPE + 2) return;
    const c = curseur >= 0 ? blocs[curseur] : null;
    if (!c || b.cue > c.cue || (b.cue === c.cue && b.col < c.col)) curseur = i;
  });
  // Bord gauche de chaque colonne : un bloc en retrait est un element de liste, sa puce est masquee aussi
  const gauche = [0, 1].map((c) => Math.min(...parCol[c].map((b) => b.x)));
  return (
    <AbsoluteFill>
      <PageCam src={tex(lang, 'documents')} pageH={L.pageH} keys={keys}>
        {blocs.map((b, i) => {
          const cache = interpolate(f, [b.cue, b.cue + WIPE], [1, 0], { ...cl, easing: REVEAL });
          const retrait = b.x - gauche[b.col];
          // puce d'un element de liste : 30 px au plus, pour ne jamais couvrir un bloc voisin deja ecrit
          const puce = b.tag === 'li' ? 30 : retrait > 8 ? Math.min(30, retrait) + 4 : 4;
          const bx = b.x - puce;
          const bw = b.w + puce + 8;
          const caretH = Math.min(26, b.h - 2);
          return (
            <React.Fragment key={i}>
              {cache > 0 ? (
                <div style={{ position: 'absolute', left: bx, top: b.y - 3, width: bw, height: b.h + 6, overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${cache * 100}%`, background: '#fff' }} />
                </div>
              ) : null}
              {curseur === i ? (
                <div
                  style={{
                    position: 'absolute', left: bx + bw * (1 - cache), top: b.y + (b.h - caretH) / 2, width: 3, height: caretH, borderRadius: 2,
                    background: C.bleu, opacity: cache > 0 ? 1 : interpolate(f, [b.cue + WIPE, b.cue + WIPE + 2], [1, 0], cl),
                  }}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </PageCam>
    </AbsoluteFill>
  );
};
