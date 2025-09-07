'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { heroFeatures } from '../data/homepage';

export default function Home() {
  const { t, currentLanguage } = useLanguage();
  
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
        overflow: 'hidden'
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
          zIndex: 1
        }}></div>
        
        <style jsx>{`
          @keyframes sakuraFloat {
            0%, 100% { 
              background-position: center, center;
              filter: hue-rotate(0deg) brightness(1);
            }
            25% { 
              background-position: center top, center bottom;
              filter: hue-rotate(5deg) brightness(1.1);
            }
            50% { 
              background-position: center bottom, center top;
              filter: hue-rotate(10deg) brightness(0.95);
            }
            75% { 
              background-position: center, center;
              filter: hue-rotate(5deg) brightness(1.05);
            }
          }
          
          @keyframes sakuraDrift {
            0% { 
              transform: translateX(-2%) translateY(-1%);
              opacity: 0.7;
            }
            100% { 
              transform: translateX(2%) translateY(1%);
              opacity: 0.9;
            }
          }
        `}</style>
        <div style={{
          maxWidth: '800px',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(34, 197, 94, 0.9)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            fontSize: '0.9rem',
            marginBottom: '2rem'
          }}>
            <span style={{ fontWeight: 'bold' }}>✓</span>
            {t('home.trustedBy')}
          </div>
          
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
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '3rem',
            flexWrap: 'wrap'
          }}>
            <Link 
              href="/plan" 
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
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))',
                color: '#2563eb',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 8px 25px rgba(255, 255, 255, 0.2)',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.7))';
                target.style.transform = 'translateY(-3px)';
                target.style.boxShadow = '0 12px 35px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))';
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.2)';
              }}
            >
              {t('home.ctaPrimary')}
            </Link>
            <Link 
              href="#" 
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
                backdropFilter: 'blur(15px)'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))';
                target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3))';
                target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                target.style.transform = 'translateY(0)';
              }}
            >
              {t('home.ctaSecondary')}
            </Link>
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
                opacity: 0.9
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
                <span>{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

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

      {/* Visual Section */}
      <section style={{
        height: '60vh',
        background: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(30, 58, 138, 0.6)), url("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        margin: '2rem',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#f8fafc',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            {t('home.experienceTitle')}
          </h2>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            color: '#e2e8f0'
          }}>
            {t('home.experienceSubtitle')}
          </p>
        </div>
      </section>

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
