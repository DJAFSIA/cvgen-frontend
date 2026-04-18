import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

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
    <AuthContext.Provider value={{ user, login, inscription, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
