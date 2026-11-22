// Plan 4 : la carte score, heros du film (carte spotlight-hero-card, parametres de la demo).
// Page d'analyse entiere ; projecteur qui cherche puis se fixe (0–44) ; poussee en biais de la page
// entiere (zoom 1) jusqu'au gros plan de la carte (zoom 1,6 ; rotY 34°, rotX 8°) ; la carte s'eleve
// (44–54, depassement : image 44 = temps 32 de la musique), plane (54–108), faisceau en deux tours
// (56–70 rapide, 76–96 lent), se repose (108–126), puis immobilite. L'anneau se remplit et les
// chiffres roulent pendant l'envol.
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { cadrer, LAYOUTS, tex } from '../layout';
import { PageCam, type Cle } from '../lib/PageCam';
import { C, POLICE } from '../lib/theme';
import type { Lang } from '../textes';

const PUSH = Easing.bezier(0.35, 0, 0.2, 1);
const POP = Easing.bezier(0.2, 1.25, 0.3, 1);
const RESEAT = Easing.bezier(0.4, 0, 0.3, 1.05);
const ENTREE = Easing.bezier(0.16, 1, 0.3, 1);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const RAYON = 18;

const Chiffres: React.FC<{ valeur: number; debut: number; taille: number }> = ({ valeur, debut, taille }) => {
  const f = useCurrentFrame();
  const texte = String(valeur);
  const h = taille * 1.12;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', fontFamily: POLICE, fontWeight: 700, fontSize: taille, color: C.encre, lineHeight: `${h}px` }}>
      {texte.split('').map((ch, i) => {
        const cible = Number(ch);
        const p = interpolate(f, [debut + i * 4, debut + i * 4 + 24], [0, 1], { ...cl, easing: Easing.bezier(0.25, 0.8, 0.25, 1) });
        const decal = (10 + cible) * p * h;
        return (
          <span key={i} style={{ display: 'inline-block', height: h, overflow: 'hidden' }}>
            <span style={{ display: 'block', transform: `translateY(${-decal}px)` }}>
              {'01234567890123456789'.split('').map((d, j) => (
                <span key={j} style={{ display: 'block', height: h, fontVariantNumeric: 'tabular-nums' }}>{d}</span>
              ))}
            </span>
          </span>
        );
      })}
      <span style={{ height: h }}>%</span>
    </span>
  );
};

