import { Metadata } from 'next';
import AnimationClient from '@/components/AnimationClient';
import InteractiveButton from '@/components/InteractiveButton';
import StoryCard from '@/components/StoryCard';

export const metadata: Metadata = {
  title: '旅行記・体験談シェア | Japan Travel Guide',
  description: '日本旅行の体験談や旅行記を共有し、他の旅行者と思い出や発見を分かち合いましょう。',
};

interface TravelStory {
  id: string;
  title: string;
  content: string;
  author: string;
  area: string;
  duration: string;
  budget: string;
  images: string[];
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
}

const storiesData: TravelStory[] = [
  {
    id: '1',
    title: '初めての東京一人旅 - 3日間で巡る王道コース',
    content: '初めて東京を一人で旅行した体験記です。浅草、銀座、渋谷を中心に回りました。特に印象的だったのは早朝の築地市場での朝食。新鮮な海鮮丼は絶品でした...',
    author: '旅好きYuki',
    area: '東京',
    duration: '3日間',
    budget: '8万円',
    images: ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'],
    createdAt: '2024-01-15',
    likes: 142,
    comments: 28,
    tags: ['一人旅', '東京', '初心者向け', 'グルメ']
  },
  {
    id: '2',
    title: '桜満開の京都 - 家族で楽しむ春の旅',
    content: '4月上旬の京都に家族4人で行ってきました。清水寺、嵐山、哲学の道など桜の名所を巡りました。子供たちも大喜びで、特に竹林の道では写真をたくさん撮りました...',
    author: 'ファミリートラベラー',
    area: '京都',
    duration: '4日間',
    budget: '15万円',
    images: ['https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&h=300&fit=crop'],
    createdAt: '2024-01-12',
    likes: 89,
    comments: 15,
    tags: ['家族旅行', '京都', '桜', '春']
  },
  {
    id: '3',
    title: '大阪グルメ巡り - 食い倒れの2日間',
    content: '大阪名物を食べ尽くす旅に行ってきました。たこ焼き、お好み焼き、串カツ、ラーメン...2日間で体重が3kg増えました（笑）道頓堀の夜景も最高でした...',
    author: 'グルメハンター',
    area: '大阪',
    duration: '2日間',
    budget: '5万円',
    images: ['https://images.unsplash.com/photo-1589952283406-b53a7d1347e8?w=400&h=300&fit=crop'],
    createdAt: '2024-01-10',
    likes: 203,
    comments: 45,
    tags: ['グルメ', '大阪', '短期旅行', '食べ歩き']
  },
  {
    id: '4',
    title: '沖縄リゾート満喫 - 海と自然に癒された1週間',
    content: '念願の沖縄旅行！青い海、白い砂浜、美しいサンセット。シュノーケリングで見た熱帯魚たちは忘れられません。沖縄料理も最高で、特にゴーヤチャンプルーが...',
    author: 'ビーチラバー',
    area: '沖縄',
    duration: '7日間',
    budget: '20万円',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'],
    createdAt: '2024-01-08',
    likes: 167,
    comments: 32,
    tags: ['沖縄', 'リゾート', '海', '長期旅行']
  },
  {
    id: '5',
    title: '北海道冬景色 - 雪祭りと温泉の旅',
    content: '2月の札幌雪祭りに行ってきました。雪像の迫力に圧倒！その後登別温泉で疲れを癒し、新鮮な海鮮も堪能。寒かったけど心温まる旅でした...',
    author: '雪国探検家',
    area: '北海道',
    duration: '5日間',
    budget: '12万円',
    images: ['https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400&h=300&fit=crop'],
    createdAt: '2024-01-05',
    likes: 134,
    comments: 23,
    tags: ['北海道', '冬', '雪祭り', '温泉']
  }
];

export default function StoriesPage() {
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
              📖 旅行記・体験談シェア
            </h1>
            <p className="text-xl text-black max-w-4xl mx-auto leading-relaxed font-medium">
              あなたの素晴らしい日本旅行の体験を共有し、他の旅行者にインスピレーションを与えましょう。
              思い出に残る瞬間や発見した秘密の場所を教えてください。
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '30px',
              padding: '40px',
              textAlign: 'center'
            }}
          >
            <div className="text-4xl mb-4">✍️✨</div>
            <h3 className="text-2xl font-bold text-black mb-4">
              あなたの旅行体験をシェアしませんか？
            </h3>
            <p className="text-black text-base mb-6 max-w-2xl mx-auto opacity-80">
              素晴らしい思い出や発見した秘密の場所を、他の旅行者と共有して新しい旅のインスピレーションを与えましょう。
            </p>
            <InteractiveButton>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              新しい旅行記を投稿
            </InteractiveButton>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '25px',
              padding: '30px'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="旅行記を検索..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-lg"
                />
              </div>
              <select className="px-4 py-3 rounded-xl border-0 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg">
                <option>すべての地域</option>
                <option>東京</option>
                <option>京都</option>
                <option>大阪</option>
                <option>沖縄</option>
                <option>北海道</option>
              </select>
              <select className="px-4 py-3 rounded-xl border-0 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg">
                <option>新着順</option>
                <option>人気順</option>
                <option>いいね数順</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storiesData.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-16">
            <InteractiveButton
              style={{
                padding: '14px 32px'
              }}
            >
              もっと読む
            </InteractiveButton>
          </div>
        </div>
      </div>
    </>
  );
}