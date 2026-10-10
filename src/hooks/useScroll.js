import { useEffect, useState } from 'react'

const clamp = (v) => Math.min(1, Math.max(0, v))

/** true si le systeme demande de limiter les animations. */
export function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduit, setReduit] = useState(() => window.matchMedia?.(query).matches ?? false)
  useEffect(() => {
    const mq = window.matchMedia?.(query)
    if (!mq) return undefined
    const onChange = () => setReduit(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduit
}

/** true si la fenetre est au moins aussi large que minWidth (px). */
export function useMinWidth(minWidth) {
  const query = `(min-width: ${minWidth}px)`
  const [ok, setOk] = useState(() => window.matchMedia?.(query).matches ?? true)
  useEffect(() => {
    const mq = window.matchMedia?.(query)
    if (!mq) return undefined
    const onChange = () => setOk(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return ok
}

/**
 * Progression du defilement (0 -> 1) pour l'element reference.
 * - mode "pin"  : 0 quand le haut de la section atteint le haut de l'ecran, 1 quand son bas
 *                 atteint le bas de l'ecran (section epinglee plus haute que l'ecran).
 * - mode "pass" : 0 quand la section entre par le bas, 1 quand elle sort par le haut.
 */
export function useScrollProgress(ref, { mode = 'pin', enabled = true } = {}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) return undefined
    let frame = 0
    const mesurer = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = mode === 'pin'
        ? clamp(-r.top / Math.max(1, r.height - vh))
        : clamp((vh - r.top) / (vh + r.height))
      setProgress(p)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(mesurer) }
    mesurer()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [ref, mode, enabled])

  // Animation desactivee : etat final directement
  return enabled ? progress : 1
}

/** Sous-progression (0 -> 1) d'une plage [debut, fin] de la progression globale. */
export function segment(progress, debut, fin) {
  return clamp((progress - debut) / (fin - debut))
}
