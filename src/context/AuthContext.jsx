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
  const [user, setUser] = useState(lireUtilisateur)
  const loading = false

  const login = async (email, password) => {
    const res = await authAPI.login({ email, mot_de_passe: password })
    const { access_token, utilisateur } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(utilisateur))
    setUser(utilisateur)
    return utilisateur
  }

  const inscription = async (data) => {
    const res = await authAPI.inscription(data)
    const { access_token, utilisateur } = res.data
    localStorage.setItem('token', access_token)
    localStorage.setItem('user', JSON.stringify(utilisateur))
    setUser(utilisateur)
    return utilisateur
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, inscription, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
