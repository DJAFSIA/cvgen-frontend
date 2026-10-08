import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../i18n'
import { candidatureAPI, profilAPI } from '../services/api'
import { Alert, Button, Card, Spinner } from '../components/ui'
import StatusBadge, { ScoreBar } from '../components/StatusBadge'

export default function Dashboard() {
  const { user } = useAuth()
  const { t, lang } = useI18n()
  const [candidatures, setCandidatures] = useState([])
  const [profilVide, setProfilVide] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([candidatureAPI.list(), profilAPI.get()]).then(([cands, profil]) => {
      if (cands.status === 'fulfilled') setCandidatures(cands.value.data)
      if (profil.status === 'fulfilled') {
        const p = profil.value.data
        setProfilVide(!p.experiences || !(p.competences || '').trim())
      }
      setLoading(false)
    })
  }, [])

  const scoreMoyen = candidatures.length
    ? Math.round(candidatures.reduce((acc, c) => acc + (c.score_compatibilite || 0), 0) / candidatures.length)
    : 0

  const stats = [
    { label: t('dashboard.applications'), value: candidatures.length },
    { label: t('dashboard.avgScore'), value: `${scoreMoyen}%` },
    { label: t('dashboard.generated'), value: candidatures.filter((c) => c.statut === 'generee').length },
  ]

  return (
    <div className="max-w-5xl mx-auto fade-up">
      <h1 className="text-2xl font-bold">{t('dashboard.hello')}, {user?.prenom}</h1>
      <p className="mt-1 text-body">{t('dashboard.overview')}</p>

      {!loading && profilVide && (
        <div className="mt-6">
          <Alert
            tone="warn"
            title={t('dashboard.incompleteTitle')}
            action={<Link to="/profil"><Button size="sm" variant="secondary">{t('dashboard.completeNow')}</Button></Link>}
          >
            {t('dashboard.incompleteText')}
          </Alert>
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink tabular-nums">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-soft to-white">
        <div>
          <h2 className="text-lg font-semibold">{t('dashboard.ctaTitle')}</h2>
          <p className="mt-1 text-sm text-body">{t('dashboard.ctaText')}</p>
        </div>
        <Link to="/nouvelle-candidature">
          <Button size="lg">{t('dashboard.ctaButton')} <ArrowRight size={16} aria-hidden="true" /></Button>
        </Link>
      </Card>

      <h2 className="mt-10 mb-3 text-sm font-semibold text-ink">{t('dashboard.recent')}</h2>
      {loading ? (
        <Spinner label={t('common.loading')} />
      ) : candidatures.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">{t('dashboard.empty')}</Card>
      ) : (
        <Card className="divide-y divide-line">
          {candidatures.slice(0, 5).map((c) => (
            <div key={c.id} className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{c.titre_poste || t('dashboard.untitled')}</p>
                <p className="text-xs text-muted mt-0.5 truncate">
                  {[c.entreprise, new Date(c.date_creation).toLocaleDateString(lang)].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ScoreBar score={c.score_compatibilite} />
                <StatusBadge statut={c.statut} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
