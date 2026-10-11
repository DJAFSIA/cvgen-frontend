import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useScroll'

/** Fine barre de progression de lecture en haut de la page. */
export default function ScrollProgressBar() {
  const reduit = useReducedMotion()
  const [p, setP] = useState(0)

  useEffect(() => {
    if (reduit) return undefined
    let frame = 0
    const mesurer = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setP(max > 0 ? window.scrollY / max : 0)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(mesurer) }
    mesurer()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [reduit])

  if (reduit) return null
  return (
    <div className="absolute left-0 right-0 bottom-[-1px] h-[2px] pointer-events-none" aria-hidden="true">
      <div className="h-full origin-left" style={{ transform: `scaleX(${p})`, background: 'linear-gradient(90deg,#635bff,#c95bff,#ff8a4c)' }} />
    </div>
  )
}
