// Plan 10 : photo de groupe autour du logo (carte outro-group-photo-launch, parametres de la demo).
// Un element de chaque fonction vue vole depuis les bords (repere 4 + 3 i, vol 12 i, atterrissage
// avec depassement), la page d'accueil se floute derriere, la grue descend (rotateX 4° → 0),
// le logo s'imprime lettre a lettre (42 + 1,8 i), filet degrade, adresse, pause finale (R1).
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { LAYOUTS, tex } from '../layout';
import { C, DEGRADE, POLICE } from '../lib/theme';
import { TEXTES, type Lang } from '../textes';
import { Tuile } from './Ouverture';

const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const VOL = Easing.bezier(0.34, 1.4, 0.44, 1);
const GRUE = Easing.bezier(0.3, 0, 0.2, 1);

type Element = { cle: string; w: number; h: number; cx: number; cy: number; rot: number; dx: number; dy: number; cue: number; rayon: number; contenu: React.ReactNode };

const Pilule: React.FC<{ texte: string; sombre?: boolean }> = ({ texte, sombre }) => (
  <div style={{ width: '100%', height: '100%', borderRadius: 999, display: 'grid', placeItems: 'center', fontFamily: POLICE, fontWeight: 600, fontSize: 34, letterSpacing: '-0.01em', background: sombre ? C.encre : '#fff', color: sombre ? '#fff' : C.encre, whiteSpace: 'nowrap' }}>
    {texte}
  </div>
);

/** Morceau de capture mis a l'echelle d'une boite de taille w × h ; fondu en bas si l'extrait coupe un texte. */
const Extrait: React.FC<{ src: string; pageH: number; r: { x: number; y: number; w: number; h: number }; w: number; fondu?: boolean }> = ({ src, pageH, r, w, fondu }) => {
  const k = w / r.w;
  const masque = fondu ? 'linear-gradient(to bottom, #000 72%, transparent 96%)' : undefined;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#fff', WebkitMaskImage: masque, maskImage: masque }}>
      <Img src={staticFile(src)} style={{ position: 'absolute', left: -r.x * k, top: -r.y * k, width: 1920 * k, height: pageH * k, maxWidth: 'none' }} />
    </div>
  );
};

