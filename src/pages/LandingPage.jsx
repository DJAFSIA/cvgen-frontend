import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, FileDown, Gauge, Languages, LayoutTemplate, MessageSquareText, ShieldCheck } from 'lucide-react'
import { useI18n } from '../i18n'
import { useAuth } from '../context/AuthContext'
import { billingAPI } from '../services/api'
import { deviseCarteParDefaut } from '../services/money'
import { Logo, LangSwitch, Ribbon } from '../components/Brand'
import { Button } from '../components/ui'
import PricingCards from '../components/PricingCards'
import StoryScroll from '../components/landing/StoryScroll'
import TemplatesFan from '../components/landing/TemplatesFan'

const featureIcons = [Gauge, MessageSquareText, Languages, ShieldCheck, LayoutTemplate, FileDown]

export default function LandingPage() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [offre, setOffre] = useState(null)
  const features = t('landing.features')

  useEffect(() => {
    billingAPI.plans().then((res) => setOffre(res.data)).catch(() => { /* section masquee si l'API ne repond pas */ })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-line/70">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/75" aria-label="Main">
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
                <Link to="/signup"><Button size="sm">{t('common.signup')}</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero : une seule sequence orchestree au chargement (titre puis trace du ruban) */}
      <section className="relative overflow-hidden">
        <Ribbon draw className="hidden lg:block right-[-4%] top-0 w-[52%] h-full" />
        <div className="max-w-6xl mx-auto px-5 pt-24 pb-32 md:pt-32 md:pb-40 relative">
          <div className="max-w-[600px] relative z-10">
            <h1 className="text-[42px] sm:text-[56px] lg:text-[62px] font-semibold leading-[1.04] tracking-[-0.035em]">
              <span className="hero-in inline" style={{ animationDelay: '60ms' }}>{t('landing.titleDark')}</span>{' '}
              <span className="hero-in inline text-slate-500" style={{ animationDelay: '200ms' }}>{t('landing.titleMuted')}</span>
            </h1>
            <p className="hero-in mt-8 text-lg leading-relaxed text-body max-w-xl" style={{ animationDelay: '360ms' }}>{t('landing.subtitle')}</p>
            <div className="hero-in mt-10 flex flex-wrap gap-3" style={{ animationDelay: '480ms' }}>
              <Link to={user ? '/dashboard' : '/signup'}>
                <Button size="lg">{t('landing.ctaPrimary')} <ArrowRight size={16} aria-hidden="true" /></Button>
              </Link>
              {!user && <Link to="/login"><Button size="lg" variant="secondary">{t('landing.ctaSecondary')}</Button></Link>}
            </div>
            <ul className="hero-in mt-12 flex flex-wrap gap-x-7 gap-y-2 text-sm text-muted" style={{ animationDelay: '600ms' }}>
              {t('landing.trust').map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5"><Check size={15} className="text-brand" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <StoryScroll />

      {/* Fonctionnalites : titre fixe a gauche, liste a droite */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-24 grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-12">
        <div className="lg:sticky lg:top-28 self-start">
          <h2 className="text-3xl sm:text-[40px] leading-[1.08] font-semibold tracking-tight">{t('landing.featuresTitle')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10">
          {features.map((feature, i) => {
            const Icon = featureIcons[i]
            return (
              <div key={feature.title} className="border-t border-line py-7">
                <Icon size={22} className="text-brand" aria-hidden="true" />
                <h3 className="mt-4 font-semibold text-ink">{feature.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed">{feature.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="bg-surface border-y border-line"><TemplatesFan /></div>

      {offre && (
        <section id="pricing" className="max-w-4xl mx-auto px-5 py-24">
          <h2 className="text-3xl sm:text-[40px] leading-[1.08] font-semibold tracking-tight text-center">{t('billing.pricingTitle')}</h2>
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

      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 sm:px-16">
          <Ribbon className="hidden md:block right-[-12%] top-[-30%] w-[55%] h-[160%] opacity-90" />
          <div className="relative max-w-lg">
            <h2 className="text-3xl sm:text-[40px] leading-[1.08] font-semibold tracking-tight !text-white">{t('landing.ctaTitle')}</h2>
            <p className="mt-4 text-white/70">{t('landing.ctaText')}</p>
            <Link to={user ? '/dashboard' : '/signup'} className="inline-block mt-9">
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
