// Plan 3 : lecture de l'offre (carte scanline-annotate-focus). Ligne de lecture a vitesse constante
// (t 0,06 → 0,66, sans courbe) ; un cadre ne s'ouvre qu'apres le passage de la ligne sous le mot,
// avec un ecart minimal de 0,05 ; l'etiquette suit 0,05 plus tard ; compteur en direct.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { LAYOUTS, tex } from '../layout';
import { PageCam } from '../lib/PageCam';
import { E, lerp, seg } from '../lib/motion';
import { C, MONO } from '../lib/theme';
import { TEXTES, type Lang } from '../textes';

const BLEU = '0,113,227';
const BRAS = 10; // bras des coins : moins d'un tiers du petit cote du cadre (fiche scanline)

/** Mots cles dans l'ordre de lecture, avec l'instant (fraction du plan) ou la ligne les declenche.
 *  Exporte pour caler les bruitages des cadres (Sons.tsx). */
export const ciblesOffre = (lang: Lang) => {
  const z = LAYOUTS[lang].offre.zone;
  const debut = z.y - 24;
  const course = z.h + 48;
  // La ligne passe sous le bord bas du mot ; ecart minimal de 0,05 entre deux declenchements
  let prec = -1;
  return [...LAYOUTS[lang].offre.mots]
    .sort((a, b) => a.y + a.h - (b.y + b.h))
    .map((m) => {
      const brut = 0.06 + ((m.y + m.h - debut) / course) * 0.6;
      const ft = Math.max(brut, prec + 0.05);
      prec = ft;
      return { ...m, ft };
    });
};

