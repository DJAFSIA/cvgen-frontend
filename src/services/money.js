/** Montants Stripe en unites mineures (centimes) ; FCFA sans decimales. */
const SANS_DECIMALES = new Set(['XAF', 'XOF', 'JPY'])

export function formatPrice(montant, devise, lang) {
  const code = devise.toUpperCase()
  const valeur = SANS_DECIMALES.has(code) ? montant : montant / 100
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: code,
    // 7,99 EUR mais 0 EUR (pas 0,00 EUR)
    minimumFractionDigits: Number.isInteger(valeur) ? 0 : 2,
    maximumFractionDigits: SANS_DECIMALES.has(code) ? 0 : 2,
  }).format(valeur)
}

/** Devise de carte proposee par defaut selon la langue du navigateur. */
export function deviseCarteParDefaut(disponibles) {
  const locale = (navigator.language || '').toLowerCase()
  const voulue = locale === 'en-us' ? 'usd' : locale === 'en-gb' ? 'gbp' : 'eur'
  return disponibles.includes(voulue) ? voulue : disponibles[0]
}
