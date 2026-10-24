import { useRef } from 'react'
import { useI18n } from '../../i18n'
import { segment, useReducedMotion, useScrollProgress } from '../../hooks/useScroll'

/** Grande phrase epinglee dont les mots s'allument un a un au defilement. */
export default function Manifesto() {
  const { t } = useI18n()
  const ref = useRef(null)
  const reduit = useReducedMotion()
  const p = useScrollProgress(ref, { mode: 'pin', enabled: !reduit })
  const mots = t('manifesto.text').split(' ')
  const cles = new Set(t('manifesto.keys'))

  return (
    <section ref={ref} className="relative bg-black" style={{ height: reduit ? 'auto' : '230vh' }}>
      <div className={`${reduit ? '' : 'sticky top-0 h-screen'} flex items-center`}>
        <p className="max-w-5xl mx-auto px-5 py-24 text-[30px] sm:text-[44px] lg:text-[56px] leading-[1.12] font-semibold tracking-[-0.03em]">
          {mots.map((mot, i) => {
            const debut = (i / mots.length) * 0.78
            const lumiere = segment(p, debut, debut + 0.16)
            const nu = mot.replace(/[.,;:!?]/g, '')
            const cle = cles.has(nu)
            return (
              <span
                key={i}
                className="transition-colors duration-150"
                style={{
                  color: cle
                    ? `rgba(41, 151, 255, ${0.18 + lumiere * 0.82})`
                    : `rgba(245, 245, 247, ${0.16 + lumiere * 0.84})`,
                }}
              >
                {mot}{' '}
              </span>
            )
          })}
        </p>
      </div>
    </section>
  )
}
