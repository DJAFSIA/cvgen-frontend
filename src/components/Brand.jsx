import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export function Logo({ to = '/', dark = false }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 font-bold text-[19px] tracking-tight" aria-label="CVGen">
      <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand text-white text-sm font-bold" aria-hidden="true">CV</span>
      <span className={dark ? 'text-white' : 'text-ink'}>Gen</span>
    </Link>
  )
}

export function LangSwitch() {
  const { lang, setLang } = useI18n()
  return (
    <div className="inline-flex rounded-md border border-line bg-white p-0.5 text-xs font-semibold" role="group" aria-label="Language">
      {['en', 'fr'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-2 py-1 rounded uppercase transition-colors ${lang === code ? 'bg-brand text-white' : 'text-muted hover:text-ink'}`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

/**
 * Ruban degrade abstrait, inspire du hero de Stripe : bandes courbes en SVG (aucune image),
 * recouvertes d'un fin motif de rayures.
 */
export function Ribbon({ className = '' }) {
  const bands = [
    { d: 'M-40 -60 C 220 120, 120 380, 330 560 S 520 780, 640 860', w: 120, g: 'rb1' },
    { d: 'M110 -80 C 380 90, 250 340, 470 520 S 640 760, 760 840', w: 105, g: 'rb2' },
    { d: 'M250 -90 C 500 80, 400 330, 600 500 S 760 720, 880 800', w: 95, g: 'rb3' },
    { d: 'M380 -90 C 600 60, 540 300, 720 460 S 860 680, 980 760', w: 70, g: 'rb4' },
  ]
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <svg viewBox="0 0 700 760" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id="rb1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b7d3ff" /><stop offset="0.55" stopColor="#8f94ff" /><stop offset="1" stopColor="#b57bff" /></linearGradient>
          <linearGradient id="rb2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd36e" /><stop offset="0.5" stopColor="#ff8a4c" /><stop offset="1" stopColor="#ff5fa8" /></linearGradient>
          <linearGradient id="rb3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ff7ab8" /><stop offset="0.6" stopColor="#d36bff" /><stop offset="1" stopColor="#7a6bff" /></linearGradient>
          <linearGradient id="rb4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffa24d" /><stop offset="1" stopColor="#ff4f9a" /></linearGradient>
          <pattern id="rbLines" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(62)">
            <rect width="2" height="7" fill="#fff" opacity="0.22" />
          </pattern>
          <mask id="rbMask">
            {bands.map((b) => <path key={b.g} d={b.d} fill="none" stroke="#fff" strokeWidth={b.w} strokeLinecap="round" />)}
          </mask>
        </defs>
        {bands.map((b) => (
          <path key={b.g} d={b.d} fill="none" stroke={`url(#${b.g})`} strokeWidth={b.w} strokeLinecap="round" opacity="0.96" />
        ))}
        <rect width="700" height="760" fill="url(#rbLines)" mask="url(#rbMask)" />
      </svg>
    </div>
  )
}
