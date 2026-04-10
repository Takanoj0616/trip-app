import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { rateLimit } from '@/lib/rate-limit';
import { verifyAuth, isAuthError } from '@/lib/api-auth';

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 10 });

// OpenAI client - only initialize if API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface PlanRequest {
  destination: string;
  budget: string;
  duration: string;
  interests: string[];
  travelStyle: string;
  groupType: string;
}

export async function POST(request: NextRequest) {
  const rateLimitResult = limiter.check(request);
  if (rateLimitResult) return rateLimitResult;

  const authResult = await verifyAuth(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const data: PlanRequest = await request.json();

    // バリデーション
    if (!data.destination || !data.budget || !data.duration) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      );
    }

    let planContent: string;

    // OpenAI APIが利用可能な場合は実際のAPIを使用
    if (openai) {
      console.log('🤖 Using OpenAI API for plan generation');
      const prompt = createTravelPlanPrompt(data);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "あなたは日本の関東地方（東京、横浜、埼玉、千葉）に精通した旅行プランナーです。ユーザーの要望に基づいて、詳細で実用的な旅行プランを提案してください。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      planContent = completion.choices[0].message.content || '';
    } else {
      // 開発環境用のMockレスポンス
      console.log('🧪 Using Mock response for plan generation (no OpenAI API key)');
      planContent = generateMockPlan(data);
    }

    // レスポンスを構造化
    const structuredPlan = parsePlanContent(planContent || '', data);

    return NextResponse.json({
      success: true,
      plan: structuredPlan,
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'プラン生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

function createTravelPlanPrompt(data: PlanRequest): string {
  const budgetMap = {
    budget: '節約（〜5,000円/日）',
    standard: '標準（5,000円〜10,000円/日）',
    luxury: 'プレミアム（10,000円〜/日）'
  };

  const durationMap = {
    '1day': '1日',
    '2-3days': '2-3日',
    '4-7days': '4-7日',
    '1week+': '1週間以上'
  };

  const styleMap = {
    relaxed: 'のんびり（ゆっくり観光）',
    active: 'アクティブ（多くの場所を巡る）',
    flexible: 'フレキシブル（臨機応変に）'
  };

  const groupMap = {
    solo: '一人旅',
    couple: 'カップル',
    family: '家族',
    friends: '友人'
  };

  const interestLabels = {
    culture: '文化・歴史',
    food: '食べ物',
    shopping: 'ショッピング',
    nature: '自然・公園',
    entertainment: 'エンターテインメント',
    nightlife: 'ナイトライフ'
  };

  const interests = data.interests.map(id => interestLabels[id as keyof typeof interestLabels]).join('、');

  return `
以下の条件で${data.destination}の旅行プランを作成してください：

📍 目的地: ${data.destination}
💰 予算: ${budgetMap[data.budget as keyof typeof budgetMap]}
⏰ 期間: ${durationMap[data.duration as keyof typeof durationMap]}
❤️ 興味・関心: ${interests || 'なし'}
🚶 旅行スタイル: ${styleMap[data.travelStyle as keyof typeof styleMap]}
👥 グループ: ${groupMap[data.groupType as keyof typeof groupMap]}

以下の形式でプランを提案してください：

## 🗾 旅行プラン概要
[プランの全体的な説明]

## 📅 詳細スケジュール
[日程ごとの具体的なスケジュール]

## 🍽️ おすすめグルメ
[予算に合ったレストランや食べ物の提案]

## 🏨 宿泊施設の提案
[予算に応じた宿泊施設の提案]

## 💡 旅のコツ・注意点
[実用的なアドバイス]

## 💰 予算の目安
[詳細な費用見積もり]

実際に行ける具体的な場所、アクセス方法、営業時間なども含めて、実用的なプランを提案してください。
`;
}

function parsePlanContent(content: string, originalData: PlanRequest) {
  // プランをセクション別に分割
  const sections = content.split('##').filter(section => section.trim());
  
  const plan = {
    id: `plan_${Date.now()}`,
    destination: originalData.destination,
    budget: originalData.budget,
    duration: originalData.duration,
    interests: originalData.interests,
    travelStyle: originalData.travelStyle,
    groupType: originalData.groupType,
    title: `${originalData.destination}の旅行プラン`,
    overview: '',
    schedule: '',
    restaurants: '',
    accommodation: '',
    tips: '',
    budgetDetails: '',
    fullContent: content,
    createdAt: new Date().toISOString(),
  };

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();

    if (title.includes('概要')) {
      plan.overview = content;
    } else if (title.includes('スケジュール') || title.includes('日程')) {
      plan.schedule = content;
    } else if (title.includes('グルメ') || title.includes('食事')) {
      plan.restaurants = content;
    } else if (title.includes('宿泊')) {
      plan.accommodation = content;
    } else if (title.includes('コツ') || title.includes('注意')) {
      plan.tips = content;
    } else if (title.includes('予算') || title.includes('費用')) {
      plan.budgetDetails = content;
    }
  });

  return plan;
}

