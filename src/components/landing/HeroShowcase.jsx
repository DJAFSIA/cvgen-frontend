import { useRef } from 'react'
import { useI18n } from '../../i18n'
import { segment, useReducedMotion, useScrollProgress } from '../../hooks/useScroll'

const TEXTES = {
  fr: { offre: "Offre d'emploi", cv: 'CV généré', match: 'compatibilité', exp: 'Expérience', comp: 'Compétences', titre: 'Ingénieure data' },
  en: { offre: 'Job offer', cv: 'Generated CV', match: 'match', exp: 'Experience', comp: 'Skills', titre: 'Data Engineer' },
}

const Mot = ({ children }) => (
  <mark className="bg-[#ffe066] text-ink rounded-[3px] px-0.5">{children}</mark>
)

/**
 * Fenetre de l'application en vedette, entouree d'une lueur multicolore.
 * Inclinee en 3D a l'arrivee, elle se redresse et s'agrandit au defilement.
 */
export default function HeroShowcase() {
  const { lang } = useI18n()
  const tx = TEXTES[lang] || TEXTES.en
  const ref = useRef(null)
  const reduit = useReducedMotion()
  const p = useScrollProgress(ref, { mode: 'pass', enabled: !reduit })
  const redresse = reduit ? 1 : segment(p, 0.12, 0.48)

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl px-5" style={{ perspective: '1600px' }} aria-hidden="true">
      <div
        className="ai-glow relative rounded-[22px] will-change-transform"
        style={{
          transform: `rotateX(${(1 - redresse) * 24}deg) scale(${0.88 + redresse * 0.12}) translateY(${(1 - redresse) * 40}px)`,
          transformOrigin: 'center top',
        }}
      >
        <div className="relative rounded-[22px] bg-white shadow-window overflow-hidden">
          {/* Barre de fenetre */}
          <div className="h-10 flex items-center gap-2 px-4 border-b border-black/[.06] bg-[#fbfbfd]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-4 text-xs text-muted">cvgen.app</span>
          </div>

          <div className="grid md:grid-cols-[5fr_7fr] min-h-[380px]">
            {/* Offre */}
            <div className="p-7 border-b md:border-b-0 md:border-r border-black/[.06] bg-[#fbfbfd]">
              <p className="text-xs font-medium text-muted">{tx.offre}</p>
              <p className="mt-1 text-lg font-semibold text-ink">Senior Data Engineer</p>
              <p className="mt-3 text-sm leading-relaxed text-body">
                Northwind is hiring in Lyon. You will build <Mot>Airflow pipelines</Mot> on <Mot>BigQuery</Mot>,
                model data with <Mot>dbt</Mot> and <Mot>mentor</Mot> junior engineers. 3+ years of <Mot>Python and SQL</Mot>.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white border border-black/[.06] px-4 py-3 shadow-card">
                <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#e8e8ed" strokeWidth="5" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#0071e3" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 16} strokeDashoffset={2 * Math.PI * 16 * (1 - 0.86 * redresse)} />
                </svg>
                <div>
                  <p className="text-xl font-semibold text-ink tabular-nums">{Math.round(86 * redresse)}%</p>
                  <p className="text-xs text-muted">{tx.match}</p>
                </div>
              </div>
            </div>

            {/* CV */}
            <div className="p-7 bg-white">
              <p className="text-xs font-medium text-muted">{tx.cv}</p>
              <div className="mt-3 rounded-xl overflow-hidden border border-black/[.06]">
                <div className="bg-[#1d1d1f] px-5 py-4">
                  <p className="text-white text-lg font-semibold">Amina Diallo</p>
                  <p className="text-white/60 text-xs">{tx.titre} · Lyon</p>
                </div>
                <div className="px-5 py-4 space-y-3 text-[13px]">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">{tx.exp}</p>
                  <div className="flex justify-between"><span className="font-medium text-ink">Data Engineer, Acme</span><span className="text-muted">2023 –</span></div>
                  <ul className="space-y-1.5 text-body">
                    <li className="flex gap-2"><span className="mt-[7px] w-1 h-1 rounded-full bg-brand shrink-0" />Built <b className="font-medium text-ink">Airflow pipelines</b> feeding <b className="font-medium text-ink">BigQuery</b> from 40 sources</li>
                    <li className="flex gap-2"><span className="mt-[7px] w-1 h-1 rounded-full bg-brand shrink-0" />Nightly batch cut from 6h to 2h with <b className="font-medium text-ink">Python and SQL</b></li>
                  </ul>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand pt-1">{tx.comp}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'SQL', 'Airflow', 'dbt', 'BigQuery'].map((s) => (
                      <span key={s} className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-ink">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
