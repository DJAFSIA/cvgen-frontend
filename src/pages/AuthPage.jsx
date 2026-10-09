import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'
import { errorMessage } from '../services/api'
import AuthShell from '../components/AuthShell'
import GoogleButton from '../components/GoogleButton'
import PasswordInput from '../components/PasswordInput'
import { Alert, Button, Field, Input } from '../components/ui'

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const { t, lang } = useI18n()
  const { login, inscription, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ prenom: '', nom: '', email: '', mot_de_passe: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const mismatch = isSignup && form.confirm && form.mot_de_passe !== form.confirm

  const fail = (err) => {
    setError(err.response?.status === 422 ? t('auth.invalid') : errorMessage(err, t))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (isSignup && form.mot_de_passe !== form.confirm) {
      setError(t('auth.mismatch'))
      return
    }
    setLoading(true)
    try {
      if (isSignup) {
        await inscription({ prenom: form.prenom, nom: form.nom, email: form.email, mot_de_passe: form.mot_de_passe, langue: lang })
      } else {
        await login(form.email, form.mot_de_passe)
      }
      navigate('/dashboard')
    } catch (err) {
      fail(err)
    } finally {
      setLoading(false)
    }
  }

  const google = async (credential) => {
    setError('')
    try {
      await loginWithGoogle(credential, lang)
      navigate('/dashboard')
    } catch (err) {
      fail(err)
    }
  }

  return (
    <AuthShell
      title={isSignup ? t('auth.signupTitle') : t('auth.loginTitle')}
      subtitle={isSignup ? t('auth.signupSub') : t('auth.loginSub')}
      footer={
        <>
          {isSignup ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
          <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-brand hover:text-brand-dark">
            {isSignup ? t('common.login') : t('common.signup')}
          </Link>
        </>
      }
    >
      {error && <div className="mb-4"><Alert>{error}</Alert></div>}

      <GoogleButton signup={isSignup} onCredential={google} />
      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <div className="my-5 flex items-center gap-3 text-xs text-muted" aria-hidden="true">
          <span className="flex-1 h-px bg-line" />{t('auth.or')}<span className="flex-1 h-px bg-line" />
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        {isSignup && (
          <div className="grid grid-cols-2 gap-3">
            <Field id="prenom" label={t('auth.firstName')}>
              <Input id="prenom" value={form.prenom} onChange={set('prenom')} autoComplete="given-name" maxLength={100} required />
            </Field>
            <Field id="nom" label={t('auth.lastName')}>
              <Input id="nom" value={form.nom} onChange={set('nom')} autoComplete="family-name" maxLength={100} required />
            </Field>
          </div>
        )}

        <Field id="email" label={t('auth.email')}>
          <Input id="email" type="email" value={form.email} onChange={set('email')} autoComplete={isSignup ? 'email' : 'username'} required />
        </Field>

        <div>
          <Field id="password" label={t('auth.password')} hint={isSignup ? t('auth.passwordHint') : undefined}>
            <PasswordInput
              id="password" t={t} value={form.mot_de_passe} onChange={set('mot_de_passe')}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={isSignup ? 8 : undefined} maxLength={72}
            />
          </Field>
          {!isSignup && (
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-[13px] font-medium text-brand hover:text-brand-dark">{t('auth.forgot')}</Link>
            </div>
          )}
        </div>

        {isSignup && (
          <Field id="confirm" label={t('auth.confirm')}>
            <PasswordInput id="confirm" t={t} value={form.confirm} onChange={set('confirm')} autoComplete="new-password" maxLength={72} />
            {form.confirm && (
              <p className={`text-xs mt-1.5 ${mismatch ? 'text-danger' : 'text-success'}`}>
                {mismatch ? t('auth.mismatch') : t('auth.match')}
              </p>
            )}
          </Field>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? t('auth.working') : isSignup ? t('auth.submitSignup') : t('auth.submitLogin')}
        </Button>
      </form>
    </AuthShell>
  )
}
