import { useEffect, useRef } from 'react'
import { useI18n } from '../i18n'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let scriptPromise
function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.onload = resolve
      script.onerror = () => { scriptPromise = undefined; reject(new Error('google script')) }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

/** Bouton "Continuer avec Google". N'apparait que si VITE_GOOGLE_CLIENT_ID est defini. */
export default function GoogleButton({ onCredential, signup = false }) {
  const { lang } = useI18n()
  const container = useRef(null)
  const callback = useRef(onCredential)

  useEffect(() => { callback.current = onCredential }, [onCredential])

  useEffect(() => {
    if (!CLIENT_ID) return undefined
    let annule = false
    loadGoogleScript()
      .then(() => {
        if (annule || !container.current) return
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => callback.current?.(response.credential),
        })
        container.current.innerHTML = ''
        window.google.accounts.id.renderButton(container.current, {
          theme: 'outline', size: 'large', shape: 'rectangular', locale: lang,
          text: signup ? 'signup_with' : 'signin_with',
          width: Math.min(container.current.offsetWidth || 384, 400),
        })
      })
      .catch(() => { /* script bloque (reseau, extension) : le bouton reste absent */ })
    return () => { annule = true }
  }, [lang, signup])

  if (!CLIENT_ID) return null
  return <div ref={container} className="w-full flex justify-center min-h-[44px]" />
}
