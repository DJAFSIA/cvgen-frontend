import { Check, FileDown } from 'lucide-react'
import { useI18n } from '../../i18n'
import Reveal from '../motion/Reveal'

/** Grille "bento" : cinq tuiles de tailles differentes, chacune illustrant sa fonctionnalite. */
export default function BentoFeatures() {
  const { t } = useI18n()
  const [score, questions, langues, honnete, , pdf] = t('landing.features')

  // Le fond est donne a part : deux classes bg-* sur un meme element entrent en conflit
  const base = 'rounded-bento p-8 overflow-hidden relative'
  const tuile = `${base} bg-surface`
  const titre = (f) => (
    <>
      <h3 className="text-2xl font-semibold tracking-tight">{f.title}</h3>
      <p className="mt-2 text-[17px] leading-relaxed text-muted max-w-sm">{f.text}</p>
    </>
  )

  return (
    <section id="features" className="bg-white py-28">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal as="h2" variant="mask" className="text-center text-[40px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em]">
          {t('landing.featuresTitle')}
        </Reveal>

        <div className="mt-16 grid md:grid-cols-6 gap-5">
          {/* Score : grande tuile */}
          <Reveal variant="scale" className={`${tuile} md:col-span-4 min-h-[360px]`}>
            {titre(score)}
            <div className="absolute right-8 bottom-6 flex items-end gap-3" aria-hidden="true">
              <span className="text-[120px] leading-none font-semibold tracking-[-0.05em] text-gradient">86%</span>
            </div>
          </Reveal>

          {/* Questions : bulles de conversation */}
          <Reveal variant="scale" delay={100} className={`${base} md:col-span-2 min-h-[360px] bg-[#1d1d1f]`}>
            <h3 className="text-2xl font-semibold tracking-tight !text-white">{questions.title}</h3>
            <p className="mt-2 text-[17px] leading-relaxed text-white/60">{questions.text}</p>
            <div className="mt-8 space-y-2.5 text-sm" aria-hidden="true">
              <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-white/85">{t('bento.ask')}</p>
              <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-white">{t('bento.answer')}</p>
            </div>
          </Reveal>

          {/* Langues */}
          <Reveal variant="scale" className={`${tuile} md:col-span-2 min-h-[300px]`}>
            {titre(langues)}
            <p className="mt-6 text-[34px] font-semibold tracking-tight text-gradient leading-[1.1]" aria-hidden="true">Hello. Hola. Hallo.</p>
          </Reveal>

          {/* Honnete */}
          <Reveal variant="scale" delay={100} className={`${tuile} md:col-span-2 min-h-[300px]`}>
            {titre(honnete)}
            <span className="absolute right-8 bottom-8 grid place-items-center w-16 h-16 rounded-full bg-[#28c840] text-white" aria-hidden="true">
              <Check size={34} strokeWidth={3} />
            </span>
          </Reveal>

          {/* PDF */}
          <Reveal variant="scale" delay={200} className={`${tuile} md:col-span-2 min-h-[300px]`}>
            {titre(pdf)}
            <FileDown size={56} strokeWidth={1.4} className="absolute right-8 bottom-8 text-brand" aria-hidden="true" />
          </Reveal>

        </div>
      </div>
    </section>
  )
}
