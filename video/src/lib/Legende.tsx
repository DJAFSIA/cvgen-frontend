// Sous-titre narratif : pilule claire en bas de l'image, texte de 56 px (Q11 : lisible en petit).
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ENTREE } from './motion';
import { C, POLICE } from './theme';

export const Legende: React.FC<{ texte: string; duree: number }> = ({ texte, duree }) => {
  const frame = useCurrentFrame();
  const entree = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ENTREE });
  const sortie = interpolate(frame, [duree - 8, duree], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 64, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div
        style={{
          fontFamily: POLICE,
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: C.encre,
          padding: '16px 44px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.97)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 20px 50px -12px rgba(0,0,0,0.22)',
          backdropFilter: 'blur(24px) saturate(180%)',
          opacity: entree * sortie,
          transform: `translateY(${(1 - entree) * 18}px)`,
          filter: `blur(${(1 - entree) * 8}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        {texte}
      </div>
    </div>
  );
};
