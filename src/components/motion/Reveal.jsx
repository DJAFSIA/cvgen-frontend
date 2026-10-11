import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useScroll'

/**
 * Apparition a l'entree dans l'ecran (une seule fois).
 * variant : "up" (glisse vers le haut), "mask" (texte revele par un masque), "scale" (zoom leger).
 */
export default function Reveal({ as = 'div', variant = 'up', delay = 0, className = '', children, ...props }) {
  const Tag = as
  const ref = useRef(null)
  const reduit = useReducedMotion()
  // Sans IntersectionObserver (vieux navigateurs) : contenu visible d'emblee
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const el = ref.current
    if (reduit || visible || !el) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduit, visible])

  const etat = reduit || visible ? 'is-in' : ''
  return (
    <Tag ref={ref} className={`reveal reveal-${variant} ${etat} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...props}>
      {/* Masque : applique a un element interieur, sinon l'element observe aurait une surface nulle
          et ne serait jamais detecte comme visible */}
      {variant === 'mask'
        ? <span className="reveal-inner block" style={{ transitionDelay: `${delay}ms` }}>{children}</span>
        : children}
    </Tag>
  )
}
