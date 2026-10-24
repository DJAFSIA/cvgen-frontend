import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useI18n } from '../i18n'
import { useAuth } from '../context/AuthContext'
import { billingAPI } from '../services/api'
import { deviseCarteParDefaut } from '../services/money'
import { Logo, LangSwitch } from '../components/Brand'
import { Button } from '../components/ui'
import PricingCards from '../components/PricingCards'
import HeroShowcase from '../components/landing/HeroShowcase'
import Manifesto from '../components/landing/Manifesto'
import StoryScroll from '../components/landing/StoryScroll'
import BentoFeatures from '../components/landing/BentoFeatures'
import LanguagesMarquee from '../components/landing/LanguagesMarquee'
import TemplatesFan from '../components/landing/TemplatesFan'
import Reveal from '../components/motion/Reveal'
import ScrollProgressBar from '../components/motion/ScrollProgressBar'
import { segment, useReducedMotion, useScrollProgress } from '../hooks/useScroll'

export default function LandingPage() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [offre, setOffre] = useState(null)
  const reduit = useReducedMotion()
  const ctaRef = useRef(null)
  const entreeCta = useScrollProgress(ctaRef, { mode: 'pass', enabled: !reduit })
  const ouvertureCta = reduit ? 1 : segment(entreeCta, 0.05, 0.42)
  const cible = user ? '/dashboard' : '/signup'

  useEffect(() => {
    billingAPI.plans().then((res) => setOffre(res.data)).catch(() => { /* section masquee si l'API ne repond pas */ })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Barre de navigation fine et translucide */}
      <header className="sticky top-0 z-30 bg-white/75 backdrop-blur-xl backdrop-saturate-150 border-b border-black/[.06] relative">
        <div className="max-w-5xl mx-auto px-5 h-12 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-[13px] text-ink/80" aria-label="Main">
            <a href="#how" className="hover:text-ink">{t('nav.howItWorks')}</a>
            <a href="#features" className="hover:text-ink">{t('nav.features')}</a>
            <a href="#templates" className="hover:text-ink">{t('nav.templates')}</a>
            <a href="#pricing" className="hover:text-ink">{t('nav.pricing')}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitch />
            {user ? (
              <Link to="/dashboard"><Button size="sm">{t('nav.dashboard')}</Button></Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-[13px] text-ink/80 hover:text-ink">{t('common.login')}</Link>
                <Link to="/signup"><Button size="sm">{t('common.signup')}</Button></Link>
              </>
            )}
          </div>
        </div>
        <ScrollProgressBar />
      </header>

      {/* Hero centre, puis le produit en vedette */}
      <section className="relative pt-20 sm:pt-28 pb-24 overflow-hidden bg-gradient-to-b from-white via-white to-surface">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h1 className="text-[44px] sm:text-[64px] lg:text-[80px] font-semibold leading-[1.03] tracking-[-0.04em]">
            <span className="hero-in inline" style={{ animationDelay: '60ms' }}>{t('landing.titleDark')}</span>{' '}
            <span className="hero-in inline text-gradient" style={{ animationDelay: '220ms' }}>{t('landing.titleMuted')}</span>
          </h1>
          <p className="hero-in mt-7 mx-auto max-w-2xl text-[19px] sm:text-[21px] leading-relaxed text-muted" style={{ animationDelay: '380ms' }}>
            {t('landing.subtitle')}
          </p>
          <div className="hero-in mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4" style={{ animationDelay: '520ms' }}>
            <Link to={cible}><Button size="lg">{t('landing.ctaPrimary')}</Button></Link>
            <a href="#how" className="inline-flex items-center gap-0.5 text-[17px] text-brand hover:underline">
              {t('landing.ctaLearn')}<ChevronRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-in mt-20" style={{ animationDelay: '650ms' }}>
          <HeroShowcase />
        </div>
      </section>

      <Manifesto />

      <StoryScroll />

      <BentoFeatures />

      <LanguagesMarquee />

      <div className="bg-surface"><TemplatesFan /></div>

      {offre && (
        <section id="pricing" className="bg-white py-28">
          <div className="max-w-4xl mx-auto px-5">
            <Reveal as="h2" variant="mask" className="text-[40px] sm:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em] text-center">{t('billing.pricingTitle')}</Reveal>
            <Reveal as="p" delay={120} className="mt-4 text-center text-[19px] text-muted">{t('billing.pricingSubtitle')}</Reveal>
            <Reveal variant="scale" delay={200} className="mt-14">
              <PricingCards
                offre={offre}
                deviseCarte={deviseCarteParDefaut(Object.keys(offre.stripe.prix))}
                footer={{
                  free: <Link to={cible}><Button variant="secondary" className="w-full">{t('landing.ctaPrimary')}</Button></Link>,
                  pro: <Link to={user ? '/abonnement' : '/signup'}><Button className="w-full">{t('billing.goPro')}</Button></Link>,
                }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Appel final : bloc noir qui s'agrandit en entrant */}
      <section ref={ctaRef} className="bg-white pb-6 px-3 sm:px-6">
        <div
          className="relative overflow-hidden bg-black text-center px-6 py-28 sm:py-36 mx-auto"
          style={{
            maxWidth: `${88 + ouvertureCta * 12}%`,
            borderRadius: `${40 - ouvertureCta * 12}px`,
          }}
        >
          <div className="absolute inset-x-0 -bottom-40 mx-auto w-[70%] h-80 rounded-full blur-3xl opacity-50"
            style={{ background: 'conic-gradient(from 180deg, #0894ff, #c959dd, #ff2e54, #ff9004, #0894ff)' }} aria-hidden="true" />
          <div className="relative">
            <h2 className="text-[40px] sm:text-[64px] leading-[1.04] font-semibold tracking-[-0.035em] text-gradient">{t('landing.ctaTitle')}</h2>
            <p className="mt-5 text-[19px] text-white/70 max-w-xl mx-auto">{t('landing.ctaText')}</p>
            <Link to={cible} className="inline-block mt-10"><Button size="lg">{t('landing.ctaPrimary')}</Button></Link>
          </div>
        </div>
      </section>

      <footer className="bg-surface border-t border-black/[.06]">
        <div className="max-w-5xl mx-auto px-5 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
          <Logo />
          <span>&copy; {new Date().getFullYear()} CVGen. {t('landing.footer')}</span>
        </div>
      </footer>
    </div>
  )
}
