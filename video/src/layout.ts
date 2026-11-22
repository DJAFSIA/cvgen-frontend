// Positions des elements dans les captures (produites par scripts/capture.mjs).
import fr from './layout.fr.json';
import en from './layout.en.json';
import type { Lang } from './textes';
import type { Rect } from './lib/PageCam';

export type Champ = Rect & { cle: string };
export type Mot = Rect & { mot: string; label: string };
export type Bloc = Rect & { col: number; tag: string };

export type Layout = {
  profil: { pageH: number; pageHVide: number; champs: Champ[]; champsVides: Champ[]; importCarte: Rect; cartes: Rect[]; bouton: Rect };
  offre: { pageH: number; zone: Rect; carte: Rect; mots: Mot[] };
  analyse: {
    pageH: number; carteScore: Rect; anneau: Rect; pourcent: Rect; score: number; poste: Rect; listes: Rect[];
    affiner: Rect; titreAffiner: Rect; diagnostic: Rect; questions: Rect[]; langue: Rect; modeles: Rect; generer: Rect;
  };
  documents: { pageH: number; colonnes: Rect[]; titres: Rect[]; barre: Rect; blocs: Bloc[] };
  score: number;
  poste: string;
};

export const LAYOUTS = { fr, en } as unknown as Record<Lang, Layout>;

export const tex = (lang: Lang, nom: string) => `textures/${lang}/${nom}.png`;

/** Rectangle englobant plusieurs rectangles. */
export const union = (rs: Rect[]): Rect => {
  const x = Math.min(...rs.map((r) => r.x));
  const y = Math.min(...rs.map((r) => r.y));
  const x2 = Math.max(...rs.map((r) => r.x + r.w));
  const y2 = Math.max(...rs.map((r) => r.y + r.h));
  return { x, y, w: x2 - x, h: y2 - y };
};

/** Cadrage qui fait tenir r dans la zone utile de l'ecran (au-dessus du sous-titre). */
export const cadrer = (r: Rect, { hautUtile = 800, largeUtile = 1700, centreY = 460, max = 3 } = {}) => {
  const zoom = Math.min(max, hautUtile / r.h, largeUtile / r.w);
  return { cx: r.x + r.w / 2, cy: r.y + r.h / 2 + (540 - centreY) / zoom, zoom };
};
