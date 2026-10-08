import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'
import { errorMessage } from '../services/api'
import { Logo, LangSwitch, Ribbon } from '../components/Brand'
import { Alert, Button, Field, Input } from '../components/ui'

function PasswordInput({ id, value, onChange, autoComplete, t, ...props }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={shown ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="pr-10"
        required
        {...props}
      />
      <button
        type="button"
        onClick={() => setShown(!shown)}
        aria-label={shown ? t('auth.hide') : t('auth.show')}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
      >
        {shown ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  )
}

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup'
  const { t } = useI18n()
  const { login, inscription } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ prenom: '', nom: '', email: '', mot_de_passe: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const mismatch = isSignup && form.confirm && form.mot_de_passe !== form.confirm

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
        await inscription({ prenom: form.prenom, nom: form.nom, email: form.email, mot_de_passe: form.mot_de_passe })
      } else {
        await login(form.email, form.mot_de_passe)
      }
      navigate('/dashboard')
    } catch (err) {
      const status = err.response?.status
      if (!isSignup && status === 401) setError(t('auth.badCredentials'))
      else if (isSignup && status === 400) setError(t('auth.emailTaken'))
      else if (status === 422) setError(t('auth.invalid'))
      else setError(errorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] bg-white">
      <div className="flex flex-col px-6 sm:px-12 py-8">
        <div className="flex items-center justify-between">
          <Logo />
          <LangSwitch />
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto py-10">
            <h1 className="text-3xl font-bold">{isSignup ? t('auth.signupTitle') : t('auth.loginTitle')}</h1>
            <p className="mt-2 text-body">{isSignup ? t('auth.signupSub') : t('auth.loginSub')}</p>

            <form onSubmit={submit} className="mt-8 space-y-4" noValidate={false}>
              {error && <Alert>{error}</Alert>}

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

              <Field id="password" label={t('auth.password')} hint={isSignup ? t('auth.passwordHint') : undefined}>
                <PasswordInput
                  id="password" t={t} value={form.mot_de_passe} onChange={set('mot_de_passe')}
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  minLength={isSignup ? 8 : undefined} maxLength={72}
                />
              </Field>

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

            <p className="mt-6 text-sm text-body">
              {isSignup ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
              <Link to={isSignup ? '/login' : '/signup'} className="font-semibold text-brand hover:text-brand-dark">
                {isSignup ? t('common.login') : t('common.signup')}
              </Link>
            </p>
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
