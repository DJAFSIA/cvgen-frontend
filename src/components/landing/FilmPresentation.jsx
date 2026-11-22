import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useI18n } from '../../i18n'
import { useReducedMotion } from '../../hooks/useScroll'
import Reveal from '../motion/Reveal'

/**
 * Section « Comment ça marche » : le film de présentation en motion design (projet video/).
 * Lecture muette en boucle quand la section est visible, pause hors écran ; jamais de lecture
 * automatique si le système demande moins d'animations. Les étapes restent écrites en dessous.
 */
export default function FilmPresentation() {
  const { t, lang } = useI18n()
  const reduit = useReducedMotion()

  return (
    <section id="how" className="bg-surface py-24 sm:py-28" aria-labelledby="film-titre">
      <div className="max-w-6xl mx-auto px-5">
        <Reveal as="h2" variant="mask" id="film-titre" className="max-w-3xl text-3xl sm:text-[40px] leading-[1.08] font-semibold tracking-tight">
          {t('story.title')}
        </Reveal>

        <Reveal variant="scale" delay={120} className="mt-12">
          {/* Une cle par langue : changer de langue repart d'un lecteur neuf (muet, en pause) */}
          <Lecteur key={lang} lang={lang} t={t} reduit={reduit} />
        </Reveal>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t('story.steps').map((etape, i) => (
            <Reveal as="li" key={etape.title} delay={i * 80}>
              <p className="text-[13px] font-semibold text-brand">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{etape.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{etape.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Lecteur du film : lecture muette quand il est visible, boutons lecture et son. */
function Lecteur({ lang, t, reduit }) {
  const video = useRef(null)
  const [lecture, setLecture] = useState(false)
  const [son, setSon] = useState(false)

  useEffect(() => {
    const el = video.current
    if (!el || reduit || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduit])

  const basculerLecture = () => {
    const el = video.current
    if (!el) return
    if (el.paused) el.play().catch(() => {})
    else el.pause()
  }

  const basculerSon = () => {
    const el = video.current
    if (!el) return
    el.muted = !el.muted
    setSon(!el.muted)
    if (!el.muted && el.paused) el.play().catch(() => {})
  }

  const bouton = 'grid place-items-center w-11 h-11 rounded-full bg-black/55 text-white backdrop-blur-md hover:bg-black/70 transition-colors'

  return (
    <div className="relative overflow-hidden rounded-bento bg-white shadow-window">
      <video
        ref={video}
        className="block w-full aspect-video"
        poster={`/video/apply-${lang}.jpg`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={t('film.label')}
        onPlay={() => setLecture(true)}
        onPause={() => setLecture(false)}
      >
        <source src={`/video/apply-${lang}.mp4`} type="video/mp4" />
      </video>
      <div className="absolute right-4 bottom-4 flex gap-2">
        <button type="button" className={bouton} onClick={basculerLecture} aria-label={lecture ? t('film.pause') : t('film.play')}>
          {lecture ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
        <button type="button" className={bouton} onClick={basculerSon} aria-label={son ? t('film.soundOff') : t('film.soundOn')}>
          {son ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
