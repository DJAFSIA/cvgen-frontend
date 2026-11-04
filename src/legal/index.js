import fr from './fr'
import en from './en'

const TEXTES = { fr, en }

/** Documents legaux, dans l'ordre d'affichage. */
export const DOCS = ['cgu', 'confidentialite', 'remboursement', 'mentions']

export const textesLegaux = (lang) => TEXTES[lang] || en
