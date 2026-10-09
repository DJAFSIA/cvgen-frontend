import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Alert, Button } from './ui'

/** Alerte d'erreur ; quand le quota est atteint, propose directement de passer au Pro. */
export default function ErrorAlert({ message }) {
  const { t } = useI18n()
  if (!message) return null
  const quota = message === t('errors.quota_exceeded')
  return (
    <Alert
      action={quota ? <Link to="/abonnement"><Button size="sm" variant="secondary">{t('billing.seePlans')}</Button></Link> : null}
    >
      {message}
    </Alert>
  )
}
