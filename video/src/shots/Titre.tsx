// Plan 6 : carton de respiration (carte blur-slide) avant le plan document (C2).
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { E, lerp, seg } from '../lib/motion';
import { C, POLICE, texteDegrade } from '../lib/theme';
import { TEXTES, type Lang } from '../textes';

const Ligne: React.FC<{ mots: string[]; debut: number; ecart: number; dy: number; style: React.CSSProperties; degradeDepuis?: number }> = ({
  mots, debut, ecart, dy, style, degradeDepuis = Infinity,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', gap: '0.28em', ...style }}>
      {mots.map((m, i) => {
        const p = seg(f, debut + i * ecart, debut + i * ecart + 20, E.outCubic);
        return (
          <span key={i} style={{ opacity: p, transform: `translateY(${lerp(p, dy, 0)}px)`, filter: `blur(${(1 - p) * 10}px)`, ...(i >= degradeDepuis ? texteDegrade : {}) }}>
            {m}
          </span>
        );
      })}
    </div>
  );
};

export const Titre: React.FC<{ lang: Lang }> = ({ lang }) => {
  const t = TEXTES[lang];
  return (
    <AbsoluteFill style={{ background: '#fff', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
      <Ligne mots={t.titre} debut={3} ecart={3.5} dy={40} degradeDepuis={t.titre.length - 2}
        style={{ fontFamily: POLICE, fontWeight: 600, fontSize: 112, letterSpacing: '-0.04em', color: C.encre, lineHeight: 1.05 }} />
      <Ligne mots={t.sousTitre} debut={15} ecart={2.5} dy={26}
        style={{ fontFamily: POLICE, fontWeight: 500, fontSize: 46, letterSpacing: '-0.02em', color: C.muet }} />
    </AbsoluteFill>
  );
};
