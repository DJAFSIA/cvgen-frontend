// Plan 2 : le CV importe remplit le profil (carte product-card-progressive-assemble).
// Fond = page profil vide ; chaque champ rempli (meme page, meme position) se pose a son tour.
// Calendrier "images de recette" en 60e (F) comme la demo, applique a la duree du plan.
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { cadrer, LAYOUTS, tex, union } from '../layout';
import { Morceau, PageCam } from '../lib/PageCam';
import { ATTERRISSAGE, E, lerp, seg } from '../lib/motion';
import { C, POLICE } from '../lib/theme';
import { TEXTES, type Lang } from '../textes';

// Ordre et instant (en 60e de plan) de chaque champ : coordonnees groupees, puis titre, puis parcours
const RECETTE: Record<string, number> = {
  nom_complet_cv: 8, email_cv: 10, telephone: 12, adresse: 14, titre_profil: 18,
  experiences: 30, formations: 33, competences: 36, langues: 40,
};
// Hauteur du libelle au-dessus de chaque champ (CSS px de la page) : seul le champ de saisie se
// remplit, le libelle de la page vide reste en place (pas de libelle dedouble).
const LIBELLE = 25.5;
// Montee du champ rempli : 6 px (fiche product-card : au-dela de 20 px, le mouvement contredit la poussee)
const MONTEE = 6;

export const Profil: React.FC<{ lang: Lang }> = ({ lang }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const L = LAYOUTS[lang].profil;
  const t = (f / Math.max(1, durationInFrames - 1)) as number;
  const F = (r: number) => r / 60;
  // Cadrage lisible : d'abord la carte d'import et les coordonnees, puis la camera descend
  // avec les champs qui se remplissent (parcours, competences, langues) et pousse legerement.
  const champ = (cle: string) => L.champs.find((c) => c.cle === cle) ?? L.champs[0];
  const haut = cadrer(union([L.importCarte, champ('titre_profil')]), { hautUtile: 760, centreY: 470, max: 1.25 });
  const bas = cadrer(union([champ('experiences'), champ('langues')]), { hautUtile: 700, centreY: 430, max: 1.25 });
  const zoom = Math.min(haut.zoom, bas.zoom);
  // la poussee s'arrete a 75 % du plan, puis la camera est immobile (fiche product-card)
  const keys = [
    { frame: 0, cx: haut.cx, cy: haut.cy, zoom },
    { frame: 46, cx: haut.cx, cy: haut.cy, zoom: zoom * 1.02 },
    { frame: 96, cx: bas.cx, cy: bas.cy, zoom: zoom * 1.04 },
    { frame: Math.round(durationInFrames * 0.75), cx: bas.cx, cy: bas.cy, zoom: zoom * 1.06 },
  ];
  // Puce du fichier PDF qui tombe dans la carte d'import (atterrissage avec leger rebond)
  const chute = seg(f, 4, 22, ATTERRISSAGE);
  const chip = L.importCarte;
  const halo = seg(f, 20, 26) * (1 - seg(f, 30, 44));
  const chipSort = seg(t, F(34), F(40));
  return (
    <PageCam src={tex(lang, 'profil-vide')} pageH={L.pageHVide} keys={keys}>
      {L.champs.map((c) => {
        const r = RECETTE[c.cle] ?? 44;
        const k = seg(t, F(r), F(r) + 0.1, E.outCubic);
        if (k <= 0) return null;
        const champ = { x: c.x, y: c.y + LIBELLE, w: c.w, h: c.h - LIBELLE };
        return (
          <React.Fragment key={c.cle}>
            {/* le texte d'exemple de la page vide s'efface sous la valeur qui arrive */}
            <div style={{ position: 'absolute', left: champ.x + 2, top: champ.y + 2, width: champ.w - 4, height: champ.h - 4, borderRadius: 10, background: '#fff', opacity: Math.min(1, k * 4) }} />
            <div style={{ position: 'absolute', inset: 0, opacity: Math.min(1, k * 2), transform: `translateY(${lerp(k, MONTEE, 0)}px)` }}>
              <Morceau src={tex(lang, 'profil-plein')} pageH={L.pageH} r={champ} pad={-2} />
            </div>
          </React.Fragment>
        );
      })}
      {/* halo bleu sur la carte d'import a l'arrivee du fichier */}
      <div
        style={{
          position: 'absolute', left: chip.x - 4, top: chip.y - 4, width: chip.w + 8, height: chip.h + 8, borderRadius: 22,
          boxShadow: `0 0 0 3px rgba(0,113,227,${0.55 * halo}), 0 0 40px rgba(0,113,227,${0.25 * halo})`,
        }}
      />
      <div
        style={{
          position: 'absolute', left: chip.x + chip.w / 2 - 230, top: chip.y + chip.h / 2 - 48, width: 460, height: 96,
          transform: `translateY(${(1 - chute) * -260}px) rotate(${(1 - chute) * -6}deg)`,
          opacity: seg(f, 4, 9) * (1 - chipSort),
          background: '#fff', borderRadius: 18, boxShadow: '0 20px 50px -12px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', boxSizing: 'border-box',
          fontFamily: POLICE,
        }}
      >
        <div style={{ width: 52, height: 64, borderRadius: 8, background: '#e5383b', color: '#fff', fontWeight: 700, fontSize: 17, display: 'grid', placeItems: 'center' }}>PDF</div>
        <div style={{ fontSize: 26, fontWeight: 600, color: C.encre }}>{TEXTES[lang].fichier}</div>
      </div>
    </PageCam>
  );
};
