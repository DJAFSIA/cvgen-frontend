import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CreditCard, Smartphone } from 'lucide-react'
import { useI18n } from '../i18n'
import { billingAPI, errorMessage } from '../services/api'
import { deviseCarteParDefaut, formatPrice } from '../services/money'
import { Alert, Badge, Button, Card, Spinner } from '../components/ui'

const ZONES_MOMO = ['XAF', 'XOF']
const selectClass = 'h-10 w-full bg-white border border-line rounded-md px-3 text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

function UsageBar({ label, used, limit }) {
  const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-body">{label}</span>
        <span className="font-semibold text-ink tabular-nums">{used} / {limit}</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-line overflow-hidden" role="progressbar" aria-valuenow={used} aria-valuemin={0} aria-valuemax={limit} aria-label={label}>
        <div className={`h-full rounded-full ${pct >= 100 ? 'bg-danger' : 'bg-brand'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function AbonnementPage() {
  const { t, lang } = useI18n()
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [etat, setEtat] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState('')
  const [feedback, setFeedback] = useState(null) // { tone, text }
  const [deviseCarte, setDeviseCarte] = useState('eur')
  const [zone, setZone] = useState('XAF')
  const retourTraite = useRef(false)

  const charger = useCallback(async () => {
    const res = await billingAPI.me()
    setEtat(res.data)
    setDeviseCarte((d) => (res.data.offre.stripe.prix[d] ? d : deviseCarteParDefaut(Object.keys(res.data.offre.stripe.prix))))
    return res.data
  }, [])

  // Chargement + traitement des retours de paiement (Stripe ou Mobile Money)
  useEffect(() => {
    if (retourTraite.current) return
    retourTraite.current = true
    const estRetourMomo = location.pathname.endsWith('/mobile-money')
    const sessionId = params.get('session_id')
    const checkout = params.get('checkout')

    const traiter = async () => {
      try {
        if (estRetourMomo) {
          const statut = params.get('status')
          const transactionId = params.get('transaction_id')
          if (statut === 'cancelled' || !transactionId) {
            setFeedback({ tone: 'warn', text: t('billing.cancelled') })
          } else {
            const res = await billingAPI.momoConfirm(transactionId)
            setFeedback(res.data.statut === 'paid'
              ? { tone: 'success', text: t('billing.activated') }
              : { tone: 'warn', text: t('billing.pending') })
          }
        } else if (checkout === 'success' && sessionId) {
          await billingAPI.stripeConfirm(sessionId)
          setFeedback({ tone: 'success', text: t('billing.activated') })
        } else if (checkout === 'cancel') {
          setFeedback({ tone: 'warn', text: t('billing.cancelled') })
        }
      } catch (err) {
        setFeedback({ tone: 'error', text: errorMessage(err, t) })
      }
      if (estRetourMomo || checkout) navigate('/abonnement', { replace: true })
      try {
        await charger()
      } catch (err) {
        setFeedback({ tone: 'error', text: errorMessage(err, t) })
      } finally {
        setLoading(false)
      }
    }
    traiter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rediriger = async (cle, appel) => {
    setBusy(cle)
    setFeedback(null)
    try {
      const res = await appel()
      window.location.assign(res.data.url)
    } catch (err) {
      setFeedback({ tone: 'error', text: errorMessage(err, t) })
      setBusy('')
    }
  }

  if (loading) return <Spinner label={t('common.loading')} />
  if (!etat) return <div className="max-w-4xl mx-auto">{feedback && <Alert tone={feedback.tone}>{feedback.text}</Alert>}</div>

  const pro = etat.plan === 'pro'
  const { stripe, mobile_money: momo } = etat.offre
  const finPlan = etat.expire_le ? new Date(etat.expire_le).toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }) : null

  return (
    <div className="max-w-4xl mx-auto fade-up">
      <h1 className="text-2xl font-bold">{t('billing.title')}</h1>
      <p className="mt-1 text-body">{t('billing.subtitle')}</p>

      {feedback && <div className="mt-5"><Alert tone={feedback.tone}>{feedback.text}</Alert></div>}

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">{t('billing.currentPlan')}</h2>
            <Badge tone={pro ? 'brand' : 'neutral'}>{pro ? 'Pro' : t('billing.free')}</Badge>
          </div>
          <p className="mt-3 text-sm text-body">
            {pro
              ? (etat.renouvellement_auto ? t('billing.renews', { date: finPlan }) : t('billing.validUntil', { date: finPlan }))
              : t('billing.freeDesc')}
          </p>
          {etat.peut_gerer_carte && (
            <Button variant="secondary" size="sm" className="mt-4" loading={busy === 'portal'} onClick={() => rediriger('portal', billingAPI.stripePortal)}>
              <CreditCard size={15} aria-hidden="true" />{t('billing.manage')}
            </Button>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-base font-semibold">{t('billing.usageTitle')}</h2>
          <UsageBar label={t('billing.usageGenerations')} used={etat.usage.generations} limit={etat.limites.generations} />
          <UsageBar label={t('billing.usageAnalyses')} used={etat.usage.analyses} limit={etat.limites.analyses} />
          <UsageBar label={t('billing.usageImports')} used={etat.usage.imports} limit={etat.limites.imports} />
          <p className="text-xs text-muted">{t('billing.usageReset')}</p>
        </Card>
      </div>

      {!etat.renouvellement_auto && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">{pro ? t('billing.extendTitle') : t('billing.upgradeTitle')}</h2>
          <p className="mt-1 text-sm text-body">{t('billing.upgradeText', { n: etat.offre.limites.pro.generations })}</p>

          <div className="mt-5 grid md:grid-cols-2 gap-6">
            <Card className="p-6 flex flex-col">
              <div className="flex items-center gap-2 font-semibold text-ink"><CreditCard size={18} className="text-brand" aria-hidden="true" />{t('billing.card')}</div>
              <p className="mt-1 text-sm text-body">{t('billing.cardDesc')}</p>
              {stripe.actif ? (
                <>
                  <p className="mt-4"><span className="text-3xl font-bold text-ink">{formatPrice(stripe.prix[deviseCarte], deviseCarte, lang)}</span><span className="text-muted"> / {t('billing.month')}</span></p>
                  <label htmlFor="devise-carte" className="mt-4 block text-[13px] font-medium text-ink mb-1.5">{t('billing.currency')}</label>
                  <select id="devise-carte" className={selectClass} value={deviseCarte} onChange={(e) => setDeviseCarte(e.target.value)}>
                    {Object.keys(stripe.prix).map((d) => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                  </select>
                  <Button className="mt-5 w-full" loading={busy === 'card'} onClick={() => rediriger('card', () => billingAPI.stripeCheckout(deviseCarte))}>
                    {t('billing.payCard')}
                  </Button>
                </>
              ) : <p className="mt-4 text-sm text-muted">{t('billing.unavailable')}</p>}
            </Card>

            <Card className="p-6 flex flex-col">
              <div className="flex items-center gap-2 font-semibold text-ink"><Smartphone size={18} className="text-brand" aria-hidden="true" />Mobile Money</div>
              <p className="mt-1 text-sm text-body">{t('billing.momoDesc', { days: momo.jours })}</p>
              {momo.actif ? (
                <>
                  <p className="mt-4"><span className="text-3xl font-bold text-ink">{formatPrice(momo.prix[zone], zone, lang)}</span><span className="text-muted"> / {t('billing.days', { n: momo.jours })}</span></p>
                  <label htmlFor="zone-momo" className="mt-4 block text-[13px] font-medium text-ink mb-1.5">{t('billing.zone')}</label>
                  <select id="zone-momo" className={selectClass} value={zone} onChange={(e) => setZone(e.target.value)}>
                    {ZONES_MOMO.filter((z) => momo.prix[z] !== undefined).map((z) => <option key={z} value={z}>{t(`billing.zone${z}`)}</option>)}
                  </select>
                  <Button className="mt-5 w-full" loading={busy === 'momo'} onClick={() => rediriger('momo', () => billingAPI.momoCheckout(zone))}>
                    {t('billing.payMomo')}
                  </Button>
                </>
              ) : <p className="mt-4 text-sm text-muted">{t('billing.unavailable')}</p>}
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}
