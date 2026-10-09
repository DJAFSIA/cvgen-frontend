import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FilePlus2, History, LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'
import { authAPI, errorMessage } from '../services/api'
import { Logo, LangSwitch } from './Brand'
import { Alert, Button } from './ui'

const navItems = [
  { path: '/dashboard', key: 'nav.dashboard', Icon: LayoutDashboard },
  { path: '/nouvelle-candidature', key: 'nav.newApplication', Icon: FilePlus2 },
  { path: '/historique', key: 'nav.history', Icon: History },
  { path: '/profil', key: 'nav.profile', Icon: UserRound },
]

export default function Layout({ children }) {
  const { user, logout, refreshUser } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [resend, setResend] = useState({ status: 'idle', error: '' }) // idle | sending | sent | error
  const nonVerifie = user && user.email_verifie === false

  // Au chargement : si le compte est marque non confirme, on verifie aupres de l'API
  // (l'email a pu etre confirme depuis un autre onglet ou appareil).
  useEffect(() => {
    if (nonVerifie) refreshUser().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renvoyer = async () => {
    setResend({ status: 'sending', error: '' })
    try {
      await authAPI.resendVerification()
      setResend({ status: 'sent', error: '' })
    } catch (err) {
      setResend({ status: 'error', error: errorMessage(err, t) })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user ? `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase() : 'U'

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
      isActive ? 'bg-brand-soft text-brand-dark' : 'text-body hover:bg-surface hover:text-ink'
    }`

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-white border-b border-line sticky top-0 z-20">
        <div className="px-5 h-14 flex items-center justify-between">
          <Logo to="/dashboard" />
          <div className="flex items-center gap-3">
            <LangSwitch />
            <span className="hidden sm:flex items-center gap-2 text-sm text-ink">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-soft text-brand-dark text-xs font-bold" aria-hidden="true">{initials}</span>
              {user?.prenom} {user?.nom}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
              aria-label={t('common.logout')}
            >
              <LogOut size={16} aria-hidden="true" />
              <span className="hidden sm:inline">{t('common.logout')}</span>
            </button>
          </div>
        </div>
        <nav className="md:hidden border-t border-line px-3 py-2 flex gap-1 overflow-x-auto" aria-label="Main">
          {navItems.map((item) => {
            const Icon = item.Icon
            return <NavLink key={item.path} to={item.path} className={linkClass}><Icon size={16} aria-hidden="true" />{t(item.key)}</NavLink>
          })}
        </nav>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-line p-4 flex-col gap-1" aria-label="Main">
          {navItems.map((item) => {
            const Icon = item.Icon
            return <NavLink key={item.path} to={item.path} className={linkClass}><Icon size={17} aria-hidden="true" />{t(item.key)}</NavLink>
          })}
        </aside>
        <main className="flex-1 min-w-0 p-5 sm:p-8">
          {nonVerifie && (
            <div className="max-w-5xl mx-auto mb-6">
              <Alert
                tone="warn"
                title={t('account.unverifiedTitle')}
                action={
                  resend.status === 'sent' ? null : (
                    <Button size="sm" variant="secondary" loading={resend.status === 'sending'} onClick={renvoyer}>
                      {t('account.resend')}
                    </Button>
                  )
                }
              >
                {resend.status === 'sent' ? t('account.resent') : resend.status === 'error' ? resend.error : t('account.unverifiedText', { email: user.email })}
              </Alert>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
