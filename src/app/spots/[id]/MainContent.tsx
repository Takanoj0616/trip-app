'use client';

import { useState } from 'react';
import {
  Clock,
  DollarSign,
  Hourglass,
  Star,
  Users,
  MapPin,
  Heart,
  Bot,
  Ticket,
  Images,
  Info,
  MessageSquare,
  Twitter,
  Accessibility,
  Baby,
  Bath,
  Camera,
  Ban,
  Wifi,
  Store,
  Utensils,
  HelpCircle,
  Map,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Map component を動的インポート（SSRを無効化）
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
      <p>地図を読み込み中...</p>
    </div>
  ),
});

interface MainContentProps {
  language?: string;
  currency?: string;
  unit?: string;
}

export default function MainContent({
  language: _language = 'ja',
  currency = 'jpy',
  unit: _unit = 'metric',
}: MainContentProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const showNotification = (message: string, _type: 'success' | 'info' = 'info') => {
    // 通知表示のロジック（実装を簡略化）
    alert(message);
  };

  const addToFavorites = () => {
    showNotification('お気に入りに追加しました！', 'success');
  };

  const addToAITravelPlan = () => {
    showNotification('AI旅行プランに追加しました！', 'success');
  };

  // 現在の営業時間を計算
  const getBusinessHours = () => {
    // const now = new Date(); // 将来的に動的計算に使用予定
    return '本日: 9:00 - 23:00';
  };

  // 料金表示
  const getPriceDisplay = () => {
    if (currency === 'jpy') {
      return '¥1,200 - ¥3,000';
    }
    return '$8 - $20';
  };

  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-primary/80 to-primary-light/60 flex items-center justify-center text-white overflow-hidden">
        {/* 背景 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-45 from-primary/10 to-primary-light/10 backdrop-blur-sm" />
          {/* SVGで東京タワーのシルエットを作成 */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg
              width="400"
              height="600"
              viewBox="0 0 400 600"
              className="text-white"
            >
              <polygon
                fill="currentColor"
                points="200,50 250,200 150,200"
              />
              <rect fill="currentColor" x="175" y="200" width="50" height="300" />
              <circle fill="currentColor" cx="200" cy="100" r="20" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-8">
          <h1 className="mb-6 text-shadow-lg bg-gradient-to-br from-white to-slate-100 bg-clip-text text-transparent">
            東京タワー
            <br />
            <span className="text-3xl opacity-90">Tokyo Tower</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-95 mb-12 text-shadow">
            東京のシンボル、333mの展望タワー
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={addToFavorites}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:scale-105 transform transition-all duration-300 shadow-xl"
            >
              <Heart size={20} />
              お気に入りに追加
            </button>
            <button
              onClick={addToAITravelPlan}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/90 text-secondary font-semibold backdrop-blur-sm hover:bg-white hover:scale-105 transform transition-all duration-300 shadow-xl"
            >
              <Bot size={20} />
              AI旅行プランに入れる
            </button>
            <a
              href="#tickets"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-white/50 hover:scale-105 transform transition-all duration-300"
            >
              <Ticket size={20} />
              チケット予約
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6">
        {/* クイック情報 */}
        <section className="relative -mt-20 z-10 mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-border-light p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Clock className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">営業時間</h3>
                <p className="text-lg font-semibold mb-1">{getBusinessHours()}</p>
                <small className="text-text-light">メインデッキ・トップデッキ</small>
              </div>

              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <DollarSign className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">料金</h3>
                <p className="text-lg font-semibold mb-1">{getPriceDisplay()}</p>
                <small className="text-text-light">メインデッキ・トップデッキ</small>
              </div>

              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Hourglass className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">滞在時間</h3>
                <p className="text-lg font-semibold mb-1">1.5 - 3時間</p>
                <small className="text-text-light">平均的な滞在時間</small>
              </div>

              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Star className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">評価</h3>
                <div className="flex justify-center items-center gap-2 mb-1">
                  <span className="text-yellow-400 text-xl">★★★★☆</span>
                  <span className="font-semibold">4.2</span>
                </div>
                <small className="text-text-light">(2,847件)</small>
              </div>

              <div className="text-center p-6 border border-border-light rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <Users className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-secondary mb-2">混雑状況</h3>
                <p className="text-lg font-semibold mb-2">普通</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-6 h-1.5 rounded-full ${
                        i <= 2 ? 'bg-warning' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 地図・アクセス */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <MapPin className="text-primary" size={24} />
            アクセス・地図
          </h2>

          <MapComponent />

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 border border-border-light rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
              <h3 className="flex items-center gap-3 text-secondary mb-6">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                最寄り駅
              </h3>
              <ul className="space-y-3">
                <li className="border-b border-border-light pb-3">
                  <strong className="text-secondary">赤羽橋駅</strong>
                  <span className="text-text-muted"> (都営大江戸線) - 徒歩5分</span>
                </li>
                <li className="border-b border-border-light pb-3">
                  <strong className="text-secondary">神谷町駅</strong>
                  <span className="text-text-muted">
                    {' '}
                    (東京メトロ日比谷線) - 徒歩7分
                  </span>
                </li>
                <li>
                  <strong className="text-secondary">御成門駅</strong>
                  <span className="text-text-muted"> (都営三田線) - 徒歩6分</span>
                </li>
              </ul>
            </div>

            <div className="p-6 border border-border-light rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
              <h3 className="flex items-center gap-3 text-secondary mb-6">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                車でのアクセス
              </h3>
              <p className="text-text-muted mb-3">
                首都高速都心環状線「芝公園」出口より約10分
              </p>
              <p className="text-text-muted mb-2">
                <strong className="text-secondary">駐車場:</strong> タワーパーキング（150台）
              </p>
              <p className="text-text-muted">
                平日: ¥600/h、土日祝: ¥800/h
              </p>
            </div>
          </div>
        </section>

        {/* 写真ギャラリー */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Images className="text-primary" size={24} />
            写真ギャラリー
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'exterior', label: '外観' },
              { id: 'observatory', label: '展望台' },
              { id: 'night', label: '夜景' },
              { id: 'interior', label: '内部' },
            ].map((item) => (
              <div
                key={item.id}
                className="aspect-[16/10] bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
                onClick={() => openModal(item.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openModal(item.id);
                  }
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 詳細説明 */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Info className="text-primary" size={24} />
            詳細説明
          </h2>

          <div className="prose max-w-none">
            <p className="text-text-muted mb-6">
              東京タワーは1958年に建設された東京のシンボル的な電波塔です。高さ333メートルで、東京都港区芝公園に位置しています。
            </p>

            <h3 className="text-secondary">見どころ</h3>
            <ul className="list-disc list-inside space-y-2 text-text-muted mb-6">
              <li>
                <strong className="text-secondary">メインデッキ（150m）:</strong>{' '}
                東京の360度パノラマビューを楽しめます
              </li>
              <li>
                <strong className="text-secondary">トップデッキ（250m）:</strong>{' '}
                より高い位置からの絶景と特別な体験
              </li>
              <li>
                <strong className="text-secondary">フットタウン:</strong>{' '}
                ショッピング、レストラン、水族館
              </li>
              <li>
                <strong className="text-secondary">ライトアップ:</strong>{' '}
                季節やイベントに合わせた美しい照明
              </li>
            </ul>

            <h3 className="text-secondary">歴史</h3>
            <p className="text-text-muted">
              東京タワーは戦後復興のシンボルとして建設され、現在でも東京の重要なランドマークとして多くの人に愛されています。エッフェル塔をモデルにしながらも、日本独自のデザインが特徴的です。
            </p>
          </div>
        </section>

        {/* 口コミ・レビュー */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <MessageSquare className="text-primary" size={24} />
            口コミ・レビュー
          </h2>

          <div className="space-y-6">
            {[
              {
                name: '田中太郎',
                rating: 5,
                date: '2024/08/20',
                comment:
                  '夜景が本当に美しかったです！特にトップデッキからの眺めは圧巻でした。少し混雑していましたが、スタッフの対応も良く満足できました。',
              },
              {
                name: 'Sarah Johnson',
                rating: 4,
                date: '2024/08/18',
                comment:
                  'Amazing views of Tokyo! The elevator ride was smooth and the observation decks were well-maintained. A bit pricey but worth the experience for first-time visitors.',
              },
              {
                name: '山田花子',
                rating: 4,
                date: '2024/08/15',
                comment:
                  '家族で訪問しました。子供たちも大興奮でした。フットタウンにもたくさんの楽しい施設があり、一日中楽しめます。',
              },
            ].map((review, index) => (
              <div
                key={index}
                className="border-b border-border-light pb-6 hover:bg-slate-50/50 -mx-4 px-4 py-4 rounded-xl transition-colors"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-secondary">
                    {review.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="text-text-light text-sm">{review.date}</span>
                  </div>
                </div>
                <p className="text-text-muted leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SNSリアルタイム情報 */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Twitter className="text-primary" size={24} />
            SNS・リアルタイム情報
          </h2>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 text-center">
            <Twitter className="mx-auto mb-4 text-blue-400" size={48} />
            <div className="text-lg font-semibold mb-2">
              #東京タワー #TokyoTower のリアルタイム投稿
            </div>
            <p className="text-text-muted mb-6">
              最新の投稿や混雑状況をチェックできます
            </p>
            <button className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">
              最新情報を読み込み
            </button>
          </div>
        </section>

        {/* チケット・予約CTA */}
        <section
          id="tickets"
          className="bg-gradient-to-br from-primary to-primary-light rounded-3xl p-12 text-center text-white mb-12 relative overflow-hidden"
        >
          {/* 背景パターン */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='2' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '50px 50px',
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="flex items-center justify-center gap-4 mb-4">
              <Ticket size={32} />
              チケット・予約
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              事前予約でスムーズに入場！特別料金もご用意しています。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white/90 text-secondary rounded-xl font-semibold backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300">
                公式サイトで予約
              </button>
              <button className="px-8 py-4 bg-white/90 text-secondary rounded-xl font-semibold backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300">
                チケット予約サイト
              </button>
            </div>
          </div>
        </section>

        {/* 設備・注意事項 */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Info className="text-primary" size={24} />
            設備・注意事項
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Baby, text: 'ベビーカー利用可', available: true },
              { icon: Accessibility, text: 'バリアフリー対応', available: true },
              { icon: Bath, text: '多目的トイレあり', available: true },
              { icon: Camera, text: '撮影OK', available: true },
              { icon: Ban, text: '全館禁煙', available: false },
              { icon: Wifi, text: '無料Wi-Fi', available: true },
              { icon: Store, text: 'お土産ショップ', available: true },
              { icon: Utensils, text: 'レストラン・カフェ', available: true },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-transform hover:scale-105 ${
                  item.available
                    ? 'border-success/20 text-success bg-green-50'
                    : 'border-danger/20 text-danger bg-red-50'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-secondary mb-4">注意事項</h3>
          <ul className="list-disc list-inside space-y-2 text-text-muted">
            <li>悪天候時は展望台が閉鎖される場合があります</li>
            <li>大きな荷物は有料ロッカーをご利用ください</li>
            <li>ペットの同伴はできません（盲導犬等は除く）</li>
            <li>三脚を使用した撮影は禁止されています</li>
            <li>混雑時は入場制限を行う場合があります</li>
          </ul>
        </section>

        {/* よくある質問 */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <HelpCircle className="text-primary" size={24} />
            よくある質問
          </h2>

          <div className="space-y-4">
            {[
              {
                question: '営業時間を教えてください',
                answer:
                  'メインデッキ：9:00～23:00（最終入場 22:30）\nトップデッキ：9:00～22:45（最終入場 22:00～22:15）\nフットタウン：10:00～21:00（店舗により異なります）',
              },
              {
                question: '料金はいくらですか？',
                answer:
                  'メインデッキ：大人 1,200円、高校生 1,000円、小中学生 700円、幼児（4歳以上） 500円\nトップデッキ：+2,800円（13歳以上）、+1,800円（小学生）、+1,200円（幼児）',
              },
              {
                question: '予約は必要ですか？',
                answer:
                  'メインデッキは予約不要ですが、トップデッキは事前予約が必要です。特に土日祝日や夜景の時間帯は混雑するため、事前予約をおすすめします。',
              },
              {
                question: '車椅子でも利用できますか？',
                answer:
                  'はい、バリアフリー対応しており、車椅子でもご利用いただけます。エレベーターや多目的トイレも完備しています。',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-border-light rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 flex justify-between items-center transition-colors"
                >
                  <span className="font-semibold text-secondary">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-primary transition-transform ${
                      activeFAQ === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeFAQ === index && (
                  <div className="p-6 bg-white">
                    <p className="text-text-muted whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 近隣スポット */}
        <section className="bg-white rounded-3xl shadow-lg border border-border-light p-8 mb-12">
          <h2 className="flex items-center gap-4 text-secondary border-b border-border-light pb-4 mb-8">
            <Map className="text-primary" size={24} />
            近隣の観光スポット
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: '増上寺',
                distance: '徒歩3分',
                category: '歴史ある寺院',
                description:
                  '東京タワーを背景にした美しい寺院。徳川家の菩提寺として有名です。',
                color: 'from-green-400 to-green-600',
              },
              {
                name: '芝公園',
                distance: '徒歩1分',
                category: '都市公園',
                description:
                  '東京タワーの足元に広がる緑豊かな公園。散歩やピクニックにおすすめです。',
                color: 'from-emerald-400 to-emerald-600',
              },
              {
                name: '愛宕神社',
                distance: '徒歩8分',
                category: '神社',
                description:
                  '出世の石段で有名な神社。東京23区で最も高い自然の山にあります。',
                color: 'from-blue-400 to-blue-600',
              },
            ].map((spot, index) => (
              <div
                key={index}
                className="border border-border-light rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white"
              >
                <div className={`h-48 bg-gradient-to-br ${spot.color}`} />
                <div className="p-6">
                  <h3 className="font-semibold text-secondary mb-2">{spot.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3">
                    {spot.distance} • {spot.category}
                  </p>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {spot.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* モーダル */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              ×
            </button>
            <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
              <span className="text-2xl font-semibold">
                {activeModal === 'exterior' && '外観'}
                {activeModal === 'observatory' && '展望台'}
                {activeModal === 'night' && '夜景'}
                {activeModal === 'interior' && '内部'}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}