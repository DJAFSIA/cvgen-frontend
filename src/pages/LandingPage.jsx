import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, FileDown, Gauge, Languages, LayoutTemplate, MessageSquareText, ShieldCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { billingAPI } from '../services/api'
import { deviseCarteParDefaut } from '../services/money'
import PricingCards from '../components/PricingCards'
import { useAuth } from '../context/AuthContext'
import { Logo, LangSwitch, Ribbon } from '../components/Brand'
import { Button } from '../components/ui'
import TemplateMock from '../components/TemplateMock'

const featureIcons = [Gauge, MessageSquareText, Languages, ShieldCheck, LayoutTemplate, FileDown]

export default function LandingPage() {
  const { t } = useI18n()
  const { user } = useAuth()
  const steps = t('landing.steps')
  const [offre, setOffre] = useState(null)

  useEffect(() => {
    billingAPI.plans().then((res) => setOffre(res.data)).catch(() => { /* section masquee si l'API ne repond pas */ })
  }, [])
  const features = t('landing.features')

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/80">
              <a href="#how" className="hover:text-ink">{t('nav.howItWorks')}</a>
              <a href="#features" className="hover:text-ink">{t('nav.features')}</a>
              <a href="#templates" className="hover:text-ink">{t('nav.templates')}</a>
              <a href="#pricing" className="hover:text-ink">{t('nav.pricing')}</a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LangSwitch />
            {user ? (
              <Link to="/dashboard"><Button size="sm">{t('nav.dashboard')}</Button></Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block"><Button variant="secondary" size="sm">{t('common.login')}</Button></Link>
                <Link to="/signup"><Button size="sm">{t('common.signup')} <ArrowRight size={14} aria-hidden="true" /></Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <Ribbon className="hidden lg:block right-0 top-0 w-[48%] h-full" />
        <div className="max-w-6xl mx-auto px-5 pt-20 pb-28 md:pt-28 md:pb-36 relative">
          <div className="max-w-xl fade-up relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft text-brand-dark text-xs font-semibold px-3 py-1 mb-6">
              <BadgeCheck size={14} aria-hidden="true" /> {t('landing.eyebrow')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1]">
              {t('landing.titleDark')}{' '}
              <span className="text-slate-500">{t('landing.titleMuted')}</span>
            </h1>
            <p className="mt-6 text-lg text-body leading-relaxed max-w-xl">{t('landing.subtitle')}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={user ? '/dashboard' : '/signup'}>
                <Button size="lg">{t('landing.ctaPrimary')} <ArrowRight size={16} aria-hidden="true" /></Button>
              </Link>
              {!user && <Link to="/login"><Button size="lg" variant="secondary">{t('landing.ctaSecondary')}</Button></Link>}
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {t('landing.trust').map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5"><BadgeCheck size={15} className="text-brand" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="how" className="bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <h2 className="text-3xl font-bold max-w-xl">{t('landing.howTitle')}</h2>
          <p className="text-body mt-3">{t('landing.howSubtitle')}</p>
          <ol className="mt-12 grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="bg-white border border-line rounded-xl2 p-6 shadow-card">
                <span className="grid place-items-center w-9 h-9 rounded-full bg-brand text-white text-sm font-bold mb-5">{i + 1}</span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-5 py-20">
        <h2 className="text-3xl font-bold max-w-xl">{t('landing.featuresTitle')}</h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {features.map((feature, i) => {
            const Icon = featureIcons[i]
            return (
              <div key={feature.title}>
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-soft text-brand mb-4"><Icon size={20} aria-hidden="true" /></span>
                <h3 className="font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed">{feature.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section id="templates" className="bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto px-5 py-20">
          <h2 className="text-3xl font-bold max-w-xl">{t('landing.templatesTitle')}</h2>
          <p className="text-body mt-3">{t('landing.templatesSubtitle')}</p>
          <div className="mt-12 grid sm:grid-cols-3 gap-8">
            {['classique', 'moderne', 'ats'].map((kind) => (
              <div key={kind}>
                <div className="max-w-[240px]"><TemplateMock kind={kind} /></div>
                <h3 className="mt-4 font-semibold text-ink">{t(`landing.tpl.${kind}`)}</h3>
                <p className="mt-1 text-sm leading-relaxed">{t(`landing.tplDesc.${kind}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {offre && (
        <section id="pricing" className="max-w-4xl mx-auto px-5 py-20">
          <h2 className="text-3xl font-bold text-center">{t('billing.pricingTitle')}</h2>
          <p className="text-body mt-3 text-center">{t('billing.pricingSubtitle')}</p>
          <div className="mt-12">
            <PricingCards
              offre={offre}
              deviseCarte={deviseCarteParDefaut(Object.keys(offre.stripe.prix))}
              footer={{
                free: <Link to={user ? '/dashboard' : '/signup'}><Button variant="secondary" className="w-full">{t('landing.ctaPrimary')}</Button></Link>,
                pro: <Link to={user ? '/abonnement' : '/signup'}><Button className="w-full">{t('billing.goPro')}</Button></Link>,
              }}
            />
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="relative overflow-hidden rounded-2xl bg-ink px-8 py-14 sm:px-14">
          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full opacity-60 blur-2xl" style={{ background: 'linear-gradient(135deg,#ff7a45,#ff4fa3 50%,#635bff)' }} aria-hidden="true" />
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-bold !text-white">{t('landing.ctaTitle')}</h2>
            <p className="mt-3 text-white/75">{t('landing.ctaText')}</p>
            <Link to={user ? '/dashboard' : '/signup'} className="inline-block mt-8">
              <Button size="lg" className="!bg-white !text-ink hover:!bg-surface">{t('landing.ctaPrimary')} <ArrowRight size={16} aria-hidden="true" /></Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <Logo />
          <span>&copy; {new Date().getFullYear()} CVGen. {t('landing.footer')}</span>
        </div>
      </footer>
    </div>
  )
}
