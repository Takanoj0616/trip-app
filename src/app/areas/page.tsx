'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources for areas page
const areasTranslations = {
  ja: {
    translation: {
      page: {
        title: "日本を探索",
        subtitle: "首都圏の素晴らしい目的地を発見しよう"
      },
      areas: {
        tokyo: {
          name: "東京",
          description: "日本の首都、東京。伝統とモダンが融合する魅力的な都市で、スカイツリー、浅草、渋谷など多彩なスポットが楽しめます。"
        },
        yokohama: {
          name: "横浜", 
          description: "港町横浜は、みなとみらいの美しい夜景、中華街のグルメ、赤レンガ倉庫など魅力的なスポットが満載の国際都市です。"
        },
        saitama: {
          name: "埼玉",
          description: "埼玉県は川越の小江戸情緒、大宮の鉄道博物館、秩父の自然など、歴史と文化、自然が調和した魅力的なエリアです。"
        },
        chiba: {
          name: "千葉",
          description: "千葉県は東京ディズニーランド、房総半島の美しい海岸線、成田山新勝寺など、エンターテイメントと自然が楽しめます。"
        }
      },
      ui: {
        spots: "スポット",
        explore: "{{area}}を探索",
        languages: {
          ja: "日本語",
          en: "English", 
          ko: "한국어"
        }
      }
    }
  },
  en: {
    translation: {
      page: {
        title: "Explore Japan",
        subtitle: "Discover amazing destinations in the Tokyo metropolitan area"
      },
      areas: {
        tokyo: {
          name: "Tokyo",
          description: "Japan's vibrant capital city where cutting-edge technology meets ancient traditions. Explore Shibuya, Asakusa, Ginza, Tokyo Skytree, and countless temples, museums, and world-class restaurants."
        },
        yokohama: {
          name: "Yokohama",
          description: "International port city famous for Chinatown, Red Brick Warehouse, Minato Mirai skyline, and coastal attractions. Perfect for day trips from Tokyo."
        },
        saitama: {
          name: "Saitama", 
          description: "Experience traditional Japan in Kawagoe's historic Edo-period streets and enjoy natural beauty in Chichibu. Great for cultural tourism and hiking."
        },
        chiba: {
          name: "Chiba",
          description: "Home to Narita Airport, Tokyo Disneyland, and beautiful Boso Peninsula beaches. Combines theme parks, nature, and traditional Japanese culture."
        }
      },
      ui: {
        spots: "spots",
        explore: "Explore {{area}}",
        languages: {
          ja: "日本語",
          en: "English",
          ko: "한국어"
        }
      }
    }
  },
  ko: {
    translation: {
      page: {
        title: "일본 탐험",
        subtitle: "도쿄 수도권의 놀라운 목적지를 발견하세요"
      },
      areas: {
        tokyo: {
          name: "도쿄",
          description: "최첨단 기술과 고대 전통이 만나는 일본의 수도. 시부야, 아사쿠사, 긴자, 도쿄 스카이트리, 그리고 수많은 사원, 박물관, 세계적인 레스토랑을 탐험하세요."
        },
        yokohama: {
          name: "요코하마",
          description: "차이나타운, 레드브릭 웨어하우스, 미나토미라이 스카이라인, 해안 관광지로 유명한 국제 항구 도시. 도쿄에서의 당일치기 여행에 완벽합니다."
        },
        saitama: {
          name: "사이타마",
          description: "가와고에의 역사적인 에도 시대 거리에서 전통적인 일본을 경험하고, 지치부의 자연미를 즐기세요. 문화 관광과 하이킹에 최적입니다."
        },
        chiba: {
          name: "지바",
          description: "나리타 공항, 도쿄 디즈니랜드, 아름다운 보소 반도 해변의 본거지. 테마파크, 자연, 전통적인 일본 문화를 결합합니다."
        }
      },
      ui: {
        spots: "스팟",
        explore: "{{area}} 탐험",
        languages: {
          ja: "日本語",
          en: "English",
          ko: "한국어"
        }
      }
    }
  }
};

// Initialize i18n for this page only
i18n
  .use(initReactI18next)
  .init({
    resources: areasTranslations,
    lng: typeof window !== 'undefined' ? localStorage.getItem('areas-language') || 'ja' : 'ja',
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
  });

interface AreaData {
  icon: string;
  nameKey: string;
  rating: number;
  descriptionKey: string;
  spots: number;
  href: string;
}

