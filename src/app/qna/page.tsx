import { Metadata } from 'next';
import AnimationClient from '@/components/AnimationClient';
import QACard from '@/components/QACard';

export const metadata: Metadata = {
  title: 'Q&A掲示板 | Japan Travel Guide',
  description: '日本旅行に関する質問と回答を共有できる掲示板。旅行の疑問を解決し、現地の情報を交換しましょう。',
};

interface Answer {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  isBestAnswer?: boolean;
}

interface QAItem {
  id: string;
  question: string;
  answer?: string;
  author: string;
  category: string;
  createdAt: string;
  answers: Answer[];
  views: number;
  status: 'open' | 'answered' | 'closed';
}

const qaData: QAItem[] = [
  {
    id: '1',
    question: '東京駅から浅草寺への最適な交通手段は？',
    answer: 'JR山手線で上野駅まで行き、そこから地下鉄銀座線で浅草駅へ向かうのが最も便利です。',
    author: '旅行好きA',
    category: '交通・アクセス',
    createdAt: '2024-01-15',
    answers: [
      {
        id: '1-1',
        content: 'JR山手線で上野駅まで行き、そこから地下鉄銀座線で浅草駅へ向かうのが最も便利です。所要時間は約30分、運賃は200円程度です。朝の通勤ラッシュ時間帯を避けて行くことをおすすめします。',
        author: '東京在住ガイド',
        createdAt: '2024-01-15 10:30',
        likes: 24,
        isBestAnswer: true
      },
      {
        id: '1-2',
        content: 'タクシーでも行けますが、交通状況によっては時間がかかる場合があります。電車の方が確実で安いと思います。',
        author: 'タクシー運転手',
        createdAt: '2024-01-15 14:20',
        likes: 8
      },
      {
        id: '1-3',
        content: '徒歩でも行けますが、約1時間かかります。途中で皇居や神田を通るので、時間に余裕があれば散歩がてら歩くのも良いですよ。',
        author: '散歩好き',
        createdAt: '2024-01-15 16:45',
        likes: 12
      }
    ],
    views: 125,
    status: 'answered'
  },
  {
    id: '2',
    question: '桜の季節におすすめの東京の観光スポットを教えてください',
    author: '花見初心者',
    category: '観光スポット',
    createdAt: '2024-01-14',
    answers: [
      {
        id: '2-1',
        content: '上野公園は桜の名所として有名で、約1000本の桜が楽しめます。お花見シーズンには屋台も出て賑やかです。新宿御苑も美しい桜が見られ、入園料200円で静かに桜を楽しめます。',
        author: '桜マスター',
        createdAt: '2024-01-14 09:15',
        likes: 45,
        isBestAnswer: true
      },
      {
        id: '2-2',
        content: '千鳥ヶ淵も絶対におすすめ！ボートに乗りながら桜を見ることができて、とても幻想的です。夜はライトアップもされます。',
        author: 'ボート愛好家',
        createdAt: '2024-01-14 12:30',
        likes: 32
      },
      {
        id: '2-3',
        content: '隅田川沿いの桜も素晴らしいです。スカイツリーと桜を一緒に撮影できるスポットもあります。',
        author: '写真家',
        createdAt: '2024-01-14 15:45',
        likes: 28
      }
    ],
    views: 245,
    status: 'answered'
  },
  {
    id: '3',
    question: '羽田空港から都心への深夜移動方法について',
    author: '深夜到着者',
    category: '交通・アクセス',
    createdAt: '2024-01-13',
    answers: [],
    views: 67,
    status: 'open'
  },
  {
    id: '4',
    question: '築地市場周辺でおすすめの朝食スポットは？',
    author: 'グルメ探検家',
    category: 'グルメ・レストラン',
    createdAt: '2024-01-12',
    answers: [
      {
        id: '4-1',
        content: '「大和寿司」は築地の老舗寿司店で、新鮮なネタが味わえます。朝6時から営業していて、マグロの握りは絶品です。ただし行列ができるので早めに行くことをおすすめします。',
        author: '寿司職人',
        createdAt: '2024-01-12 07:20',
        likes: 89,
        isBestAnswer: true
      },
      {
        id: '4-2',
        content: '「愛養」の卵焼きサンドは築地名物です。ふわふわの卵焼きが絶品で、手軽に食べられます。',
        author: '卵焼き愛好家',
        createdAt: '2024-01-12 08:15',
        likes: 56
      }
    ],
    views: 389,
    status: 'answered'
  },
  {
    id: '5',
    question: '一人旅で泊まるのにおすすめのホテルタイプは？',
    author: 'ソロトラベラー',
    category: '宿泊・ホテル',
    createdAt: '2024-01-11',
    answers: [
      {
        id: '5-1',
        content: 'カプセルホテルがコスパ良くておすすめです。最近のカプセルホテルは設備も良く、一人旅には最適です。新宿や渋谷にある「ファーストキャビン」系列が快適でした。',
        author: 'カプセル愛用者',
        createdAt: '2024-01-11 11:30',
        likes: 34,
        isBestAnswer: true
      },
      {
        id: '5-2',
        content: 'ビジネスホテルも一人旅には良いと思います。アパホテルやドーミーインなど、全国チェーンなら安心です。',
        author: 'ビジネス旅行者',
        createdAt: '2024-01-11 14:20',
        likes: 22
      }
    ],
    views: 178,
    status: 'answered'
  }
];

export default function QnaPage() {

  return (
    <>
      <AnimationClient />
      <div className="animated-bg"></div>
      <div className="sakura-container" id="sakuraContainer"></div>
      
      <div className="min-h-screen" style={{ paddingTop: '120px' }}>
        {/* Header Section */}
        <div className="text-center mb-16 px-4">
          <div 
            className="inline-block"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '30px',
              padding: '60px 80px',
              margin: '0 20px'
            }}
          >
            <h1 
              className="text-5xl font-black mb-6"
              style={{
                background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              🙋‍♀️ Q&A掲示板
            </h1>
            <p className="text-xl text-black max-w-4xl mx-auto leading-relaxed font-medium">
              日本旅行に関する疑問や質問を投稿して、経験豊富な旅行者からアドバイスをもらいましょう。
              あなたの知識も他の旅行者の役に立ちます。
            </p>
          </div>
        </div>

        {/* New Question Button */}
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            新しい質問を投稿
          </button>
        </div>

        {/* Filter and Search */}
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="質問を検索..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>すべてのカテゴリー</option>
                <option>交通・アクセス</option>
                <option>観光スポット</option>
                <option>グルメ・レストラン</option>
                <option>宿泊・ホテル</option>
                <option>文化・マナー</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>新着順</option>
                <option>回答数順</option>
                <option>閲覧数順</option>
              </select>
            </div>
          </div>
        </div>

        {/* Q&A List */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="space-y-6">
            {qaData.map((item) => (
              <QACard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700">前へ</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700">2</button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700">3</button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700">次へ</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}