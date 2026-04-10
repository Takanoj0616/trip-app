'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Star, Heart, MessageCircle, User, Camera, Lock, CreditCard } from 'lucide-react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import PaymentModal from '@/components/PaymentModal';

interface TravelPreferences {
  destination: string;
  duration: string;
  budget: string;
  travelStyle: string;
  interests: string[];
  groupSize: string;
  preferredLanguage: string;
  specialRequests: string;
}

interface Coordinator {
  id: string;
  name: string;
  nameEn: string;
  age: number;
  location: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  languages: string[];
  specialties: string[];
  experience: number;
  introduction: string;
  recentReviews: string[];
  responseTime: string;
  matchPercentage?: number;
}

export default function CoordinatorMatchingPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'matching' | 'results'>('form');
  const [preferences, setPreferences] = useState<TravelPreferences>({
    destination: '',
    duration: '',
    budget: '',
    travelStyle: '',
    interests: [],
    groupSize: '',
    preferredLanguage: '',
    specialRequests: ''
  });
  const [matchedCoordinators, setMatchedCoordinators] = useState<Coordinator[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Check if user has paid for coordinator access
    const checkPaymentStatus = () => {
      const paymentSuccess = localStorage.getItem('coordinatorPaymentSuccess');
      const paymentDate = localStorage.getItem('coordinatorPaymentDate');

      if (paymentSuccess === 'true' && paymentDate) {
        // Check if payment is still valid (e.g., within 1 year)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const paymentTime = new Date(paymentDate);

        if (paymentTime > oneYearAgo) {
          setHasAccess(true);
        } else {
          // Payment expired
          localStorage.removeItem('coordinatorPaymentSuccess');
          localStorage.removeItem('coordinatorPaymentId');
          localStorage.removeItem('coordinatorPaymentDate');
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
    };

    checkPaymentStatus();

    // Inject Google Fonts and FontAwesome
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
          if (sakura && sakura.parentNode && sakura.parentNode.contains(sakura)) {
            sakura.parentNode.removeChild(sakura);
          }
        } catch (error) {
          // Silent fail
        }
      }, (duration + delay) * 1000);
    }

    const sakuraInterval = setInterval(createSakura, 800);

    // Initialize animations
    setTimeout(() => {
      document.querySelectorAll('.loading').forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('visible');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
      });
    }, 500);

    return () => {
      clearInterval(sakuraInterval);
      try {
        if (fontLinks && fontLinks.parentNode && fontLinks.parentNode.contains(fontLinks)) {
          fontLinks.parentNode.removeChild(fontLinks);
        }
        if (fontAwesome && fontAwesome.parentNode && fontAwesome.parentNode.contains(fontAwesome)) {
          fontAwesome.parentNode.removeChild(fontAwesome);
        }
      } catch (error) {
        // Silent fail
      }

      const sakuraContainer = document.getElementById('sakuraContainer');
      if (sakuraContainer) {
        try {
          // Safe cleanup using innerHTML
          sakuraContainer.innerHTML = '';
        } catch (error) {
          try {
            // Fallback: Safe iteration with null checks
            const particles = Array.from(sakuraContainer.children);
            particles.forEach(particle => {
              try {
                if (particle && particle.parentNode && particle.parentNode === sakuraContainer) {
                  sakuraContainer.removeChild(particle);
                }
              } catch (particleError) {
                // Continue with other particles
              }
            });
          } catch (fallbackError) {
            // Silent fail - non-critical
          }
        }
      }
    };
  }, []);

  const sampleCoordinators: Coordinator[] = [
    {
      id: '1',
      name: '山田 美咲',
      nameEn: 'Misaki Yamada',
      age: 28,
      location: '東京',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616c4e55c22?w=400&h=400&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 127,
      languages: ['日本語', 'English', '한국어'],
      specialties: ['歴史・文化', 'グルメ', 'ショッピング'],
      experience: 3,
      introduction: '東京生まれ東京育ちの地元愛溢れるガイドです。隠れた名店や穴場スポットをご案内します！',
      recentReviews: ['とても親切で楽しい旅になりました！', '地元ならではの情報をたくさん教えてくれました'],
      responseTime: '平均30分以内'
    },
    {
      id: '2',
      name: '佐藤 健太',
      nameEn: 'Kenta Sato',
      age: 32,
      location: '京都',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 89,
      languages: ['日本語', 'English'],
      specialties: ['寺社仏閣', '伝統文化', 'アート'],
      experience: 5,
      introduction: '京都の伝統文化に精通しています。本物の日本文化を体験したい方におすすめです。',
      recentReviews: ['文化について詳しく説明してくれました', '素晴らしい体験をありがとう！'],
      responseTime: '平均1時間以内'
    },
    {
      id: '3',
      name: '田中 あゆみ',
      nameEn: 'Ayumi Tanaka',
      age: 26,
      location: '大阪',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      rating: 4.7,
      reviewCount: 156,
      languages: ['日本語', 'English', 'Español'],
      specialties: ['グルメ', 'ナイトライフ', 'エンターテインメント'],
      experience: 2,
      introduction: '大阪のおもしろい文化と絶品グルメをご紹介します。一緒に楽しい時間を過ごしましょう！',
      recentReviews: ['とても面白くて美味しい店を紹介してくれました', 'エネルギッシュで素敵なガイドさん'],
      responseTime: '平均15分以内'
    }
  ];

  const travelStyles = [
    { id: 'luxury', label: '高級・快適重視', icon: '✨' },
    { id: 'adventure', label: '冒険・体験重視', icon: '🎒' },
    { id: 'culture', label: '文化・歴史重視', icon: '🏛️' },
    { id: 'relaxed', label: 'のんびり・癒し重視', icon: '🌸' },
    { id: 'local', label: '地元体験重視', icon: '🏘️' },
    { id: 'foodie', label: 'グルメ重視', icon: '🍜' }
  ];

  const interestOptions = [
    '寺社仏閣', 'グルメ', 'ショッピング', 'アニメ・マンガ', '温泉',
    '自然・景色', 'アート・美術', 'ファッション', 'ナイトライフ',
    '伝統文化', 'テクノロジー', 'スポーツ'
  ];

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handlePaymentSuccess = () => {
    setHasAccess(true);
    setShowPaymentModal(false);
  };

  const handleStartMatching = async () => {
    if (!hasAccess) {
      setShowPaymentModal(true);
      return;
    }

    setCurrentStep('matching');
    setIsMatching(true);

    // Simulate matching algorithm
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Calculate match percentages based on preferences
    const coordinatorsWithMatches = sampleCoordinators.map(coordinator => ({
      ...coordinator,
      matchPercentage: Math.floor(Math.random() * 20) + 80 // 80-99% match
    })).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    setMatchedCoordinators(coordinatorsWithMatches);
    setIsMatching(false);
    setCurrentStep('results');
  };

  const renderPreferenceForm = () => (
    <div className="fade-in loading" style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '24px',
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{
        color: 'black',
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        Find the Perfect Coordinator for You
      </h2>
      <p style={{
        color: 'rgba(0, 0, 0, 0.7)',
        fontSize: '16px',
        marginBottom: '40px',
        textAlign: 'center',
        lineHeight: '1.6'
      }}>
        ご希望の旅行スタイルや興味に基づいて、最適な日本人コーディネーターをマッチングします
      </p>

      <div className="space-y-6">
        {/* 行き先 */}
        <div>
          <label style={{ color: 'black', fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
            行き先 <span style={{ color: '#FF6B9D' }}>*</span>
          </label>
          <select
            value={preferences.destination}
            onChange={(e) => setPreferences(prev => ({ ...prev, destination: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'black',
              fontSize: '14px'
            }}
          >
            <option value="">選択してください</option>
            <option value="tokyo">東京</option>
            <option value="osaka">大阪</option>
            <option value="kyoto">京都</option>
            <option value="yokohama">横浜</option>
            <option value="other">その他</option>
          </select>
        </div>

        {/* 旅行期間 */}
        <div>
          <label style={{ color: 'black', fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
            旅行期間 <span style={{ color: '#FF6B9D' }}>*</span>
          </label>
          <select
            value={preferences.duration}
            onChange={(e) => setPreferences(prev => ({ ...prev, duration: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'black',
              fontSize: '14px'
            }}
          >
            <option value="">選択してください</option>
            <option value="1day">1日</option>
            <option value="2-3days">2-3日</option>
            <option value="1week">1週間</option>
            <option value="2weeks">2週間以上</option>
          </select>
        </div>

        {/* 予算 */}
        <div>
          <label style={{ color: 'black', fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
            予算（1日あたり） <span style={{ color: '#FF6B9D' }}>*</span>
          </label>
          <select
            value={preferences.budget}
            onChange={(e) => setPreferences(prev => ({ ...prev, budget: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'black',
              fontSize: '14px'
            }}
          >
            <option value="">選択してください</option>
            <option value="budget">節約（〜5,000円）</option>
            <option value="standard">標準（5,000-15,000円）</option>
            <option value="premium">高級（15,000円〜）</option>
          </select>
        </div>

        {/* 旅行スタイル */}
        <div>
          <label style={{ color: 'black', fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
            旅行スタイル <span style={{ color: '#FF6B9D' }}>*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {travelStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setPreferences(prev => ({ ...prev, travelStyle: style.id }))}
                style={{
                  background: preferences.travelStyle === style.id
                    ? 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: preferences.travelStyle === style.id
                    ? 'none'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  color: preferences.travelStyle === style.id ? 'white' : 'black',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{style.icon}</div>
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* 興味・関心 */}
        <div>
          <label style={{ color: 'black', fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
            興味・関心（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                style={{
                  background: preferences.interests.includes(interest)
                    ? 'linear-gradient(135deg, #FF6B9D 0%, #4FACFE 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: preferences.interests.includes(interest)
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: preferences.interests.includes(interest) ? 'white' : 'black',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* グループサイズ */}
        <div>
          <label style={{ color: 'black', fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
            グループサイズ
          </label>
          <select
            value={preferences.groupSize}
            onChange={(e) => setPreferences(prev => ({ ...prev, groupSize: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'black',
              fontSize: '14px'
            }}
          >
            <option value="">選択してください</option>
            <option value="solo">一人旅</option>
            <option value="couple">カップル・夫婦</option>
            <option value="family">家族</option>
            <option value="friends">友人同士</option>
            <option value="group">グループ（5人以上）</option>
          </select>
        </div>

        {/* 希望言語 */}
        <div>
          <label style={{ color: 'black', fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
            希望言語
          </label>
          <select
            value={preferences.preferredLanguage}
            onChange={(e) => setPreferences(prev => ({ ...prev, preferredLanguage: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'black',
              fontSize: '14px'
            }}
          >
            <option value="">選択してください</option>
            <option value="japanese">日本語</option>
            <option value="english">英語</option>
            <option value="korean">韓国語</option>
            <option value="any">どれでも可</option>
          </select>
        </div>

        {/* 特別なリクエスト */}
        <div>
          <label style={{ color: 'black', fontSize: '16px', fontWeight: '600', marginBottom: '12px', display: 'block' }}>
            特別なリクエスト・質問
          </label>
          <textarea
            value={preferences.specialRequests}
            onChange={(e) => setPreferences(prev => ({ ...prev, specialRequests: e.target.value }))}
            placeholder="食事制限、アクセシビリティ、特別な希望などがあればお書きください"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'black',
              fontSize: '14px',
              minHeight: '100px',
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Premium Service Info */}
      {!hasAccess && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(79, 172, 254, 0.1) 100%)',
          border: '2px solid rgba(255, 107, 157, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          margin: '30px 0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🌟</div>
          <h3 style={{
            color: 'black',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            プレミアムコーディネーターサービス
          </h3>
          <p style={{
            color: 'rgba(0, 0, 0, 0.7)',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            AI専門コーディネーターによる完全カスタマイズされた旅行プラン作成<br/>
            24時間サポート付きで、あなたの理想の旅を実現します
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#FF6B9D',
              marginBottom: '8px'
            }}>
              ¥100,000
            </div>
            <div style={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: '14px'
            }}>
              1年間有効 / 無制限利用
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={handleStartMatching}
          disabled={!preferences.destination || !preferences.duration || !preferences.budget || !preferences.travelStyle}
          style={{
            background: preferences.destination && preferences.duration && preferences.budget && preferences.travelStyle
              ? hasAccess
                ? 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
                : 'linear-gradient(135deg, #FF6B9D 0%, #4FACFE 100%)'
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '16px 48px',
            fontSize: '18px',
            fontWeight: '700',
            cursor: preferences.destination && preferences.duration && preferences.budget && preferences.travelStyle ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            opacity: preferences.destination && preferences.duration && preferences.budget && preferences.travelStyle ? 1 : 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            margin: '0 auto'
          }}
        >
          {hasAccess ? (
            <>
              <i className="fas fa-search"></i>
              コーディネーターを探す
            </>
          ) : (
            <>
              <CreditCard size={20} />
              今すぐ購入してコーディネーターを探す
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderMatchingScreen = () => (
    <div className="text-center" style={{ padding: '80px 20px' }}>
      <div className="fade-in loading" style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '60px 40px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          fontSize: '60px',
          marginBottom: '30px',
          animation: 'pulse 2s infinite'
        }}>
          💕
        </div>

        <h2 style={{
          color: 'black',
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          最適なコーディネーターを探しています
        </h2>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '30px'
        }}>
          <div className="loading-dot" style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#4FACFE',
            animation: 'bounce 1.4s infinite ease-in-out both'
          }}></div>
          <div className="loading-dot" style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#4FACFE',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: '-0.32s'
          }}></div>
          <div className="loading-dot" style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#4FACFE',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: '-0.16s'
          }}></div>
        </div>

        <p style={{
          color: 'rgba(0, 0, 0, 0.7)',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          あなたの旅行スタイルと興味に基づいて、<br />
          最適なコーディネーターをマッチングしています...
        </p>
      </div>
    </div>
  );

  const renderCoordinatorCard = (coordinator: Coordinator, index: number) => (
    <div
      key={coordinator.id}
      className="fade-in loading"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${index * 0.2}s`
      }}
    >
      {/* Match percentage badge */}
      {coordinator.matchPercentage && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #FF6B9D 0%, #4FACFE 100%)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '700'
        }}>
          {coordinator.matchPercentage}% Match
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* Profile image */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundImage: `url(${coordinator.profileImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '3px solid rgba(255, 255, 255, 0.3)'
        }} />

        <div style={{ flex: 1 }}>
          <h3 style={{
            color: 'black',
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            {coordinator.name}
            <span style={{
              fontSize: '16px',
              color: 'rgba(0, 0, 0, 0.6)',
              fontWeight: '400',
              marginLeft: '8px'
            }}>
              ({coordinator.nameEn})
            </span>
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="fas fa-star" style={{ color: '#FFD700' }}></i>
              <span style={{ color: 'black', fontSize: '16px', fontWeight: '600' }}>
                {coordinator.rating}
              </span>
              <span style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px' }}>
                ({coordinator.reviewCount}件)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="fas fa-map-marker-alt" style={{ color: '#FF6B9D' }}></i>
              <span style={{ color: 'black', fontSize: '14px' }}>{coordinator.location}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="fas fa-calendar" style={{ color: '#4FACFE' }}></i>
              <span style={{ color: 'black', fontSize: '14px' }}>
                {coordinator.experience}年の経験
              </span>
            </div>
          </div>

          {/* Languages */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {coordinator.languages.map((lang) => (
              <span
                key={lang}
                style={{
                  background: 'rgba(79, 172, 254, 0.2)',
                  color: 'black',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {lang}
              </span>
            ))}
          </div>

          {/* Specialties */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {coordinator.specialties.map((specialty) => (
              <span
                key={specialty}
                style={{
                  background: 'rgba(255, 107, 157, 0.2)',
                  color: 'black',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Introduction */}
      <p style={{
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '20px'
      }}>
        {coordinator.introduction}
      </p>

      {/* Response time */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <i className="fas fa-clock" style={{ color: '#4FACFE' }}></i>
        <span style={{ color: 'rgba(0, 0, 0, 0.7)', fontSize: '14px' }}>
          返信速度: {coordinator.responseTime}
        </span>
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center'
      }}>
        <button style={{
          background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}>
          <i className="fas fa-comment"></i>
          メッセージを送る
        </button>

        <button style={{
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'black',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '25px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}>
          <i className="fas fa-user"></i>
          プロフィールを見る
        </button>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="animated-bg"></div>
      <div className="sakura-container" id="sakuraContainer"></div>

      <section className="hero min-h-screen">
        <div className="container">
          <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '40px' }}>

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="section-title" style={{ color: 'black', marginBottom: '20px' }}>
                <i className="fas fa-users" style={{
                  marginRight: '15px',
                  background: 'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}></i>
                コーディネーターマッチング
              </h1>
              <p className="section-subtitle" style={{ color: 'black', marginBottom: '60px' }}>
                あなたの旅行スタイルにぴったりの日本人コーディネーターと出会えます
              </p>
            </div>

            {/* Content based on current step */}
            {currentStep === 'form' && renderPreferenceForm()}
            {currentStep === 'matching' && renderMatchingScreen()}
            {currentStep === 'results' && (
              <div>
                <div className="text-center mb-8">
                  <h2 style={{
                    color: 'black',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '20px'
                  }}>
                    🎉 あなたにおすすめのコーディネーター
                  </h2>
                  <p style={{
                    color: 'rgba(0, 0, 0, 0.7)',
                    fontSize: '16px',
                    marginBottom: '40px'
                  }}>
                    {matchedCoordinators.length}名のコーディネーターが見つかりました
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {matchedCoordinators.map((coordinator, index) =>
                    renderCoordinatorCard(coordinator, index)
                  )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button
                    onClick={() => setCurrentStep('form')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'black',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '25px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
                    新しい条件で再検索
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </AuthGuard>
  );
}