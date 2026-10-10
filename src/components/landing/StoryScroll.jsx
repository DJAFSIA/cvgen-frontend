import { useRef } from 'react'
import { useI18n } from '../../i18n'
import { segment, useMinWidth, useReducedMotion, useScrollProgress } from '../../hooks/useScroll'

// Offre d'exemple : les segments "k" sont les mots-cles que le recruteur (et CVGen) reperent.
const OFFRE = [
  { t: 'Northwind is hiring a ' }, { k: 'Senior Data Engineer' }, { t: ' in Lyon. You will build ' },
  { k: 'Airflow pipelines' }, { t: ' on ' }, { k: 'BigQuery' }, { t: ', model data with ' }, { k: 'dbt' },
  { t: ' and ' }, { k: 'mentor junior engineers' }, { t: '. 3+ years of ' }, { k: 'Python and SQL' }, { t: ' required.' },
]

// Le CV produit, dans les deux langues (l'etape 4 montre le changement de langue).
const CV = {
  fr: {
    titre: 'Ingénieure data', experience: 'Expérience', competences: 'Compétences',
    poste: 'Data Engineer, Acme Analytics', date: '2023 - aujourd’hui',
    puces: [
      [{ t: 'Conception de ' }, { k: 'pipelines Airflow' }, { t: ' alimentant ' }, { k: 'BigQuery' }, { t: ' depuis 40 sources' }],
      [{ t: 'Batch nocturne ramené de 6 h à 2 h avec ' }, { k: 'Python et SQL' }],
      [{ t: 'Accompagnement de deux ingénieurs juniors : ' }, { k: 'mentorat' }, { t: ' et revues de code' }],
    ],
    skills: 'Python, SQL, Airflow, dbt, BigQuery',
  },
  en: {
    titre: 'Data Engineer', experience: 'Experience', competences: 'Skills',
    poste: 'Data Engineer, Acme Analytics', date: '2023 - present',
    puces: [
      [{ t: 'Built ' }, { k: 'Airflow pipelines' }, { t: ' feeding ' }, { k: 'BigQuery' }, { t: ' from 40 sources' }],
      [{ t: 'Cut the nightly batch from 6h to 2h with ' }, { k: 'Python and SQL' }],
      [{ t: 'Coached two junior engineers: ' }, { k: 'mentoring' }, { t: ' and code reviews' }],
    ],
    skills: 'Python, SQL, Airflow, dbt, BigQuery',
  },
}

// Rang de chaque mot-cle, pour les surligner l'un apres l'autre
const NB_MOTS = OFFRE.filter((s) => s.k).length
const RANG_MOT = OFFRE.map((s, i) => OFFRE.slice(0, i).filter((x) => x.k).length)

const SCORE = 86

/** Surlignage au feutre dont la largeur suit la progression (0 -> 1). */
function Marker({ children, p }) {
  return (
    <mark
      className="rounded-[3px] px-0.5 -mx-0.5 text-ink bg-no-repeat"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(transparent 12%, #ffe066 12%, #ffe066 88%, transparent 88%)',
        backgroundSize: `${p * 100}% 100%`,
      }}
    >
      {children}
    </mark>
  )
}

