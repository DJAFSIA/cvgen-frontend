import { Check } from 'lucide-react'
import { useI18n } from '../i18n'
import { formatPrice } from '../services/money'
import { Badge, Card } from './ui'

/** Comparatif Gratuit / Pro, alimente par GET /billing/plans. */
export default function PricingCards({ offre, deviseCarte = 'eur', footer }) {
  const { t, lang } = useI18n()
  if (!offre) return null
  const { limites, stripe, mobile_money: momo } = offre
  const prixCarte = stripe.prix[deviseCarte]
  const prixMomo = momo.prix.XAF ?? Object.values(momo.prix)[0]

  const lignes = (plan) => [
    t('billing.featGenerations', { n: limites[plan].generations }),
    t('billing.featAnalyses', { n: limites[plan].analyses }),
    t('billing.featImports', { n: limites[plan].imports }),
    t('billing.featTemplates'),
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-7 flex flex-col">
        <h3 className="text-lg font-semibold">{t('billing.free')}</h3>
        <p className="mt-1 text-sm text-body">{t('billing.freeDesc')}</p>
        <p className="mt-6 text-4xl font-bold text-ink">{formatPrice(0, deviseCarte, lang)}</p>
        <ul className="mt-6 space-y-2.5 text-sm">
          {lignes('free').map((l) => <li key={l} className="flex gap-2"><Check size={17} className="text-brand shrink-0" aria-hidden="true" />{l}</li>)}
        </ul>
        {footer?.free && <div className="mt-auto pt-7">{footer.free}</div>}
      </Card>

      <Card className="p-7 flex flex-col border-brand ring-1 ring-brand/30 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pro</h3>
          <Badge tone="brand">{t('billing.popular')}</Badge>
        </div>
        <p className="mt-1 text-sm text-body">{t('billing.proDesc')}</p>
        <p className="mt-6">
          {prixCarte !== undefined && (
            <><span className="text-4xl font-bold text-ink">{formatPrice(prixCarte, deviseCarte, lang)}</span><span className="text-muted"> / {t('billing.month')}</span></>
          )}
        </p>
        {prixMomo !== undefined && (
          <p className="mt-1 text-sm text-body">
            {t('billing.orMomo', { price: formatPrice(prixMomo, momo.prix.XAF !== undefined ? 'XAF' : Object.keys(momo.prix)[0], lang), days: momo.jours })}
          </p>
        )}
        <ul className="mt-6 space-y-2.5 text-sm">
          {lignes('pro').map((l) => <li key={l} className="flex gap-2"><Check size={17} className="text-brand shrink-0" aria-hidden="true" />{l}</li>)}
          <li className="flex gap-2"><Check size={17} className="text-brand shrink-0" aria-hidden="true" />{t('billing.featPayments')}</li>
        </ul>
        {footer?.pro && <div className="mt-auto pt-7">{footer.pro}</div>}
      </Card>
    </div>
  )
}
