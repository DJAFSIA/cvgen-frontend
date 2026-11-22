// Minutage du film : seule source de verite. Plans, sous-titres, transitions et sons en derivent.
// Chaque coupe tombe sur un temps de la musique (music-beat-sync) : les plans se mesurent en temps.
//
// Grille de house-vibez.mp3 (Mixkit 745), mesuree le 16/11/2026 : attaques graves detectees puis
// grille reguliere ajustee aux moindres carres (residu max 9 ms, rms 3,7 ms). Valeurs d'analyse :
// ne pas les corriger a la main ; le decalage de sortie AAC se compense a part (Sons.tsx).
export const BPM = 121.998;
/** Premier temps de la musique dans le fichier source, en secondes. */
export const SOURCE_BEAT0 = 0.0102;
export const FPS = 30;
/** Images par temps (≈ 14,75). */
export const P = (FPS * 60) / BPM;
/** Image du temps n (arrondie). */
export const beatF = (n: number) => Math.round(n * P);

const enchaine = <T extends Record<string, number>>(temps: T) => {
  let n = 0;
  const out = {} as Record<keyof T, { from: number; dur: number; temps: number }>;
  for (const k of Object.keys(temps) as (keyof T)[]) {
    const from = beatF(n);
    out[k] = { from, dur: beatF(n + temps[k]) - from, temps: n };
    n += temps[k];
  }
  return { shots: out, total: beatF(n) };
};

// Duree de chaque plan en temps de musique (1 temps ≈ 0,49 s). La carte score s'eleve au temps 32,
// la ou la musique s'etoffe ; le final commence au temps 84, debut de mesure.
export const { shots: SHOTS, total: DUREE_TOTALE } = enchaine({
  ouverture: 7,
  profil: 11,
  offre: 11,
  score: 10,
  questions: 12,
  titre: 6,
  documents: 10,
  langues: 10,
  modeles: 7,
  final: 10,
});
