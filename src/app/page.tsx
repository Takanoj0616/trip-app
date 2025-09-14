'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { heroFeatures } from '../data/homepage';
import { useAuth } from '@/contexts/AuthContext';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

export default function Home() {
  const { t, currentLanguage } = useLanguage();
  const { signInWithGoogle, signInWithApple } = useAuth();

  // Simple A/B variant for CTA (persisted in localStorage)
  const [ctaVariant, setCtaVariant] = useState<'A' | 'B'>('A');
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('homeCtaVariant') : null;
      const v = stored === 'A' || stored === 'B' ? (stored as 'A' | 'B') : (Math.random() < 0.5 ? 'A' : 'B');
      if (!stored) localStorage.setItem('homeCtaVariant', v);
      setCtaVariant(v);
    } catch {
      setCtaVariant('A');
    }
  }, []);

  const trackCta = (location: 'hero' | 'features' | 'footer' | 'bottom_bar', label: 'primary' | 'secondary') => {
    const params = { location, label, variant: ctaVariant } as const;
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', params);
    } else {
      console.log('GA4 Event: cta_click', params);
    }
    try { if (analytics) logEvent(analytics as any, 'cta_click', params as any); } catch {}
  };

  // Multilingual features data
  const getMainFeatures = () => [
    {
      icon: '🌍',
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description'),
    },
    {
      icon: '📍',
      title: t('features.areaGuide.title'),
      description: t('features.areaGuide.description'),
    },
    {
      icon: '⭐',
      title: t('features.userExperience.title'),
      description: t('features.userExperience.description'),
    },
    {
      icon: '🤖',
      title: t('features.aiRecommendation.title'),
      description: t('features.aiRecommendation.description'),
    },
    {
      icon: '📱',
      title: t('features.realTimeInfo.title'),
      description: t('features.realTimeInfo.description'),
    },
    {
      icon: '💬',
      title: t('features.community.title'),
      description: t('features.community.description'),
    },
  ];

  // Multilingual areas data
  const getAreas = () => [
    {
      emoji: '🏙️',
      title: t('areas.tokyo.title'),
      description: t('areas.tokyo.description'),
    },
    {
      emoji: '🗾',
      title: t('areas.mtFuji.title'),
      description: t('areas.mtFuji.description'),
    },
    {
      emoji: '🏯',
      title: t('areas.kyoto.title'),
      description: t('areas.kyoto.description'),
    },
    {
      emoji: '🍜',
      title: t('areas.osaka.title'),
      description: t('areas.osaka.description'),
    },
  ];

  // Multilingual footer data
  const getFooterColumns = () => [
    {
      title: t('footer.explore.title'),
      links: [
        { href: '#', label: t('footer.explore.areaGuide') },
        { href: '#', label: t('footer.explore.categorySearch') },
        { href: '#', label: t('footer.explore.popularSpots') },
        { href: '#', label: t('footer.explore.whatsNew') },
      ],
    },
    {
      title: t('footer.features.title'),
      links: [
        { href: '#', label: t('footer.features.aiTravelPlan') },
        { href: '#', label: t('footer.features.favorites') },
        { href: '#', label: t('footer.features.reviews') },
        { href: '#', label: t('footer.features.offlineFeatures') },
      ],
    },
    {
      title: t('footer.support.title'),
      links: [
        { href: '#', label: t('footer.support.helpCenter') },
        { href: '#', label: t('footer.support.contactUs') },
        { href: '#', label: t('footer.support.emergencyGuide') },
        { href: '#', label: t('footer.support.feedback') },
      ],
    },
    {
      title: t('footer.account.title'),
      links: [
        { href: '#', label: t('footer.account.login') },
        { href: '#', label: t('footer.account.signUp') },
        { href: '#', label: t('footer.account.premium') },
        { href: '#', label: t('footer.account.settings') },
      ],
    },
  ];

  return (
    <div className="min-h-screen" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'} style={{
      background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 25%, #1e1b4b 50%, #0f172a 75%, #020617 100%)",
      minHeight: "100vh"
    }}>

      {/* Hero Section */}
      <main style={{
        height: '100vh',
        background: 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 182, 193, 0.2)), url("https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80"), url("https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        backgroundAttachment: 'fixed, fixed',
        backgroundBlendMode: 'overlay',
        animation: 'sakuraFloat 20s ease-in-out infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        paddingTop: '140px',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 182, 193, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 80% 40%, rgba(255, 218, 185, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 240, 245, 0.3) 0%, transparent 50%),
            linear-gradient(45deg, rgba(255, 228, 225, 0.2) 0%, rgba(255, 245, 238, 0.1) 100%)
          `,
          animation: 'sakuraDrift 25s ease-in-out infinite alternate',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>

        <style jsx>{`
          .hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.1) brightness(0.85); z-index: 0; }
          .hero-overlay { position: absolute; inset: 0; z-index: 1; background:
            radial-gradient(circle at 20% 20%, rgba(2, 6, 23, 0.25) 0%, transparent 45%),
            radial-gradient(circle at 80% 40%, rgba(2, 6, 23, 0.25) 0%, transparent 45%),
            linear-gradient(0deg, rgba(2, 6, 23, 0.35) 0%, rgba(2, 6, 23, 0.15) 40%, rgba(2, 6, 23, 0.55) 100%);
            backdrop-filter: blur(1.5px);
          }
          @keyframes sakuraFloat {
            0%, 100% {
              filter: hue-rotate(0deg) brightness(1);
            }
            25% {
              filter: hue-rotate(5deg) brightness(1.1);
            }
            50% {
              filter: hue-rotate(10deg) brightness(0.95);
            }
            75% {
              filter: hue-rotate(5deg) brightness(1.05);
            }
          }
          @keyframes sakuraDrift {
            0% { transform: translateX(-2%) translateY(-1%); opacity: 0.7; }
            100% { transform: translateX(2%) translateY(1%); opacity: 0.9; }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 640px) {
            .hero-cta-row a { width: 100% !important; display: block !important; text-align: center; }
            .mobile-cta-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 9999; background: rgba(2,6,23,0.75); backdrop-filter: blur(8px); padding: env(safe-area-inset-bottom, 12px) 12px 12px; }
            .mobile-cta-link { display: block; text-align: center; padding: 14px 16px; border-radius: 9999px; font-weight: 900; color: #fff; text-decoration: none; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); box-shadow: 0 8px 20px rgba(0,0,0,.35); }
          }
          @media (min-width: 641px) {
            .mobile-cta-bar { display: none; }
          }
        `}</style>
        <div style={{
          maxWidth: '800px',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.2,
            color: '#000000',
            textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)'
          }}>
            {t('home.heroTitle')}
          </h1>

          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            color: '#000000',
            textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
            fontWeight: 500
          }}>
            {t('home.heroSubtitle')}
          </p>

          <div className="hero-cta-row" style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '3rem',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 20
          }}>
            <Link
              href="/areas"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                borderRadius: '30px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                border: 'none',
                cursor: 'pointer',
                background: ctaVariant === 'B' ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))',
                color: ctaVariant === 'B' ? '#ffffff' : '#2563eb',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                position: 'relative',
                zIndex: 30,
                pointerEvents: 'auto'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = ctaVariant === 'B' ? 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.7))';
                target.style.transform = 'translateY(-3px) scale(1.05)';
                target.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = ctaVariant === 'B' ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))';
                target.style.transform = 'translateY(0) scale(1)';
                target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
              }}
              onClick={(e) => {
                trackCta('hero', 'primary');
              }}
            >
              {ctaVariant === 'B' ? t('home.ctaPrimaryAlt') : t('home.ctaPrimary')}
            </Link>
            <Link
              href="/discover"
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                borderRadius: '30px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                textDecoration: 'none',
                transition: 'all 0.3s',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(15px)',
                position: 'relative',
                zIndex: 30,
                pointerEvents: 'auto'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
                target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                target.style.transform = 'translateY(-3px) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))';
                target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                target.style.transform = 'translateY(0) scale(1)';
              }}
              onClick={(e) => {
                trackCta('hero', 'secondary');
              }}
            >
              {t('home.ctaSecondary')}
            </Link>
          </div>

          {/* Explainer and social proof under the CTA */}
          <div style={{ maxWidth: 760, margin: '0 auto 1rem', color: '#000', textShadow: '0 1px 2px rgba(255,255,255,0.85)' }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{t('home.ctaExplainer1')}</div>
            <div style={{ opacity: 0.9 }}>{t('home.ctaExplainer2')}</div>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(34, 197, 94, 0.9)', padding: '0.4rem 0.9rem', borderRadius: '20px',
            fontSize: '0.9rem', marginTop: '0.5rem', color: '#052e16'
          }}>
            <span style={{ fontWeight: 'bold' }}>✓</span> {t('home.trustedBy')}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap'
          }}>
            {heroFeatures.map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                opacity: 0.9,
                color: '#000'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  background: '#2563eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>{feature.icon}</div>
                <span style={{ color: '#000' }}>{feature.title}</span>
              </div>
            ))}
          </div>

          {/* AI quick CTA under hero */}
          <div style={{
            marginTop: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.9rem',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 6px 18px rgba(0,0,0,.08)'
          }}>
            <span style={{ color: '#000' }}>🤖 {t('home.aiQuickPitch')}</span>
            <a href="#ai-plan-home" style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontWeight: 700,
              textDecoration: 'none'
            }}>{t('home.tryFree')}</a>
          </div>
        </div>
      </main>

      {/* AI Plan Promo Section (home) */}
      <section id="ai-plan-home" className="tokyo-tower-night" style={{
        padding: '4rem 1.5rem',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#7dd3fc', fontWeight: 700, marginBottom: '0.5rem', textShadow: '0 2px 8px rgba(0,0,0,.5)' }}>{t('home.aiPlan.label')}</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', textShadow: '0 4px 16px rgba(0,0,0,.6)' }}>{t('home.aiPlan.headline')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,.6)' }}>{t('home.aiPlan.subhead')}</p>
          </div>

          {/* Benefits */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px' }}>
              <span>✅</span>
              <span>{t('home.aiPlan.benefit.route')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px' }}>
              <span>✅</span>
              <span>{t('home.aiPlan.benefit.save')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px' }}>
              <span>✅</span>
              <span>{t('home.aiPlan.benefit.languages')}</span>
            </div>
          </div>

          {/* Sample Plan Teaser */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
            {/* preview */}
            <div style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.7)', borderRadius: '16px', padding: '16px', backdropFilter: 'blur(6px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontWeight: 700 }}>{t('home.aiPlan.sampleTitle')}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{t('home.aiPlan.sampleNote')}</div>
              </div>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9999, background: '#22c55e', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700 }}>1</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {currentLanguage === 'en' ? 'Morning: Asakusa Temple' :
                       currentLanguage === 'ko' ? '아침: 아사쿠사 사원' :
                       currentLanguage === 'fr' ? 'Matin : Temple d\'Asakusa' :
                       currentLanguage === 'ar' ? 'صباحاً: معبد أساكوسا' : '朝: 浅草寺'}
                    </div>
                    <div style={{ color: '#475569', fontSize: 14 }}>
                      {currentLanguage === 'en' ? '9:00–10:30 / Morning stroll in Nakamise' :
                       currentLanguage === 'ko' ? '9:00–10:30 / 나카미세 산책' :
                       currentLanguage === 'fr' ? '9:00–10:30 / Promenade à Nakamise' :
                       currentLanguage === 'ar' ? '9:00–10:30 / جولة صباحية في ناكاميسه' : '9:00 - 10:30 / 仲見世通りで朝散歩'}
                    </div>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'center', filter: 'blur(3px)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9999, background: '#22c55e', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700 }}>2</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {currentLanguage === 'en' ? 'Noon: Tokyo Skytree' :
                       currentLanguage === 'ko' ? '점심: 도쿄 스카이트리' :
                       currentLanguage === 'fr' ? 'Midi : Tokyo Skytree' :
                       currentLanguage === 'ar' ? 'الظهيرة: برج طوكيو سكاي تري' : '昼: 東京スカイツリー'}
                    </div>
                    <div style={{ color: '#475569', fontSize: 14 }}>
                      {currentLanguage === 'en' ? '11:30–13:00 / Panorama from the deck' :
                       currentLanguage === 'ko' ? '11:30–13:00 / 전망대 파노라마' :
                       currentLanguage === 'fr' ? '11:30–13:00 / Panorama depuis la terrasse' :
                       currentLanguage === 'ar' ? '11:30–13:00 / إطلالة بانورامية' : '11:30 - 13:00 / 展望台で絶景'}
                    </div>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '10px', alignItems: 'center', filter: 'blur(3px)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9999, background: '#22c55e', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700 }}>3</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {currentLanguage === 'en' ? 'Night: Shibuya Crossing' :
                       currentLanguage === 'ko' ? '밤: 시부야 스크램블 교차로' :
                       currentLanguage === 'fr' ? 'Soir : Carrefour de Shibuya' :
                       currentLanguage === 'ar' ? 'ليلاً: تقاطع شيبويا' : '夜: 渋谷スクランブル交差点'}
                    </div>
                    <div style={{ color: '#475569', fontSize: 14 }}>
                      {currentLanguage === 'en' ? '19:00–20:00 / Night view and food' :
                       currentLanguage === 'ko' ? '19:00–20:00 / 야경과 미식' :
                       currentLanguage === 'fr' ? '19:00–20:00 / Vue nocturne et gastronomie' :
                       currentLanguage === 'ar' ? '19:00–20:00 / منظر ليلي وطعام' : '19:00 - 20:00 / 夜景とグルメ'}
                    </div>
                  </div>
                </li>
              </ol>
              <div style={{ marginTop: 12, fontSize: 12, color: '#64748b' }}>{t('home.aiPlan.sampleNote')}</div>
            </div>

            {/* CTA */}
            <div style={{ display: 'grid', alignContent: 'center', gap: '12px' }}>
              <button
                onClick={() => { /* open auth flow — use one-click first */ signInWithGoogle().catch(()=>{}); }}
                style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 10px 24px rgba(79,172,254,0.45)'
                }}
              >
                {t('home.aiPlan.primaryCta')}
              </button>
              <div style={{ display: 'grid', gap: 8 }}>
                <button
                  onClick={() => signInWithGoogle()}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.95)', fontWeight: 600 }}
                >
                  <span>G</span>
                  <span>{t('home.aiPlan.continueGoogle')}</span>
                </button>
                <button
                  onClick={() => signInWithApple().catch(() => alert('Appleログインはサーバー設定後に有効化されます'))}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'black', color: 'white', fontWeight: 600 }}
                >
                  <span style={{ fontSize: 16 }}></span>
                  <span>{t('home.aiPlan.continueApple')}</span>
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 10px rgba(0,0,0,.5)' }}>
                {t('common.or')} <Link href="/register" style={{ color: '#2563eb', textDecoration: 'underline' }}>{t('home.aiPlan.registerWithEmail')}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url("https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        margin: 0,
        borderRadius: 0,
        boxShadow: 'none',
        border: 'none',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            color: '#ffffff',
            textShadow: '0 3px 6px rgba(0, 0, 0, 0.8)',
            position: 'relative',
            zIndex: 2
          }}>
            {t('home.featuresTitle')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {getMainFeatures().map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6))',
                  padding: '2rem',
                  borderRadius: '15px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(15px)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6))';
                }}
              >
                <h3 style={{
                  color: '#ffffff',
                  marginBottom: '1rem',
                  fontSize: '1.25rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                  fontWeight: 600
                }}>
                  {feature.icon} {feature.title}
                </h3>
                <p style={{
                  color: '#f1f5f9',
                  lineHeight: 1.6,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          {/* Inline CTA under features */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link
              href="/ai-plan"
              onClick={() => trackCta('features', 'primary')}
              style={{
                display: 'inline-block', padding: '1rem 2rem', borderRadius: 30, fontWeight: 800,
                textDecoration: 'none',
                background: ctaVariant === 'B' ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,.25)'
              }}
            >{ctaVariant === 'B' ? t('home.ctaPrimaryAlt') : t('home.ctaPrimary')}</Link>
            <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.95)' }}>{t('home.ctaExplainer2')}</div>
          </div>
        </div>
      </section>

      {/* Areas Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.2)), url("https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2092&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        margin: 0,
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '3rem',
            color: '#ffffff',
            textShadow: '0 3px 6px rgba(0, 0, 0, 0.8)',
            position: 'relative',
            zIndex: 2
          }}>
            {t('home.popularDestinations')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {getAreas().map((area, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5))',
                  padding: '2rem',
                  borderRadius: '15px',
                  textAlign: 'center',
                  color: 'white',
                  transition: 'transform 0.3s, background 0.3s',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6))';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5))';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
                }}
              >
                <span style={{
                  fontSize: '2rem',
                  marginBottom: '1rem',
                  display: 'block'
                }}>{area.emoji}</span>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                  fontWeight: 600
                }}>
                  {area.title}
                </h3>
                <p style={{
                  color: '#f1f5f9',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.6)'
                }}>
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA before footer */}
      <section style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.75rem', textShadow: '0 3px 8px rgba(0,0,0,.5)' }}>
            {t('home.experienceTitle')}
          </h3>
          <p style={{ color: 'rgba(255,255,255,.9)', marginBottom: '1.25rem' }}>{t('home.experienceSubtitle')}</p>
          <Link
            href="/ai-plan"
            onClick={() => trackCta('footer', 'primary')}
            style={{
              display: 'inline-block', padding: '1rem 2rem', borderRadius: 30, fontWeight: 800,
              textDecoration: 'none',
              background: ctaVariant === 'B' ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,.25)'
            }}
          >{ctaVariant === 'B' ? t('home.ctaPrimaryAlt') : t('home.ctaPrimary')}</Link>
          <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.9)' }}>{t('home.ctaExplainer1')}</div>
        </div>
      </section>

      {/* Bottom mobile CTA bar */}
      <div className="mobile-cta-bar">
        <Link href="/ai-plan" onClick={() => trackCta('bottom_bar', 'primary')} className="mobile-cta-link">
          {t('home.ctaBottomBar')}
        </Link>
      </div>


      {/* Experience Japan Video Section */}
      <section style={{
        margin: '4rem 2rem',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)'
      }}>
        {/* Video Container */}
        <div style={{
          position: 'relative',
          height: '65vh',
          minHeight: '420px',
          overflow: 'hidden'
        }}>
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1
            }}
            onError={(e) => {
              // フォールバック：動画が読み込めない場合は背景画像を設定
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.style.background = 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(30, 58, 138, 0.6)), url("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")';
                parent.style.backgroundSize = 'cover';
                parent.style.backgroundPosition = 'center';
              }
            }}
          >
            <source src="/douga.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(45deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.5) 100%),
              radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)
            `,
            zIndex: 2
          }}></div>

          {/* Content Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 3,
            padding: '2rem',
            display: 'none'
          }}>
            <div style={{
              maxWidth: '800px',
              animation: 'fadeInUp 1.5s ease-out'
            }}>
              <h2 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: '#ffffff',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 255, 255, 0.2)',
                lineHeight: 1.2
              }}>
                {t('home.experienceTitle')}
              </h2>
              <p style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                opacity: 0.95,
                color: '#f1f5f9',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                marginBottom: '2.5rem',
                lineHeight: 1.6
              }}>
                {t('home.experienceSubtitle')}
              </p>

              {/* Call to Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Link
                  href="/areas"
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))',
                    color: '#1e293b',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLAnchorElement;
                    target.style.transform = 'translateY(-3px) scale(1.05)';
                    target.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLAnchorElement;
                    target.style.transform = 'translateY(0) scale(1)';
                    target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
                  }}
                >
                  🗾 Explore Japan
                </Link>

                <Link
                  href="/spots/101"
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    borderRadius: '50px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(15px)',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLAnchorElement;
                    target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
                    target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                    target.style.transform = 'translateY(-3px) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget as HTMLAnchorElement;
                    target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))';
                    target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    target.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  🗼 Visit Tokyo Tower
                </Link>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            display: 'none',
            gap: '1rem',
            zIndex: 4
          }}>
            <button
              onClick={() => {
                const video = document.querySelector('section video');
                if (video) {
                  if (video.paused) {
                    video.play();
                  } else {
                    video.pause();
                  }
                }
              }}
              style={{
                padding: '0.75rem',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                color: 'white',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
                fontSize: '1rem',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ⏯️
            </button>

            <button
              onClick={() => {
                const video = document.querySelector('section video');
                if (video) {
                  video.muted = !video.muted;
                }
              }}
              style={{
                padding: '0.75rem',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                color: 'white',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
                fontSize: '1rem',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              🔊
            </button>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
          padding: '2rem',
          backdropFilter: 'blur(20px)',
          display: 'none'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
            color: 'white'
          }}>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏯</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>1000+</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Historic Temples</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗼</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>500+</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Modern Landmarks</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍜</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>10000+</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Local Restaurants</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>4.8/5</div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* fadeInUp keyframes moved to the hero <style jsx> to avoid nested styled-jsx tags */}

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        padding: '4rem 2rem 2rem',
        color: '#e2e8f0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {getFooterColumns().map((column, index) => (
              <div key={index}>
                <h3 style={{
                  color: '#f8fafc',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem'
                }}>{column.title}</h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0
                }}>
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex} style={{
                      marginBottom: '0.75rem'
                    }}>
                      <Link href={link.href} style={{
                        color: '#94a3b8',
                        textDecoration: 'none',
                        transition: 'color 0.3s',
                        fontSize: '0.9rem'
                      }}
                        onMouseEnter={(e) => {
                          const target = e.currentTarget as HTMLAnchorElement;
                          target.style.color = '#e2e8f0';
                        }}
                        onMouseLeave={(e) => {
                          const target = e.currentTarget as HTMLAnchorElement;
                          target.style.color = '#94a3b8';
                        }}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: '1px solid #334155',
            paddingTop: '2rem',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#64748b',
              fontSize: '0.9rem'
            }}>{t('home.footerCopyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
