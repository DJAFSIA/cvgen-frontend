import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { I18nProvider, useI18n } from './i18n'
import Layout from './components/Layout'
import { Spinner } from './components/ui'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import ProfilPage from './pages/ProfilPage'
import NouvelleCandidature from './pages/NouvelleCandidature'
import HistoriquePage from './pages/HistoriquePage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import AbonnementPage from './pages/AbonnementPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const { t } = useI18n()
  if (loading) return <div className="min-h-screen"><Spinner label={t('common.loading')} /></div>
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function GuestRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><AuthPage mode="login" /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><AuthPage mode="signup" /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profil" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
      <Route path="/nouvelle-candidature" element={<PrivateRoute><NouvelleCandidature /></PrivateRoute>} />
      <Route path="/abonnement" element={<PrivateRoute><AbonnementPage /></PrivateRoute>} />
      <Route path="/abonnement/mobile-money" element={<PrivateRoute><AbonnementPage /></PrivateRoute>} />
      <Route path="/historique" element={<PrivateRoute><HistoriquePage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}
