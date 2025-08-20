import { NextRequest, NextResponse } from 'next/server';
import { TouristSpot } from '@/types';
import { tokyoSpots } from '@/data/tokyo-spots';

interface RecommendationRequest {
  interests: string[];
  budget: string;
  duration: string;
  area: string;
}

interface RecommendedSpot extends TouristSpot {
  order: number;
  visitTime: string;
  duration: string;
  reason: string;
  tips: string[];
}

interface RecommendationResponse {
  recommendations: RecommendedSpot[];
  reasoning: string;
  totalTime: string;
  aiThoughts: string[];
}

export async function POST(request: NextRequest) {
  try {
    const data: RecommendationRequest = await request.json();

    // バリデーション
    if (!data.interests || data.interests.length === 0) {
      return NextResponse.json(
        { error: '興味のある分野を選択してください' },
        { status: 400 }
      );
    }

    if (!data.budget || !data.duration || !data.area) {
      return NextResponse.json(
        { error: 'すべての項目を入力してください' },
        { status: 400 }
      );
    }

    // AIが考える時間をシミュレート (1-3秒)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

    // AI推奨ロジック（強化版）
    const result = await generateSmartRecommendations(data);

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('AI recommendation error:', error);
    return NextResponse.json(
      { error: '推奨スポットの生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

async function generateSmartRecommendations(data: RecommendationRequest): Promise<RecommendationResponse> {
  const aiThoughts: string[] = [
    'お客様の興味と予算を分析中...',
    '最適なスポットの組み合わせを検討中...',
    '効率的な回り方を計算中...',
    '天気と混雑状況を考慮中...',
    '最終的なおすすめプランを作成中...'
  ];

  const baseSpots = generateBaseRecommendations(data);
  const orderedSpots = optimizeVisitOrder(baseSpots, data);
  
  return {
    recommendations: orderedSpots,
    reasoning: generateAIReasoning(data, orderedSpots),
    totalTime: calculateTotalTime(orderedSpots, data.duration),
    aiThoughts: aiThoughts
  };
}

function generateBaseRecommendations(data: RecommendationRequest): TouristSpot[] {
  // エリアとタイプに基づいたおすすめスポット
  const spotDatabase: Record<string, TouristSpot[]> = {
    shibuya: [
      {
        id: 'shibuya-1',
        name: '渋谷スカイ',
        description: '渋谷の絶景を360度楽しめる展望施設',
        category: 'sightseeing',
        area: 'shibuya',
        location: { lat: 35.6580, lng: 139.7016, address: '東京都渋谷区渋谷2-24-12' },
        rating: 4.5,
        images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop'],
        priceRange: 'standard',
        tags: ['展望台', '夜景', 'インスタ映え'],
        reviews: []
      },
      {
        id: 'shibuya-2',
        name: '明治神宮',
        description: '都心にある広大な森に囲まれた神社',
        category: 'sightseeing',
        area: 'shibuya',
        location: { lat: 35.6763, lng: 139.6993, address: '東京都渋谷区代々木神園町1-1' },
        rating: 4.4,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'],
        priceRange: 'budget',
        tags: ['神社', 'パワースポット', '歴史'],
        reviews: []
      }
    ],
    akihabara: [
      {
        id: 'akiba-1',
        name: 'アキバカルチャーズゾーン',
        description: 'アニメ・マンガ文化の聖地で最新グッズを探索',
        category: 'entertainment',
        area: 'akihabara',
        location: { lat: 35.7023, lng: 139.7745, address: '東京都千代田区外神田1-1-1' },
        rating: 4.6,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'],
        priceRange: 'standard',
        tags: ['アニメ', 'マンガ', 'ゲーム'],
        reviews: []
      }
    ],
    ginza: [
      {
        id: 'ginza-1',
        name: '銀座三越',
        description: '高級百貨店で上質なショッピング体験',
        category: 'shopping',
        area: 'ginza',
        location: { lat: 35.6719, lng: 139.7648, address: '東京都中央区銀座4-6-16' },
        rating: 4.3,
        images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop'],
        priceRange: 'luxury',
        tags: ['百貨店', 'ブランド', '高級'],
        reviews: []
      }
    ],
    yokohama: [
      {
        id: 'yokohama-1',
        name: 'みなとみらい21',
        description: '横浜の代表的な観光エリア、美しい夜景と近代的な建物群',
        category: 'sightseeing',
        area: 'yokohama',
        location: { lat: 35.4563, lng: 139.6380, address: '神奈川県横浜市西区みなとみらい' },
        rating: 4.6,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'],
        priceRange: 'standard',
        tags: ['夜景', '観光', 'デート'],
        reviews: []
      }
    ]
  };

  // 興味に基づくカテゴリマッピング
  const interestToCategory: Record<string, string[]> = {
    anime: ['entertainment', 'shopping'],
    history: ['sightseeing'],
    nature: ['sightseeing'],
    gourmet: ['restaurants'],
    shopping: ['shopping'],
    onsen: ['hotels'],
    art: ['sightseeing', 'entertainment']
  };

  // 予算に基づくフィルタリング
  const budgetMap: Record<string, string[]> = {
    budget: ['budget'],
    standard: ['budget', 'moderate'],
    luxury: ['budget', 'moderate', 'expensive']
  };

  // エリアのスポットを取得
  let availableSpots = spotDatabase[data.area] || [];

  // Tokyo spots データも含める
  if (data.area.includes('tokyo') || ['shibuya', 'shinjuku', 'ginza', 'asakusa', 'akihabara', 'roppongi', 'odaiba', 'tsukiji'].includes(data.area)) {
    availableSpots = [...availableSpots, ...tokyoSpots];
  }

  // 興味に基づくフィルタリング
  const relevantCategories = data.interests.flatMap(interest => 
    interestToCategory[interest] || []
  );

  let filteredSpots = availableSpots.filter(spot => 
    relevantCategories.includes(spot.category) ||
    data.interests.some(interest => 
      spot.tags?.some(tag => 
        tag.toLowerCase().includes(interest) ||
        (interest === 'anime' && (tag.includes('アニメ') || tag.includes('マンガ'))) ||
        (interest === 'history' && (tag.includes('歴史') || tag.includes('文化'))) ||
        (interest === 'nature' && (tag.includes('自然') || tag.includes('公園'))) ||
        (interest === 'gourmet' && (tag.includes('グルメ') || tag.includes('食事'))) ||
        (interest === 'shopping' && (tag.includes('ショッピング') || tag.includes('買い物'))) ||
        (interest === 'art' && (tag.includes('アート') || tag.includes('美術')))
      )
    )
  );

  // 予算に基づくフィルタリング
  const allowedPriceRanges = budgetMap[data.budget] || ['budget'];
  filteredSpots = filteredSpots.filter(spot => 
    allowedPriceRanges.includes(spot.priceRange)
  );

  // 評価順でソート
  filteredSpots.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // 滞在期間に基づく推奨数を決定
  const maxRecommendations = data.duration === 'half-day' ? 3 : 
                             data.duration === 'full-day' ? 6 : 
                             data.duration === 'multi-day' ? 12 : 20;

  return filteredSpots.slice(0, maxRecommendations);
}

function optimizeVisitOrder(spots: TouristSpot[], data: RecommendationRequest): RecommendedSpot[] {
  // 地理的位置と営業時間を考慮した最適順序
  const orderedSpots = [...spots].sort((a, b) => {
    // 緯度でソート（北から南へ）
    return b.location.lat - a.location.lat;
  });

  const baseTime = 9; // 開始時間
  let currentTime = baseTime;

  return orderedSpots.map((spot, index) => {
    const duration = getDurationByCategory(spot.category, data.duration);
    const visitTime = `${String(Math.floor(currentTime)).padStart(2, '0')}:${String(Math.floor((currentTime % 1) * 60)).padStart(2, '0')}`;
    
    const recommendedSpot: RecommendedSpot = {
      ...spot,
      order: index + 1,
      visitTime: visitTime,
      duration: duration,
      reason: generateSpotReason(spot, data.interests),
      tips: generateSpotTips(spot, data)
    };

    currentTime += parseFloat(duration.replace('時間', '').replace('分', '')) || 1.5;
    if (duration.includes('分')) {
      currentTime += parseFloat(duration.replace('分', '')) / 60;
    }

    return recommendedSpot;
  });
}

function getDurationByCategory(category: string, duration: string): string {
  const baseDuration = {
    sightseeing: duration === 'half-day' ? '1時間' : '1.5時間',
    restaurants: '1時間',
    shopping: duration === 'half-day' ? '45分' : '1時間',
    entertainment: duration === 'half-day' ? '1時間' : '2時間',
    hotels: '30分'
  };
  
  return baseDuration[category as keyof typeof baseDuration] || '1時間';
}

function generateSpotReason(spot: TouristSpot, interests: string[]): string {
  const reasons = [];
  
  if (interests.includes('anime') && spot.tags?.some(tag => tag.includes('アニメ') || tag.includes('マンガ'))) {
    reasons.push('アニメ・マンガ好きには外せないスポット');
  }
  if (interests.includes('history') && spot.tags?.some(tag => tag.includes('歴史') || tag.includes('文化'))) {
    reasons.push('日本の歴史と文化を深く学べる');
  }
  if (interests.includes('nature') && spot.tags?.some(tag => tag.includes('自然') || tag.includes('公園'))) {
    reasons.push('都市部で自然を感じられる貴重な場所');
  }
  if (interests.includes('gourmet')) {
    reasons.push('地元の美味しいグルメを堪能できる');
  }
  
  if (reasons.length === 0) {
    reasons.push(`評価${spot.rating}の人気スポット`);
  }
  
  return reasons[0];
}

function generateSpotTips(spot: TouristSpot, data: RecommendationRequest): string[] {
  const tips = [];
  
  if (spot.category === 'sightseeing') {
    tips.push('朝早めの時間帯がおすすめ（混雑回避）');
  }
  if (spot.category === 'restaurants') {
    tips.push('昼食時間の混雑を避けて11:30頃の利用がベスト');
  }
  if (spot.priceRange === 'expensive' && data.budget === 'budget') {
    tips.push('入場料以外の費用も考慮して予算を調整');
  }
  if (spot.tags?.includes('インスタ映え')) {
    tips.push('写真撮影におすすめ！カメラを忘れずに');
  }
  
  tips.push('事前に営業時間・定休日を確認することをお勧めします');
  
  return tips.slice(0, 3);
}

function generateAIReasoning(data: RecommendationRequest, spots: RecommendedSpot[]): string {
  const interestText = data.interests.join('、');
  const budgetText = data.budget === 'budget' ? '節約志向' : 
                    data.budget === 'standard' ? '標準' : 'プレミアム';
  const durationText = data.duration === 'half-day' ? '半日' : 
                      data.duration === 'full-day' ? '1日' : '複数日';

  return `${interestText}に興味をお持ちの${budgetText}予算で${durationText}の滞在プランとして、${spots.length}箇所のスポットを厳選いたしました。地理的な位置関係と各スポットの特徴を考慮し、効率的で充実した旅程となるよう最適化しています。`;
}

function calculateTotalTime(spots: RecommendedSpot[], duration: string): string {
  const totalHours = spots.reduce((total, spot) => {
    const hours = parseFloat(spot.duration.replace('時間', '').replace('分', '')) || 1;
    return total + (spot.duration.includes('分') ? hours / 60 : hours);
  }, 0);
  
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours % 1) * 60);
  
  return `約${hours}時間${minutes > 0 ? minutes + '分' : ''}`;
}