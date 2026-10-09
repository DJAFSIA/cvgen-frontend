import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { authAPI, errorMessage } from '../services/api'
import AuthShell from '../components/AuthShell'
import { Alert, Button, Field, Input } from '../components/ui'

export default function ForgotPasswordPage() {
  const { t, lang } = useI18n()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authAPI.forgot({ email, langue: lang })
      setSent(true)
    } catch (err) {
      setError(err.response?.status === 422 ? t('auth.invalid') : errorMessage(err, t))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title={t('auth.forgotTitle')}
      subtitle={t('auth.forgotSub')}
      footer={<Link to="/login" className="font-semibold text-brand hover:text-brand-dark">&larr; {t('auth.backToLogin')}</Link>}
    >
      {sent ? (
        <Alert tone="success" title={t('auth.checkInbox')}>{t('auth.forgotSent')}</Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <Alert>{error}</Alert>}
          <Field id="email" label={t('auth.email')}>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </Field>
          <Button type="submit" size="lg" loading={loading} className="w-full">{t('auth.sendLink')}</Button>
        </form>
      )}
    </AuthShell>
  )
}
