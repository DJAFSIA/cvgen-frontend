import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'
import { compteAPI, errorMessage } from '../services/api'
import { saveJson } from '../services/download'
import { LegalLinks, TexteRiche } from '../components/Legal'
import PasswordInput from '../components/PasswordInput'
import { Alert, Button, Card, Field, Input, Select } from '../components/ui'

/** Droits de l'utilisateur : rectifier ses informations, obtenir ses donnees, supprimer son compte. */
export default function ComptePage() {
  const { t, lang } = useI18n()
  const { user, setUser, refreshUser, logoutApresSuppression } = useAuth()

  const [form, setForm] = useState({ prenom: user.prenom, nom: user.nom, langue: user.langue || 'en' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null) // { tone, text }
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmation, setConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  // Un compte Google n'a pas de mot de passe connu : il confirme la suppression avec son email
  const google = user.provider === 'google'
  const inscription = new Date(user.date_inscription).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' })

  // Le compte a pu changer depuis un autre appareil
  useEffect(() => {
    refreshUser()
      .then((u) => setForm({ prenom: u.prenom, nom: u.nom, langue: u.langue || 'en' }))
      .catch(() => { /* on garde les informations deja connues */ })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const champ = (cle) => (e) => setForm({ ...form, [cle]: e.target.value })

  const enregistrer = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const res = await compteAPI.modifier(form)
      setUser(res.data)
      setForm({ prenom: res.data.prenom, nom: res.data.nom, langue: res.data.langue })
      setFeedback({ tone: 'success', text: t('account.saved') })
    } catch (err) {
      setFeedback({ tone: 'error', text: err.response?.status === 422 ? t('auth.invalid') : errorMessage(err, t) })
    } finally {
      setSaving(false)
    }
  }

  const exporter = async () => {
    setExporting(true)
    setExportError('')
    try {
      const res = await compteAPI.exporter()
      saveJson(res.data, `apply-export-${new Date().toISOString().slice(0, 10)}.json`)
    } catch (err) {
      setExportError(errorMessage(err, t))
    } finally {
      setExporting(false)
    }
  }

  const supprimer = async (e) => {
    e.preventDefault()
    setDeleting(true)
    setDeleteError('')
    try {
      await compteAPI.supprimer(google ? { confirmation } : { mot_de_passe: confirmation })
      logoutApresSuppression() // la route privee renvoie alors vers la page de connexion
    } catch (err) {
      setDeleteError(errorMessage(err, t))
      setDeleting(false)
    }
  }

  const annulerSuppression = () => {
    setDeleteOpen(false)
    setConfirmation('')
    setDeleteError('')
  }

  return (
    <div className="max-w-2xl mx-auto fade-up space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('account.title')}</h1>
        <p className="mt-1 text-body">{t('account.subtitle')}</p>
      </div>

      <Card className="p-6">
        <h2 className="text-base font-semibold">{t('account.infoTitle')}</h2>
        {feedback && <div className="mt-4"><Alert tone={feedback.tone}>{feedback.text}</Alert></div>}

        <form onSubmit={enregistrer} className="mt-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field id="prenom" label={t('auth.firstName')}>
              <Input id="prenom" value={form.prenom} onChange={champ('prenom')} autoComplete="given-name" maxLength={100} required />
            </Field>
            <Field id="nom" label={t('auth.lastName')}>
              <Input id="nom" value={form.nom} onChange={champ('nom')} autoComplete="family-name" maxLength={100} required />
            </Field>
          </div>
          <Field id="email" label={t('auth.email')} hint={<TexteRiche texte={t('account.emailHint')} />}>
            <Input id="email" value={user.email} disabled className="disabled:bg-surface disabled:text-muted" />
          </Field>
          <Field id="langue" label={t('account.emailLanguage')}>
            <Select id="langue" value={form.langue} onChange={champ('langue')}>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </Select>
          </Field>
          <Button type="submit" loading={saving}>{t('common.save')}</Button>
        </form>

        <dl className="mt-6 pt-5 border-t border-line grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">{t('account.signInMethod')}</dt>
            <dd className="mt-0.5 font-medium text-ink">{google ? 'Google' : t('account.methodPassword')}</dd>
            {!google && <dd className="mt-1"><Link to="/forgot-password" className="text-brand hover:underline">{t('account.changePassword')}</Link></dd>}
          </div>
          <div>
            <dt className="text-muted">{t('account.memberSince')}</dt>
            <dd className="mt-0.5 font-medium text-ink">{inscription}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold">{t('account.dataTitle')}</h2>
        <p className="mt-2 text-sm text-body">{t('account.dataText')}</p>
        {exportError && <div className="mt-4"><Alert>{exportError}</Alert></div>}
        <Button variant="secondary" className="mt-4" loading={exporting} onClick={exporter}>
          {!exporting && <Download size={16} aria-hidden="true" />}{t('account.dataButton')}
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold">{t('account.legalTitle')}</h2>
        <LegalLinks className="mt-3 text-sm text-body" />
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold text-danger">{t('account.deleteTitle')}</h2>
        <p className="mt-2 text-sm text-body"><TexteRiche texte={t('account.deleteText')} /></p>

        {deleteOpen ? (
          <form onSubmit={supprimer} className="mt-5 space-y-4">
            {deleteError && <Alert>{deleteError}</Alert>}
            {google ? (
              <Field id="confirmation" label={t('account.deleteEmail', { email: user.email })}>
                <Input id="confirmation" type="email" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="off" required />
              </Field>
            ) : (
              <Field id="confirmation" label={t('account.deletePassword')}>
                <PasswordInput id="confirmation" t={t} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} autoComplete="current-password" maxLength={72} />
              </Field>
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="danger" loading={deleting}>{t('account.deleteConfirm')}</Button>
              <Button type="button" variant="ghost" disabled={deleting} onClick={annulerSuppression}>{t('account.deleteCancel')}</Button>
            </div>
          </form>
        ) : (
          <Button variant="dangerOutline" className="mt-4" onClick={() => setDeleteOpen(true)}>{t('account.deleteTitle')}</Button>
        )}
      </Card>
    </div>
  )
}
