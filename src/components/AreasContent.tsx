'use client';

import React, { useEffect } from 'react';
import { MapPin, Users, Star } from 'lucide-react';
import Link from 'next/link';
import SakuraBackground from '@/components/SakuraBackground';

const areas = [
  {
    id: 'tokyo',
    name: 'Tokyo Travel Guide',
    englishName: 'Tokyo',
    koreanName: '도쿄',
    description: 'Japan\'s vibrant capital where cutting-edge technology meets ancient traditions. Explore Tokyo Tower, Asakusa Temple, Imperial Palace, Harajuku, Ginza and world-class dining.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop',
    spots: 150,
    categories: ['Tokyo Attractions', 'Tokyo Restaurants', 'Tokyo Shopping', 'Tokyo Entertainment'],
    highlights: ['Tokyo Tower', 'Asakusa Temple', 'Imperial Palace', 'Harajuku', 'Ginza District']
  },
  {
    id: 'yokohama',
    name: 'Yokohama Tourism',
    englishName: 'Yokohama',
    koreanName: '요코하마',
    description: 'International port city with harbor charm. Discover Minato Mirai skyline, vibrant Chinatown, historic Red Brick Warehouse and waterfront attractions.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    spots: 80,
    categories: ['Yokohama Attractions', 'Yokohama Restaurants', 'Yokohama Entertainment', 'Yokohama Shopping'],
    highlights: ['Minato Mirai', 'Chinatown', 'Red Brick Warehouse', 'Cosmo World', 'Yamashita Park']
  },
  {
    id: 'saitama',
    name: 'Saitama Attractions',
    englishName: 'Saitama',
    koreanName: '사이타마',
    description: 'Rich nature and historic charm. Experience traditional Edo-period streets in Kawagoe, natural beauty in Chichibu, and modern attractions.',
    image: 'https://images.unsplash.com/photo-1574874897720-a8b90b6a7ef8?w=800&h=400&fit=crop',
    spots: 60,
    categories: ['Saitama Sightseeing', 'Saitama Entertainment', 'Saitama Hotels'],
    highlights: ['Kawagoe', 'Chichibu', 'Railway Museum', 'Omiya Bonsai Museum', 'Moomin Valley Park']
  },
  {
    id: 'chiba',
    name: 'Chiba Travel',
    englishName: 'Chiba',
    koreanName: '치바',
    description: 'Theme parks and beautiful coastlines. Home to Tokyo Disneyland, Narita-san Temple, Kujukuri Beach and family-friendly attractions.',
    image: 'https://images.unsplash.com/photo-1576670159805-381ccbac8e8c?w=800&h=400&fit=crop',
    spots: 70,
    categories: ['Chiba Entertainment', 'Chiba Sightseeing', 'Chiba Hotels'],
    highlights: ['Tokyo Disneyland', 'Narita-san Temple', 'Kujukuri Beach', 'Kamogawa Sea World', 'Mother Farm']
  }
];