export const Offre: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = f / Math.max(1, durationInFrames - 1);
  const L = LAYOUTS[lang].offre;
  const z = L.zone;
  const debut = z.y - 24;
  const course = z.h + 48;
  // Cadrage : la zone de texte a gauche, la colonne d'etiquettes a droite, place pour le sous-titre
  const zoom = Math.min(780 / z.h, 1800 / (z.w + 330));
  const cx = z.x + (z.w + 330) / 2;
  const cy = z.y + z.h / 2 + (540 - 450) / zoom;
  const keys = [
    { frame: 0, cx, cy, zoom: zoom * 0.97 },
    { frame: durationInFrames, cx, cy, zoom },
  ];
  const cibles = ciblesOffre(lang);
  // Etiquettes : colonne a droite de la zone, decalees si deux mots sont trop proches
  let basPrec = -Infinity;
  const etiquettes = cibles.map((m) => {
    const y = Math.max(m.y + m.h / 2 - 17, basPrec + 6);
    basPrec = y + 34;
    return y;
  });
  const ligneY = debut + seg(t, 0.06, 0.66) * course;
  const ligneO = seg(t, 0.04, 0.09) * (1 - seg(t, 0.66, 0.71));
  const allumes = cibles.filter((m) => t >= m.ft).length;
  const fini = seg(t, 0.74, 0.8) >= 1;
  const tx = TEXTES[lang];
  return (
    <AbsoluteFill>
      <PageCam src={tex(lang, 'offre')} pageH={L.pageH} keys={keys}>
        {cibles.map((m, i) => {
          const a = seg(t, m.ft, m.ft + 0.11, E.outCubic);
          const s = lerp(E.outBack(seg(t, m.ft, m.ft + 0.13)), 1.75, 1);
          const flash = 0.1 * seg(t, m.ft + 0.04, m.ft + 0.09) * (1 - seg(t, m.ft + 0.09, m.ft + 0.22));
          const la = seg(t, m.ft + 0.05, m.ft + 0.16, E.outCubic);
          const bx = m.x - 7;
          const by = m.y - 5;
          const bw = m.w + 14;
          const bh = m.h + 10;
          const ex = z.x + z.w + 46;
          const coin = (pos: React.CSSProperties) => ({ position: 'absolute' as const, width: BRAS, height: BRAS, ...pos });
          const trait = `2.5px solid ${C.bleu}`;
          return (
            <React.Fragment key={i}>
              <div style={{ position: 'absolute', left: bx, top: by, width: bw, height: bh, opacity: Math.min(1, a * 1.6), transform: `scale(${a > 0 ? s : 1.75})` }}>
                <div style={coin({ left: 0, top: 0, borderTop: trait, borderLeft: trait })} />
                <div style={coin({ right: 0, top: 0, borderTop: trait, borderRight: trait })} />
                <div style={coin({ left: 0, bottom: 0, borderBottom: trait, borderLeft: trait })} />
                <div style={coin({ right: 0, bottom: 0, borderBottom: trait, borderRight: trait })} />
                <div style={{ position: 'absolute', inset: 2, background: `rgba(${BLEU},1)`, opacity: flash, borderRadius: 3 }} />
                <div style={{ position: 'absolute', inset: 2, background: `rgba(${BLEU},0.07)`, opacity: a, borderRadius: 3 }} />
              </div>
              {/* filet discret du mot vers le centre de SON etiquette : horizontal, puis coude si les
                  etiquettes ont du s'empiler ; il se trace de gauche a droite */}
              {(() => {
                const wy = m.y + m.h + 3; // dans l'interligne, sous le mot : le filet ne barre pas le texte
                const ly = etiquettes[i] + 17;
                const x0 = bx + bw;
                const x2 = ex - 4;
                const x1 = x2 - 34;
                const haut = Math.min(wy, ly) - 4;
                const larg = x2 - x0;
                const h = Math.abs(ly - wy) + 8;
                return (
                  <svg width={larg} height={h} style={{ position: 'absolute', left: x0, top: haut, overflow: 'visible' }}>
                    <defs>
                      <clipPath id={`filet-${i}`}>
                        <rect x={-2} y={-4} width={Math.max(0, larg * la) + 2} height={h + 8} />
                      </clipPath>
                    </defs>
                    <path
                      d={`M 0 ${wy - haut} H ${x1 - x0} L ${larg} ${ly - haut}`}
                      fill="none" stroke={`rgba(${BLEU},0.4)`} strokeWidth={2} strokeDasharray="6 5" clipPath={`url(#filet-${i})`}
                    />
                  </svg>
                );
              })()}
              <div
                style={{
                  position: 'absolute', left: ex, top: etiquettes[i], height: 34, padding: '0 12px', borderRadius: 8,
                  display: 'flex', alignItems: 'center', background: '#fff', border: `1.5px solid rgba(${BLEU},0.35)`,
                  font: `600 22px ${MONO}`, letterSpacing: 1.5, fontVariantNumeric: 'tabular-nums', color: C.bleu, whiteSpace: 'nowrap',
                  opacity: la, transform: `translateY(${lerp(la, 6, 0)}px)`,
                }}
              >
                {m.label}
              </div>
            </React.Fragment>
          );
        })}
        {/* ligne d'etat : dans la bande libre au-dessus du texte, alignee a droite, 34 px a l'ecran */}
        <div
          style={{
            position: 'absolute', right: 1920 - (z.x + z.w), top: z.y - 12 - 56 / zoom, display: 'flex', justifyContent: 'flex-end',
            font: `600 ${34 / zoom}px ${MONO}`, letterSpacing: 3 / zoom, fontVariantNumeric: 'tabular-nums',
            color: fini ? C.bleu : C.muet, opacity: seg(t, 0.02, 0.08), whiteSpace: 'nowrap',
          }}
        >
          <span style={{ padding: `${9 / zoom}px ${22 / zoom}px`, borderRadius: 999, background: 'rgba(255,255,255,0.96)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {fini ? tx.lectureFin : `${tx.lecture} · 0${allumes}/0${cibles.length}`}
          </span>
        </div>
        {/* ligne de lecture : traine degradee + coeur lumineux */}
        <div style={{ position: 'absolute', left: z.x - 18, width: z.w + 36, top: ligneY - 46, height: 46, opacity: ligneO, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent, rgba(${BLEU},0.08) 70%, rgba(${BLEU},0.02))` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, borderRadius: 2, background: `rgb(${BLEU})`, boxShadow: `0 0 10px rgba(${BLEU},0.8), 0 0 26px rgba(${BLEU},0.35)` }} />
        </div>
      </PageCam>
    </AbsoluteFill>
  );
};
