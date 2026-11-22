// Jetons de la charte d'Apply (tailwind.config.js et index.css du site).
import type React from 'react';

export const C = {
  blanc: '#ffffff',
  surface: '#f5f5f7',
  encre: '#1d1d1f',
  texte: '#424245',
  muet: '#6e6e73',
  filet: '#d2d2d7',
  bleu: '#0071e3',
  bleuDoux: '#e8f1fc',
};

export const DEGRADE = 'linear-gradient(90deg, #0894ff 0%, #c959dd 38%, #ff2e54 68%, #ff9004 100%)';
// Une seule police, Inter (chargée par lib/polices.ts) ; les annotations l'utilisent aussi, en capitales
// espacées et chiffres tabulaires, au lieu d'une police à chasse fixe hors charte.
export const POLICE = '"Inter", sans-serif';
export const MONO = POLICE;

/** Texte en degrade (comme .text-gradient sur le site). */
export const texteDegrade: React.CSSProperties = {
  background: DEGRADE,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};
