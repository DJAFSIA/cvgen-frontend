import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { AlertCircle, CheckCircle2, Download, Lightbulb, Link2, RotateCcw, Sparkles, Wand2 } from 'lucide-react'
import { offreAPI, candidatureAPI, errorMessage } from '../services/api'
import { saveBlob } from '../services/download'
import { useI18n } from '../i18n'
import { Alert, Button, Card, Field, Input, Spinner, Textarea } from '../components/ui'
import TemplateMock from '../components/TemplateMock'

const MODELES = ['classique', 'moderne', 'ats']
const MIN_CHARS = 30

function Stepper({ current, labels }) {
  return (
    <ol className="flex items-center gap-2 text-sm" aria-label="Progress">
      {labels.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span className={`grid place-items-center w-6 h-6 rounded-full text-xs font-bold ${done || active ? 'bg-brand text-white' : 'bg-line text-muted'}`}>
              {done ? <CheckCircle2 size={14} aria-hidden="true" /> : i + 1}
            </span>
            <span className={active ? 'font-semibold text-ink' : 'text-muted'}>{label}</span>
            {i < labels.length - 1 && <span className="w-6 sm:w-10 h-px bg-line" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

function ScoreRing({ score = 0 }) {
  const value = Math.max(0, Math.min(100, Math.round(score)))
  const circumference = 2 * Math.PI * 52
  return (
    <div className="relative grid place-items-center w-32 h-32">
      <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="52" stroke="#e3e8ee" strokeWidth="9" fill="none" />
        <circle
          cx="60" cy="60" r="52" stroke="#635bff" strokeWidth="9" fill="none" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-3xl font-bold text-ink tabular-nums">{value}%</span>
    </div>
  )
}

function InsightList({ tone, icon, title, items = [] }) {
  const tones = {
    success: 'bg-success-soft/60 border-success/20 text-success',
    warn: 'bg-warn-soft/70 border-warn/20 text-warn',
  }
  return (
    <div className={`border rounded-xl2 p-5 ${tones[tone]}`}>
      <h3 className="text-xs font-bold uppercase tracking-wide flex items-center gap-2">{icon}{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-ink/90 list-disc pl-5 marker:text-current">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}

function DocumentPreview({ title, content }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-ink mb-3">{title}</h3>
      <div className="bg-white border border-line rounded-lg shadow-card p-8 max-h-[640px] overflow-y-auto">
        <div className="doc-preview"><ReactMarkdown>{content}</ReactMarkdown></div>
      </div>
    </section>
  )
}

export default function NouvelleCandidature() {
  const { t } = useI18n()
  const [url, setUrl] = useState('')
  const [contenu, setContenu] = useState('')
  const [modele, setModele] = useState('classique')
  const [analyse, setAnalyse] = useState(null)
  const [alignement, setAlignement] = useState(null)
  const [reponses, setReponses] = useState({})
  const [resultat, setResultat] = useState(null)
  const [busy, setBusy] = useState('') // extract | analyse | questions | generate | pdf
  const [error, setError] = useState('')

  const questions = alignement?.questions || []
  const step = resultat ? 2 : analyse ? 1 : 0

  const extraire = async () => {
    setBusy('extract')
    setError('')
    try {
      const res = await offreAPI.extraire(url.trim())
      setContenu(res.data.contenu)
    } catch (err) {
      setError(errorMessage(err, t, 'apply.extractError'))
    } finally {
      setBusy('')
    }
  }

  const analyser = async () => {
    setBusy('analyse')
    setError('')
    setAlignement(null)
    setReponses({})
    try {
      const res = await offreAPI.soumettre({ url_source: url.trim() || null, contenu_brut: contenu })
      setAnalyse(res.data)
      setBusy('questions')
      const q = await offreAPI.questionsAlignement(res.data.id)
      setAlignement(q.data)
    } catch (err) {
      setError(errorMessage(err, t, 'apply.analyseError'))
    } finally {
      setBusy('')
    }
  }

  const generer = async () => {
    setBusy('generate')
    setError('')
    try {
      const payload = questions
        .map((q) => ({ id: q.id, theme: q.theme, question: q.question, reponse: reponses[q.id]?.trim() || '' }))
        .filter((item) => item.reponse)
      const created = await candidatureAPI.create(analyse.id)
      const id = created.data.id
      const gen = await candidatureAPI.generer(id, payload, modele)
      setResultat({ id, cv: gen.data.cv, lettre: gen.data.lettre })
    } catch (err) {
      setError(errorMessage(err, t, 'apply.generateError'))
    } finally {
      setBusy('')
    }
  }

  const telecharger = async (type) => {
    setBusy('pdf')
    setError('')
    try {
      const res = await candidatureAPI.exportPdf(resultat.id, type, type === 'cv' ? modele : undefined)
      saveBlob(res.data, `${type === 'cv' ? 'CV' : 'Cover_letter'}.pdf`)
    } catch {
      setError(t('apply.pdfError'))
    } finally {
      setBusy('')
    }
  }

  const recommencer = () => {
    setUrl(''); setContenu(''); setAnalyse(null); setAlignement(null)
    setReponses({}); setResultat(null); setError('')
  }

  return (
    <div className="max-w-4xl mx-auto pb-16 fade-up">
      <h1 className="text-2xl font-bold">{t('apply.title')}</h1>
      <p className="mt-1 text-body">{t('apply.subtitle')}</p>
      <div className="mt-6 overflow-x-auto"><Stepper current={step} labels={t('apply.steps')} /></div>

      {error && <div className="mt-6"><Alert>{error}</Alert></div>}

      {step === 0 && (
        <Card className="mt-6 p-6 space-y-6">
          <Field id="url" label={t('apply.offerLink')}>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
                <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('apply.offerLinkPh')} className="pl-9" maxLength={1000} />
              </div>
              <Button variant="secondary" onClick={extraire} loading={busy === 'extract'} disabled={!url.trim()}>
                <Sparkles size={16} aria-hidden="true" />{t('apply.extract')}
              </Button>
            </div>
          </Field>

          <Field id="contenu" label={t('apply.offerText')} hint={contenu.length > 0 && contenu.length < MIN_CHARS ? t('apply.minChars') : undefined}>
            <Textarea id="contenu" rows={11} value={contenu} onChange={(e) => setContenu(e.target.value)} placeholder={t('apply.offerTextPh')} maxLength={30000} />
          </Field>

          <Button size="lg" className="w-full" onClick={analyser} loading={busy === 'analyse'} disabled={contenu.trim().length < MIN_CHARS}>
            <CheckCircle2 size={18} aria-hidden="true" />{busy === 'analyse' ? t('apply.analysing') : t('apply.analyse')}
          </Button>
        </Card>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col items-center text-center">
              <p className="text-xs font-bold uppercase tracking-wide text-muted mb-4">{t('apply.scoreLabel')}</p>
              <ScoreRing score={analyse.score_compatibilite} />
              <p className="mt-4 font-semibold text-ink">{analyse.titre_poste}</p>
              <p className="text-sm text-muted">{analyse.entreprise}</p>
            </Card>
            <div className="md:col-span-2 space-y-4">
              <InsightList tone="success" icon={<CheckCircle2 size={14} aria-hidden="true" />} title={t('apply.strengths')} items={analyse.points_forts} />
              <InsightList tone="warn" icon={<AlertCircle size={14} aria-hidden="true" />} title={t('apply.gaps')} items={analyse.points_manquants} />
            </div>
          </div>

          {analyse.conseil_ia && (
            <Card className="p-6 flex gap-4 bg-brand-soft/50">
              <span className="grid place-items-center w-10 h-10 shrink-0 rounded-lg bg-white text-brand shadow-card"><Lightbulb size={20} aria-hidden="true" /></span>
              <div>
                <h3 className="text-sm font-semibold">{t('apply.advice')}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{analyse.conseil_ia}</p>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold">{t('apply.refine')}</h2>
            <p className="mt-1 text-sm text-body">{busy === 'questions' ? t('apply.refineWait') : alignement?.diagnostic}</p>

            {busy === 'questions' ? (
              <Spinner label={t('apply.refineWait')} />
            ) : (
              <div className="mt-5 space-y-5">
                {questions.map((q) => (
                  <div key={q.id}>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-brand">{q.theme}</p>
                    <Field id={`q-${q.id}`} label={q.question}>
                      <Textarea id={`q-${q.id}`} rows={3} value={reponses[q.id] || ''} onChange={(e) => setReponses({ ...reponses, [q.id]: e.target.value })} placeholder={q.aide || t('apply.answerPh')} maxLength={2000} />
                    </Field>
                  </div>
                ))}

                <fieldset>
                  <legend className="text-[13px] font-medium text-ink mb-3">{t('apply.chooseTemplate')}</legend>
                  <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-xl">
                    {MODELES.map((m) => (
                      <label key={m} className={`cursor-pointer rounded-xl2 border p-2 transition ${modele === m ? 'border-brand ring-2 ring-brand/25 bg-brand-soft/40' : 'border-line hover:border-slate-300'}`}>
                        <input type="radio" name="modele" value={m} checked={modele === m} onChange={() => setModele(m)} className="sr-only" />
                        <TemplateMock kind={m} />
                        <span className="block mt-2 text-center text-sm font-medium text-ink">{t(`landing.tpl.${m}`)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <Button size="lg" className="w-full" onClick={generer} loading={busy === 'generate'}>
                  <Wand2 size={18} aria-hidden="true" />{busy === 'generate' ? t('apply.generating') : t('apply.generate')}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-6">
          <Card className="p-5 flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 font-semibold text-success"><CheckCircle2 size={18} aria-hidden="true" />{t('apply.done')}</span>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => telecharger('cv')} loading={busy === 'pdf'}><Download size={16} aria-hidden="true" />{t('apply.downloadCv')}</Button>
              <Button onClick={() => telecharger('lettre')} loading={busy === 'pdf'}><Download size={16} aria-hidden="true" />{t('apply.downloadLetter')}</Button>
              <Button variant="secondary" onClick={recommencer}><RotateCcw size={16} aria-hidden="true" />{t('apply.startOver')}</Button>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <DocumentPreview title={t('apply.previewCv')} content={resultat.cv} />
            <DocumentPreview title={t('apply.previewLetter')} content={resultat.lettre} />
          </div>
        </div>
      )}
    </div>
  )
}
