import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { DOCS, textesLegaux } from '../legal'
import { remplir } from '../legal/config'

const HORS_LEGAL = { compte: '/compte', abonnement: '/abonnement', tarifs: '/#pricing' }
const NOUVEL_ONGLET = { target: '_blank', rel: 'noopener' }

/**
 * Texte contenant des {cles} (valeurs de legal/config.js) et des liens internes [[page|texte]].
 * newTab : a utiliser au milieu d'un formulaire, pour ne pas perdre ce qui a ete saisi.
 */
export function TexteRiche({ texte, newTab = false }) {
  return remplir(texte).split(/(\[\[\w+\|[^\]]+\]\])/).map((morceau, i) => {
    const lien = morceau.match(/^\[\[(\w+)\|([^\]]+)\]\]$/)
    if (!lien) return <Fragment key={i}>{morceau}</Fragment>
    const [, page, libelle] = lien
    return (
      <Link key={i} to={HORS_LEGAL[page] || `/legal/${page}`} className="text-brand hover:underline" {...(newTab ? NOUVEL_ONGLET : {})}>
        {libelle}
      </Link>
    )
  })
}

/** Liens vers les quatre documents legaux (pieds de page, page Compte). */
export function LegalLinks({ className = '', newTab = false }) {
  const { t, lang } = useI18n()
  const { titres } = textesLegaux(lang)
  return (
    <nav aria-label={t('nav.legal')} className={`flex flex-wrap gap-x-4 gap-y-1 ${className}`}>
      {DOCS.map((doc) => (
        <Link key={doc} to={`/legal/${doc}`} className="hover:text-ink hover:underline" {...(newTab ? NOUVEL_ONGLET : {})}>
          {titres[doc]}
        </Link>
      ))}
    </nav>
  )
}
