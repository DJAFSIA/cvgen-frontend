import { useRef } from 'react'
import { useI18n } from '../../i18n'
import { segment, useReducedMotion, useScrollProgress } from '../../hooks/useScroll'
import TemplateMock from '../TemplateMock'

const MODELES = ['classique', 'moderne', 'ats']
const DEPLOIEMENT = [
  { x: -108, r: -7, y: 18 },
  { x: 0, r: 0, y: 0 },
  { x: 108, r: 7, y: 18 },
]

/** Les trois modeles empiles s'ouvrent en eventail quand la section traverse l'ecran. */
export default function TemplatesFan() {
  const { t } = useI18n()
  const ref = useRef(null)
  const reduit = useReducedMotion()
  const p = useScrollProgress(ref, { mode: 'pass', enabled: !reduit })
  const ouverture = segment(p, 0.12, 0.5)

  return (
    <section id="templates" ref={ref} className="max-w-6xl mx-auto px-5 py-24 overflow-hidden">
      <div className="max-w-xl">
        <h2 className="text-3xl sm:text-[40px] leading-[1.08] font-semibold tracking-tight">{t('landing.templatesTitle')}</h2>
        <p className="mt-3 text-body">{t('landing.templatesSubtitle')}</p>
      </div>

      {/* Grand ecran : eventail anime */}
      <div className="hidden md:block relative h-[430px] mt-14" aria-hidden="true">
        {MODELES.map((m, i) => {
          const d = DEPLOIEMENT[i]
          return (
            <div
              key={m}
              className="absolute left-1/2 top-0 w-[230px] -ml-[115px] will-change-transform"
              style={{
                transform: `translate(${d.x * ouverture}%, ${d.y * ouverture}px) rotate(${d.r * ouverture}deg)`,
                zIndex: i === 1 ? 3 : 2,
              }}
            >
              <TemplateMock kind={m} />
            </div>
          )
        })}
      </div>

      <div className="mt-10 md:mt-4 grid sm:grid-cols-3 gap-8">
        {MODELES.map((m) => (
          <div key={m}>
            <div className="md:hidden max-w-[220px] mb-4"><TemplateMock kind={m} /></div>
            <h3 className="font-semibold text-ink">{t(`landing.tpl.${m}`)}</h3>
            <p className="mt-1 text-sm leading-relaxed">{t(`landing.tplDesc.${m}`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
