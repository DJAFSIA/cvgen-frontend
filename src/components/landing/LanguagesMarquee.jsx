import { useRef } from 'react'
import { useI18n } from '../../i18n'
import { useReducedMotion, useScrollProgress } from '../../hooks/useScroll'
import Reveal from '../motion/Reveal'

const LIGNE_1 = ['Bonjour', 'Hello', 'Hola', 'Hallo', 'Olá', 'Ciao', 'Bonjour', 'Hello', 'Hola', 'Hallo']
const LIGNE_2 = ['Expérience', 'Experience', 'Experiencia', 'Erfahrung', 'Experiência', 'Esperienza', 'Expérience', 'Experience', 'Experiencia']

/** Deux lignes de mots geants qui glissent en sens inverse au rythme du defilement. */
export default function LanguagesMarquee() {
  const { t } = useI18n()
  const ref = useRef(null)
  const reduit = useReducedMotion()
  const p = useScrollProgress(ref, { mode: 'pass', enabled: !reduit })
  const decalage = reduit ? 0 : (p - 0.5) * 30

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-28 sm:py-32" aria-labelledby="langues-titre">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal as="h2" variant="mask" id="langues-titre" className="text-3xl sm:text-[40px] leading-[1.08] font-semibold tracking-tight !text-white max-w-xl">{t('marquee.title')}</Reveal>
        <Reveal as="p" delay={120} className="mt-3 text-white/65 max-w-lg">{t('marquee.text')}</Reveal>
      </div>
      <div className="mt-14 space-y-2 select-none" aria-hidden="true">
        <div className="whitespace-nowrap text-[64px] sm:text-[96px] font-semibold tracking-[-0.04em] leading-none" style={{ transform: `translateX(${-10 - decalage}%)` }}>
          {LIGNE_1.map((m, i) => (
            <span key={i} className={i % 2 ? 'text-transparent' : 'text-white'} style={i % 2 ? { WebkitTextStroke: '1.5px rgba(255,255,255,.45)' } : undefined}>{m}&nbsp;&nbsp;</span>
          ))}
        </div>
        <div className="whitespace-nowrap text-[64px] sm:text-[96px] font-semibold tracking-[-0.04em] leading-none" style={{ transform: `translateX(${-30 + decalage}%)` }}>
          {LIGNE_2.map((m, i) => (
            <span key={i} className={i % 2 ? 'text-[#b8b3ff]' : 'text-transparent'} style={i % 2 ? undefined : { WebkitTextStroke: '1.5px rgba(184,179,255,.5)' }}>{m}&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>
    </section>
  )
}
