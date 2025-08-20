'use client';

import { useEffect, useState } from 'react';
import AnimationClient from '@/components/AnimationClient';

interface Tweet {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
  createdAt: string;
  metrics: {
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
  };
  hashtags: string[];
  mentions: string[];
  urls: string[];
  contextAnnotations: any[];
  category?: 'traffic' | 'weather' | 'events' | 'food' | 'sightseeing' | 'emergency';
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'traffic': return 'bg-red-100 text-red-800';
      case 'weather': return 'bg-blue-100 text-blue-800';
      case 'events': return 'bg-purple-100 text-purple-800';
      case 'food': return 'bg-orange-100 text-orange-800';
      case 'sightseeing': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'traffic': return '交通情報';
      case 'weather': return '天気';
      case 'events': return 'イベント';
      case 'food': return 'グルメ';
      case 'sightseeing': return '観光';
      case 'emergency': return '緊急情報';
      default: return 'その他';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="feature-card fade-in">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
          {tweet.author.avatar || tweet.author.displayName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <h3 className="font-bold text-gray-900 text-lg">{tweet.author.displayName}</h3>
            <span className="text-gray-500">@{tweet.author.username}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 text-sm">{formatDate(tweet.createdAt)}</span>
            {tweet.category && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(tweet.category)}`}>
                {getCategoryLabel(tweet.category)}
              </span>
            )}
          </div>
          
          <p className="text-gray-800 mb-4 leading-relaxed text-base">{tweet.content}</p>
          
          {tweet.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tweet.hashtags.map((hashtag, index) => (
                <span key={index} className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer bg-blue-50 px-2 py-1 rounded">
                  #{hashtag}
                </span>
              ))}
            </div>
          )}
          
          {tweet.urls.length > 0 && (
            <div className="mb-4">
              {tweet.urls.map((url, index) => (
                <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm block truncate bg-gray-50 p-2 rounded">
                  🔗 {url}
                </a>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-8 text-gray-500 text-sm pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{tweet.metrics.replies}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-600 cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{tweet.metrics.retweets}</span>
            </div>
            <div className="flex items-center gap-2 hover:text-red-600 cursor-pointer transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{tweet.metrics.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RealtimeContent() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const categorizeByKeywords = (content: string, hashtags: string[]): Tweet['category'] => {
    const text = content.toLowerCase() + ' ' + hashtags.join(' ').toLowerCase();
    
    if (text.includes('電車') || text.includes('地下鉄') || text.includes('バス') || text.includes('交通') || text.includes('遅延') || text.includes('運行')) {
      return 'traffic';
    }
    if (text.includes('天気') || text.includes('雨') || text.includes('晴れ') || text.includes('曇り') || text.includes('台風')) {
      return 'weather';
    }
    if (text.includes('イベント') || text.includes('祭り') || text.includes('ライトアップ') || text.includes('コンサート')) {
      return 'events';
    }
    if (text.includes('グルメ') || text.includes('レストラン') || text.includes('寿司') || text.includes('食事') || text.includes('美味し')) {
      return 'food';
    }
    if (text.includes('観光') || text.includes('旅行') || text.includes('スポット') || text.includes('桜') || text.includes('神社') || text.includes('寺')) {
      return 'sightseeing';
    }
    return undefined;
  };

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/twitter?q=#東京 OR #横浜 OR #Tokyo OR #Yokohama OR #東京観光 OR #横浜観光 OR #東京旅行 OR #横浜旅行&count=10');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }
      
      const data = await response.json();
      
      if (data.tweets) {
        const categorizedTweets = data.tweets.map((tweet: Tweet) => ({
          ...tweet,
          category: categorizeByKeywords(tweet.content, tweet.hashtags)
        }));
        
        setTweets(categorizedTweets);
        setLastUpdate(new Date().toLocaleString('ja-JP'));
        
        // フォールバックデータを使用している場合の通知
        if (data.fallback) {
          console.log('Using fallback data:', data.error || 'Twitter API not available');
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError('ツイートの取得に失敗しました。サンプルデータを表示しています。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
    
    // 15分ごとに自動更新（レート制限を回避）
    const interval = setInterval(fetchTweets, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredTweets = selectedCategory === 'all' 
    ? tweets 
    : tweets.filter(tweet => tweet.category === selectedCategory);

  return (
    <>
      <AnimationClient />
      <div className="animated-bg"></div>
      <div className="sakura-container" id="sakuraContainer"></div>
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>📡 リアルタイム情報</h1>
            <p>Twitter/Xからの最新旅行情報、交通状況、天気、イベント情報などをリアルタイムでお届けします。旅行中の最新情報収集にご活用ください。</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          {/* Filter Section */}
          <div className="feature-card fade-in" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div className="feature-icon">🔍</div>
            <h3>カテゴリーフィルター</h3>
            <div className="flex flex-wrap gap-4 justify-center" style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                すべて
              </button>
              <button 
                onClick={() => setSelectedCategory('traffic')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'traffic' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🚇 交通情報
              </button>
              <button 
                onClick={() => setSelectedCategory('weather')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'weather' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🌤️ 天気
              </button>
              <button 
                onClick={() => setSelectedCategory('events')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'events' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🎪 イベント
              </button>
              <button 
                onClick={() => setSelectedCategory('food')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'food' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🍣 グルメ
              </button>
              <button 
                onClick={() => setSelectedCategory('sightseeing')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'sightseeing' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                ⛩️ 観光
              </button>
            </div>
          </div>

          {/* Status Section */}
          <div className="feature-card fade-in" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div className="feature-icon">🔄</div>
            <h3>更新ステータス</h3>
            <div className="flex items-center justify-center gap-3" style={{ marginTop: '20px' }}>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-blue-800 font-medium">リアルタイム更新中</span>
              {lastUpdate && (
                <span className="text-blue-600 text-sm">最終更新: {lastUpdate}</span>
              )}
              <button 
                onClick={fetchTweets}
                disabled={loading}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? '更新中...' : '手動更新'}
              </button>
            </div>
          </div>

          {/* Content */}
          {loading && tweets.length === 0 ? (
            <div className="feature-card fade-in text-center">
              <div className="feature-icon">⏳</div>
              <h3>読み込み中</h3>
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto my-4"></div>
              <p>最新のツイート情報を取得中...</p>
            </div>
          ) : error ? (
            <div className="feature-card fade-in text-center">
              <div className="feature-icon">❌</div>
              <h3>エラーが発生しました</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchTweets}
                className="btn btn-primary"
              >
                再試行
              </button>
            </div>
          ) : (
            <>
              <h2 className="section-title fade-in">最新のツイート情報</h2>
              <p className="section-subtitle fade-in">旅行に役立つリアルタイム情報をお届けします</p>
              
              {/* デバッグ情報 */}
              <div className="feature-card fade-in" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div className="feature-icon">📊</div>
                <h3>データ状況</h3>
                <p style={{ marginTop: '10px' }}>
                  総ツイート数: {tweets.length} | フィルター後: {filteredTweets.length} | 選択中: {selectedCategory}
                </p>
              </div>

              <div className="features-grid">
                {filteredTweets.length === 0 ? (
                  <div className="feature-card fade-in text-center">
                    <div className="feature-icon">🔍</div>
                    <h3>ツイートが見つかりません</h3>
                    <p>選択したカテゴリーのツイートが見つかりませんでした。「すべて」を選択してお試しください。</p>
                  </div>
                ) : (
                  filteredTweets.map((tweet) => (
                    <TweetCard key={tweet.id} tweet={tweet} />
                  ))
                )}
              </div>

              {/* Load More Button */}
              <div className="text-center" style={{ marginTop: '60px' }}>
                <button 
                  onClick={fetchTweets}
                  className="btn btn-primary"
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>最新情報を更新</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}