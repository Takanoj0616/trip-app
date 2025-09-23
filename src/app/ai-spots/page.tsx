'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Clock, Users, Search, Sparkles } from 'lucide-react';
import SakuraBackground from '@/components/SakuraBackground';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecommendationForm {
  interests: string[];
  budget: string;
  duration: string;
  area: string;
}

interface TouristSpot {
  id: string;
  name: string;
  description: string;
  category: string;
  area: string;
  rating: number;
  priceRange: string;
  tags: string[];
  image: string;
  images?: string[];
}

interface RecommendedSpot extends TouristSpot {
  order: number;
  visitTime: string;
  duration: string;
  reason: string;
  tips: string[];
}

export default function AISpotRecommendationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState<RecommendationForm>({
    interests: [],
    budget: '',
    duration: '',
    area: ''
  });
  const [recommendedSpots, setRecommendedSpots] = useState<RecommendedSpot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiThoughts, setAiThoughts] = useState<string[]>([]);
  const [currentThought, setCurrentThought] = useState('');
  const [aiReasoning, setAiReasoning] = useState('');
  const [totalTime, setTotalTime] = useState('');
  const FREE_LIMIT = 5;
  const [freeUses, setFreeUses] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load free usage count from localStorage (for non-logged-in users)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ai-spots-free-uses');
      setFreeUses(raw ? parseInt(raw, 10) || 0 : 0);
    } catch {}
  }, []);

  // Remove the problematic DOM manipulation

  const interests = [
    { id: 'anime', labelKey: 'aiSpots.interests.anime', icon: '🎌', color: '#FF6B9D' },
    { id: 'history', labelKey: 'aiSpots.interests.history', icon: '🏛️', color: '#C77DFF' },
    { id: 'nature', labelKey: 'aiSpots.interests.nature', icon: '🌸', color: '#7BC950' },
    { id: 'gourmet', labelKey: 'aiSpots.interests.gourmet', icon: '🍜', color: '#FF8C42' },
    { id: 'shopping', labelKey: 'aiSpots.interests.shopping', icon: '🛍️', color: '#4ECDC4' },
    { id: 'onsen', labelKey: 'aiSpots.interests.onsen', icon: '♨️', color: '#45B7D1' },
    { id: 'art', labelKey: 'aiSpots.interests.art', icon: '🎨', color: '#96CEB4' }
  ];

  const budgetOptions = [
    { id: 'budget', labelKey: 'aiSpots.budget.budget', icon: '💰' },
    { id: 'standard', labelKey: 'aiSpots.budget.standard', icon: '💳' },
    { id: 'luxury', labelKey: 'aiSpots.budget.luxury', icon: '👑' }
  ];

  const durationOptions = [
    { id: 'half-day', labelKey: 'aiSpots.duration.halfDay', icon: '🕐' },
    { id: 'full-day', labelKey: 'aiSpots.duration.fullDay', icon: '🕘' },
    { id: 'multi-day', labelKey: 'aiSpots.duration.multiDay', icon: '📅' },
    { id: 'week', labelKey: 'aiSpots.duration.week', icon: '🗓️' }
  ];

  const areaOptions = [
    { id: 'shibuya', labelKey: 'aiSpots.area.shibuya', descKey: 'aiSpots.area.shibuya.desc' },
    { id: 'shinjuku', labelKey: 'aiSpots.area.shinjuku', descKey: 'aiSpots.area.shinjuku.desc' },
    { id: 'ginza', labelKey: 'aiSpots.area.ginza', descKey: 'aiSpots.area.ginza.desc' },
    { id: 'asakusa', labelKey: 'aiSpots.area.asakusa', descKey: 'aiSpots.area.asakusa.desc' },
    { id: 'akihabara', labelKey: 'aiSpots.area.akihabara', descKey: 'aiSpots.area.akihabara.desc' },
    { id: 'roppongi', labelKey: 'aiSpots.area.roppongi', descKey: 'aiSpots.area.roppongi.desc' },
    { id: 'odaiba', labelKey: 'aiSpots.area.odaiba', descKey: 'aiSpots.area.odaiba.desc' },
    { id: 'tsukiji', labelKey: 'aiSpots.area.tsukiji', descKey: 'aiSpots.area.tsukiji.desc' },
    { id: 'yokohama', labelKey: 'aiSpots.area.yokohama', descKey: 'aiSpots.area.yokohama.desc' }
  ];

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const simulateAIThinking = async (thoughts: string[]) => {
    for (let i = 0; i < thoughts.length; i++) {
      setCurrentThought(thoughts[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };

  const handleSearch = async () => {
    if (formData.interests.length === 0 || !formData.budget || !formData.duration || !formData.area) {
      alert('すべての項目を選択してください');
      return;
    }

    // Free quota gating: allow up to 5 searches without account
    if (!user) {
      if (freeUses >= FREE_LIMIT) {
        setShowAuthModal(true);
        return;
      }
    }

    setIsLoading(true);
    setRecommendedSpots([]);
    setAiReasoning('');
    setTotalTime('');

    // AI思考プロセスのシミュレーション
    const thinkingProcess = [
      'お客様の興味と予算を分析中...',
      '最適なスポットの組み合わせを検討中...',
      '効率的な回り方を計算中...',
      '天気と混雑状況を考慮中...',
      '最終的なおすすめプランを作成中...'
    ];

    setAiThoughts(thinkingProcess);
    simulateAIThinking(thinkingProcess);

    try {
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('推奨スポットの取得に失敗しました');
      }

      const result = await response.json();
      setRecommendedSpots(result.recommendations || []);
      setAiReasoning(result.reasoning || '');
      setTotalTime(result.totalTime || '');
      setCurrentThought('完了！最適なプランをご提案します 🎉');

      // Increment free usage if not logged in
      if (!user) {
        const next = freeUses + 1;
        setFreeUses(next);
        try { localStorage.setItem('ai-spots-free-uses', String(next)); } catch {}
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setCurrentThought('エラーが発生しました。再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Allow viewing without login; enforce quota at action level
    <AuthGuard requireAuth={false}>
      <div className="hero-background" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -2,
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 100%), url('/images/backgrounds/hokkaidou.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}></div>
      <SakuraBackground />
      
      <section className="hero min-h-screen">
        <div className="container">
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
            
            {/* ヘッダー */}
            <div className="text-center mb-12">
              <h1 className="section-title" style={{ color: 'black', marginBottom: '20px' }}>
                <Sparkles className="inline mr-3" size={32} style={{ color: '#FF6B9D' }} />
                {t('aiSpots.title')}
              </h1>
              <p className="section-subtitle" style={{ color: 'black', marginBottom: '60px' }}>
                {t('aiSpots.subtitle')}
              </p>
              {!user && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(79, 172, 254, 0.12)',
                  border: '1px solid rgba(79, 172, 254, 0.35)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  color: '#0b3c5d',
                  fontWeight: 600
                }}>
                  {t('aiSpots.freeTrial').replace('{count}', Math.max(0, FREE_LIMIT - freeUses).toString())}
                </div>
              )}
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '40px',
              marginBottom: '40px'
            }}>

              {/* 興味・関心 */}
              <div className="mb-8">
                <h2 style={{
                  color: 'black',
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '20px'
                }}>
                  {t('aiSpots.interestsTitle')}
                </h2>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  {t('aiSpots.interestsExample')}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestToggle(interest.id)}
                      style={{
                        background: formData.interests.includes(interest.id) 
                          ? `linear-gradient(135deg, ${interest.color}20, ${interest.color}10)`
                          : 'rgba(255, 255, 255, 0.1)',
                        border: formData.interests.includes(interest.id)
                          ? `2px solid ${interest.color}`
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        padding: '16px',
                        textAlign: 'center',
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{interest.icon}</span>
                      {t(interest.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 予算 */}
              <div className="mb-8">
                <h2 style={{
                  color: 'black',
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '20px'
                }}>
                  {t('aiSpots.budgetTitle')}
                </h2>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  {t('aiSpots.budgetExample')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {budgetOptions.map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setFormData(prev => ({ ...prev, budget: budget.id }))}
                      style={{
                        background: formData.budget === budget.id 
                          ? 'rgba(79, 172, 254, 0.2)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        border: formData.budget === budget.id
                          ? '2px solid #4FACFE'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'center',
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>
                        {budget.icon}
                      </span>
                      {t(budget.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 滞在日数 */}
              <div className="mb-8">
                <h2 style={{
                  color: 'black',
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '20px'
                }}>
                  {t('aiSpots.durationTitle')}
                </h2>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  {t('aiSpots.durationExample')}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {durationOptions.map((duration) => (
                    <button
                      key={duration.id}
                      onClick={() => setFormData(prev => ({ ...prev, duration: duration.id }))}
                      style={{
                        background: formData.duration === duration.id 
                          ? 'rgba(123, 201, 80, 0.2)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        border: formData.duration === duration.id
                          ? '2px solid #7BC950'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        padding: '16px',
                        textAlign: 'center',
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>
                        {duration.icon}
                      </span>
                      {t(duration.labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* エリア選択 */}
              <div className="mb-8">
                <h2 style={{
                  color: 'black',
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '20px'
                }}>
                  {t('aiSpots.areaTitle')}
                </h2>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  {t('aiSpots.areaExample')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {areaOptions.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setFormData(prev => ({ ...prev, area: area.id }))}
                      style={{
                        background: formData.area === area.id 
                          ? 'rgba(255, 107, 157, 0.2)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        border: formData.area === area.id
                          ? '2px solid #FF6B9D'
                          : '2px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'left',
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                        {t(area.labelKey)}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        opacity: 0.7,
                        fontWeight: '400'
                      }}>
                        {t(area.descKey)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 検索ボタン */}
              <div className="text-center">
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '16px 48px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '0 auto',
                    boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {t('aiSpots.searchingButton')}
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      {t('aiSpots.searchButton')}
                    </>
                  )}
                </button>
                {!user && freeUses >= FREE_LIMIT && (
                  <p style={{ textAlign: 'center', marginTop: '12px', color: 'rgba(0,0,0,0.8)' }}>
                    <span dangerouslySetInnerHTML={{ __html: t('aiSpots.freeTrialEnded') }} />
                  </p>
                )}
              </div>
            </div>

            {/* AI思考プロセス表示 */}
            {isLoading && currentThought && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '30px',
                marginBottom: '40px',
                textAlign: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                  marginBottom: '20px'
                }}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <Sparkles className="animate-pulse" size={24} style={{ color: '#FF6B9D' }} />
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                </div>
                
                <h3 style={{
                  color: 'black',
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  🤖 AIが最適なプランを考えています
                </h3>
                
                <p style={{
                  color: 'rgba(0, 0, 0, 0.8)',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  {currentThought}
                </p>
              </div>
            )}

            {/* AI推奨理由 */}
            {aiReasoning && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '30px',
                marginBottom: '30px'
              }}>
                <h3 style={{
                  color: 'black',
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Sparkles size={20} style={{ color: '#FF6B9D' }} />
                  AIの分析結果
                </h3>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.8)',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  {aiReasoning}
                </p>
                {totalTime && (
                  <div style={{
                    marginTop: '15px',
                    padding: '12px 20px',
                    background: 'rgba(79, 172, 254, 0.2)',
                    borderRadius: '12px',
                    display: 'inline-block'
                  }}>
                    <strong style={{ color: 'black' }}>推奨所要時間: {totalTime}</strong>
                  </div>
                )}
              </div>
            )}

            {/* 検索結果 */}
            {recommendedSpots.length > 0 && (
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
                  marginBottom: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Sparkles size={24} style={{ color: '#FF6B9D' }} />
                  おすすめ観光ルート（訪問順）
                </h2>

                <div className="space-y-6">
                  {recommendedSpots.map((spot, index) => (
                    <div
                      key={spot.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        padding: '25px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                    >
                      {/* 順番表示 */}
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
                        {spot.order}
                      </div>

                      <div className="ml-16">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 style={{
                              color: 'black',
                              fontSize: '20px',
                              fontWeight: '700',
                              marginBottom: '8px'
                            }}>
                              {spot.name}
                            </h3>
                            <p style={{
                              color: 'rgba(0, 0, 0, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              marginBottom: '12px'
                            }}>
                              {spot.description}
                            </p>
                          </div>
                          <div style={{ width: '100px', height: '60px', marginLeft: '15px', position: 'relative' }}>
                            <img
                              src={spot.images?.[0] || spot.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'}
                              alt={spot.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                              loading="lazy"
                            />
                          </div>
                        </div>

                        {/* 時間と詳細情報 */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '15px',
                          marginBottom: '15px'
                        }}>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                                到着時間
                              </div>
                              <div style={{ color: 'black', fontSize: '16px', fontWeight: '700' }}>
                                {spot.visitTime}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                                滞在時間
                              </div>
                              <div style={{ color: 'black', fontSize: '16px', fontWeight: '700' }}>
                                {spot.duration}
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                                評価
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="fill-current text-yellow-400" size={16} />
                                <span style={{ color: 'black', fontSize: '16px', fontWeight: '700' }}>
                                  {spot.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* おすすめ理由 */}
                        <div style={{
                          background: 'rgba(255, 107, 157, 0.1)',
                          borderRadius: '12px',
                          padding: '12px 15px',
                          marginBottom: '15px'
                        }}>
                          <div style={{ color: 'black', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                            💡 おすすめ理由
                          </div>
                          <div style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '14px' }}>
                            {spot.reason}
                          </div>
                        </div>

                        {/* ヒント */}
                        {spot.tips && spot.tips.length > 0 && (
                          <div>
                            <div style={{ color: 'black', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                              ✨ 訪問のコツ
                            </div>
                            <ul style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '13px', lineHeight: '1.5', marginLeft: '16px' }}>
                              {spot.tips.slice(0, 2).map((tip, tipIndex) => (
                                <li key={tipIndex} style={{ marginBottom: '4px' }}>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* 次のスポットへの矢印 */}
                        {index < recommendedSpots.length - 1 && (
                          <div style={{
                            textAlign: 'center',
                            marginTop: '20px',
                            color: 'rgba(0, 0, 0, 0.5)',
                            fontSize: '20px'
                          }}>
                            ↓
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} initialMode="register" />
    </AuthGuard>
  );
}
