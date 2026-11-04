import { createContext, useContext, useState } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

function lireUtilisateur() {
  try {
    const token = localStorage.getItem('token')
    const saved = localStorage.getItem('user')
    return token && saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(lireUtilisateur)
  const [compteSupprime, setCompteSupprime] = useState(false)
  const loading = false

  const setUser = (next) => {
    setUserState(next)
    if (next) localStorage.setItem('user', JSON.stringify(next))
  }

  const startSession = ({ access_token, utilisateur }) => {
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(utilisateur))
    setUserState(utilisateur)
    setCompteSupprime(false)
    return utilisateur
  }

  const login = async (email, password) => {
    const res = await authAPI.login({ email, mot_de_passe: password })
    return startSession(res.data)
  }

  const inscription = async (data) => {
    const res = await authAPI.inscription(data)
    return startSession(res.data)
  }

  const loginWithGoogle = async (credential, langue) => {
    const res = await authAPI.google({ credential, langue })
    return startSession(res.data)
  }

  /** Recharge l'utilisateur depuis l'API (ex: apres confirmation de l'email dans un autre onglet). */
  const refreshUser = async () => {
    const res = await authAPI.me()
    setUser(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUserState(null)
  }

  /** Fin de session apres la suppression du compte : la page de connexion l'annonce. */
  const logoutApresSuppression = () => {
    logout()
    setCompteSupprime(true)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, inscription, loginWithGoogle, refreshUser, logout, logoutApresSuppression, compteSupprime, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
