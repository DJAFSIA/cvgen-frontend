import { useState, useEffect, useRef } from 'react'
import { FileUp } from 'lucide-react'
import { profilAPI, errorMessage } from '../services/api'
import { FIELDS, profilVersFormulaire } from '../services/profile'
import { useI18n } from '../i18n'
import { Alert, Button, Card, Field, Input, Spinner, Textarea } from '../components/ui'
import ErrorAlert from '../components/ErrorAlert'

export default function ProfilPage() {
  const { t } = useI18n()
  const [profil, setProfil] = useState(profilVersFormulaire())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [feedback, setFeedback] = useState(null) // { tone, text }
  const fileInputRef = useRef(null)

  useEffect(() => {
    profilAPI.get()
      .then((res) => setProfil(profilVersFormulaire(res.data)))
      .catch((err) => {
        if (err.response?.status !== 404) setFeedback({ tone: 'error', text: errorMessage(err, t) })
      })
      .finally(() => setLoading(false))
  }, [t])

  const set = (key) => (e) => setProfil({ ...profil, [key]: e.target.value })

  const handleImportCV = async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)

    setImporting(true)
    setFeedback(null)
    try {
      const res = await profilAPI.importCV(formData)
      setProfil(profilVersFormulaire(res.data.data))
      setFeedback({ tone: 'success', text: t('profile.imported') })
    } catch (err) {
      setFeedback({ tone: 'error', text: errorMessage(err, t, 'profile.importError') })
    } finally {
      setImporting(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const payload = Object.fromEntries(FIELDS.map((key) => [key, profil[key]]))
      await profilAPI.update(payload)
      setFeedback({ tone: 'success', text: t('profile.saved') })
    } catch (err) {
      setFeedback({ tone: 'error', text: errorMessage(err, t, 'profile.saveError') })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner label={t('common.loading')} />

  return (
    <div className="max-w-2xl mx-auto fade-up">
      <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
      <p className="mt-1 text-body">{t('profile.subtitle')}</p>

      <Card className="mt-6 p-6 border-dashed bg-brand-soft/50 text-center">
        <span className="mx-auto grid place-items-center w-11 h-11 rounded-full bg-white text-brand shadow-card"><FileUp size={20} aria-hidden="true" /></span>
        <h2 className="mt-3 text-base font-semibold">{t('profile.importTitle')}</h2>
        <p className="mt-1 text-sm text-body">{t('profile.importText')}</p>
        <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf,.pdf" onChange={handleImportCV} aria-label={t('profile.importButton')} />
        <Button type="button" variant="secondary" className="mt-4" loading={importing} onClick={() => fileInputRef.current.click()}>
          {importing ? t('profile.importing') : t('profile.importButton')}
        </Button>
      </Card>

      {feedback && <div className="mt-5">{feedback.tone === 'error' ? <ErrorAlert message={feedback.text} /> : <Alert tone={feedback.tone}>{feedback.text}</Alert>}</div>}

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        <Card className="p-6">
          <h2 className="text-base font-semibold mb-4">{t('profile.identity')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="nom_complet_cv" label={t('profile.fullName')}>
              <Input id="nom_complet_cv" value={profil.nom_complet_cv} onChange={set('nom_complet_cv')} autoComplete="name" />
            </Field>
            <Field id="email_cv" label={t('profile.emailCv')}>
              <Input id="email_cv" type="email" value={profil.email_cv} onChange={set('email_cv')} autoComplete="email" />
            </Field>
            <Field id="telephone" label={t('profile.phone')}>
              <Input id="telephone" type="tel" value={profil.telephone} onChange={set('telephone')} autoComplete="tel" />
            </Field>
            <Field id="adresse" label={t('profile.address')}>
              <Input id="adresse" value={profil.adresse} onChange={set('adresse')} autoComplete="address-level2" />
            </Field>
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <Field id="titre_profil" label={t('profile.professionalTitle')}>
            <Input id="titre_profil" value={profil.titre_profil} onChange={set('titre_profil')} placeholder={t('profile.titlePh')} maxLength={200} />
          </Field>
          <Field id="experiences" label={t('profile.experiences')}>
            <Textarea id="experiences" rows={9} value={profil.experiences} onChange={set('experiences')} placeholder={t('profile.experiencesPh')} />
          </Field>
          <Field id="formations" label={t('profile.formations')}>
            <Textarea id="formations" rows={4} value={profil.formations} onChange={set('formations')} placeholder={t('profile.formationsPh')} />
          </Field>
          <Field id="competences" label={t('profile.skills')}>
            <Textarea id="competences" rows={3} value={profil.competences} onChange={set('competences')} placeholder={t('profile.skillsPh')} />
          </Field>
          <Field id="langues" label={t('profile.languages')}>
            <Input id="langues" value={profil.langues} onChange={set('langues')} placeholder={t('profile.languagesPh')} maxLength={500} />
          </Field>
        </Card>

        <Button type="submit" size="lg" loading={saving} disabled={importing} className="w-full">
          {saving ? t('profile.saving') : t('profile.saveButton')}
        </Button>
      </form>
    </div>
  )
}