function generateMockPlan(data: PlanRequest): string {
  const budgetMap = {
    budget: '節約（〜5,000円/日）',
    standard: '標準（5,000円〜10,000円/日）',
    luxury: 'プレミアム（10,000円〜/日）'
  };

  const durationMap = {
    '1day': '1日',
    '2-3days': '2-3日',
    '4-7days': '4-7日',
    '1week+': '1週間以上'
  };

  const destination = data.destination;
  const budget = budgetMap[data.budget as keyof typeof budgetMap];
  const duration = durationMap[data.duration as keyof typeof durationMap];

  // 目的地に応じたMockプラン生成
  const mockPlans = {
    '東京': {
      spots: ['浅草寺', '東京スカイツリー', '銀座', '新宿', '渋谷', '上野公園', '築地市場', '明治神宮'],
      foods: ['寿司', 'ラーメン', 'もんじゃ焼き', '天ぷら', 'すき焼き'],
      hotels: ['ホテルニューオータニ', 'パークハイアット東京', 'アパホテル', '東急ステイ'],
    },
    '横浜': {
      spots: ['みなとみらい21', '中華街', '赤レンガ倉庫', '山下公園', 'コスモワールド'],
      foods: ['中華料理', '横浜家系ラーメン', '焼売', 'ナポリタン'],
      hotels: ['インターコンチネンタル横浜', 'ロイヤルパークホテル', '横浜ベイホテル東急'],
    },
    '埼玉': {
      spots: ['川越', '秩父', '大宮', '所沢', '鉄道博物館'],
      foods: ['川越いも', 'うどん', '草加せんべい', '秩父そば'],
      hotels: ['川越プリンスホテル', '秩父温泉満願の湯', 'パレスホテル大宮'],
    },
    '千葉': {
      spots: ['成田山新勝寺', '房総半島', 'マザー牧場', '鴨川シーワールド', '幕張メッセ'],
      foods: ['なめろう', 'びわ', '落花生', '房総の海鮮'],
      hotels: ['ディズニーランドホテル', 'ヒルトン成田', '鴨川シーワールドホテル'],
    }
  };

  const planData = mockPlans[destination as keyof typeof mockPlans] || mockPlans['東京'];

  return `## 🗾 旅行プラン概要

${destination}の${duration}旅行プランをご提案します。予算は${budget}でのプランとなります。

${destination}は日本の関東地方の魅力的な観光地で、現代と伝統が美しく融合した場所です。このプランでは、主要な観光スポットから隠れた名所まで、バランスよく巡ることができます。

## 📅 詳細スケジュール

**1日目：**
- 9:00 - ${planData.spots[0]}を訪問
- 12:00 - 昼食（${planData.foods[0]}）
- 14:00 - ${planData.spots[1]}で観光
- 17:00 - ${planData.spots[2]}でショッピング
- 19:00 - 夕食（${planData.foods[1]}）

${duration !== '1日' ? `**2日目：**
- 9:00 - ${planData.spots[3]}を散策
- 12:00 - 昼食（${planData.foods[2]}）
- 14:00 - ${planData.spots[4]}を見学
- 17:00 - 自由時間
- 19:00 - 夕食（${planData.foods[3]}）` : ''}

## 🍽️ おすすめグルメ

${destination}では以下のような美味しい料理を楽しむことができます：

- **${planData.foods[0]}**: ${destination}の代表的な料理です
- **${planData.foods[1]}**: 地元の人にも愛される味
- **${planData.foods[2]}**: ${destination}ならではの特産品を使った料理
- **${planData.foods[3]}**: 観光客にも人気の一品

予算に合わせて、高級料理店から気軽に楽しめる食堂まで幅広くご紹介しています。

## 🏨 宿泊施設の提案

${budget}に合わせたおすすめの宿泊施設：

- **${planData.hotels[0]}**: 最高級のサービスとアメニティ
- **${planData.hotels[1]}**: アクセス抜群の立地
- **${planData.hotels[2]}**: コストパフォーマンスが優秀

## 💡 旅のコツ・注意点

- 電車の時刻表を事前に確認しておくと移動がスムーズです
- ICカード（Suica/PASMO）を用意すると便利です
- 人気スポットは朝早めに訪問すると混雑を避けられます
- ${destination}の天気は変わりやすいので、折り畳み傘を持参することをお勧めします
- 現金とクレジットカードの両方を準備しておくと安心です

## 💰 予算の目安

**${duration}の概算費用：**

- 交通費: ¥3,000-5,000
- 宿泊費: ¥${budget.includes('節約') ? '5,000-8,000' : budget.includes('標準') ? '10,000-15,000' : '20,000-40,000'}/泊
- 食費: ¥${budget.includes('節約') ? '3,000-4,000' : budget.includes('標準') ? '5,000-8,000' : '10,000-15,000'}/日
- 観光・入場料: ¥2,000-4,000/日

**合計目安: ¥${budget.includes('節約') ? '15,000-25,000' : budget.includes('標準') ? '25,000-40,000' : '50,000-80,000'}**

このプランは${destination}の魅力を存分に楽しめる内容となっています。素晴らしい旅行をお楽しみください！`;
}