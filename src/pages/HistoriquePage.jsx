import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { useI18n } from '../i18n'
import { candidatureAPI, errorMessage } from '../services/api'
import { Alert, Button, Card, Spinner } from '../components/ui'
import StatusBadge, { ScoreBar } from '../components/StatusBadge'
import { downloadDocument } from '../services/download'

export default function HistoriquePage() {
  const { t, lang } = useI18n()
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')

  useEffect(() => {
    candidatureAPI.list()
      .then((res) => setCandidatures(res.data))
      .catch((err) => setError(errorMessage(err, t)))
      .finally(() => setLoading(false))
  }, [t])

  const download = async (c, type) => {
    setBusy(`${c.id}:${type}`)
    setError('')
    try {
      await downloadDocument(c.id, type)
    } catch {
      setError(t('apply.pdfError'))
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto fade-up">
      <h1 className="text-2xl font-bold">{t('history.title')}</h1>
      <p className="mt-1 text-body">{t('history.count', { n: candidatures.length })}</p>

      {error && <div className="mt-5"><Alert>{error}</Alert></div>}

      <div className="mt-6">
        {loading ? (
          <Spinner label={t('common.loading')} />
        ) : candidatures.length === 0 ? (
          <Card className="p-10 text-center text-sm text-muted">{t('history.empty')}</Card>
        ) : (
          <div className="space-y-3">
            {candidatures.map((c) => (
              <Card key={c.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink truncate">{c.titre_poste || t('dashboard.untitled')}</p>
                    <p className="text-sm text-muted mt-0.5">{c.entreprise}</p>
                    <p className="text-xs text-muted mt-1">
                      {t('history.created', { date: new Date(c.date_creation).toLocaleDateString(lang, { day: '2-digit', month: 'long', year: 'numeric' }) })}
                    </p>
                  </div>
                  <StatusBadge statut={c.statut} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">{t('history.score')}</span>
                    <ScoreBar score={c.score_compatibilite} />
                  </div>
                  {c.statut === 'generee' && (
                    <div className="flex gap-2">
                      {['cv', 'lettre'].map((type) => (
                        <Button key={type} size="sm" variant="secondary" loading={busy === `${c.id}:${type}`} onClick={() => download(c, type)}>
                          <Download size={14} aria-hidden="true" />{type === 'cv' ? t('common.cv') : t('common.letter')}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
