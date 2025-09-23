'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimationClient from '@/components/AnimationClient';

interface SpotQuery {
  id: string;
  name: string;
  nameEn: string;
  hashtags: string[];
  keywords: string[];
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  blacklistKeywords: string[];
}

interface Tweet {
  id: string;
  content: string;
  translatedContent?: string;
  originalLang?: string;
  summary?: string;
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
    views?: number;
  };
  hashtags: string[];
  mentions: string[];
  urls: string[];
  media?: {
    type: 'photo' | 'video' | 'gif';
    url: string;
    thumbnailUrl?: string;
    alt?: string;
  }[];
  contextAnnotations: any[];
  category?: 'traffic' | 'weather' | 'events' | 'food' | 'sightseeing' | 'emergency';
  relevanceScore?: number;
  spotId?: string;
  lang?: string;
  geo?: {
    lat: number;
    lng: number;
  };
  isRetweet?: boolean;
  retweetOf?: string;
}

function TweetCard({ tweet, displayLang }: { tweet: Tweet; displayLang: string }) {
  const { t, currentLanguage } = useLanguage();
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
      case 'traffic': return t('realtime.categories.traffic');
      case 'weather': return t('realtime.categories.weather');
      case 'events': return t('realtime.categories.events');
      case 'food': return t('realtime.categories.food');
      case 'sightseeing': return t('realtime.categories.sightseeing');
      case 'emergency': return t('realtime.categories.emergency') || 'Emergency';
      default: return t('realtime.categories.other') || 'Other';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localeMap: Record<string, string> = {
      ja: 'ja-JP',
      en: 'en-US',
      ko: 'ko-KR',
      fr: 'fr-FR',
      ar: 'ar-SA',
    };
    return date.toLocaleString(localeMap[currentLanguage] || 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getDisplayContent = () => {
    if (displayLang !== 'ja' && tweet.translatedContent) {
      return tweet.translatedContent;
    }
    return tweet.summary || tweet.content;
  };
  
  const shouldShowOriginal = () => {
    return displayLang !== 'ja' && tweet.translatedContent && tweet.originalLang !== displayLang;
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
            {tweet.lang && tweet.lang !== 'ja' && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {tweet.lang.toUpperCase()}
              </span>
            )}
            {tweet.category && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(tweet.category)}`}>
                {getCategoryLabel(tweet.category)}
              </span>
            )}
            {tweet.relevanceScore && tweet.relevanceScore > 10 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ★ {t('realtime.badge.featured')}
              </span>
            )}
          </div>
          
          <p className="text-gray-800 mb-2 leading-relaxed text-base">{getDisplayContent()}</p>
          
          {shouldShowOriginal() && (
            <details className="mb-3">
              <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">{t('realtime.tweet.showOriginal')}</summary>
              <p className="text-gray-700 text-sm mt-2 p-3 bg-gray-50 rounded">{tweet.content}</p>
            </details>
          )}
          
          {tweet.media && tweet.media.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {tweet.media.slice(0, 4).map((media, index) => (
                <div key={index} className="relative">
                  {media.type === 'photo' ? (
                    <img
                      src={media.thumbnailUrl || media.url}
                      alt={media.alt || 'Media content'}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(media.url, '_blank')}
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                         onClick={() => window.open(media.url, '_blank')}>
                      <span className="text-gray-600 font-medium">
                        {media.type === 'video' ? `🎥 ${t('realtime.media.video')}` : `🎬 ${t('realtime.media.gif')}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
              {tweet.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tweet.hashtags.slice(0, 5).map((hashtag, index) => (
                <span key={index} className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer bg-blue-50 px-2 py-1 rounded">
                  #{hashtag}
                </span>
              ))}
              {tweet.hashtags.length > 5 && (
                <span className="text-gray-500 text-sm">+{tweet.hashtags.length - 5} {t('realtime.more')}</span>
              )}
            </div>
          )}
          
              {tweet.urls.length > 0 && (
            <div className="mb-4">
              {tweet.urls.slice(0, 2).map((url, index) => (
                <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm block truncate bg-gray-50 p-2 rounded mb-1">
                  🔗 {url}
                </a>
              ))}
              {tweet.urls.length > 2 && (
                <span className="text-gray-500 text-sm">+{tweet.urls.length - 2} {t('realtime.moreLinks')}</span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{tweet.metrics.replies}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-green-600 cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{tweet.metrics.retweets}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-red-600 cursor-pointer transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{tweet.metrics.likes}</span>
              </div>
              {tweet.metrics.views && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{tweet.metrics.views.toLocaleString()}</span>
                </div>
              )}
            </div>
            {tweet.relevanceScore && (
              <div className="text-xs text-gray-400">
                Score: {tweet.relevanceScore.toFixed(1)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const SPOTS: SpotQuery[] = [
  {
    id: 'tokyo',
    name: '東京',
    nameEn: 'Tokyo',
    hashtags: ['#東京', '#Tokyo', '#東京観光', '#東京旅行', '#TokyoTravel'],
    keywords: ['東京', 'Tokyo', '浅草', 'Asakusa', '新宿', 'Shinjuku', '渋谷', 'Shibuya', '原宿', 'Harajuku', '上野', 'Ueno'],
    blacklistKeywords: ['東京駅弁当', 'スパム', '宣伝'],
    location: { lat: 35.6762, lng: 139.6503, radius: 50000 }
  },
  {
    id: 'kyoto',
    name: '京都',
    nameEn: 'Kyoto',
    hashtags: ['#京都', '#Kyoto', '#京都観光', '#京都旅行', '#KyotoTravel'],
    keywords: ['京都', 'Kyoto', '清水寺', 'Kiyomizu', '金閣寺', 'Kinkaku', '嵐山', 'Arashiyama', '祇園', 'Gion'],
    blacklistKeywords: ['スパム', '宣伝'],
    location: { lat: 35.0116, lng: 135.7681, radius: 30000 }
  },
  {
    id: 'osaka',
    name: '大阪',
    nameEn: 'Osaka',
    hashtags: ['#大阪', '#Osaka', '#大阪観光', '#大阪旅行', '#OsakaTravel'],
    keywords: ['大阪', 'Osaka', '道頓堀', 'Dotonbori', '大阪城', 'Osaka Castle', 'USJ', 'Universal Studios'],
    blacklistKeywords: ['スパム', '宣伝'],
    location: { lat: 34.6937, lng: 135.5023, radius: 30000 }
  },
  {
    id: 'yokohama',
    name: '横浜',
    nameEn: 'Yokohama',
    hashtags: ['#横浜', '#Yokohama', '#横浜観光', '#横浜旅行'],
    keywords: ['横浜', 'Yokohama', 'みなとみらい', 'Minato Mirai', '赤レンガ', '中華街', 'Chinatown'],
    blacklistKeywords: ['スパム', '宣伝'],
    location: { lat: 35.4438, lng: 139.6380, radius: 20000 }
  },
  {
    id: 'nara',
    name: '奈良',
    nameEn: 'Nara',
    hashtags: ['#奈良', '#Nara', '#奈良観光', '#奈良旅行'],
    keywords: ['奈良', 'Nara', '奈良公園', 'Nara Park', '東大寺', 'Todaiji', '春日大社', 'Kasuga'],
    blacklistKeywords: ['スパム', '宣伝'],
    location: { lat: 34.6851, lng: 135.8050, radius: 20000 }
  }
];

interface FilterOptions {
  languages: string[];
  hasMedia: boolean;
  minLikes: number;
  minRetweets: number;
  showRetweets: boolean;
  sortBy: 'recent' | 'popular' | 'relevant';
}

export default function RealtimeContent() {
  const { t, currentLanguage } = useLanguage();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpot, setSelectedSpot] = useState<string>('tokyo');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [displayLang, setDisplayLang] = useState<string>('ja');
  const [spotSearch, setSpotSearch] = useState<string>('');
  const [isSpotDropdownOpen, setIsSpotDropdownOpen] = useState<boolean>(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [filters, setFilters] = useState<FilterOptions>({
    languages: ['ja', 'en'],
    hasMedia: false,
    minLikes: 0,
    minRetweets: 0,
    showRetweets: true,
    sortBy: 'recent'
  });
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Make fade-in elements visible on mount (staggered)
  useEffect(() => {
    try {
      const elements = Array.from(document.querySelectorAll('.fade-in')) as HTMLElement[];
      elements.forEach((el, idx) => {
        setTimeout(() => {
          el.classList.add('visible');
        }, 120 + idx * 80);
      });
    } catch {}
  }, []);

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

  const getCurrentSpot = () => SPOTS.find(spot => spot.id === selectedSpot) || SPOTS[0];
  
  const buildSearchQuery = (spot: SpotQuery) => {
    const hashtagQuery = spot.hashtags.join(' OR ');
    const keywordQuery = spot.keywords.map(k => `"${k}"`).join(' OR ');
    const blacklistQuery = spot.blacklistKeywords.map(k => `-"${k}"`).join(' ');
    return `(${hashtagQuery}) OR (${keywordQuery}) ${blacklistQuery}`;
  };
  
  const calculateRelevanceScore = (tweet: Tweet, spot: SpotQuery): number => {
    let score = 0;
    const content = (tweet.content + ' ' + tweet.hashtags.join(' ')).toLowerCase();
    
    // Hashtag matches (highest weight)
    spot.hashtags.forEach(hashtag => {
      if (content.includes(hashtag.toLowerCase().replace('#', ''))) {
        score += 10;
      }
    });
    
    // Keyword matches
    spot.keywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        score += 5;
      }
    });
    
    // Engagement score
    score += (tweet.metrics.likes * 0.1) + (tweet.metrics.retweets * 0.2);
    
    // Recency score (newer tweets get higher score)
    const hoursAgo = (Date.now() - new Date(tweet.createdAt).getTime()) / (1000 * 60 * 60);
    score += Math.max(0, 24 - hoursAgo) * 0.5;
    
    // Media bonus
    if (tweet.media && tweet.media.length > 0) {
      score += 3;
    }
    
    // Blacklist penalty
    spot.blacklistKeywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        score -= 20;
      }
    });
    
    return Math.max(0, score);
  };
  
  const translateContent = async (content: string, fromLang: string, toLang: string): Promise<string> => {
    if (fromLang === toLang) return content;
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          from: fromLang,
          to: toLang
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.translatedText || content;
      }
    } catch (error) {
      console.log('Translation API not available, using original content');
    }
    
    return content;
  };
  
  const summarizeContent = (content: string): string => {
    if (content.length <= 140) return content;
    
    // Remove hashtags and mentions for summary
    let summary = content.replace(/#\w+/g, '').replace(/@\w+/g, '').trim();
    
    // Truncate to approximately 140 characters
    if (summary.length > 140) {
      summary = summary.substring(0, 137) + '...';
    }
    
    return summary;
  };
  
  const processTweets = async (rawTweets: any[]): Promise<Tweet[]> => {
    const spot = getCurrentSpot();
    
    const processedTweets = await Promise.all(
      rawTweets.map(async (tweet) => {
        const relevanceScore = calculateRelevanceScore(tweet, spot);
        const category = categorizeByKeywords(tweet.content, tweet.hashtags);
        
        let translatedContent = tweet.content;
        if (displayLang !== 'ja' && tweet.lang && tweet.lang !== displayLang) {
          translatedContent = await translateContent(tweet.content, tweet.lang, displayLang);
        }
        
        return {
          ...tweet,
          category,
          relevanceScore,
          spotId: spot.id,
          translatedContent,
          summary: summarizeContent(translatedContent),
        };
      })
    );
    
    // Filter out low relevance tweets
    return processedTweets.filter(tweet => tweet.relevanceScore && tweet.relevanceScore > 2);
  };

  // フォールバックデータ生成関数
  const generateFallbackTweets = (spot: SpotLocation, category: string) => {
    const baseData = [
      {
        id: '1',
        text: `${spot.name}の夕日が綺麗です！今日は特に美しい夜景が見られそうです 🌅 #東京観光 #${spot.name}`,
        author: '東京観光ガイド',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        location: spot.name,
        category: 'sightseeing'
      },
      {
        id: '2',
        text: `${spot.name}周辺のカフェでランチ中。景色も料理も最高です！ ☕️ #グルメ #${spot.name}`,
        author: 'TokyoFoodie',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        location: spot.name,
        category: 'food'
      },
      {
        id: '3',
        text: `${spot.name}への電車、現在正常運行中です。交通状況良好です 🚇`,
        author: '交通情報Bot',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        location: spot.name,
        category: 'traffic'
      },
      {
        id: '4',
        text: `今日の${spot.name}周辺は晴れ、気温22度。観光には絶好の天気です ☀️`,
        author: '天気予報',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        location: spot.name,
        category: 'weather'
      }
    ];

    // カテゴリでフィルタリング
    if (category && category !== 'all') {
      return baseData.filter(tweet => tweet.category === category);
    }

    return baseData;
  };

  const fetchTweets = async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (!append) {
        setLoading(true);
      }

      const spot = getCurrentSpot();
      const query = buildSearchQuery(spot);

      // API エンドポイントが存在しない場合のフォールバック
      // 現在は存在しないAPIを呼び出そうとしているため、ダミーデータを生成
      await new Promise(resolve => setTimeout(resolve, 1000)); // API呼び出しのシミュレーション

      // フォールバックデータを生成
      const fallbackTweets = generateFallbackTweets(spot, selectedCategory);
      const processedTweets = await processTweets(fallbackTweets);

      if (append) {
        setTweets(prev => [...prev, ...processedTweets]);
      } else {
        setTweets(processedTweets);
      }

      setLastUpdate(new Date().toLocaleString('ja-JP'));
      setHasMore(pageNum < 3); // 3ページまでにシミュレート

      setError(null);
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError('ツイートの取得に失敗しました。サンプルデータを表示しています。');

      // エラー時もフォールバックデータを表示
      const spot = getCurrentSpot();
      const fallbackTweets = generateFallbackTweets(spot, selectedCategory);
      const processedTweets = await processTweets(fallbackTweets);

      if (append) {
        setTweets(prev => [...prev, ...processedTweets]);
      } else {
        setTweets(processedTweets);
      }

      setLastUpdate(new Date().toLocaleString('ja-JP'));
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const setupSSE = () => {
    if (eventSource) {
      eventSource.close();
    }
    
    if (!autoUpdate) {
      setConnectionStatus('disconnected');
      return;
    }
    
    // For now, use polling instead of SSE since the endpoint doesn't exist yet
    setConnectionStatus('connected');
    
    const pollForUpdates = async () => {
      try {
        await fetchTweets(1, false);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Polling error:', error);
        setConnectionStatus('disconnected');
      }
    };
    
    // Poll every 2 minutes when auto-update is enabled
    const interval = setInterval(pollForUpdates, 2 * 60 * 1000);
    
    // Store interval ID in eventSource for cleanup
    setEventSource({ close: () => clearInterval(interval) } as EventSource);
  };
  
  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTweets(nextPage, true);
    }
  };
  
  useEffect(() => {
    fetchTweets(1, false);
    
    if (autoUpdate) {
      setupSSE();
    }
    
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [selectedSpot, filters, autoUpdate]);
  
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const sortTweets = (tweetsToSort: Tweet[]) => {
    const sorted = [...tweetsToSort].sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          const aEngagement = (a.metrics.likes || 0) + (a.metrics.retweets || 0) * 2;
          const bEngagement = (b.metrics.likes || 0) + (b.metrics.retweets || 0) * 2;
          return bEngagement - aEngagement;
        case 'relevant':
          return (b.relevanceScore || 0) - (a.relevanceScore || 0);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return sorted;
  };
  
  const applyFilters = (tweetsToFilter: Tweet[]) => {
    let filtered = tweetsToFilter;
    
    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tweet => tweet.category === selectedCategory);
    }
    
    // Engagement filters
    if (filters.minLikes > 0) {
      filtered = filtered.filter(tweet => (tweet.metrics.likes || 0) >= filters.minLikes);
    }
    
    if (filters.minRetweets > 0) {
      filtered = filtered.filter(tweet => (tweet.metrics.retweets || 0) >= filters.minRetweets);
    }
    
    // Media filter
    if (filters.hasMedia) {
      filtered = filtered.filter(tweet => tweet.media && tweet.media.length > 0);
    }
    
    // Retweet filter
    if (!filters.showRetweets) {
      filtered = filtered.filter(tweet => !tweet.isRetweet);
    }
    
    // Language filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter(tweet => 
        !tweet.lang || filters.languages.includes(tweet.lang)
      );
    }
    
    return filtered;
  };
  
  const filteredTweets = sortTweets(applyFilters(tweets));

  return (
    <div data-realtime-wrapper suppressHydrationWarning>
      <AnimationClient />
      {/* Dedicated onsen background layer (fixed, non-interactive) */}
      <div className="realtime-bg-onsen" aria-hidden="true"></div>
      <div className="animated-bg"></div>
      <div className="sakura-container" id="sakuraContainer"></div>
      
      {/* Hero Section */}
      <section className="hero" suppressHydrationWarning>
        <div className="container">
          <div className="hero-content">
            <h1 style={{ color: '#ffffff' }}>{t('realtime.hero.title')}</h1>
            <p style={{ color: 'rgba(255,255,255,0.95)' }}>{t('realtime.hero.desc')}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" suppressHydrationWarning>
        <div className="container" suppressHydrationWarning>
          {/* Spot Selection */}
          <div className="feature-card fade-in" style={{ marginBottom: '40px' }} suppressHydrationWarning>
            <div className="feature-icon">📍</div>
            <h3>{t('realtime.spotSelection.title')}</h3>
            <div className="relative" style={{ marginTop: '20px' }}>
              <button
                onClick={() => setIsSpotDropdownOpen(!isSpotDropdownOpen)}
                className="w-full max-w-md mx-auto flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{SPOTS.find(s => s.id === selectedSpot)?.id === 'tokyo' ? '🗼' : SPOTS.find(s => s.id === selectedSpot)?.id === 'kyoto' ? '⛩️' : SPOTS.find(s => s.id === selectedSpot)?.id === 'osaka' ? '🏯' : SPOTS.find(s => s.id === selectedSpot)?.id === 'yokohama' ? '🌉' : '🦌'}</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{getCurrentSpot().name}</div>
                    <div className="text-sm text-gray-500">{getCurrentSpot().nameEn}</div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isSpotDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSpotDropdownOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {SPOTS.filter(spot => 
                    spotSearch === '' || 
                    spot.name.toLowerCase().includes(spotSearch.toLowerCase()) ||
                    spot.nameEn.toLowerCase().includes(spotSearch.toLowerCase())
                  ).map((spot) => (
                    <button
                      key={spot.id}
                      onClick={() => {
                        setSelectedSpot(spot.id);
                        setIsSpotDropdownOpen(false);
                        setPage(1);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedSpot === spot.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      <span className="text-2xl">{spot.id === 'tokyo' ? '🗼' : spot.id === 'kyoto' ? '⛩️' : spot.id === 'osaka' ? '🏯' : spot.id === 'yokohama' ? '🌉' : '🦌'}</span>
                      <div>
                        <div className="font-semibold">{spot.name}</div>
                        <div className="text-sm text-gray-500">{spot.nameEn}</div>
                        <div className="text-xs text-gray-400">{spot.hashtags.slice(0, 3).join(' ')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Language & Filter Options */}
          <div className="feature-card fade-in" style={{ marginBottom: '40px' }} suppressHydrationWarning>
            <div className="feature-icon">🔧</div>
            <h3>{t('realtime.displaySettings.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: '20px' }}>
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('realtime.displaySettings.displayLanguage')}</label>
                <select
                  value={displayLang}
                  onChange={(e) => setDisplayLang(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="ja">{t('lang.ja')}</option>
                  <option value="en">{t('lang.en')}</option>
                  <option value="ko">{t('lang.ko')}</option>
                  <option value="zh">{t('lang.zh')}</option>
                </select>
              </div>
              
              {/* Auto Update Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('realtime.autoUpdate')}</label>
                <button
                  onClick={() => setAutoUpdate(!autoUpdate)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    autoUpdate 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${autoUpdate ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span>{autoUpdate ? t('realtime.on') : t('realtime.off')}</span>
                </button>
              </div>
            </div>
            
            {/* Advanced Filters */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasMedia}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasMedia: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{t('realtime.filters.mediaPreferred')}</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!filters.showRetweets}
                    onChange={(e) => setFilters(prev => ({ ...prev, showRetweets: !e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{t('realtime.filters.excludeRetweets')}</span>
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('realtime.filters.minLikes')}</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minLikes}
                    onChange={(e) => setFilters(prev => ({ ...prev, minLikes: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('realtime.filters.minRetweets')}</label>
                  <input
                    type="number"
                    min="0"
                    value={filters.minRetweets}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRetweets: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('realtime.filters.sortBy')}</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="recent">{t('realtime.sort.recent')}</option>
                    <option value="popular">{t('realtime.sort.popular')}</option>
                    <option value="relevant">{t('realtime.sort.relevant')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="feature-card fade-in" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div className="feature-icon">🔍</div>
            <h3>{t('realtime.categoryFilter.title')}</h3>
            <div className="flex flex-wrap gap-3 justify-center" style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {t('realtime.categories.all')}
              </button>
              <button 
                onClick={() => setSelectedCategory('traffic')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'traffic' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🚇 {t('realtime.categories.traffic')}
              </button>
              <button 
                onClick={() => setSelectedCategory('weather')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'weather' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🌤️ {t('realtime.categories.weather')}
              </button>
              <button 
                onClick={() => setSelectedCategory('events')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'events' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🎪 {t('realtime.categories.events')}
              </button>
              <button 
                onClick={() => setSelectedCategory('food')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'food' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                🍣 {t('realtime.categories.food')}
              </button>
              <button 
                onClick={() => setSelectedCategory('sightseeing')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'sightseeing' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                ⛩️ {t('realtime.categories.sightseeing')}
              </button>
            </div>
          </div>

          {/* Status Section */}
          <div className="feature-card fade-in" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div className="feature-icon">🔄</div>
            <h3>{t('realtime.status.title')}</h3>
            <div className="flex flex-wrap items-center justify-center gap-3" style={{ marginTop: '20px' }}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                  connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`}></div>
                <span className="text-blue-800 font-medium">
                  {connectionStatus === 'connected' && autoUpdate ? t('realtime.status.liveUpdating') :
                   connectionStatus === 'connecting' ? t('realtime.status.connecting') :
                   autoUpdate ? t('realtime.status.reconnecting') : t('realtime.status.offline')}
                </span>
              </div>
              {lastUpdate && (
                <span className="text-blue-600 text-sm">{t('realtime.status.lastUpdate')}: {lastUpdate}</span>
              )}
              <button 
                onClick={() => fetchTweets(1, false)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? t('realtime.status.refreshing') : t('realtime.status.manualRefresh')}
              </button>
            </div>
          </div>

          {/* Content */}
          {loading && tweets.length === 0 ? (
            <div className="feature-card fade-in text-center">
              <div className="feature-icon">⏳</div>
              <h3>{t('realtime.loading.title')}</h3>
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto my-4"></div>
              <p>{t('realtime.loading.message')}</p>
            </div>
          ) : error ? (
            <div className="feature-card fade-in text-center">
              <div className="feature-icon">❌</div>
              <h3>{t('realtime.error.title')}</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchTweets}
                className="btn btn-primary"
              >
                {t('realtime.error.retry')}
              </button>
            </div>
          ) : (
            <>
              <h2 className="section-title fade-in">{t('realtime.section.latestTweetsTitle')}</h2>
              <p className="section-subtitle fade-in">{t('realtime.section.latestTweetsSubtitle')}</p>
              
              {/* Stats */}
              <div className="feature-card fade-in" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div className="feature-icon">📊</div>
                <h3>{t('realtime.stats.title')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginTop: '20px' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{tweets.length}</div>
                    <div className="text-sm text-gray-600">{t('realtime.stats.totalTweets')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{filteredTweets.length}</div>
                    <div className="text-sm text-gray-600">{t('realtime.stats.showing')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{getCurrentSpot().name}</div>
                    <div className="text-sm text-gray-600">{t('realtime.stats.selectedArea')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{selectedCategory === 'all' ? t('realtime.categories.all') : t(`realtime.categories.${selectedCategory}`)}</div>
                    <div className="text-sm text-gray-600">{t('realtime.stats.category')}</div>
                  </div>
                </div>
              </div>

              <div className="features-grid">
                {filteredTweets.length === 0 ? (
                  <div className="feature-card fade-in text-center">
                    <div className="feature-icon">🔍</div>
                    <h3>{t('realtime.noTweets.title')}</h3>
                    <p>{t('realtime.noTweets.message')}</p>
                  </div>
                ) : (
                  filteredTweets.map((tweet) => (
                    <TweetCard key={tweet.id} tweet={tweet} displayLang={displayLang} />
                  ))
                )}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center" style={{ marginTop: '60px' }}>
                  <button 
                    onClick={() => loadMore()}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>{t('realtime.loadingMore')}</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-chevron-down"></i>
                        <span>{t('realtime.loadMore')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