export default function AreasContent() {
  useEffect(() => {
    let fontLinks: HTMLLinkElement | null = null;
    let fontAwesome: HTMLLinkElement | null = null;
    let styleSheet: HTMLStyleElement | null = null;

    // Check if elements already exist to prevent duplicates
    const existingFont = document.querySelector('link[data-areas-font="true"]');
    const existingFontAwesome = document.querySelector('link[data-areas-fontawesome="true"]');
    const existingStyles = document.querySelector('style[data-areas-styles="true"]');

    // Inject Google Fonts and FontAwesome only if they don't exist
    if (!existingFont) {
      fontLinks = document.createElement('link');
      fontLinks.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      fontLinks.rel = 'stylesheet';
      fontLinks.setAttribute('data-areas-font', 'true');
      document.head.appendChild(fontLinks);
    }

    if (!existingFontAwesome) {
      fontAwesome = document.createElement('link');
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
      fontAwesome.rel = 'stylesheet';
      fontAwesome.setAttribute('data-areas-fontawesome', 'true');
      document.head.appendChild(fontAwesome);
    }

    // Add animations CSS only if it doesn't exist
    if (!existingStyles) {
      styleSheet = document.createElement('style');
      styleSheet.setAttribute('data-areas-styles', 'true');
      styleSheet.textContent = `
      /* Areas Grid Layout */
      .areas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 40px;
      }

      /* Area Card Styles */
      .area-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 50px 40px;
        text-align: center;
        text-decoration: none;
        display: block;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }

      .area-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .area-card:hover::before {
        opacity: 1;
      }

      .area-card:hover {
        transform: translateY(-12px) scale(1.02);
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
      }

      /* Area Image */
      .area-image {
        height: 120px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 4rem;
        position: relative;
        border-radius: 16px;
        margin-bottom: 30px;
        overflow: hidden;
      }

      .area-image::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);
      }

      .area-emoji {
        position: relative;
        z-index: 2;
      }

      /* Area Content */
      .area-content h3 {
        font-size: 1.4rem;
        font-weight: 700;
        margin-bottom: 15px;
      }

      .area-content p {
        font-size: 14px;
        line-height: 1.6;
      }

      /* Loading Animation */
      .loading {
        opacity: 0;
        transform: translateY(40px) scale(0.9);
      }

      /* Fade In Animation */
      .fade-in {
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .fade-in.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .areas-grid {
          grid-template-columns: 1fr;
          gap: 30px;
        }
        
        .area-card {
          padding: 40px 30px;
        }
        
        .area-image {
          font-size: 3rem;
          height: 100px;
        }
      }
    `;
      document.head.appendChild(styleSheet);
    }

    // Initialize animations
    const animationTimeout = setTimeout(() => {
      document.querySelectorAll('.loading').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('visible');
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'translateY(0) scale(1)';
        }, index * 150);
      });
    }, 500);

    return () => {
      clearTimeout(animationTimeout);
      
      // Clean up using safer remove method with proper error handling
      const cleanupElement = (selector: string) => {
        try {
          const element = document.querySelector(selector);
          if (element && element.parentNode) {
            element.parentNode.removeChild(element);
          }
        } catch (error) {
          // Silent fail - element might already be removed
          console.warn('Cleanup warning:', error);
        }
      };
      
      cleanupElement('link[data-areas-font="true"]');
      cleanupElement('link[data-areas-fontawesome="true"]');
      cleanupElement('style[data-areas-styles="true"]');
    };
  }, []);


  return (
    <>
      <div className="animated-bg"></div>
      <SakuraBackground />
      
      <section className="hero min-h-screen">
        <div className="container">
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="section-title" style={{ color: 'black', marginBottom: '20px' }}>
                <i className="fas fa-map-marked-alt" style={{ 
                  marginRight: '15px', 
                  background: 'var(--accent-gradient)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}></i>
                Japan Travel Guide | Tokyo, Yokohama, Saitama & Chiba Tourism
              </h1>
              <p className="section-subtitle" style={{ color: 'black', marginBottom: '60px' }}>
                Discover the best tourist attractions, restaurants, and hotels in Japan's most popular travel destinations. Complete travel guide with AI-powered recommendations for your perfect Japan trip.
              </p>
            </div>

            {/* Areas Grid */}
            <div className="areas-grid" style={{ marginBottom: '80px' }}>
              {areas.map((area, index) => (
                <Link
                  key={area.id}
                  href={`/areas/${area.id}`}
                  className="area-card fade-in loading"
                  style={{
                    animationDelay: `${index * 0.15}s`
                  }}
                >
                  {/* Area Image with Emoji */}
                  <div className="area-image">
                    {/* エリア絵文字 */}
                    <div className="area-emoji">
                      {area.id === 'tokyo' && '🏙️'}
                      {area.id === 'yokohama' && '🌊'}
                      {area.id === 'saitama' && '🏛️'}
                      {area.id === 'chiba' && '🏖️'}
                    </div>
                  </div>

                  {/* Area Content */}
                  <div className="area-content">
                    <h3 style={{ color: 'white', position: 'relative', zIndex: 2 }}>
                      {area.name}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', position: 'relative', zIndex: 2 }}>
                      {area.description}
                    </p>
                    
                    {/* Stats */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '20px', 
                      marginTop: '15px',
                      position: 'relative', 
                      zIndex: 2
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        <i className="fas fa-map-marker-alt"></i>
                        <span style={{ fontSize: '14px' }}>{area.spots} attractions</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.9)' }}>
                        <i className="fas fa-list"></i>
                        <span style={{ fontSize: '14px' }}>{area.categories.length} categories</span>
                      </div>
                    </div>

                    {/* Highlights Tags */}
                    <div style={{ 
                      marginTop: '20px', 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '8px',
                      position: 'relative', 
                      zIndex: 2
                    }}>
                      {area.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Additional Info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '50px 40px',
              textAlign: 'center',
              marginBottom: '60px'
            }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'black',
                marginBottom: '20px'
              }}>
                Create Your Perfect Japan Itinerary
              </h3>
              <p style={{
                color: 'black',
                marginBottom: '30px',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                Let our AI create efficient travel routes combining multiple areas for your ideal Japan vacation
              </p>
              <Link
                href="/plan"
                className="btn btn-primary"
                style={{
                  fontSize: '16px',
                  padding: '16px 32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <i className="fas fa-magic"></i>
                Plan Your Japan Trip
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}