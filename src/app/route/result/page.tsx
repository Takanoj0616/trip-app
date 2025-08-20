'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TouristSpot } from '@/types';
import AuthGuard from '@/components/AuthGuard';

interface RouteStep {
  spot: TouristSpot;
  order: number;
  estimatedTime: string;
  transportationMethod: string;
  distanceFromPrevious: string;
  recommendedDuration: string;
  tips: string[];
}

interface RouteData {
  id: string;
  area: string;
  selectedSpots: TouristSpot[];
  recommendedSpots: TouristSpot[];
  optimizedRoute: RouteStep[];
  timeEstimate: string;
  totalDistance: string;
  tips: string[];
  alternativeRoutes?: RouteStep[][];
  createdAt: string;
}

function RouteResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'route' | 'recommended'>('route');

  useEffect(() => {
    // Inject fonts and styles
    const fontLinks = document.createElement('link');
    fontLinks.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    fontLinks.rel = 'stylesheet';
    document.head.appendChild(fontLinks);

    const fontAwesome = document.createElement('link');
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    fontAwesome.rel = 'stylesheet';
    document.head.appendChild(fontAwesome);

    // Create sakura particles
    function createSakura() {
      const sakuraContainer = document.getElementById('sakuraContainer');
      if (!sakuraContainer) return;
      
      const sakura = document.createElement('div');
      sakura.className = 'sakura';
      
      const startX = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const size = Math.random() * 8 + 8;
      
      sakura.style.left = startX + '%';
      sakura.style.animationDuration = duration + 's';
      sakura.style.animationDelay = delay + 's';
      sakura.style.width = size + 'px';
      sakura.style.height = size + 'px';
      
      sakuraContainer.appendChild(sakura);
      
      setTimeout(() => {
        try {
          if (sakura && sakura.parentNode && sakura.parentNode === sakuraContainer && document.contains(sakura)) {
            sakuraContainer.removeChild(sakura);
          } else if (sakura && document.contains(sakura)) {
            sakura.remove();
          }
        } catch (error) {
          try {
            if (sakura && sakura.remove) {
              sakura.remove();
            }
          } catch (fallbackError) {
            // Silent fail - non-critical
          }
        }
      }, (duration + delay) * 1000);
    }

    const sakuraInterval = setInterval(createSakura, 800);

    // URLパラメータからルートデータを取得
    const routeData = searchParams.get('data');
    if (routeData) {
      try {
        const decodedRoute = JSON.parse(decodeURIComponent(routeData));
        setRoute(decodedRoute);
        setLoading(false);
      } catch (err) {
        setError('ルートデータの読み込みに失敗しました');
        setLoading(false);
      }
    } else {
      setError('ルートデータが見つかりません');
      setLoading(false);
    }

    return () => {
      clearInterval(sakuraInterval);
      
      try {
        if (fontLinks && document.head && document.head.contains(fontLinks)) {
          document.head.removeChild(fontLinks);
        }
      } catch (error) {
        try {
          if (fontLinks && fontLinks.remove) {
            fontLinks.remove();
          }
        } catch (fallbackError) {
          // Silent fail - non-critical
        }
      }

      try {
        if (fontAwesome && document.head && document.head.contains(fontAwesome)) {
          document.head.removeChild(fontAwesome);
        }
      } catch (error) {
        try {
          if (fontAwesome && fontAwesome.remove) {
            fontAwesome.remove();
          }
        } catch (fallbackError) {
          // Silent fail - non-critical
        }
      }

      const sakuraContainer = document.getElementById('sakuraContainer');
      if (sakuraContainer) {
        try {
          const particles = sakuraContainer.querySelectorAll('.sakura');
          particles.forEach(particle => {
            try {
              if (particle && particle.parentNode && particle.parentNode === sakuraContainer) {
                sakuraContainer.removeChild(particle);
              } else if (particle && particle.remove) {
                particle.remove();
              }
            } catch (particleError) {
              // Continue with other particles
            }
          });
        } catch (error) {
          try {
            if (sakuraContainer) {
              sakuraContainer.innerHTML = '';
            }
          } catch (fallbackError) {
            // Silent fail - non-critical
          }
        }
      }
    };
  }, [searchParams]);

  if (loading) {
    return (
      <>
        <div className="animated-bg"></div>
        <div className="sakura-container" id="sakuraContainer"></div>
        <section className="hero min-h-screen flex items-center justify-center">
          <div className="text-center" style={{ color: 'black' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>ルートを読み込んでいます...</p>
          </div>
        </section>
      </>
    );
  }

  if (error || !route) {
    return (
      <>
        <div className="animated-bg"></div>
        <div className="sakura-container" id="sakuraContainer"></div>
        <section className="hero min-h-screen flex items-center justify-center">
          <div className="text-center" style={{ color: 'black' }}>
            <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={() => router.push('/areas/tokyo')}
              className="btn btn-primary"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              スポット選択に戻る
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="animated-bg"></div>
      <div className="sakura-container" id="sakuraContainer"></div>
      
      <section className="hero min-h-screen">
        <div className="container">
          <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '40px' }}>
            
            {/* ヘッダー */}
            <div className="text-center mb-12">
              <h1 className="section-title" style={{ color: 'black', marginBottom: '20px' }}>
                <i className="fas fa-route" style={{ 
                  marginRight: '15px', 
                  background: 'var(--accent-gradient)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}></i>
                {route.area}のおすすめルート
              </h1>
              <p className="section-subtitle" style={{ color: 'black', marginBottom: '40px' }}>
                AIがあなたの選択したスポットを効率的に回るルートを提案しました
              </p>
              
              {/* ルートの基本情報 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '40px'
              }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <i className="fas fa-clock text-blue-500 text-xl mb-2"></i>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      所要時間: {route.timeEstimate}
                    </div>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-map-marker-alt text-red-500 text-xl mb-2"></i>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      距離: {route.totalDistance}
                    </div>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-map text-purple-500 text-xl mb-2"></i>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      スポット: {route.selectedSpots.length}箇所
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* タブ切り替え */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '30px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setSelectedTab('route')}
                className="btn"
                style={{
                  background: selectedTab === 'route' ? 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' : 'rgba(255, 255, 255, 0.1)',
                  color: selectedTab === 'route' ? 'white' : 'black',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '12px'
                }}
              >
                <i className="fas fa-route mr-2"></i>
                最適化ルート
              </button>
              <button
                onClick={() => setSelectedTab('recommended')}
                className="btn"
                style={{
                  background: selectedTab === 'recommended' ? 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)' : 'rgba(255, 255, 255, 0.1)',
                  color: selectedTab === 'recommended' ? 'white' : 'black',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '12px'
                }}
              >
                <i className="fas fa-star mr-2"></i>
                おすすめスポット ({route.recommendedSpots.length})
              </button>
            </div>

            {/* コンテンツ */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '40px'
            }}>
              
              {selectedTab === 'route' && (
                <div>
                  {/* 最適化ルート */}
                  <h2 style={{
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '30px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-map-signs text-blue-500 mr-3"></i>
                    最適化されたルート
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {route.optimizedRoute.map((step, index) => (
                      <div key={step.spot.id} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '25px',
                        position: 'relative'
                      }}>
                        {/* Step番号 */}
                        <div style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '20px',
                          background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                          color: 'white',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}>
                          {step.order}
                        </div>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                          {/* スポット画像 */}
                          <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: 'rgba(0, 0, 0, 0.1)'
                          }}>
                            {step.spot.images && step.spot.images[0] ? (
                              <img
                                src={step.spot.images[0]}
                                alt={step.spot.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px'
                              }}>
                                {step.spot.category === 'sightseeing' && '🏛️'}
                                {step.spot.category === 'restaurants' && '🍜'}
                                {step.spot.category === 'hotels' && '🏨'}
                                {step.spot.category === 'shopping' && '🛍️'}
                                {step.spot.category === 'entertainment' && '🎢'}
                              </div>
                            )}
                          </div>

                          {/* スポット情報 */}
                          <div style={{ flex: 1 }}>
                            <h3 style={{
                              color: 'black',
                              fontSize: '20px',
                              fontWeight: '700',
                              marginBottom: '8px'
                            }}>
                              {step.spot.name}
                            </h3>
                            <p style={{
                              color: 'rgba(0, 0, 0, 0.7)',
                              fontSize: '14px',
                              marginBottom: '15px'
                            }}>
                              {step.spot.description}
                            </p>

                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="fas fa-clock text-blue-500"></i>
                                <span style={{ color: 'black', fontSize: '12px' }}>
                                  {step.estimatedTime} ({step.recommendedDuration})
                                </span>
                              </div>
                              {step.distanceFromPrevious !== '0m' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <i className="fas fa-walking text-green-500"></i>
                                  <span style={{ color: 'black', fontSize: '12px' }}>
                                    前のスポットから {step.distanceFromPrevious}
                                  </span>
                                </div>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="fas fa-star text-yellow-500"></i>
                                <span style={{ color: 'black', fontSize: '12px' }}>
                                  {step.spot.rating || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 次への矢印 */}
                        {index < route.optimizedRoute.length - 1 && (
                          <div style={{
                            textAlign: 'center',
                            marginTop: '15px',
                            color: 'rgba(0, 0, 0, 0.4)'
                          }}>
                            <i className="fas fa-arrow-down text-xl"></i>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 旅のコツ */}
                  <div style={{ marginTop: '40px' }}>
                    <h3 style={{
                      color: 'black',
                      fontSize: '20px',
                      fontWeight: '700',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <i className="fas fa-lightbulb text-yellow-500 mr-3"></i>
                      旅のコツ
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                      {route.tips.map((tip, index) => (
                        <div key={index} style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '15px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <div style={{ color: 'black', fontSize: '14px' }}>
                            <i className="fas fa-check-circle text-green-500 mr-2"></i>
                            {tip}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'recommended' && (
                <div>
                  <h2 style={{
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-star text-yellow-500 mr-3"></i>
                    追加おすすめスポット
                  </h2>
                  <p style={{
                    color: 'rgba(0, 0, 0, 0.7)',
                    marginBottom: '30px'
                  }}>
                    選択されたスポットと合わせて訪問するとより充実した体験ができるスポットです
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '25px'
                  }}>
                    {route.recommendedSpots.map((spot, index) => (
                      <div key={spot.id} style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '20px',
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{
                          width: '100%',
                          height: '150px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          marginBottom: '15px',
                          background: 'rgba(0, 0, 0, 0.1)'
                        }}>
                          {spot.images && spot.images[0] ? (
                            <img
                              src={spot.images[0]}
                              alt={spot.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '48px'
                            }}>
                              {spot.category === 'sightseeing' && '🏛️'}
                              {spot.category === 'restaurants' && '🍜'}
                              {spot.category === 'hotels' && '🏨'}
                              {spot.category === 'shopping' && '🛍️'}
                              {spot.category === 'entertainment' && '🎢'}
                            </div>
                          )}
                        </div>

                        <h3 style={{
                          color: 'black',
                          fontSize: '18px',
                          fontWeight: '700',
                          marginBottom: '8px'
                        }}>
                          {spot.name}
                        </h3>

                        <p style={{
                          color: 'rgba(0, 0, 0, 0.7)',
                          fontSize: '14px',
                          marginBottom: '15px',
                          lineHeight: '1.5'
                        }}>
                          {spot.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <i className="fas fa-star text-yellow-500"></i>
                              <span style={{ color: 'black', fontSize: '12px' }}>{spot.rating}</span>
                            </div>
                            <div style={{ color: 'black', fontSize: '12px' }}>
                              {spot.priceRange === 'budget' ? '¥' :
                               spot.priceRange === 'moderate' ? '¥¥' :
                               spot.priceRange === 'expensive' ? '¥¥¥' : '¥¥¥¥'}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {spot.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span key={tagIndex} style={{
                                background: 'rgba(79, 172, 254, 0.2)',
                                color: 'black',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '10px'
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 mb-12">
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ fontSize: '16px', padding: '16px 32px' }}
              >
                <i className="fas fa-print mr-2"></i>
                ルートを印刷
              </button>
              <button
                onClick={() => {
                  navigator.share?.({
                    title: `${route.area}のおすすめルート`,
                    text: `${route.area}の効率的な観光ルートをチェック！`,
                    url: window.location.href,
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('URLをクリップボードにコピーしました！');
                  });
                }}
                className="btn btn-secondary"
                style={{ fontSize: '16px', padding: '16px 32px' }}
              >
                <i className="fas fa-share-alt mr-2"></i>
                ルートを共有
              </button>
              <button
                onClick={() => router.push(`/areas/${route.area}`)}
                className="btn btn-primary"
                style={{ fontSize: '16px', padding: '16px 32px' }}
              >
                <i className="fas fa-plus mr-2"></i>
                新しいルート作成
              </button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default function RouteResultPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
        <RouteResultContent />
      </Suspense>
    </AuthGuard>
  );
}