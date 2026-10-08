import { NavLink, useNavigate } from 'react-router-dom'
import { FilePlus2, History, LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'
import { Logo, LangSwitch } from './Brand'

const navItems = [
  { path: '/dashboard', key: 'nav.dashboard', Icon: LayoutDashboard },
  { path: '/nouvelle-candidature', key: 'nav.newApplication', Icon: FilePlus2 },
  { path: '/historique', key: 'nav.history', Icon: History },
  { path: '/profil', key: 'nav.profile', Icon: UserRound },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const navigate = useNavigate()

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
        <main className="flex-1 min-w-0 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
