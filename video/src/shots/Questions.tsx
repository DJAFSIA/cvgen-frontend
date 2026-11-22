// Plan 5 : questions de l'IA (carte ai-stream-response). Le diagnostic arrive d'abord (repere 18,
// 12 i) et se lit ; puis chaque question se pose dans son emplacement reel (reperes 42 + 0/16/30/42…,
// de plus en plus rapproches), la pastille d'etat suit 3 i plus tard. Cadrage serre pour que le texte
// se lise une fois le film integre a la page (≈ 28 px) : la camera descend d'un seul mouvement
// continu, lent au depart et a l'arrivee, pendant que les questions arrivent (contre-revue v4 :
// un segment par question donnait quatre a-coups). Une seule pulsation a la fin, puis immobilite.
import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { LAYOUTS, tex } from '../layout';
import { Morceau, PageCam, type Cle } from '../lib/PageCam';
import { CAMERA } from '../lib/motion';
import { C } from '../lib/theme';
import type { Lang } from '../textes';

const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const EASE = Easing.bezier(0.2, 0.75, 0.25, 1);
export const REPERES = [0, 16, 30, 42, 52, 60, 66, 71];
/** Image (relative au plan) ou la question i commence a se poser. */
export const repereQuestion = (i: number) => 42 + (REPERES[i] ?? 71 + (i - 7) * 5);

const TAILLE = 22; // pastille posee sur la ligne du theme, a droite, sans toucher le texte de la question

const Pastille: React.FC<{ p: number }> = ({ p }) => {
  const anneau = interpolate(p, [0, 0.45, 0.75], [0.4, 1, 0], cl);
  const coche = interpolate(p, [0.62, 1], [0, 1], cl);
  return (
    <div style={{ position: 'absolute', width: TAILLE, height: TAILLE }}>
      <div style={{ position: 'absolute', inset: 2, borderRadius: 99, border: '2px solid rgba(0,113,227,0.25)', borderTopColor: C.bleu, opacity: anneau, transform: `rotate(${p * 160}deg)` }} />
      <div style={{ position: 'absolute', inset: 1, borderRadius: 99, background: C.bleu, opacity: coche, transform: `scale(${0.72 + 0.28 * coche})`, display: 'grid', placeItems: 'center' }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3.4 8.3 6.6 11l6-6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
};

export const Questions: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const L = LAYOUTS[lang].analyse;
  const Q = L.questions;
  // Zoom de lecture : la colonne de texte remplit l'ecran a 5 % des bords ; bande utile au-dessus du sous-titre
  const zoom = Math.min(2.1, 1728 / Q[0].w);
  const cx = Q[0].x + Q[0].w / 2;
  const centreUtile = 450; // centre (ecran) de la bande libre au-dessus du sous-titre
  const viser = (haut: number, bas: number) => (haut + bas) / 2 + (540 - centreUtile) / zoom;
  const debut = viser(L.titreAffiner.y - 10, L.diagnostic.y + L.diagnostic.h + 30);
  // de la synthese jusqu'aux deux dernieres questions, en un seul mouvement
  const n = Q.length;
  const fin = viser(n > 1 ? Q[n - 2].y : L.diagnostic.y, Q[n - 1].y + Q[n - 1].h);
  const keys: Cle[] = [
    { frame: 0, cx, cy: debut, zoom: zoom * 1.03 },
    { frame: repereQuestion(0) - 4, cx, cy: debut, zoom },
    { frame: repereQuestion(n - 1) + 16, cx, cy: fin, zoom },
  ];
  const resume = interpolate(f, [18, 30], [0, 1], { ...cl, easing: EASE });
  const finCascade = repereQuestion(Q.length - 1) + 12 + 6;
  const pulsation = interpolate(f, [finCascade, finCascade + 5, finCascade + 10], [0, 0.55, 0], cl);
  const fond = tex(lang, 'analyse-sans-questions');
  const plein = tex(lang, 'analyse');
  return (
    <AbsoluteFill>
      <PageCam src={fond} pageH={L.pageH} keys={keys} ease={CAMERA}>
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - 100 * resume}% 0 0)` }}>
          <div style={{ opacity: resume, transform: `translateY(${10 * (1 - resume)}px)` }}>
            <Morceau src={plein} pageH={L.pageH} r={L.diagnostic} pad={3} />
          </div>
        </div>
        {Q.map((q, i) => {
          const cue = repereQuestion(i);
          const corps = interpolate(f, [cue, cue + 12], [0, 1], { ...cl, easing: EASE });
          const etat = interpolate(f, [cue + 3, cue + 11], [0, 1], { ...cl, easing: EASE });
          if (corps <= 0) return null;
          return (
            <div key={i} style={{ position: 'absolute', inset: 0, opacity: corps, transform: `translateY(${22 * (1 - corps)}px)`, filter: `blur(${6 * (1 - corps)}px)` }}>
              <Morceau src={plein} pageH={L.pageH} r={q} pad={2} />
              <div style={{ position: 'absolute', left: q.x + q.w - TAILLE, top: q.y - 6 }}>
                <Pastille p={etat} />
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: L.affiner.x, top: L.affiner.y, width: L.affiner.w, height: L.affiner.h, borderRadius: 18, boxShadow: `0 0 0 2px rgba(0,113,227,${pulsation}), 0 0 36px rgba(0,113,227,${pulsation * 0.5})` }} />
      </PageCam>
    </AbsoluteFill>
  );
};
