'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Clock, Users, Search, Sparkles } from 'lucide-react';
import SakuraBackground from '@/components/SakuraBackground';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

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
    { id: 'anime', label: 'アニメ・漫画', icon: '🎌', color: '#FF6B9D' },
    { id: 'history', label: '歴史・文化', icon: '🏛️', color: '#C77DFF' },
    { id: 'nature', label: '自然・風景', icon: '🌸', color: '#7BC950' },
    { id: 'gourmet', label: 'グルメ', icon: '🍜', color: '#FF8C42' },
    { id: 'shopping', label: 'ショッピング', icon: '🛍️', color: '#4ECDC4' },
    { id: 'onsen', label: '温泉', icon: '♨️', color: '#45B7D1' },
    { id: 'art', label: 'アート・美術館', icon: '🎨', color: '#96CEB4' }
  ];

  const budgetOptions = [
    { id: 'budget', label: '節約 (1人あたり5,000円以下)', icon: '💰' },
    { id: 'standard', label: '標準 (1人あたり10,000円)', icon: '💳' },
    { id: 'luxury', label: 'プレミアム (1人あたり20,000円以上)', icon: '👑' }
  ];

  const durationOptions = [
    { id: 'half-day', label: '半日 (3-4時間)', icon: '🕐' },
    { id: 'full-day', label: '1日 (8-10時間)', icon: '🕘' },
    { id: 'multi-day', label: '2-3日', icon: '📅' },
    { id: 'week', label: '1週間以上', icon: '🗓️' }
  ];

  const areaOptions = [
    { id: 'shibuya', label: '渋谷・原宿', description: '若者文化の中心地' },
    { id: 'shinjuku', label: '新宿', description: 'ビジネス街とエンターテイメント' },
    { id: 'ginza', label: '銀座・有楽町', description: '高級ショッピングエリア' },
    { id: 'asakusa', label: '浅草・上野', description: '伝統的な下町文化' },
    { id: 'akihabara', label: '秋葉原', description: 'アニメ・電気街' },
    { id: 'roppongi', label: '六本木・赤坂', description: 'アートとナイトライフ' },
    { id: 'odaiba', label: 'お台場', description: '近未来的な臨海エリア' },
    { id: 'tsukiji', label: '築地・豊洲', description: 'グルメと市場' },
    { id: 'yokohama', label: '横浜', description: '港町の魅力' }
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
      <div className="animated-bg"></div>
      <SakuraBackground />
      
      <section className="hero min-h-screen">
        <div className="container">
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>
            
            {/* ヘッダー */}
            <div className="text-center mb-12">
              <h1 className="section-title" style={{ color: 'black', marginBottom: '20px' }}>
                <Sparkles className="inline mr-3" size={32} style={{ color: '#FF6B9D' }} />
                AIおすすめスポット
              </h1>
              <p className="section-subtitle" style={{ color: 'black', marginBottom: '60px' }}>
                あなたの好みに合わせて、AIが最適な観光スポットをご提案します
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
                  無料体験: 残り {Math.max(0, FREE_LIMIT - freeUses)} 回（会員登録で無制限）
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
                  どんなことに興味がありますか？
                </h2>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  例: アニメ、自然、歴史的建造物
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
                      {interest.label}
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
                  予算
                </h2>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  例: 1人あたり5,000円
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
                      {budget.label}
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
                  滞在日数
                </h2>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  例: 3日間
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
                      {duration.label}
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
                  どのエリアに行きたいですか？
                </h2>
                <p style={{
                  color: 'rgba(0, 0, 0, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  例: 渋谷、新宿、秋葉原
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
                        {area.label}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        opacity: 0.7,
                        fontWeight: '400'
                      }}>
                        {area.description}
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
                      AI分析中...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      おすすめを検索
                    </>
                  )}
                </button>
                {!user && freeUses >= FREE_LIMIT && (
                  <p style={{ textAlign: 'center', marginTop: '12px', color: 'rgba(0,0,0,0.8)' }}>
                    無料体験は終了しました。<a href="/register" style={{ color: '#2563eb', textDecoration: 'underline' }}>会員登録</a>で無制限にご利用いただけます。
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
                          <div style={{ width: '100px', height: '60px', marginLeft: '15px' }}>
                            <img
                              src={spot.images?.[0] || spot.image || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'}
                              alt={spot.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
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
