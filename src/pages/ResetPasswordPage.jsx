import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n'
import { authAPI, errorMessage } from '../services/api'
import AuthShell from '../components/AuthShell'
import PasswordInput from '../components/PasswordInput'
import { Alert, Button, Field } from '../components/ui'

export default function ResetPasswordPage() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const mismatch = confirm && password !== confirm

  const submit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setError(t('auth.mismatch'))
      return
    }
    setLoading(true)
    setError('')
    try {
      await authAPI.reset({ token, mot_de_passe: password })
      setDone(true)
    } catch (err) {
      setError(err.response?.status === 422 ? t('auth.invalid') : errorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title={t('auth.resetTitle')} subtitle={done || !token ? undefined : t('auth.resetSub')}>
      {!token ? (
        <div className="space-y-4">
          <Alert>{t('errors.invalid_link')}</Alert>
          <Link to="/forgot-password" className="inline-block text-sm font-semibold text-brand hover:text-brand-dark">{t('auth.requestNewLink')}</Link>
        </div>
      ) : done ? (
        <div className="space-y-4">
          <Alert tone="success">{t('auth.resetDone')}</Alert>
          <Link to="/login"><Button size="lg" className="w-full">{t('auth.submitLogin')}</Button></Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <Alert>
              {error}{' '}
              <Link to="/forgot-password" className="font-semibold underline">{t('auth.requestNewLink')}</Link>
            </Alert>
          )}
          <Field id="new-password" label={t('auth.newPassword')} hint={t('auth.passwordHint')}>
            <PasswordInput id="new-password" t={t} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} maxLength={72} />
          </Field>
          <Field id="confirm-password" label={t('auth.confirm')}>
            <PasswordInput id="confirm-password" t={t} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" maxLength={72} />
            {confirm && (
              <p className={`text-xs mt-1.5 ${mismatch ? 'text-danger' : 'text-success'}`}>{mismatch ? t('auth.mismatch') : t('auth.match')}</p>
            )}
          </Field>
          <Button type="submit" size="lg" loading={loading} className="w-full">{t('auth.resetSubmit')}</Button>
        </form>
      )}
    </AuthShell>
  )
}
