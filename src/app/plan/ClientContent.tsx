'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

interface PlanFormData {
  destination: string;
  budget: string;
  duration: string;
  interests: string[];
  travelStyle: string;
  groupType: string;
}

export default function PlanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<PlanFormData>({
    destination: '',
    budget: '',
    duration: '',
    interests: [],
    travelStyle: '',
    groupType: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
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
          // Check if elements still exist and are properly connected
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
            // Silent fail - particle cleanup is non-critical
          }
        }
      }, (duration + delay) * 1000);
    }

    const sakuraInterval = setInterval(createSakura, 800);

    return () => {
      clearInterval(sakuraInterval);

      // Cleanup with improved error handling
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
        // Safe cleanup using innerHTML
        sakuraContainer.innerHTML = '';
      }
    };
  }, []);

  const interests = [
    { id: 'culture', label: '文化・歴史', icon: '🏛️' },
    { id: 'food', label: '食べ物', icon: '🍜' },
    { id: 'shopping', label: 'ショッピング', icon: '🛍️' },
    { id: 'nature', label: '自然・公園', icon: '🌳' },
    { id: 'entertainment', label: 'エンターテインメント', icon: '🎢' },
    { id: 'nightlife', label: 'ナイトライフ', icon: '🌙' },
  ];

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination || !formData.budget || !formData.duration) {
      alert('目的地、予算、滞在期間は必須です');
      return;
    }

    setIsGenerating(true);

    try {
      // 新しいルートベースのプラン生成API を使用
      const response = await fetch('/api/generate-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: formData.destination,
          budget: formData.budget,
          duration: formData.duration,
          interests: formData.interests,
          travelStyle: formData.travelStyle,
          groupType: formData.groupType
        }),
      });

      if (!response.ok) {
        throw new Error('プラン生成に失敗しました');
      }

      const result = await response.json();

      if (result.success && result.data) {
        // 結果ページに遷移
        const planDataEncoded = encodeURIComponent(JSON.stringify(result.data));
        router.push(`/plan/result?data=${planDataEncoded}`);
      } else {
        throw new Error(result.error || 'プラン生成に失敗しました');
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('プラン生成中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AuthGuard>
      <div className="animated-bg"></div>
      <div className="sakura-container" id="sakuraContainer"></div>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 data-translate="hero.title">AI旅行プラン作成</h1>
            <p data-translate="hero.subtitle">あなたの好みに合わせて、最適な旅行プランをAIが提案します</p>
          </div>
        </div>
      </section>

      {/* Plan Form Section */}
      <section className="features">
        <div className="container">
          <div className="plan-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit} style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '50px 40px' }}>
            {/* 目的地選択 */}
            <div className="form-section" style={{ marginBottom: '50px' }}>
              <label className="block text-lg font-semibold mb-6" style={{ color: 'black' }}>
                <i className="fas fa-map-marker-alt" style={{ color: '#FF6B6B', marginRight: '12px', fontSize: '20px' }}></i>
                目的地を選択してください
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['東京', '横浜', '埼玉', '千葉'].map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setFormData({...formData, destination: city})}
                    className="feature-card"
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: formData.destination === city ? '#4FACFE' : 'black',
                      background: formData.destination === city
                        ? 'rgba(79, 172, 254, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.destination === city
                        ? '2px solid rgba(79, 172, 254, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* 予算 */}
            <div className="form-section" style={{ marginBottom: '50px' }}>
              <label className="block text-lg font-semibold mb-6" style={{ color: 'black' }}>
                <i className="fas fa-yen-sign" style={{ color: '#4ECDC4', marginRight: '12px', fontSize: '20px' }}></i>
                予算範囲
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'budget', label: '節約（〜5,000円/日）' },
                  { value: 'standard', label: '標準（5,000円〜10,000円/日）' },
                  { value: 'luxury', label: 'プレミアム（10,000円〜/日）' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({...formData, budget: option.value})}
                    className="feature-card"
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: formData.budget === option.value ? '#4ECDC4' : 'black',
                      background: formData.budget === option.value
                        ? 'rgba(78, 205, 196, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.budget === option.value
                        ? '2px solid rgba(78, 205, 196, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 滞在期間 */}
            <div className="form-section" style={{ marginBottom: '50px' }}>
              <label className="block text-lg font-semibold mb-6" style={{ color: 'black' }}>
                <i className="fas fa-clock" style={{ color: '#A29BFE', marginRight: '12px', fontSize: '20px' }}></i>
                滞在期間
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '1day', label: '1日' },
                  { value: '2-3days', label: '2-3日' },
                  { value: '4-7days', label: '4-7日' },
                  { value: '1week+', label: '1週間以上' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({...formData, duration: option.value})}
                    className="feature-card"
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: formData.duration === option.value ? '#A29BFE' : 'black',
                      background: formData.duration === option.value
                        ? 'rgba(162, 155, 254, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.duration === option.value
                        ? '2px solid rgba(162, 155, 254, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 興味・関心 */}
            <div className="form-section" style={{ marginBottom: '50px' }}>
              <label className="block text-lg font-semibold mb-6" style={{ color: 'black' }}>
                <i className="fas fa-heart" style={{ color: '#FD79A8', marginRight: '12px', fontSize: '20px' }}></i>
                興味・関心（複数選択可）
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {interests.map(interest => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleInterestToggle(interest.id)}
                    className="feature-card"
                    style={{
                      padding: '25px 20px',
                      textAlign: 'center',
                      color: formData.interests.includes(interest.id) ? '#FD79A8' : 'black',
                      background: formData.interests.includes(interest.id)
                        ? 'rgba(253, 121, 168, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.interests.includes(interest.id)
                        ? '2px solid rgba(253, 121, 168, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span className="text-2xl mb-2 block">{interest.icon}</span>
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 旅行スタイル */}
            <div className="form-section" style={{ marginBottom: '50px' }}>
              <label className="block text-lg font-semibold mb-6" style={{ color: 'black' }}>
                <i className="fas fa-route" style={{ color: '#667EEA', marginRight: '12px', fontSize: '20px' }}></i>
                旅行スタイル
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'relaxed', label: 'のんびり', desc: 'ゆっくり観光' },
                  { value: 'active', label: 'アクティブ', desc: '多くの場所を巡る' },
                  { value: 'flexible', label: 'フレキシブル', desc: '臨機応変に' }
                ].map(style => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => setFormData({...formData, travelStyle: style.value})}
                    className="feature-card"
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: formData.travelStyle === style.value ? '#667EEA' : 'black',
                      background: formData.travelStyle === style.value
                        ? 'rgba(102, 126, 234, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.travelStyle === style.value
                        ? '2px solid rgba(102, 126, 234, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="font-semibold">{style.label}</div>
                    <div className="text-sm" style={{ opacity: 0.7, marginTop: '8px' }}>{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* グループタイプ */}
            <div className="form-section" style={{ marginBottom: '50px' }}>
              <label className="block text-lg font-semibold mb-6" style={{ color: 'black' }}>
                <i className="fas fa-users" style={{ color: '#FDCB6E', marginRight: '12px', fontSize: '20px' }}></i>
                グループタイプ
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'solo', label: '一人旅' },
                  { value: 'couple', label: 'カップル' },
                  { value: 'family', label: '家族' },
                  { value: 'friends', label: '友人' }
                ].map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, groupType: type.value})}
                    className="feature-card"
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: formData.groupType === type.value ? '#FDCB6E' : 'black',
                      background: formData.groupType === type.value
                        ? 'rgba(253, 203, 110, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.groupType === type.value
                        ? '2px solid rgba(253, 203, 110, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex flex-col items-center space-y-6" style={{ marginTop: '60px' }}>
              <button
                type="submit"
                disabled={!formData.destination || !formData.budget || !formData.duration || isGenerating}
                className="btn btn-primary"
                style={{
                  opacity: !formData.destination || !formData.budget || !formData.duration ? 0.5 : 1,
                  cursor: !formData.destination || !formData.budget || !formData.duration ? 'not-allowed' : 'pointer',
                  background: isGenerating
                    ? 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
                    : 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                  padding: '18px 36px',
                  fontSize: '16px'
                }}
              >
                {isGenerating ? (
                  <span className="flex items-center" style={{ color: 'white' }}>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AIプラン生成中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <i className="fas fa-magic mr-2"></i>
                    AIプランを生成する
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-secondary"
                style={{ fontSize: '14px', padding: '12px 24px' }}
              >
                戻る
              </button>
            </div>
          </form>
          </div>
        </div>
      </section>
    </AuthGuard>
  );
}