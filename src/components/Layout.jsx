import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: '⊞' },
  { path: '/profil', label: 'Mon profil', icon: '◎' },
  { path: '/nouvelle-candidature', label: 'Nouvelle candidature', icon: '+' },
  { path: '/historique', label: 'Historique', icon: '≡' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user ? `${user.prenom?.[0]}${user.nom?.[0]}`.toUpperCase() : 'U'

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <nav className="bg-white/3 border-b border-white/8 px-6 py-3 flex items-center justify-between">
        <div className="text-lg font-bold text-white">
          CV<span className="text-primary-light">Gen</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{user?.prenom} {user?.nom}</span>
          <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center text-xs font-medium text-primary-light">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-500 hover:text-white transition-colors ml-2"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-56 bg-white/2 border-r border-white/8 p-4 flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-primary/20 text-primary-light border border-primary/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
