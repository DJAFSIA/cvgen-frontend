// Primitives de mouvement (reprises de demos/_fixtures/Motion.tsx de video-shotcraft) :
// courbes E, progression par segment seg, interpolation lerp. Fonctions pures, rendu deterministe.
import { Easing } from 'remotion';

export const E = {
  linear: (t: number) => t,
  outQuad: (t: number) => t * (2 - t),
  inQuad: (t: number) => t * t,
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inCubic: (t: number) => t * t * t,
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outQuint: (t: number) => 1 - Math.pow(1 - t, 5),
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outBack: (t: number, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2),
  spring: (t: number, bounce = 0.25) => {
    const w = 8 + 8 * (1 - bounce);
    return 1 - Math.exp(-6 * t) * Math.cos(w * t * bounce * 2.2);
  },
};

export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Progression 0→1 entre deux images (ou deux instants), avec courbe, bornee. */
export const seg = (t: number, t0: number, t1: number, ease: (x: number) => number = E.linear) =>
  ease(clamp01((t - t0) / (t1 - t0)));

/** Courbes de la charte du film (DESIGN_SPEC.md §1). */
export const ENTREE = Easing.bezier(0.16, 1, 0.3, 1);
export const CAMERA = Easing.bezier(0.33, 0, 0.15, 1);
export const ATTERRISSAGE = Easing.bezier(0.34, 1.4, 0.44, 1);

export const mixHex = (a: string, b: string, k: number) => {
  const q = clamp01(k);
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * q));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/** Pseudo-hasard deterministe (meme graine = meme valeur, d'une image a l'autre). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
