import { NavLink, Navigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Logo, LangSwitch } from '../components/Brand'
import { TexteRiche } from '../components/Legal'
import { Alert } from '../components/ui'
import { DOCS, textesLegaux } from '../legal'
import { LEGAL, identiteIncomplete } from '../legal/config'

/** Un bloc de section. Les cles d'une section sont dans l'ordre d'affichage voulu. */
function Bloc({ cle, valeur, lang }) {
  if (cle === 'paragraphes') {
    return valeur.map((texte, i) => <p key={i} className="mt-3 leading-relaxed"><TexteRiche texte={texte} /></p>)
  }
  if (cle === 'liste') {
    return (
      <ul className="mt-3 space-y-2 list-disc pl-5 leading-relaxed marker:text-muted">
        {valeur.map((texte, i) => <li key={i}><TexteRiche texte={texte} /></li>)}
      </ul>
    )
  }
  if (cle === 'hebergeurs') {
    return (
      <ul className="mt-3 space-y-3 leading-relaxed">
        {LEGAL.hebergeurs.map((h) => (
          <li key={h.nom}>
            <span className="font-medium text-ink">{h.nom}</span> ({h.role[lang]})<br />{h.coordonnees}
          </li>
        ))}
      </ul>
    )
  }
  return null
}

/** Conditions d'utilisation, confidentialite, remboursement, mentions legales. Pages publiques. */
export default function LegalPage() {
  const { doc } = useParams()
  const { t, lang } = useI18n()
  if (!DOCS.includes(doc)) return <Navigate to="/legal/cgu" replace />

  const textes = textesLegaux(lang)
  const contenu = textes.docs[doc]
  // Midi : la date reste la meme quel que soit le fuseau horaire du visiteur
  const date = new Date(`${LEGAL.miseAJour}T12:00:00`).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[.06]">
        <div className="max-w-5xl mx-auto px-5 h-12 flex items-center justify-between">
          <Logo />
          <LangSwitch />
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-5 pt-8 pb-20">
        <nav aria-label={t('nav.legal')} className="flex flex-wrap gap-2">
          {DOCS.map((d) => (
            <NavLink
              key={d}
              to={`/legal/${d}`}
              className={({ isActive }) => `px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                isActive ? 'bg-ink text-white' : 'bg-surface text-body hover:text-ink'
              }`}
            >
              {textes.titres[d]}
            </NavLink>
          ))}
        </nav>

        {identiteIncomplete() && <div className="mt-6"><Alert tone="warn">{textes.aCompleter}</Alert></div>}

        <h1 className="mt-10 text-[36px] sm:text-[48px] leading-[1.08] font-semibold tracking-[-0.03em]">{textes.titres[doc]}</h1>
        <p className="mt-3 text-sm text-muted">{textes.majLabel.replace('{date}', date)}</p>
        <p className="mt-6 text-[19px] leading-relaxed"><TexteRiche texte={contenu.intro} /></p>

        {contenu.sections.map((section) => (
          <section key={section.titre} className="mt-10">
            <h2 className="text-[22px] font-semibold tracking-tight">{section.titre}</h2>
            {Object.keys(section).map((cle) => <Bloc key={cle} cle={cle} valeur={section[cle]} lang={lang} />)}
          </section>
        ))}
      </main>

      <footer className="bg-surface border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
          <Logo />
          <span>&copy; {new Date().getFullYear()} Apply. {t('landing.footer')}</span>
        </div>
      </footer>
    </div>
  )
}
