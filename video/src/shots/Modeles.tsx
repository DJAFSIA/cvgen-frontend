// Plan 9 : les trois modeles de CV (carte card-flock-tumble, partie vol + rotation lente).
// Les trois pages PDF partent de la tranche (≈ 90°), suivent une seule spline Catmull-Rom
// (images 10 → 54, Easing.out(cubic)) jusqu'a l'escalier, puis continuent de tourner lentement
// jusqu'a la coupe : pas d'immobilite dans ce plan, aucun flou (regles de la carte).
// Version claire aux couleurs d'Apply : pas d'anneau de fumee ni de mot geant.
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { tex } from '../layout';
import { C, POLICE } from '../lib/theme';
import { TEXTES, type Lang } from '../textes';

const VOL = [10, 54] as const;
type Pose = { x: number; y: number; rx: number; ry: number; rz: number; s: number };
const CLES: (keyof Pose)[] = ['x', 'y', 'rx', 'ry', 'rz', 's'];

const catmull = (p0: number, p1: number, p2: number, p3: number, t: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
};
const spline = (k: Pose[], u: number): Pose => {
  const s = u < 0.55 ? 0 : 1;
  const lt = s === 0 ? u / 0.55 : (u - 0.55) / 0.45;
  const out = {} as Pose;
  for (const c of CLES) out[c] = catmull(k[Math.max(0, s - 1)][c], k[s][c], k[s + 1][c], k[Math.min(2, s + 2)][c], lt);
  return out;
};

// Poses de la demo, adaptees a des pages portrait (escalier serre, echelle reduite)
const CARTES: { fichier: string; k: [Pose, Pose, Pose] }[] = [
  { fichier: 'cv-classique', k: [
    { x: -20, y: -20, rx: 9, ry: 82, rz: 12, s: 0.8 },
    { x: -330, y: -70, rx: 16, ry: 44, rz: -8, s: 1.0 },
    { x: -300, y: -50, rx: 4, ry: 13, rz: -2, s: 1.16 },
  ] },
  { fichier: 'cv-moderne', k: [
    { x: 0, y: 0, rx: 8, ry: 83, rz: 12, s: 0.78 },
    { x: -20, y: -10, rx: 13, ry: 38, rz: -7, s: 1.04 },
    { x: -10, y: -16, rx: 3, ry: 11, rz: -2, s: 1.2 },
  ] },
  { fichier: 'cv-ats', k: [
    { x: 20, y: 20, rx: 7, ry: 84, rz: 12, s: 0.76 },
    { x: 300, y: 50, rx: 11, ry: 34, rz: -6, s: 1.06 },
    { x: 280, y: 18, rx: 2, ry: 9, rz: -1, s: 1.24 },
  ] },
];
const L = 420;
const H = 594;

export const Modeles: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const noms = TEXTES[lang].nomsModeles;
  const derive = (() => {
    const t = f - VOL[1] * 0.86;
    if (t <= 0) return { ry: 0, rx: 0, rz: 0 };
    const rampe = Math.min(1, t / 14) ** 2;
    return { ry: t * 0.34 * rampe, rx: t * -0.1 * rampe, rz: t * 0.05 * rampe };
  })();
  const fond = interpolate(f, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#f5f5f7', overflow: 'hidden' }}>
      {/* lumiere degradee d'Apply derriere les pages */}
      <AbsoluteFill style={{ opacity: 0.55 * fond }}>
        <div style={{ position: 'absolute', left: 560, top: 180, width: 800, height: 620, borderRadius: '50%', filter: 'blur(120px)', background: 'conic-gradient(from 200deg, #0894ff, #c959dd, #ff2e54, #ff9004, #0894ff)', transform: `rotate(${f * 0.6}deg)` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1400 }}>
        {CARTES.map((c, i) => {
          let pose: Pose;
          if (f < VOL[0]) {
            pose = c.k[0];
          } else {
            const brut = Math.min(1, (f - VOL[0]) / (VOL[1] - VOL[0]));
            pose = spline(c.k, Easing.out(Easing.cubic)(brut));
            pose = { ...pose, ry: pose.ry + derive.ry, rx: pose.rx + derive.rx, rz: pose.rz + derive.rz };
          }
          return (
            <div key={c.fichier} style={{ position: 'absolute', marginTop: -60, opacity: Math.min(1, (f + 1) / 3), transform: `translate3d(${pose.x}px, ${pose.y}px, 0) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg) scale(${pose.s})`, zIndex: 10 + i }}>
              <div style={{ width: L, height: H, borderRadius: 12, overflow: 'hidden', background: '#fff', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)' }}>
                <Img src={staticFile(tex(lang, c.fichier))} style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      {/* noms des modeles, en rangee au-dessus des pages (les pages se recouvrent) */}
      <div style={{ position: 'absolute', top: 54, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16 }}>
        {noms.map((nom, i) => {
          const p = interpolate(f, [VOL[1] - 8 + i * 4, VOL[1] + 6 + i * 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });
          return (
            <div key={nom} style={{ opacity: p, transform: `translateY(${(1 - p) * 14}px)`, padding: '12px 30px', borderRadius: 999, background: i === 1 ? C.encre : '#fff', color: i === 1 ? '#fff' : C.encre, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', fontFamily: POLICE, fontWeight: 600, fontSize: 34 }}>
              {nom}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
