import { useRef } from 'react'
import { useI18n } from '../../i18n'
import { segment, useReducedMotion, useScrollProgress } from '../../hooks/useScroll'
import TemplateMock from '../TemplateMock'
import Reveal from '../motion/Reveal'

const MODELES = ['classique', 'moderne', 'etat_civil', 'nord_americain', 'ats']
const DEPLOIEMENT = [
  { x: -132, r: -11, y: 44 },
  { x: -66, r: -5.5, y: 12 },
  { x: 0, r: 0, y: 0 },
  { x: 66, r: 5.5, y: 12 },
  { x: 132, r: 11, y: 44 },
]

/** Les cinq modeles empiles s'ouvrent en eventail quand la section traverse l'ecran. */
export default function TemplatesFan() {
  const { t } = useI18n()
  const ref = useRef(null)
  const reduit = useReducedMotion()
  const p = useScrollProgress(ref, { mode: 'pass', enabled: !reduit })
  const ouverture = segment(p, 0.12, 0.5)

  return (
    <section id="templates" ref={ref} className="max-w-6xl mx-auto px-5 py-24 overflow-hidden">
      <div className="max-w-xl">
        <Reveal as="h2" variant="mask" className="text-3xl sm:text-[40px] leading-[1.08] font-semibold tracking-tight">{t('landing.templatesTitle')}</Reveal>
        <Reveal as="p" delay={120} className="mt-3 text-body">{t('landing.templatesSubtitle')}</Reveal>
      </div>

      {/* Grand ecran : eventail anime */}
      <div className="hidden md:block relative h-[390px] mt-14" aria-hidden="true">
        {MODELES.map((m, i) => {
          const d = DEPLOIEMENT[i]
          return (
            <div
              key={m}
              className="absolute left-1/2 top-0 w-[210px] -ml-[105px] will-change-transform"
              style={{
                transform: `translate(${d.x * ouverture}%, ${d.y * ouverture}px) rotate(${d.r * ouverture}deg)`,
                zIndex: 3 - Math.abs(i - 2),
              }}
            >
              <TemplateMock kind={m} />
            </div>
          )
        })}
      </div>

      {/* Telephone : rangee a faire glisser, la carte suivante depasse pour l'indiquer */}
      <ul className="mt-10 md:mt-4 -mx-5 px-5 md:mx-0 md:px-0 pb-3 flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-5">
        {MODELES.map((m) => (
          <li key={m} className="w-[64%] max-w-[240px] shrink-0 snap-start md:w-auto md:max-w-none">
            <div className="md:hidden mb-4"><TemplateMock kind={m} /></div>
            <h3 className="font-semibold text-ink">{t(`landing.tpl.${m}`)}</h3>
            <p className="mt-1 text-sm leading-relaxed">{t(`landing.tplDesc.${m}`)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
