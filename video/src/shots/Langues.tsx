// Plan 8 : langues (carte vertical-word-roll-blur-cycle). Tige fixe, roue de 4 mots, 3 changements
// (fenetres 0,16 / 0,36 / 0,56, chacune 0,11), courbe 0,7·outQuint + 0,3·outBack, flou vertical des
// lignes voisines, teinte bleue seulement a l'arret ; fondu du groupe en fin de plan. La largeur de la
// roue suit la largeur mesuree du mot affiche : la phrase reste centree sur ce qu'on lit.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp01, E, mixHex, seg } from '../lib/motion';
import { C, POLICE } from '../lib/theme';
import { TEXTES, type Lang } from '../textes';

const LIGNE = 176; // hauteur d'une ligne de la roue (44 du design × 4)
const ETAPES = [0.16, 0.36, 0.56];
const ACCENT = '#0071e3';
const ATTENUE = '#b9b9be';
const TAILLE = 120;
const INTERLETTRE = -0.035; // em

// Largeur reelle d'un mot en Inter 700 (mesuree une fois la police chargee, puis gardee)
const largeurs = new Map<string, number>();
const mesurer = (mot: string) => {
  const connue = largeurs.get(mot);
  if (connue !== undefined) return connue;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return mot.length * 64;
  ctx.font = `700 ${TAILLE}px ${POLICE}`;
  (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${INTERLETTRE * TAILLE}px`;
  const w = ctx.measureText(mot).width;
  if (document.fonts.check(`700 ${TAILLE}px "Inter"`)) largeurs.set(mot, w);
  return w;
};

export const Langues: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = f / Math.max(1, durationInFrames - 1);
  const tx = TEXTES[lang];
  let p = 0;
  for (const s of ETAPES) {
    const u = seg(t, s, s + 0.11);
    p += 0.7 * E.outQuint(u) + 0.3 * E.outBack(u);
  }
  const style: React.CSSProperties = { fontFamily: POLICE, fontSize: TAILLE, fontWeight: 700, letterSpacing: `${INTERLETTRE}em` };
  // Largeur de la roue : celle du mot affiche, interpolee pendant chaque changement
  const n = tx.langues.length;
  const pc = Math.min(Math.max(p, 0), n - 1);
  const i0 = Math.floor(pc);
  const i1 = Math.min(n - 1, i0 + 1);
  const largeur = mesurer(tx.langues[i0]) + (mesurer(tx.langues[i1]) - mesurer(tx.langues[i0])) * (pc - i0) + 12;
  return (
    <AbsoluteFill style={{ background: '#f5f5f7', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 44, opacity: 1 - seg(t, 0.9, 0.985) * 0.999 }}>
        <div style={{ ...style, color: C.encre }}>{tx.languesTige}</div>
        <div style={{ position: 'relative', height: LIGNE * 3, width: largeur, clipPath: 'inset(0 -2000px 0 0)' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, transform: `translateY(${LIGNE - p * LIGNE}px)` }}>
            {tx.langues.map((m, i) => {
              const d = Math.abs(i - p);
              const flou = d < 1 ? 3 * d : 3 + 2 * Math.min(d - 1, 1);
              const op = d < 1 ? 1 - 0.65 * d : Math.max(0.1, 0.35 - 0.23 * (d - 1));
              return (
                <div key={m} style={{ ...style, height: LIGNE, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', filter: `blur(${(flou * 4).toFixed(2)}px)`, opacity: op, color: mixHex(ATTENUE, ACCENT, clamp01(1 - d * 2.4)) }}>
                  {m}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
