import { useState, useEffect, useMemo, useRef } from 'react'
import { FileUp, ShieldCheck } from 'lucide-react'
import { profilAPI, errorMessage } from '../services/api'
import { ETAT_CIVIL, FIELDS, profilVersFormulaire } from '../services/profile'
import { paysTries } from '../data/pays'
import { useI18n } from '../i18n'
import { Alert, Button, Card, Field, Input, Select, Spinner, Textarea } from '../components/ui'
import ErrorAlert from '../components/ErrorAlert'
import PhotoCV from '../components/PhotoCV'

// Accords proposes selon la langue du site ; l'anglais n'en a pas
const SITUATIONS = {
  fr: ['celibataire', 'marie_m', 'marie_f', 'pacse_m', 'pacse_f', 'divorce_m', 'divorce_f', 'veuf_m', 'veuf_f'],
  en: ['celibataire', 'marie', 'pacse', 'divorce', 'veuf'],
}

/** Situations a proposer ; la valeur enregistree reste choisie, meme si elle vient de l'autre langue. */
function situationsPour(lang, valeur) {
  const liste = SITUATIONS[lang] || SITUATIONS.en
  if (!valeur || liste.includes(valeur)) return liste
  const proche = liste.findIndex((code) => valeur.startsWith(`${code}_`))
  return proche >= 0 ? liste.map((code, i) => (i === proche ? valeur : code)) : [...liste, valeur]
}

export default function ProfilPage() {
  const { t, lang } = useI18n()
  const [profil, setProfil] = useState(profilVersFormulaire())
  const [aPhoto, setAPhoto] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [importing, setImporting] = useState(false)
  const [feedback, setFeedback] = useState(null) // { tone, text }
  const fileInputRef = useRef(null)

  useEffect(() => {
    profilAPI.get()
      .then((res) => {
        setProfil(profilVersFormulaire(res.data))
        setAPhoto(res.data.a_photo)
      })
      .catch((err) => {
        if (err.response?.status !== 404) setFeedback({ tone: 'error', text: errorMessage(err, t) })
      })
      .finally(() => setLoading(false))
  }, [t])

  const pays = useMemo(() => paysTries(lang), [lang])
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
      // l'import ne lit pas l'etat civil : celui du formulaire est garde
      setProfil((avant) => ({ ...profilVersFormulaire(res.data.data), ...Object.fromEntries(ETAT_CIVIL.map((c) => [c, avant[c]])) }))
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

        <Card className="p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold">{t('profile.personalTitle')}</h2>
            <p className="mt-1 text-sm text-body">{t('profile.personalText')}</p>
            <p className="mt-2.5 flex gap-2 text-[13px] text-muted">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              {t('profile.personalPrivacy')}
            </p>
          </div>

          <PhotoCV aPhoto={aPhoto} onChange={setAPhoto} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="date_naissance" label={t('profile.birthDate')}>
              <Input id="date_naissance" type="date" value={profil.date_naissance} onChange={set('date_naissance')} autoComplete="bday" />
            </Field>
            <Field id="lieu_naissance" label={t('profile.birthPlace')}>
              <Input id="lieu_naissance" value={profil.lieu_naissance} onChange={set('lieu_naissance')} placeholder={t('profile.birthPlacePh')} maxLength={120} />
            </Field>
            <Field id="nationalite" label={t('profile.nationality')}>
              <Select id="nationalite" value={profil.nationalite} onChange={set('nationalite')}>
                <option value="">{t('profile.notStated')}</option>
                {pays.map((p) => <option key={p.code} value={p.code}>{p.nom}</option>)}
              </Select>
            </Field>
            <Field id="permis_sejour" label={t('profile.permit')} hint={t('profile.permitHint')}>
              <Input id="permis_sejour" value={profil.permis_sejour} onChange={set('permis_sejour')} placeholder={t('profile.permitPh')} maxLength={80} />
            </Field>
            <Field id="situation_familiale" label={t('profile.marital')}>
              <Select id="situation_familiale" value={profil.situation_familiale} onChange={set('situation_familiale')}>
                <option value="">{t('profile.notStated')}</option>
                {situationsPour(lang, profil.situation_familiale).map((code) => <option key={code} value={code}>{t(`profile.maritalValues.${code}`)}</option>)}
              </Select>
            </Field>
            <Field id="enfants" label={t('profile.children')}>
              <Input id="enfants" type="number" min="0" max="20" inputMode="numeric" value={profil.enfants} onChange={set('enfants')} />
            </Field>
          </div>
        </Card>

        <Button type="submit" size="lg" loading={saving} disabled={importing} className="w-full">
          {saving ? t('profile.saving') : t('profile.saveButton')}
        </Button>
      </form>
    </div>
  )
}
