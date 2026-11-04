/**
 * Identite de l'editeur, reprise dans toutes les pages legales.
 *
 * A COMPLETER AVANT L'OUVERTURE AU PUBLIC : remplacez chaque valeur entre crochets.
 * Tant qu'une valeur commence par "[", un bandeau jaune le signale en haut des pages legales.
 */
export const LEGAL = {
  produit: 'CVGen',
  editeur: '[Nom ou raison sociale de l’éditeur]',
  formeJuridique: '[Forme juridique et capital, ex. SARL au capital de 1 000 000 FCFA]',
  adresse: '[Adresse postale complète du siège]',
  immatriculation: '[Numéro d’immatriculation : RCCM, SIREN…]',
  directeur: '[Nom du directeur ou de la directrice de la publication]',
  email: '[Adresse email de contact, ex. support@votre-domaine.com]',
  pays: '[Pays du siège]',
  // Date de la derniere mise a jour des textes (format AAAA-MM-JJ)
  miseAJour: '2026-11-01',
  hebergeurs: [
    { nom: 'Vercel Inc.', role: { fr: 'site web', en: 'website' }, coordonnees: '[Adresse et téléphone, voir vercel.com/legal]' },
    { nom: 'Render Services, Inc.', role: { fr: 'API', en: 'API' }, coordonnees: '[Adresse et téléphone, voir render.com/legal]' },
    { nom: 'Neon, Inc.', role: { fr: 'base de données', en: 'database' }, coordonnees: '[Adresse et téléphone, voir neon.tech]' },
  ],
}

const aCompleter = (valeur) => typeof valeur === 'string' && valeur.startsWith('[')

/** true tant qu'un champ de l'identite de l'editeur reste a completer. */
export function identiteIncomplete() {
  return Object.values(LEGAL).some(aCompleter) || LEGAL.hebergeurs.some((h) => aCompleter(h.coordonnees))
}

/** Remplace {cle} par la valeur correspondante de LEGAL. */
export function remplir(texte) {
  return texte.replace(/\{(\w+)\}/g, (tout, cle) => (typeof LEGAL[cle] === 'string' ? LEGAL[cle] : tout))
}
