import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Logo, LangSwitch, Ribbon } from './Brand'

/** Mise en page commune des pages de compte : formulaire a gauche, ruban a droite. */
export default function AuthShell({ title, subtitle, children, footer }) {
  const { t } = useI18n()
  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-white">
      <div className="flex flex-col px-6 sm:px-12 py-8">
        <div className="flex items-center justify-between">
          <Logo />
          <LangSwitch />
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto py-10">
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="mt-2 text-body">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-body">{footer}</div>}
          </div>
        </div>

        <Link to="/" className="text-sm text-muted hover:text-ink">&larr; {t('auth.backHome')}</Link>
      </div>

      <aside className="relative hidden lg:block overflow-hidden bg-surface border-l border-line">
        <Ribbon className="inset-0" />
        <div className="relative h-full flex items-end p-14">
          <div className="max-w-md bg-white/90 backdrop-blur rounded-xl2 p-8 shadow-pop">
            <h2 className="text-2xl font-bold">{t('auth.sideTitle')}</h2>
            <p className="mt-3 text-body">{t('auth.sideText')}</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