function Stage({ p, lang }) {
  const surlignage = segment(p, 0.04, 0.26)
  const score = segment(p, 0.28, 0.46)
  const cv = segment(p, 0.5, 0.72)
  const bascule = segment(p, 0.78, 0.86)
  const langueCv = bascule > 0.5 ? (lang === 'fr' ? 'en' : 'fr') : lang
  const doc = CV[langueCv]
  const circonference = 2 * Math.PI * 34

  return (
    <div className="relative h-[520px] w-full max-w-[560px] mx-auto" aria-hidden="true">
      {/* Offre d'emploi */}
      <div
        className="absolute left-0 top-0 w-[68%] bg-white rounded-xl border border-line shadow-pop p-6"
        style={{ transform: `translateY(${-cv * 24}px) scale(${1 - cv * 0.04})`, opacity: 1 - cv * 0.35 }}
      >
        <p className="text-[13px] font-semibold text-muted">Job offer</p>
        <p className="mt-1 text-lg font-semibold text-ink">Senior Data Engineer</p>
        <p className="mt-3 text-[15px] leading-relaxed text-body">
          {OFFRE.map((s, i) => {
            if (!s.k) return <span key={i}>{s.t}</span>
            const debut = RANG_MOT[i] / NB_MOTS
            return <Marker key={i} p={segment(surlignage, debut, debut + 1 / NB_MOTS)}>{s.k}</Marker>
          })}
        </p>
      </div>

      {/* Score de compatibilite */}
      <div
        className="absolute right-0 top-6 z-10 bg-white rounded-2xl border border-line shadow-pop p-4 flex items-center gap-3"
        style={{ opacity: score, transform: `translateY(${(1 - score) * 16}px) scale(${0.96 + score * 0.04})` }}
      >
        <svg viewBox="0 0 80 80" className="w-16 h-16 -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#e3e8ee" strokeWidth="8" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="#635bff" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circonference} strokeDashoffset={circonference * (1 - (score * SCORE) / 100)} />
        </svg>
        <div>
          <p className="text-2xl font-semibold text-ink tabular-nums">{Math.round(score * SCORE)}%</p>
          <p className="text-xs text-muted">match</p>
        </div>
      </div>

      {/* CV genere */}
      <div
        className="absolute right-0 bottom-0 w-[72%] bg-white rounded-xl border border-line shadow-pop px-6 py-5"
        style={{ opacity: cv, transform: `translateY(${(1 - cv) * 60}px)` }}
      >
        <div style={{ opacity: 1 - Math.sin(Math.PI * bascule) * 0.85 }}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-lg font-semibold text-ink">Amina Diallo</p>
          <span className="text-[11px] font-semibold rounded-full bg-brand-soft text-brand-dark px-2 py-0.5 uppercase">{langueCv}</span>
        </div>
        <p className="text-[13px] text-muted">{doc.titre}</p>
        <p className="mt-4 text-[12px] font-semibold text-ink border-b border-line pb-1">{doc.experience}</p>
        <div className="mt-2 flex justify-between text-[13px]">
          <span className="font-medium text-ink">{doc.poste}</span>
          <span className="text-muted">{doc.date}</span>
        </div>
        <ul className="mt-2 space-y-1.5 text-[13px] leading-snug text-body">
          {doc.puces.map((puce, i) => {
            const visible = segment(cv, 0.25 + i * 0.22, 0.45 + i * 0.22)
            return (
              <li key={i} className="flex gap-2" style={{ opacity: visible, transform: `translateX(${(1 - visible) * 12}px)` }}>
                <span className="mt-[7px] w-1 h-1 rounded-full bg-brand shrink-0" />
                <span>
                  {puce.map((s, j) => (s.k
                    ? <span key={j} className="text-ink font-medium underline decoration-[#ffe066] decoration-[3px] underline-offset-2">{s.k}</span>
                    : <span key={j}>{s.t}</span>))}
                </span>
              </li>
            )
          })}
        </ul>
        <p className="mt-4 text-[12px] font-semibold text-ink border-b border-line pb-1">{doc.competences}</p>
        <p className="mt-2 text-[13px] text-body">{doc.skills}</p>
        </div>
      </div>
    </div>
  )
}

export default function StoryScroll() {
  const { t, lang } = useI18n()
  const ref = useRef(null)
  const reduit = useReducedMotion()
  const grandEcran = useMinWidth(1024)
  const anime = grandEcran && !reduit
  const p = useScrollProgress(ref, { mode: 'pin', enabled: anime })
  const etapes = t('story.steps')
  const active = Math.min(etapes.length - 1, Math.floor(p * etapes.length))

  if (!anime) {
    // Mobile ou mouvement reduit : recit statique, etat final du produit
    return (
      <section id="how" className="bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <h2 className="text-3xl font-semibold tracking-tight max-w-xl">{t('story.title')}</h2>
          <ol className="mt-10 space-y-6 max-w-xl">
            {etapes.map((e, i) => (
              <li key={e.title} className="flex gap-4">
                <span className="grid place-items-center w-8 h-8 shrink-0 rounded-full bg-brand text-white text-sm font-semibold">{i + 1}</span>
                <div><h3 className="font-semibold text-ink">{e.title}</h3><p className="mt-1 text-[15px] leading-relaxed">{e.text}</p></div>
              </li>
            ))}
          </ol>
          <div className="mt-12 overflow-hidden"><div className="origin-top-left scale-[0.8] sm:scale-100"><Stage p={0.75} lang={lang} /></div></div>
        </div>
      </section>
    )
  }

  return (
    <section id="how" ref={ref} className="relative bg-surface border-y border-line" style={{ height: '420vh' }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-6xl w-full mx-auto px-5 grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-14 items-center">
          <div>
            <h2 className="text-[40px] leading-[1.08] font-semibold tracking-tight">{t('story.title')}</h2>
            <ol className="mt-10 relative pl-6">
              <span className="absolute left-0 top-1 bottom-1 w-px bg-line" aria-hidden="true" />
              <span className="absolute left-0 top-1 w-px bg-brand origin-top" style={{ height: `calc(${p * 100}% - 8px)` }} aria-hidden="true" />
              {etapes.map((e, i) => (
                <li key={e.title} className="py-3 transition-opacity duration-500" style={{ opacity: i === active ? 1 : 0.32 }} aria-current={i === active ? 'step' : undefined}>
                  <h3 className="text-lg font-semibold text-ink">{e.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed max-w-sm">{e.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <Stage p={p} lang={lang} />
        </div>
      </div>
    </section>
  )
}
