'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { TouristSpot } from '@/types';
import { Clock, MapPin, Navigation, Star, Users } from 'lucide-react';
import SakuraBackground from '@/components/SakuraBackground';
import AuthGuard from '@/components/AuthGuard';

interface RouteStep {
  spot: TouristSpot;
  order: number;
  estimatedTime: string;
  transportationMethod: 'start' | 'walking' | 'train' | 'bus' | 'taxi';
  distanceFromPrevious: string;
  recommendedDuration: string;
  tips: string[];
}

interface TravelPlan {
  id: string;
  destination: string;
  budget: string;
  duration: string;
  interests: string[];
  travelStyle: string;
  groupType: string;
  title: string;
  overview: string;
  schedule: string;
  restaurants: string;
  accommodation: string;
  tips: string;
  budgetDetails: string;
  fullContent: string;
  createdAt: string;
  // New route-based properties
  selectedSpots?: TouristSpot[];
  recommendedSpots?: TouristSpot[];
  optimizedRoute?: RouteStep[];
  timeEstimate?: string;
  totalDistance?: string;
}

function PlanResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    // Font injection handled by SakuraBackground component

    // URLパラメータからプランデータを取得
    const planData = searchParams.get('data');
    if (planData) {
      try {
        const decodedPlan = JSON.parse(decodeURIComponent(planData));
        setPlan(decodedPlan);
        setLoading(false);
      } catch (err) {
        setError('プランデータの読み込みに失敗しました');
        setLoading(false);
      }
    } else {
      setError('プランデータが見つかりません');
      setLoading(false);
    }

    return () => {
      // Safe cleanup with proper null checks
      try {
        if (fontLinks && fontLinks.parentNode && document.head.contains(fontLinks)) {
          document.head.removeChild(fontLinks);
        }
      } catch (error) {
        // Silent fail - element might have been removed already
      }
      
      try {
        if (fontAwesome && fontAwesome.parentNode && document.head.contains(fontAwesome)) {
          document.head.removeChild(fontAwesome);
        }
      } catch (error) {
        // Silent fail - element might have been removed already
      }
    };
  }, [searchParams]);

  const formatContent = (content: string | string[]) => {
    // Handle both string and array cases
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <li key={index} className="mb-2 ml-4">{item}</li>
      ));
    }

    // Handle non-string values
    if (!content || typeof content !== 'string') {
      return <p>内容がありません</p>;
    }

    return content.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Bold text for titles and important items
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-3">
            {parts.map((part, i) => (
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            ))}
          </p>
        );
      }
      
      // List items
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <li key={index} className="mb-2 ml-4">
            {line.replace(/^[-•]\s*/, '')}
          </li>
        );
      }
      
      return <p key={index} className="mb-3">{line}</p>;
    });
  };

  if (loading) {
    return (
      <>
        <div className="animated-bg"></div>
        <SakuraBackground />
        <section className="hero min-h-screen flex items-center justify-center">
          <div className="text-center" style={{ color: 'black' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>プランを読み込んでいます...</p>
          </div>
        </section>
      </>
    );
  }

  if (error || !plan) {
    return (
      <>
        <div className="animated-bg"></div>
        <SakuraBackground />
        <section className="hero min-h-screen flex items-center justify-center">
          <div className="text-center" style={{ color: 'black' }}>
            <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={() => router.push('/plan')}
              className="btn btn-primary"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              プラン作成に戻る
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
                <i className="fas fa-map-marked-alt" style={{ 
                  marginRight: '15px', 
                  background: 'var(--accent-gradient)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}></i>
                {plan.title}
              </h1>
              <p className="section-subtitle" style={{ color: 'black', marginBottom: '40px' }}>
                AIがあなたの好みに合わせて作成した旅行プランです
              </p>
              
              {/* プランの基本情報 */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '40px'
              }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <i className="fas fa-map-marker-alt text-red-500 text-xl mb-2"></i>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      {plan.destination}
                    </div>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-yen-sign text-green-500 text-xl mb-2"></i>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      {plan.budget === 'budget' ? '節約' : plan.budget === 'standard' ? '標準' : 'プレミアム'}
                    </div>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-clock text-purple-500 text-xl mb-2"></i>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      {plan.duration === '1day' ? '1日' : 
                       plan.duration === '2-3days' ? '2-3日' : 
                       plan.duration === '4-7days' ? '4-7日' : '1週間以上'}
                    </div>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-users text-orange-500 text-xl mb-2"></i>
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      {plan.groupType === 'solo' ? '一人旅' :
                       plan.groupType === 'couple' ? 'カップル' :
                       plan.groupType === 'family' ? '家族' : '友人'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ルート詳細（新しいルートベースプランの場合） */}
            {plan.optimizedRoute && plan.optimizedRoute.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '40px',
                marginBottom: '40px'
              }}>
                <h2 style={{
                  color: 'black',
                  fontSize: '24px',
                  fontWeight: '700',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Navigation className="text-blue-500 mr-3" size={24} />
                  最適化されたルート
                </h2>
                
                {/* ルート概要 */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '30px',
                  display: 'flex',
                  justifyContent: 'space-around',
                  textAlign: 'center',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}>
                  <div>
                    <Clock className="text-purple-500 mb-2 mx-auto" size={20} />
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      所要時間
                    </div>
                    <div style={{ color: 'black', fontSize: '18px', fontWeight: '700' }}>
                      {plan.timeEstimate || '4-5時間'}
                    </div>
                  </div>
                  <div>
                    <MapPin className="text-red-500 mb-2 mx-auto" size={20} />
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      総距離
                    </div>
                    <div style={{ color: 'black', fontSize: '18px', fontWeight: '700' }}>
                      {plan.totalDistance || '約5km'}
                    </div>
                  </div>
                  <div>
                    <Users className="text-green-500 mb-2 mx-auto" size={20} />
                    <div style={{ color: 'black', fontSize: '14px', fontWeight: '600' }}>
                      スポット数
                    </div>
                    <div style={{ color: 'black', fontSize: '18px', fontWeight: '700' }}>
                      {plan.optimizedRoute.length}箇所
                    </div>
                  </div>
                </div>

                {/* ルートステップ */}
                <div className="space-y-6">
                  {plan.optimizedRoute.map((step, index) => (
                    <div key={step.spot.id} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '20px',
                      padding: '25px',
                      position: 'relative'
                    }}>
                      {/* ステップ番号 */}
                      <div style={{
                        position: 'absolute',
                        top: '-15px',
                        left: '25px',
                        background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                        color: 'white',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '700',
                        border: '3px solid rgba(255, 255, 255, 0.3)'
                      }}>
                        {step.order}
                      </div>

                      <div className="ml-16">
                        {/* スポット情報 */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 style={{
                              color: 'black',
                              fontSize: '20px',
                              fontWeight: '700',
                              marginBottom: '8px'
                            }}>
                              {step.spot.name}
                            </h3>
                            <p style={{
                              color: 'black',
                              opacity: 0.8,
                              fontSize: '14px',
                              lineHeight: '1.6',
                              marginBottom: '12px'
                            }}>
                              {step.spot.description}
                            </p>
                            
                            {/* レーティングとカテゴリ */}
                            <div className="flex items-center gap-4 mb-3">
                              {step.spot.rating && (
                                <div className="flex items-center">
                                  <Star className="text-yellow-400 fill-current" size={16} />
                                  <span style={{ color: 'black', fontSize: '14px', marginLeft: '4px' }}>
                                    {step.spot.rating}
                                  </span>
                                </div>
                              )}
                              <span style={{
                                background: 'rgba(79, 172, 254, 0.2)',
                                color: 'black',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {step.spot.category === 'sightseeing' ? '観光・名所' :
                                 step.spot.category === 'restaurants' ? 'グルメ' :
                                 step.spot.category === 'hotels' ? 'ホテル' :
                                 step.spot.category === 'entertainment' ? 'エンタメ' :
                                 step.spot.category === 'shopping' ? 'ショッピング' : step.spot.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 時間と交通情報 */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '15px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '15px',
                          marginBottom: '15px'
                        }}>
                          <div>
                            <div style={{ color: 'black', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>到着予定時間</div>
                            <div style={{ color: 'black', fontSize: '16px', fontWeight: '700' }}>{step.estimatedTime}</div>
                          </div>
                          <div>
                            <div style={{ color: 'black', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>滞在時間</div>
                            <div style={{ color: 'black', fontSize: '16px', fontWeight: '700' }}>{step.recommendedDuration}</div>
                          </div>
                          {index > 0 && (
                            <>
                              <div>
                                <div style={{ color: 'black', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>移動手段</div>
                                <div style={{ color: 'black', fontSize: '16px', fontWeight: '700' }}>
                                  {step.transportationMethod === 'walking' ? '🚶 徒歩' :
                                   step.transportationMethod === 'train' ? '🚃 電車' :
                                   step.transportationMethod === 'bus' ? '🚌 バス' :
                                   step.transportationMethod === 'taxi' ? '🚕 タクシー' : '移動'}
                                </div>
                              </div>
                              <div>
                                <div style={{ color: 'black', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>前地点からの距離</div>
                                <div style={{ color: 'black', fontSize: '16px', fontWeight: '700' }}>{step.distanceFromPrevious}</div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* ヒント */}
                        {step.tips && step.tips.length > 0 && (
                          <div>
                            <div style={{ color: 'black', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>💡 おすすめ</div>
                            <ul style={{ color: 'black', fontSize: '13px', opacity: 0.8, lineHeight: '1.5', marginLeft: '16px' }}>
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} style={{ marginBottom: '4px' }}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 全体のアドバイス */}
                {plan.tips && Array.isArray(plan.tips) && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    marginTop: '30px'
                  }}>
                    <h3 style={{
                      color: 'black',
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      💡 旅行のコツ
                    </h3>
                    <ul style={{ color: 'black', fontSize: '14px', lineHeight: '1.6', marginLeft: '16px' }}>
                      {plan.tips.map((tip, index) => (
                        <li key={index} style={{ marginBottom: '8px' }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* プラン詳細（従来のテキストベースプランの場合） */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '40px'
            }}>
              
              {/* プラン概要 */}
              {plan.overview && (
                <div className="mb-8">
                  <h2 style={{
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-info-circle text-blue-500 mr-3"></i>
                    プラン概要
                  </h2>
                  <div style={{ color: 'black', lineHeight: '1.7' }}>
                    {formatContent(plan.overview)}
                  </div>
                </div>
              )}

              {/* 詳細スケジュール */}
              {plan.schedule && (
                <div className="mb-8">
                  <h2 style={{
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-calendar-alt text-indigo-500 mr-3"></i>
                    詳細スケジュール
                  </h2>
                  <div style={{ color: 'black', lineHeight: '1.7' }}>
                    {formatContent(plan.schedule)}
                  </div>
                </div>
              )}

              {/* おすすめグルメ */}
              {plan.restaurants && (
                <div className="mb-8">
                  <h2 style={{
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-utensils text-pink-500 mr-3"></i>
                    おすすめグルメ
                  </h2>
                  <div style={{ color: 'black', lineHeight: '1.7' }}>
                    {formatContent(plan.restaurants)}
                  </div>
                </div>
              )}

              {/* 宿泊施設 */}
              {plan.accommodation && (
                <div className="mb-8">
                  <h2 style={{
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-bed text-teal-500 mr-3"></i>
                    宿泊施設の提案
                  </h2>
                  <div style={{ color: 'black', lineHeight: '1.7' }}>
                    {formatContent(plan.accommodation)}
                  </div>
                </div>
              )}

              {/* 旅のコツ */}
              {plan.tips && (
                <div className="mb-8">
                  <h2 style={{
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-lightbulb text-yellow-500 mr-3"></i>
                    旅のコツ・注意点
                  </h2>
                  <div style={{ color: 'black', lineHeight: '1.7' }}>
                    {formatContent(plan.tips)}
                  </div>
                </div>
              )}

              {/* 予算詳細 */}
              {plan.budgetDetails && (
                <div className="mb-8">
                  <h2 style={{
                    color: 'black',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-calculator text-green-500 mr-3"></i>
                    予算の目安
                  </h2>
                  <div style={{ color: 'black', lineHeight: '1.7' }}>
                    {formatContent(plan.budgetDetails)}
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
                プランを印刷
              </button>
              <button
                onClick={() => {
                  navigator.share?.({
                    title: plan.title,
                    text: `${plan.destination}の旅行プランをチェック！`,
                    url: window.location.href,
                  }).catch(() => {
                    // Fallback for browsers that don't support Web Share API
                    navigator.clipboard.writeText(window.location.href);
                    alert('URLをクリップボードにコピーしました！');
                  });
                }}
                className="btn btn-secondary"
                style={{ fontSize: '16px', padding: '16px 32px' }}
              >
                <i className="fas fa-share-alt mr-2"></i>
                プランを共有
              </button>
              <button
                onClick={() => router.push('/plan')}
                className="btn btn-primary"
                style={{ fontSize: '16px', padding: '16px 32px' }}
              >
                <i className="fas fa-plus mr-2"></i>
                新しいプラン作成
              </button>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default function PlanResultPage() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
        <PlanResultContent />
      </Suspense>
    </AuthGuard>
  );
}