export const Final: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tx = TEXTES[lang];
  const Lay = LAYOUTS[lang];
  const carteScore = Lay.analyse.carteScore;
  // Carte des coordonnees = celle qui contient le champ « nom complet »
  const nom = Lay.profil.champs.find((c) => c.cle === 'nom_complet_cv') ?? Lay.profil.champs[0];
  const carteProfil = Lay.profil.cartes.find((c) => c.x <= nom.x && c.y <= nom.y && c.x + c.w >= nom.x + nom.w && c.y + c.h >= nom.y + nom.h) ?? Lay.profil.cartes[0];
  // marge interieure autour de la question (le theme n'est plus colle au bord) ; l'offre finit en fondu
  const q0 = Lay.analyse.questions[0];
  const question = { x: q0.x - 18, y: q0.y - 14, w: q0.w + 36, h: q0.h + 26 };
  const offre = { ...Lay.offre.zone, h: Math.min(Lay.offre.zone.h, 230) };
  const larg = (r: { w: number; h: number }, w: number) => ({ w, h: (r.h * w) / r.w });

  const els: Element[] = [
    { cle: 'profil', ...larg(carteProfil, 520), cx: 400, cy: 215, rot: -4, dx: -520, dy: -60, cue: 4, rayon: 18, contenu: <Extrait src={tex(lang, 'profil-plein')} pageH={Lay.profil.pageH} r={carteProfil} w={520} /> },
    { cle: 'offre', ...larg(offre, 500), cx: 1530, cy: 200, rot: 4, dx: 520, dy: -60, cue: 7, rayon: 14, contenu: <Extrait src={tex(lang, 'offre')} pageH={Lay.offre.pageH} r={offre} w={500} fondu /> },
    { cle: 'score', ...larg(carteScore, 250), cx: 250, cy: 610, rot: -5, dx: -500, dy: 0, cue: 10, rayon: 18, contenu: <Img src={staticFile(tex(lang, 'score-4x'))} style={{ width: '100%', height: '100%' }} /> },
    { cle: 'cv', w: 300, h: 424, cx: 1660, cy: 600, rot: 5, dx: 500, dy: 0, cue: 13, rayon: 10, contenu: <Img src={staticFile(tex(lang, 'cv-moderne'))} style={{ width: '100%', height: '100%' }} /> },
    { cle: 'question', ...larg(question, 560), cx: 470, cy: 895, rot: 3, dx: -300, dy: 320, cue: 16, rayon: 14, contenu: <Extrait src={tex(lang, 'analyse')} pageH={Lay.analyse.pageH} r={question} w={560} /> },
    { cle: 'lettre', w: 250, h: 354, cx: 1520, cy: 880, rot: -3, dx: 300, dy: 320, cue: 19, rayon: 10, contenu: <Img src={staticFile(tex(lang, 'lettre'))} style={{ width: '100%', height: '100%' }} /> },
    { cle: 'gratuit', w: 470, h: 80, cx: 960, cy: 140, rot: -1.5, dx: 0, dy: -240, cue: 22, rayon: 999, contenu: <Pilule texte={tx.gratuit} sombre /> },
    { cle: 'paiement', w: 450, h: 80, cx: 670, cy: 1000, rot: 1.5, dx: -120, dy: 260, cue: 25, rayon: 999, contenu: <Pilule texte={tx.paiement} /> },
    { cle: 'langues', w: 470, h: 80, cx: 1150, cy: 1000, rot: -2, dx: 120, dy: 260, cue: 28, rayon: 999, contenu: <Pilule texte={tx.languesPuce} /> },
  ];

  const flou = interpolate(f, [0, 24], [0, 14], { ...cl, easing: Easing.bezier(0.4, 0, 0.4, 1) });
  const filet = interpolate(f, [58, 70], [0, 1], { ...cl, easing: Easing.bezier(0.3, 0, 0.2, 1) });
  const adresse = interpolate(f, [68, 80], [0, 1], cl);
  const recul = interpolate(f, [42, 50], [0, 1], cl);
  const grue = interpolate(f, [0, 40], [0, 1], { ...cl, easing: GRUE });
  const pousse = interpolate(f, [40, durationInFrames], [0, 1], cl);
  const echelle = 1.06 - 0.06 * grue + 0.035 * pousse;
  const balayage = interpolate(f, [2, 14], [-700, 2020], { ...cl, easing: Easing.bezier(0.4, 0, 0.6, 1) });
  const balayageO = interpolate(f, [2, 5, 11, 14], [0, 0.35, 0.35, 0], cl);
  const scene = interpolate(f, [42, 50, 58], [0, 0.9, 0.6], cl);
  const tuile = interpolate(f, [40, 52], [0, 1], { ...cl, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
  const sortie = interpolate(f, [durationInFrames - 12, durationInFrames], [0, 1], cl);
  const lettres = 'Apply'.split('');
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      <AbsoluteFill style={{ transform: `perspective(1400px) rotateX(${4 * (1 - grue)}deg) scale(${echelle})`, transformOrigin: '50% 45%' }}>
        <Img src={staticFile(tex(lang, 'accueil'))} style={{ position: 'absolute', inset: 0, width: 1920, height: 1080, filter: `blur(${flou}px)` }} />
        <AbsoluteFill style={{ background: 'radial-gradient(1200px 800px at 50% 48%, rgba(255,255,255,0.96), rgba(255,255,255,0.8) 60%, rgba(245,245,247,0.7))' }} />
        {els.map((el) => {
          if (f < el.cue) return null;
          const t = interpolate(f, [el.cue, el.cue + 12], [0, 1], { ...cl, easing: VOL });
          const op = interpolate(f, [el.cue, el.cue + 3], [0, 1], cl);
          const air = Math.max(0, 1 - t);
          // une seule lueur d'atterrissage, sur la carte score (heros du film) : pas de reflets en serie
          const lueur = el.cle === 'score' ? interpolate(f, [el.cue + 12, el.cue + 18], [0.35, 0], cl) : 0;
          return (
            <div
              key={el.cle}
              style={{
                position: 'absolute', left: el.cx - el.w / 2, top: el.cy - el.h / 2, width: el.w, height: el.h,
                transform: `translate(${el.dx * (1 - t)}px, ${el.dy * (1 - t)}px) rotate(${el.rot * (2 - t)}deg) scale(${1.12 - 0.12 * t})`,
                borderRadius: el.rayon, overflow: 'hidden', opacity: op * (1 - 0.12 * recul),
                boxShadow: `0 ${10 + 26 * air}px ${24 + 46 * air}px rgba(0,0,0,${0.12 + 0.08 * air}), 0 0 0 1px rgba(0,0,0,0.05), 0 0 ${40 * lueur}px rgba(0,113,227,${lueur})`,
              }}
            >
              {el.contenu}
            </div>
          );
        })}
      </AbsoluteFill>
      {/* lumiere de scene derriere le logo : degrade d'Apply, tres doux */}
      <AbsoluteFill style={{ opacity: scene, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 560, top: 330, width: 800, height: 380, borderRadius: '50%', filter: 'blur(90px)', background: 'conic-gradient(from 90deg, #0894ff, #c959dd, #ff2e54, #ff9004, #0894ff)', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(640px 320px at 960px 500px, rgba(255,255,255,0.95), rgba(255,255,255,0) 75%)' }} />
      </AbsoluteFill>
      {balayageO > 0 ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: balayage - 300, width: 600, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,1) 50%, rgba(255,255,255,0))', opacity: balayageO }} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: -40 }}>
          <div style={{ opacity: tuile, transform: `translateY(${(1 - tuile) * 28}px) scale(${1.35 - 0.35 * tuile})`, filter: `blur(${(1 - tuile) * 8}px)` }}>
            <Tuile taille={124} />
          </div>
          <div style={{ display: 'flex', fontFamily: POLICE, fontWeight: 700, fontSize: 156, letterSpacing: '-0.045em', color: C.encre, lineHeight: 1 }}>
            {lettres.map((ch, i) => {
              const d = Math.round(42 + (i + 1) * 1.8);
              const t = interpolate(f, [d, d + 8], [0, 1], { ...cl, easing: Easing.bezier(0.2, 0.75, 0.3, 1) });
              return (
                <span key={i} style={{ display: 'inline-block', opacity: t, transform: `translateY(${(1 - t) * 28}px) scale(${1.35 - 0.35 * t})`, filter: `blur(${(1 - t) * 8}px)` }}>
                  {ch}
                </span>
              );
            })}
          </div>
        </div>
        <div style={{ height: 6, width: 300, marginTop: 36, borderRadius: 3, background: DEGRADE, transform: `scaleX(${filet})` }} />
        <div style={{ marginTop: 30, fontFamily: POLICE, fontWeight: 500, fontSize: 40, letterSpacing: '-0.01em', color: C.muet, opacity: adresse, transform: `translateY(${(1 - adresse) * 10}px)` }}>
          {tx.adresse}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#fff', opacity: sortie, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
