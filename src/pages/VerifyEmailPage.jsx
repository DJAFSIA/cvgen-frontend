import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'
import { authAPI, errorMessage } from '../services/api'
import AuthShell from '../components/AuthShell'
import { Alert, Button, Spinner } from '../components/ui'

export default function VerifyEmailPage() {
  const { t } = useI18n()
  const { user, setUser } = useAuth()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [state, setState] = useState(token ? 'loading' : 'error') // loading | ok | error
  const [message, setMessage] = useState(token ? '' : t('errors.invalid_link'))

  useEffect(() => {
    if (!token) return undefined
    let annule = false
    authAPI.verifyEmail({ token })
      .then((res) => {
        if (annule) return
        // Met a jour la session en cours si c'est le meme compte
        if (user && user.id === res.data.id) setUser({ ...user, email_verifie: true })
        setState('ok')
      })
      .catch((err) => {
        if (annule) return
        setMessage(errorMessage(err, t))
        setState('error')
      })
    return () => { annule = true }
    // Une seule verification par arrivee sur la page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <AuthShell title={t('auth.verifyTitle')}>
      {state === 'loading' && <Spinner label={t('auth.verifying')} />}
      {state === 'ok' && (
        <div className="space-y-4">
          <Alert tone="success">{t('auth.verifyDone')}</Alert>
          <Link to={user ? '/dashboard' : '/login'}>
            <Button size="lg" className="w-full">{user ? t('nav.dashboard') : t('auth.submitLogin')}</Button>
          </Link>
        </div>
      )}
      {state === 'error' && (
        <div className="space-y-4">
          <Alert>{message}</Alert>
          <Link to={user ? '/dashboard' : '/login'} className="inline-block text-sm font-semibold text-brand hover:text-brand-dark">
            {user ? t('auth.verifyResendHint') : t('auth.backToLogin')}
          </Link>
        </div>
      )}
    </AuthShell>
  )
}
