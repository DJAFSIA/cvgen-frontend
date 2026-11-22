// Plan 1 : logo et promesse (carte blur-slide). Tuile qui se pose, mot-symbole qui sort du flou,
// promesse mot a mot (decalage 3,5 i, fenetre 20 i), puis pause de plus d'une seconde (R1).
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, ENTREE, lerp, seg } from '../lib/motion';
import { C, POLICE, texteDegrade } from '../lib/theme';
import { TEXTES, type Lang } from '../textes';

export const Tuile: React.FC<{ taille: number }> = ({ taille }) => (
  <div
    style={{
      width: taille, height: taille, borderRadius: taille * 0.23, background: C.bleu, color: '#fff',
      display: 'grid', placeItems: 'center', fontFamily: POLICE, fontWeight: 700, fontSize: taille * 0.62,
      boxShadow: '0 20px 50px -12px rgba(0,113,227,0.45)',
    }}
  >
    A
  </div>
);

export const Ouverture: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const t = TEXTES[lang];
  const tuile = seg(f, 4, 30, ENTREE);
  const marque = seg(f, 12, 36, E.outCubic);
  const mots = [...t.promesse.map((m) => [m, false] as const), ...t.promesseFin.map((m) => [m, true] as const)];
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(1400px 900px at 50% 40%, #ffffff, #f5f5f7)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
        <div style={{ opacity: seg(f, 4, 14), transform: `scale(${lerp(tuile, 0.82, 1)})` }}>
          <Tuile taille={140} />
        </div>
        <div
          style={{
            fontFamily: POLICE, fontWeight: 700, fontSize: 168, letterSpacing: '-0.045em', color: C.encre, lineHeight: 1,
            opacity: marque, transform: `translateY(${lerp(marque, 40, 0)}px)`, filter: `blur(${(1 - marque) * 10}px)`,
          }}
        >
          Apply
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.28em', marginTop: 54, fontFamily: POLICE, fontWeight: 600, fontSize: 68, letterSpacing: '-0.03em', color: C.encre }}>
        {mots.map(([m, degrade], i) => {
          const p = seg(f, 34 + i * 3.5, 34 + i * 3.5 + 20, E.outCubic);
          return (
            <span key={i} style={{ opacity: p, transform: `translateY(${lerp(p, 30, 0)}px)`, filter: `blur(${(1 - p) * 10}px)`, ...(degrade ? texteDegrade : {}) }}>
              {m}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
