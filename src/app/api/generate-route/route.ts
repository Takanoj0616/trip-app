import { NextRequest, NextResponse } from 'next/server';
import { TouristSpot } from '@/types';

// OpenAI client - only initialize if API key is available
let openai: unknown = null;
const initOpenAI = async () => {
  if (process.env.OPENAI_API_KEY && !openai) {
    const OpenAI = (await import('openai')).default;
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

interface RouteRequest {
  selectedSpots: TouristSpot[];
  area: string;
  preferences: {
    transportation: 'walking' | 'public' | 'mixed';
    duration: 'half-day' | 'full-day' | 'multi-day';
    interests: string[];
  };
}

interface RouteResponse {
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

interface RouteStep {
  spot: TouristSpot;
  order: number;
  estimatedTime: string;
  transportationMethod: string;
  distanceFromPrevious: string;
  recommendedDuration: string;
  tips: string[];
}

export async function POST(request: NextRequest) {
  try {
    const data: RouteRequest = await request.json();

    // バリデーション
    if (!data.selectedSpots || data.selectedSpots.length < 2) {
      return NextResponse.json(
        { error: '最低2つのスポットが必要です' },
        { status: 400 }
      );
    }

    if (!data.area) {
      return NextResponse.json(
        { error: 'エリア情報が必要です' },
        { status: 400 }
      );
    }

    // 高速化: すぐにレスポンスを構造化して返す
    console.log('🚀 Fast route generation for', data.selectedSpots.length, 'spots');
    const structuredRoute = generateOptimizedRoute(data);

    return NextResponse.json({
      success: true,
      route: structuredRoute,
    });

  } catch (error) {
    console.error('Route generation error:', error);
    return NextResponse.json(
      { error: 'ルート生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

function createRoutePrompt(data: RouteRequest): string {
  const spotList = data.selectedSpots.map((spot, index) => 
    `${index + 1}. ${spot.name} (${spot.category}) - ${spot.location.address}`
  ).join('\n');

  const preferences = data.preferences;

  return `
以下の${data.area}のスポットを効率的に回るルートを作成してください：

📍 選択されたスポット:
${spotList}

🚶 移動手段: ${preferences.transportation === 'walking' ? '主に徒歩' : 
                 preferences.transportation === 'public' ? '公共交通機関' : '徒歩と公共交通機関の組み合わせ'}
⏰ 所要時間: ${preferences.duration === 'half-day' ? '半日（4-5時間）' : 
                preferences.duration === 'full-day' ? '1日（8-10時間）' : '複数日'}
❤️ 興味: ${preferences.interests.join('、')}

以下の形式でルートを提案してください：

## 🗺️ 最適化ルート

### ルート概要
[ルート全体の説明、総所要時間、総距離]

### 詳細スケジュール
[各スポットの訪問順序、滞在時間、移動時間、移動方法]

## 🌟 追加おすすめスポット

[選択されたスポットに近い、または関連するおすすめスポット3-5個]

## 💡 旅のコツ

[効率的に回るためのアドバイス]

## 🕒 代替ルート案

[時間や体力に応じた別のルート提案]

実際の距離、移動時間、営業時間を考慮した実用的なルートを提案してください。
`;
}

function generateMockRoute(data: RouteRequest): { content: string; recommended: TouristSpot[] } {
  const { selectedSpots, area, preferences } = data;
  
  // 効率的な順序でソート（緯度・経度を基に大まかに並び替え）
  const optimizedSpots = [...selectedSpots].sort((a, b) => {
    // 緯度を基準にソート（北から南へ）
    return b.location.lat - a.location.lat;
  });

  // 推奨スポットのモックデータ
  const mockRecommendedSpots: Record<string, TouristSpot[]> = {
    'tokyo': [
      {
        id: 'rec1',
        name: '東京国立博物館',
        description: '日本の歴史と文化を学べる国内最大の博物館',
        category: 'sightseeing',
        area: 'tokyo',
        location: {
          lat: 35.7188,
          lng: 139.7766,
          address: '東京都台東区上野公園13-9'
        },
        rating: 4.4,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'],
        priceRange: 'moderate',
        tags: ['博物館', '歴史', '文化'],
        reviews: []
      },
      {
        id: 'rec2',
        name: '築地場外市場',
        description: '新鮮な海鮮料理と食べ歩きグルメの宝庫',
        category: 'restaurants',
        area: 'tokyo',
        location: {
          lat: 35.6654,
          lng: 139.7706,
          address: '東京都中央区築地4-16-2'
        },
        rating: 4.3,
        images: ['https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=500&h=300&fit=crop'],
        priceRange: 'moderate',
        tags: ['市場', '海鮮', '食べ歩き'],
        reviews: []
      },
      {
        id: 'rec3',
        name: '代々木公園',
        description: '都心のオアス。広大な緑地でピクニックや散歩を楽しめる',
        category: 'sightseeing',
        area: 'tokyo',
        location: {
          lat: 35.6732,
          lng: 139.6960,
          address: '東京都渋谷区代々木神園町2-1'
        },
        rating: 4.2,
        images: ['https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500&h=300&fit=crop'],
        priceRange: 'budget',
        tags: ['公園', '自然', 'ピクニック'],
        reviews: []
      }
    ]
  };

  const recommendedSpots = mockRecommendedSpots[area] || [];

  const totalTime = preferences.duration === 'half-day' ? '4-5時間' : 
                   preferences.duration === 'full-day' ? '8-10時間' : '2-3日';

  const content = `## 🗺️ 最適化ルート

### ルート概要
${area}の選択されたスポットを効率的に回るルートをご提案します。
- 総所要時間: ${totalTime}
- 総移動距離: 約${Math.floor(Math.random() * 5) + 3}km
- 移動手段: ${preferences.transportation === 'walking' ? '主に徒歩' : '徒歩と公共交通機関'}
- 推奨時間帯: 9:00スタート

### 詳細スケジュール

${optimizedSpots.map((spot, index) => {
  const startTime = 9 + (index * 2);
  const endTime = startTime + 1.5;
  const nextSpot = optimizedSpots[index + 1];
  
  return `**${index + 1}. ${spot.name}** (${String(startTime).padStart(2, '0')}:00-${String(Math.floor(endTime)).padStart(2, '0')}:${String((endTime % 1) * 60).padStart(2, '0')})
- カテゴリ: ${spot.category === 'sightseeing' ? '観光スポット' : spot.category === 'restaurants' ? 'グルメ' : spot.category}
- 滞在時間: 90分
- 特徴: ${spot.description}
${nextSpot ? `- 次のスポットまで: 徒歩${Math.floor(Math.random() * 15) + 5}分 (${Math.floor(Math.random() * 800) + 200}m)` : ''}
${index < optimizedSpots.length - 1 ? '\n↓\n' : ''}`;
}).join('\n')}

## 🌟 追加おすすめスポット

選択されたスポットと合わせて訪問するとより充実した体験ができるスポットをご提案します：

${recommendedSpots.map((spot, index) => 
`**${index + 1}. ${spot.name}**
- ${spot.description}
- 評価: ⭐ ${spot.rating}
- 予算: ${spot.priceRange === 'budget' ? '¥' : spot.priceRange === 'moderate' ? '¥¥' : '¥¥¥'}
- 特徴: ${spot.tags?.join('、') || 'タグなし'}
`).join('\n')}

## 💡 旅のコツ

- 🚶‍♂️ 歩きやすい靴を着用してください
- 📱 Google マップをダウンロードしてオフラインでも使用可能にしておきましょう
- 💰 現金とクレジットカードの両方を準備
- 🕐 人気スポットは朝早めに訪問すると混雑を避けられます
- 🎫 事前予約が必要なスポットは必ず予約しておきましょう
- 🌤️ 天気予報をチェックし、雨具を持参することをお勧めします

## 🕒 代替ルート案

### 時短ルート（3時間）
最も重要な${Math.min(3, selectedSpots.length)}スポットに絞った効率的なルート

### のんびりルート（6-8時間）  
各スポットでゆっくり時間を過ごし、カフェ休憩も含めたゆったりプラン

このルートで${area}の魅力を存分にお楽しみください！`;

  return { content, recommended: recommendedSpots };
}

function generateOptimizedRoute(data: RouteRequest): RouteResponse {
  // 緯度経度を使って効率的なルート順序を計算
  const optimizedSpots = [...data.selectedSpots].sort((a, b) => {
    // 緯度を基準にソート（北から南へ）
    return b.location.lat - a.location.lat;
  });

  // 推奨スポット
  const mockRecommendedSpots: Record<string, TouristSpot[]> = {
    'tokyo': [
      {
        id: 'rec1',
        name: '東京国立博物館',
        description: '日本の歴史と文化を学べる国内最大の博物館',
        category: 'sightseeing',
        area: 'tokyo',
        location: { lat: 35.7188, lng: 139.7766, address: '東京都台東区上野公園13-9' },
        rating: 4.4,
        images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop'],
        priceRange: 'moderate',
        tags: ['博物館', '歴史'],
        reviews: []
      }
    ]
  };

  const recommendedSpots = mockRecommendedSpots[data.area] || [];
  
  const optimizedRoute: RouteStep[] = optimizedSpots.map((spot, index) => ({
    spot,
    order: index + 1,
    estimatedTime: `${9 + (index * 2)}:00`,
    transportationMethod: index === 0 ? 'start' : 'walking',
    distanceFromPrevious: index === 0 ? '0m' : `${Math.floor(Math.random() * 600) + 300}m`,
    recommendedDuration: index === 0 ? '60分' : '90分',
    tips: ['営業時間を事前に確認', '混雑時間帯を避ける']
  }));

  return {
    id: `route_${Date.now()}`,
    area: data.area,
    selectedSpots: optimizedSpots,
    recommendedSpots: recommendedSpots,
    optimizedRoute: optimizedRoute,
    timeEstimate: data.preferences.duration === 'half-day' ? '4-5時間' : '8-10時間',
    totalDistance: `約${Math.floor(Math.random() * 5) + 3}km`,
    tips: [
      '歩きやすい靴を着用してください',
      'Google マップをダウンロード',
      '現金とクレジットカードの両方を準備',
      '人気スポットは朝早めに訪問'
    ],
    createdAt: new Date().toISOString(),
  };
}

function parseRouteContent(_content: string, originalData: RouteRequest, recommendedSpots: TouristSpot[]): RouteResponse {
  // レガシー関数 - 新しい関数に置き換え済み
  return generateOptimizedRoute(originalData);
}