export const Score: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const L = LAYOUTS[lang].analyse;
  const carte = L.carteScore;
  const mcx = carte.x + carte.w / 2;
  const mcy = carte.y + carte.h / 2;
  // Vue de depart : toute la section d'analyse (en-tete, carte, listes, conseil), zoom 1 au plus
  const section = { x: carte.x, y: carte.y - 70, w: L.listes[0].x + L.listes[0].w - carte.x, h: L.affiner.y - 20 - (carte.y - 70) };
  const vue = cadrer(section, { hautUtile: 820, centreY: 480, max: 1 });
  const zoomPres = Math.min(1.6, 700 / carte.h);
  const keys: Cle[] = [
    { frame: 0, cx: vue.cx, cy: vue.cy, zoom: vue.zoom, rotX: 0, rotY: 0, rotZ: 0, persp: 1200 },
    { frame: 28, cx: vue.cx, cy: vue.cy, zoom: vue.zoom, rotX: 0, rotY: 0, rotZ: 0, persp: 1200 },
    { frame: 44, cx: mcx - 30, cy: mcy + 30, zoom: zoomPres, rotX: 8, rotY: 34, rotZ: 2, persp: 1200 },
    { frame: 200, cx: mcx - 30, cy: mcy + 30, zoom: zoomPres, rotX: 8, rotY: 34, rotZ: 2, persp: 1200 },
  ];
  // Position ecran de la carte dans la vue de depart, pour y amener le projecteur
  const sx = ((960 + (mcx - vue.cx) * vue.zoom) / 1920) * 100;
  const sy = ((540 + (mcy - vue.cy) * vue.zoom) / 1080) * 100;
  const spotX = interpolate(f, [4, 8, 16, 22, 28, 44], [25, 25, 72, 44, sx, 50], { ...cl, easing: Easing.bezier(0.4, 0, 0.3, 1) });
  const spotY = interpolate(f, [4, 8, 16, 22, 28, 44], [28, 28, 42, 60, sy, 47], { ...cl, easing: Easing.bezier(0.4, 0, 0.3, 1) });
  const spotOn = interpolate(f, [2, 10], [0, 1], cl);
  const pool = interpolate(f, [22, 28, 44], [620, 420, 380], { ...cl, easing: Easing.bezier(0.4, 0, 0.3, 1) });
  const pulse = interpolate(f, [28, 32, 37], [0, 0.06, 0], cl);
  const vignette = interpolate(f, [22, 28, 44], [0.06, 0.13, 0.16], cl);

  const rise = interpolate(f, [44, 54], [0, 1], { ...cl, easing: POP });
  const reseat = interpolate(f, [108, 126], [0, 1], { ...cl, easing: RESEAT });
  const lift = rise * (1 - reseat);
  const bob = Math.sin(((f - 54) / 40) * Math.PI * 2) * 4 * lift;
  const z = 110 * lift + bob;
  const press = interpolate(f, [122, 125, 126], [1, 0.997, 1], cl);
  const ombre = `0 ${8 * lift}px ${10 + 12 * lift}px rgba(0,0,0,${0.12 * lift}), 0 ${46 * lift}px ${90 * lift}px rgba(0,0,0,${0.16 * lift})`;
  const creux = Math.min(1, rise * 2) * (1 - reseat);
  const contact = interpolate(f, [122, 126, 130], [0, 1, 0], cl);
  const tour1 = interpolate(f, [56, 70], [0, 1], cl);
  const tour2 = interpolate(f, [76, 96], [0, 1], { ...cl, easing: Easing.bezier(0.4, 0, 0.4, 1) });
  const enTour1 = f >= 55 && f <= 71;
  const enTour2 = f >= 75 && f <= 97;
  const trace = interpolate(f, [96, 108], [0.35, 0], cl);

  // Anneau et chiffres rejoues par-dessus la capture (le score fige y est masque)
  const remplissage = interpolate(f, [46, 88], [0, 1], { ...cl, easing: ENTREE });
  const a = { x: L.anneau.x - carte.x, y: L.anneau.y - carte.y, w: L.anneau.w, h: L.anneau.h };
  const score = L.score;
  const circ = 2 * Math.PI * 52;
  const bw = carte.w + 6;
  const bh = carte.h + 6;
  return (
    <AbsoluteFill style={{ background: '#f5f5f7' }}>
      <PageCam src={tex(lang, 'analyse')} pageH={L.pageH} keys={keys} ease={PUSH}>
        <div style={{ transformStyle: 'preserve-3d' }}>
          {creux > 0.02 ? (
            <div style={{ position: 'absolute', left: carte.x - 2, top: carte.y - 2, width: carte.w + 4, height: carte.h + 4, borderRadius: RAYON, background: '#f5f5f7', opacity: creux }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: RAYON, border: `1.5px solid ${C.bleu}`, opacity: Math.min(1, 0.45 * (1 - reseat)) + contact * 0.6 }} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: carte.x, top: carte.y, width: carte.w, height: carte.h, transform: `translateZ(${z}px) scale(${press})`, transformStyle: 'preserve-3d' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: RAYON, overflow: 'hidden', boxShadow: f >= 126 ? 'none' : ombre, background: '#fff' }}>
              <Img src={staticFile(tex(lang, 'score-4x'))} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              {/* anneau rejoue */}
              <div style={{ position: 'absolute', left: a.x - 6, top: a.y - 6, width: a.w + 12, height: a.h + 12, borderRadius: '50%', background: '#fff' }} />
              <svg viewBox="0 0 120 120" style={{ position: 'absolute', left: a.x, top: a.y, width: a.w, height: a.h, transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="52" stroke="#e8e8ed" strokeWidth="9" fill="none" />
                <circle cx="60" cy="60" r="52" stroke={C.bleu} strokeWidth="9" fill="none" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - (remplissage * score) / 100)} />
              </svg>
              <div style={{ position: 'absolute', left: a.x, top: a.y, width: a.w, height: a.h, display: 'grid', placeItems: 'center', opacity: interpolate(f, [46, 52], [0, 1], cl) }}>
                <Chiffres valeur={score} debut={42} taille={L.pourcent.h * 0.82} />
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.5), transparent 40%)', opacity: lift }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, borderRadius: RAYON, boxShadow: `inset 0 0 0 1px rgba(255,255,255,${0.7 * lift})` }} />
            {(enTour1 || enTour2) && lift > 0.4 ? (
              <svg width={bw} height={bh} viewBox={`0 0 ${bw} ${bh}`} style={{ position: 'absolute', left: -3, top: -3, overflow: 'visible', opacity: enTour1 ? 1 : 0.62, filter: 'drop-shadow(0 0 6px rgba(0,113,227,0.9)) drop-shadow(0 0 18px rgba(80,160,255,0.55))' }}>
                <rect x={2} y={2} width={bw - 4} height={bh - 4} rx={RAYON} fill="none" stroke={C.bleu} strokeWidth={enTour1 ? 5 : 3.5} strokeLinecap="round" pathLength={1} strokeDasharray="0.14 1" strokeDashoffset={-(enTour1 ? tour1 : tour2)} />
                <rect x={2} y={2} width={bw - 4} height={bh - 4} rx={RAYON} fill="none" stroke="rgba(240,248,255,0.98)" strokeWidth={enTour1 ? 2.5 : 1.75} strokeLinecap="round" pathLength={1} strokeDasharray="0.14 1" strokeDashoffset={-(enTour1 ? tour1 : tour2)} />
              </svg>
            ) : null}
            {trace > 0.01 ? <div style={{ position: 'absolute', inset: -3, borderRadius: RAYON + 3, border: `1.5px solid ${C.bleu}`, opacity: trace }} /> : null}
          </div>
        </div>
      </PageCam>
      {/* projecteur froid : cercle de lumiere, le reste s'assombrit legerement */}
      <AbsoluteFill
        style={{
          opacity: spotOn,
          background: `radial-gradient(${pool * (1 + pulse)}px ${pool * 0.8 * (1 + pulse)}px at ${spotX}% ${spotY}%, rgba(255,255,255,0.28), rgba(255,255,255,0.05) 45%, rgba(18,22,30,${vignette}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