const areas: AreaData[] = [
  {
    icon: '🗼',
    nameKey: 'areas.tokyo.name',
    rating: 4.8,
    descriptionKey: 'areas.tokyo.description',
    spots: 185,
    href: '/spots/tokyo'
  },
  {
    icon: '🌊',
    nameKey: 'areas.yokohama.name',
    rating: 4.5,
    descriptionKey: 'areas.yokohama.description',
    spots: 124,
    href: '/spots/yokohama'
  },
  {
    icon: '⛩️',
    nameKey: 'areas.saitama.name',
    rating: 4.3,
    descriptionKey: 'areas.saitama.description',
    spots: 98,
    href: '/spots/saitama'
  },
  {
    icon: '🏖️',
    nameKey: 'areas.chiba.name',
    rating: 4.4,
    descriptionKey: 'areas.chiba.description',
    spots: 112,
    href: '/spots/chiba'
  }
];

export default function AreasPage() {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const heroBackgroundRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    localStorage.setItem('areas-language', lang);
  };

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.1;
      
      if (scrolled <= 120 && heroBackgroundRef.current) {
        heroBackgroundRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D tilt effect for cards
  useEffect(() => {
    const addCardTiltEffect = () => {
      cardRefs.current.forEach((card) => {
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
          if (window.innerWidth < 1024) return;
          
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / centerY * -6;
          const rotateY = (x - centerX) / centerX * 6;
          
          card.style.transform = `translateY(-14px) scale(1.06) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
        
        const handleMouseLeave = () => {
          card.style.transform = '';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    };

    addCardTiltEffect();
  }, []);

  // Count up animation
  useEffect(() => {
    const animateCountUp = (element: HTMLElement, target: number, duration = 800) => {
      const start = 0;
      const startTime = performance.now();
      
      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toString();
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      
      requestAnimationFrame(update);
    };

    const initCountUps = () => {
      const counters = document.querySelectorAll('.spot-count') as NodeListOf<HTMLElement>;
      counters.forEach((counter, index) => {
        const target = parseInt(counter.textContent || '0');
        counter.textContent = '0';
        
        setTimeout(() => {
          animateCountUp(counter, target);
        }, 500 + (index * 100));
      });
    };

    const timer = setTimeout(initCountUps, 100);
    return () => clearTimeout(timer);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="star" style={{ animationDelay: `${i * 0.1}s` }}>
          {i <= Math.floor(rating) ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        
        .hero-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: -2;
          background: url('https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2092&q=80') center/cover,
              linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%);
          background-attachment: fixed;
          will-change: transform;
        }
        
        .hero-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" opacity="0.1"><defs><pattern id="washi" patternUnits="userSpaceOnUse" width="40" height="40"><circle cx="10" cy="10" r="2" fill="%23ffffff"/><circle cx="30" cy="30" r="1.5" fill="%23ffffff"/><circle cx="20" cy="35" r="1" fill="%23ffffff"/></pattern></defs><rect width="200" height="200" fill="url(%23washi)"/></svg>') repeat;
          opacity: 0.1;
        }
        
        .hero-background::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%);
          z-index: 1;
        }

        .language-switcher {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2000;
          display: flex;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 25px;
          padding: 0.5rem;
          gap: 0.25rem;
          border: 1px solid rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(15px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .lang-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 20px;
          background: transparent;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.3s ease;
          color: #666;
        }

        .lang-button:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .lang-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        }

        .main-content {
          margin-top: 0px;
          padding: 3rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .page-title {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-title h1 {
          font-size: 3rem;
          color: white;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
          font-weight: 700;
        }

        .page-title p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
          font-weight: 500;
        }

        .areas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .area-card {
          background: rgba(255, 255, 255, 0.18);
          border-radius: 1.5rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          backdrop-filter: blur(28px) saturate(120%);
          -webkit-backdrop-filter: blur(28px) saturate(120%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08);
          position: relative;
          overflow: hidden;
          will-change: transform, box-shadow;
          border: 1px solid rgba(255,255,255,0.3);
          opacity: 0;
          transform: translateY(40px);
          animation: cardFadeUp 0.8s ease-out forwards;
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        
        .area-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: inherit;
          transform: scale(1);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }
        
        .area-card:hover {
          transform: translateY(-14px) scale(1.06);
          box-shadow: 0 25px 80px rgba(0,0,0,0.25), 0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
          border: 1px solid;
          border-image: linear-gradient(45deg, rgba(255, 105, 180, 0.6), rgba(65, 105, 225, 0.6)) 1;
          background: rgba(255,255,255,0.28);
          backdrop-filter: blur(32px) saturate(120%);
          -webkit-backdrop-filter: blur(32px) saturate(120%);
        }
        
        .area-card:hover::before {
          transform: scale(1.08);
        }
        
        .area-card:active {
          transform: translateY(-8px) scale(0.98);
          box-shadow: 
            0 15px 40px rgba(0, 0, 0, 0.2),
            0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        @media (hover: hover) {
          .area-card:hover {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
        }
        
        @media (hover: none) {
          .area-card:active {
            transform: scale(0.98);
            transition: all 0.1s ease-out;
            box-shadow: 
              0 6px 20px rgba(0, 0, 0, 0.15),
              0 3px 10px rgba(0, 0, 0, 0.1);
          }
        }
        
        @keyframes cardFadeUp {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .area-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }

        .area-name {
          font-size: 1.8rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 0.5rem;
          text-shadow: 0 1px 2px rgba(255,255,255,0.7);
        }

        .area-rating {
          color: #ffc107;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .star {
          opacity: 0;
          animation: starAppear 0.6s ease-out forwards;
        }
        
        .star:nth-child(1) { animation-delay: 0.1s; }
        .star:nth-child(2) { animation-delay: 0.2s; }
        .star:nth-child(3) { animation-delay: 0.3s; }
        .star:nth-child(4) { animation-delay: 0.4s; }
        .star:nth-child(5) { animation-delay: 0.5s; }
        
        @keyframes starAppear {
          0% {
            opacity: 0;
            transform: scale(0) rotate(180deg);
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .area-description {
          color: #1f2937;
          margin-bottom: 1rem;
          line-height: 1.5;
          text-shadow: 0 1px 2px rgba(255,255,255,0.7);
          font-weight: 500;
        }

        .area-spots {
          color: #4f46e5;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
        }

        .area-cta {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease-out;
          text-decoration: none;
          display: inline-block;
          position: relative;
          overflow: hidden;
          will-change: transform;
        }
        
        .area-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.6s ease;
        }
        
        .area-card:hover .area-cta {
          transform: scale(1.05);
          box-shadow: 
            0 15px 30px rgba(102, 126, 234, 0.4),
            0 8px 15px rgba(102, 126, 234, 0.2);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .area-card:hover .area-cta::before {
          left: 100%;
        }

        .area-card:nth-child(1) { animation-delay: 0s; }
        .area-card:nth-child(2) { animation-delay: 0.08s; }
        .area-card:nth-child(3) { animation-delay: 0.16s; }
        .area-card:nth-child(4) { animation-delay: 0.24s; }
        
        @media (prefers-reduced-motion: reduce) {
          .area-card {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .star {
            animation: none;
            opacity: 1;
          }
          .area-card:hover {
            transform: translateY(-4px) scale(1.02);
            transition: all 0.2s ease;
          }
        }
        
        @supports not (backdrop-filter: blur(12px)) {
          .area-card {
            background: rgba(255, 255, 255, 0.85);
          }
        }

        @media (max-width: 768px) {
          .nav {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .nav-links {
            gap: 1rem;
          }

          .main-content {
            margin-top: 140px;
            padding: 2rem 0;
          }

          .page-title h1 {
            font-size: 2rem;
          }

          .areas-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .area-card {
            padding: 1.5rem;
          }

          .container {
            padding: 0 1rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .areas-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1025px) {
          .areas-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <div className="hero-background" ref={heroBackgroundRef}>
        <link rel="preload" as="image" href="https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2092&q=80" />
      </div>

      <div className="language-switcher">
        <button 
          className={`lang-button ${currentLanguage === 'ja' ? 'active' : ''}`}
          onClick={() => changeLanguage('ja')}
        >
          {t('ui.languages.ja')}
        </button>
        <button 
          className={`lang-button ${currentLanguage === 'en' ? 'active' : ''}`}
          onClick={() => changeLanguage('en')}
        >
          {t('ui.languages.en')}
        </button>
        <button 
          className={`lang-button ${currentLanguage === 'ko' ? 'active' : ''}`}
          onClick={() => changeLanguage('ko')}
        >
          {t('ui.languages.ko')}
        </button>
      </div>

      <main className="main-content">
        <div className="container">
          <div className="page-title">
            <h1>{t('page.title')}</h1>
            <p>{t('page.subtitle')}</p>
          </div>

          <div className="areas-grid">
            {areas.map((area, index) => {
              const areaName = t(area.nameKey);
              return (
                <div 
                  key={area.nameKey}
                  className="area-card" 
                  role="link" 
                  tabIndex={0} 
                  aria-label={`${t('ui.explore', { area: areaName })} - ${area.spots} ${t('ui.spots')}`}
                  ref={(el) => cardRefs.current[index] = el}
                  onClick={() => window.location.href = area.href}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = area.href;
                    }
                  }}
                >
                  <span className="area-icon">{area.icon}</span>
                  <h2 className="area-name">{areaName}</h2>
                  <div className="area-rating">
                    {renderStars(area.rating)} 
                    <span className="rating-value">{area.rating}</span>
                  </div>
                  <p className="area-description">
                    {t(area.descriptionKey)}
                  </p>
                  <div className="area-spots">
                    <span className="spot-count">{area.spots}</span> {t('ui.spots')}
                  </div>
                  <Link href={area.href} className="area-cta">
                    {t('ui.explore', { area: areaName })}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}