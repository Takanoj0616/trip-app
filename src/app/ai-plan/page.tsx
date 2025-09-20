'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoute } from '@/contexts/RouteContext';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Bot, 
  MapPin, 
  Clock, 
  Star, 
  Plus,
  Sparkles,
  Mountain,
  Cherry,
  Zap
} from 'lucide-react';

import './override.css';
import SakuraBackground from '@/components/SakuraBackground';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AIPlanPage() {
  const router = useRouter();
  const { selectedSpots } = useRoute();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem('ai-plan-added');
      if (flag) {
        setToastMsg('スポットを追加しました！ここからAI旅行プランを作成できます。');
        sessionStorage.removeItem('ai-plan-added');
        setTimeout(() => setToastMsg(null), 4000);
      }
    } catch {}
  }, []);

  const generate = async () => {
    setError(null);
    if (!selectedSpots || selectedSpots.length < 2) {
      setError('少なくとも2つ以上のスポットを追加してください。');
      return;
    }
    setLoading(true);
    try {
      const area = selectedSpots[0]?.area || 'tokyo';
      const resp = await fetch('/api/generate-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedSpots,
          area,
          preferences: {
            transportation: 'mixed',
            duration: 'full-day',
            interests: Array.from(new Set((selectedSpots.flatMap(s => s.tags || []) as string[]).slice(0, 5)))
          }
        })
      });
      if (!resp.ok) throw new Error('ルート生成に失敗しました');
      const json = await resp.json();
      if (!json?.route) throw new Error('不正なレスポンス');
      // Avoid extremely long URLs that can trigger 431/414.
      // Store the route client-side and navigate with a small id param.
      try {
        const route = json.route;
        const id = route.id || `route_${Date.now()}`;
        // Persist to sessionStorage for this browsing session
        sessionStorage.setItem(`route:${id}`, JSON.stringify(route));
        sessionStorage.setItem('last-route-id', id);
        // Also keep a simple latest pointer
        sessionStorage.setItem('last-route', JSON.stringify(route));
        router.push(`/route/result?id=${encodeURIComponent(id)}`);
      } catch {
        // Fallback: minimal payload in URL (only id)
        router.push(`/route/result`);
      }
    } catch (e: unknown) {
      setError((e as Error)?.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-plan-scope min-h-screen">
      {/* Fixed background & Sakura effect to match other pages */}
      <div className="hero-background" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: -2,
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%), url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=2070&q=80')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }} />
      <SakuraBackground />

      {/* Hero Section (central card + overlay) */}
      <section className="hero relative min-h-[64vh] grid place-items-center">
        <div className="hero__overlay" />
        <div className="hero__container">
          <div className="heroCard" role="region" aria-label="AI Travel Planner">
            <div className="inline-flex items-center gap-3 bg-white/20 text-white px-5 py-2.5 rounded-full">
              <Sparkles size={18} aria-hidden />
              <span className="font-semibold">{t('home.aiPlan.label')}</span>
            </div>
            <h1 className="heroCard__title">{t('home.aiPlan.headline')}</h1>
            <p className="heroCard__lead">{t('home.aiPlan.subhead')}</p>
            <div className="heroCard__ctas" role="group" aria-label="primary actions">
              <Link href="/spots/tokyo?category=sights" className="cta cta--primary">{t('home.tryFree')}</Link>
              <Link href="#areas" className="cta cta--secondary">{t('home.ctaSecondary')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Areas scroller/cards under hero */}
      <section id="areas" className="areasWrap mt-6 mb-10">
        <div className="areas" aria-label="areas list">
          <Link href="/spots/tokyo" className="areaCard">
            <div>🗼</div>
            <div className="areaTitle">{t('areas.tokyo.title')}</div>
            <div className="areaDesc">{t('areas.tokyo.description')}</div>
          </Link>
          <Link href="/areas" className="areaCard">
            <div>🌊</div>
            <div className="areaTitle">{t('areas.yokohama.title')}</div>
            <div className="areaDesc">{t('areas.yokohama.description')}</div>
          </Link>
          <Link href="/areas" className="areaCard">
            <div>⛩️</div>
            <div className="areaTitle">{t('areas.kyoto.title')}</div>
            <div className="areaDesc">{t('areas.kyoto.description')}</div>
          </Link>
          <Link href="/areas" className="areaCard">
            <div>🍜</div>
            <div className="areaTitle">{t('areas.osaka.title')}</div>
            <div className="areaDesc">{t('areas.osaka.description')}</div>
          </Link>
        </div>
      </section>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed right-4 top-24 z-50">
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur border border-emerald-400/20">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">{toastMsg}</span>
          </div>
        </div>
      )}

      <div className="relative -mt-20 z-10 px-6">
        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto">
          {/* Generate Button Section - TOP位置 */}
          <section id="how-it-works" className="text-center mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 text-slate-900 relative overflow-hidden border border-white/20 shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='2' fill='white'/%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px'
                }} />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 bg-sky-50 text-sky-700 border border-sky-200 px-5 py-2.5 rounded-full mb-6">
                  <Bot size={20} />
                  <span className="font-semibold">AI Travel Planner</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
                  最適な旅程を生成しますか？
                </h2>

                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  選択されたスポットを基に、移動時間・料金・営業時間を全て考慮した完璧な1日プランを作成します
                </p>

                <button
                  onClick={generate}
                  disabled={loading || (selectedSpots?.length || 0) < 2}
                  className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xl font-bold rounded-2xl hover:from-emerald-600 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI旅行プランを生成中...
                    </>
                  ) : (selectedSpots?.length || 0) < 2 ? (
                    <>
                      <Plus size={24} />
                      2つ以上のスポットを追加してください
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      AI旅行プランを生成
                    </>
                  )}
                </button>

                {(selectedSpots?.length || 0) < 2 && (
                  <div className="mt-6">
                    <Link
                      href="/spots/tokyo?category=sights"
                      className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium"
                    >
                      → おすすめスポットを探す
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Selected Spots Section */}
          <section className="mb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">選択中のスポット</h2>
                  <p className="text-slate-600">現在 {selectedSpots?.length || 0} 箇所が選択されています</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {selectedSpots?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {selectedSpots.map((spot, index) => {
                    const img = (spot.images && spot.images[0]) || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=70';
                    return (
                      <div key={spot.id} className="rounded-3xl overflow-hidden bg-white text-slate-900 shadow-xl border border-white/60">
                        <div className="relative h-52">
                          <Image src={img} alt={spot.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-500 text-white">人気</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-emerald-600 text-white">Open Now</span>
                          </div>
                          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-slate-700 flex items-center justify-center">♡</div>
                          <div className="absolute -bottom-4 left-6 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center font-bold">{index + 1}</div>
                        </div>
                        <div className="p-6 pt-8">
                          <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
                          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <MapPin size={14} />
                            <span>{spot.location?.address || spot.area || '東京'}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="text-yellow-400" size={16} fill="currentColor" />
                            <span className="text-sm font-medium text-slate-700">{spot.rating ?? '4.2'}</span>
                          </div>
                          {!!(spot.tags && spot.tags.length) && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {spot.tags.slice(0, 6).map((tag, tagIndex) => (
                                <span key={tagIndex} className="chip inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700 border">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-4">
                            <a href={`/spots/${spot.id}?lang=ja`} className="block w-full text-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  {/* Main Message */}
                  <div className="mb-12">
                    <h3 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">まずはエリアを選んでね！</h3>
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
                      <p className="text-white text-lg drop-shadow">行きたいエリアを選ぶと、そのエリアの人気スポットが表示されます</p>
                    </div>
                  </div>

                  {/* エリアカードグリッド */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {/* 東京カード */}
                    <Link href="/spots/tokyo?category=sights" className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        {/* アイコン */}
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">🗼</div>
                        </div>

                        {/* タイトル */}
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">東京</h4>

                        {/* 評価 */}
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <div className="flex text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} className="text-gray-300" />
                          </div>
                          <span className="text-yellow-600 text-sm font-semibold ml-1">4.8</span>
                        </div>

                        {/* 説明 */}
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">伝統とネオンが交じる場所—日本の首都を巡ろう。</p>

                        {/* スポット数 */}
                        <div className="text-blue-600 font-bold text-lg mb-6">185 観光スポット</div>

                        {/* CTA */}
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">詳細を見る</div>
                      </div>
                    </Link>

                    {/* 大阪カード */}
                    <Link href="/spots/osaka?category=sights" className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">🏰</div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">大阪</h4>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <div className="flex text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} className="text-gray-300" />
                          </div>
                          <span className="text-yellow-600 text-sm font-semibold ml-1">4.6</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">食いだおれの街でお城と美食を楽しむ旅。</p>
                        <div className="text-blue-600 font-bold text-lg mb-6">142 観光スポット</div>
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">詳細を見る</div>
                      </div>
                    </Link>

                    {/* 京都カード */}
                    <Link href="/spots/kyoto?category=sights" className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">⛩️</div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">京都</h4>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <div className="flex text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                          </div>
                          <span className="text-yellow-600 text-sm font-semibold ml-1">4.9</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">古都の美しさを紅葉と寺院で感じる旅。</p>
                        <div className="text-blue-600 font-bold text-lg mb-6">98 観光スポット</div>
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">詳細を見る</div>
                      </div>
                    </Link>

                    {/* 横浜カード */}
                    <Link href="/spots/yokohama?category=sights" className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">🌆</div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">横浜</h4>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <div className="flex text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} className="text-gray-300" />
                          </div>
                          <span className="text-yellow-600 text-sm font-semibold ml-1">4.5</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">ミナトみらいと中華街の彩り豊かな港街。</p>
                        <div className="text-blue-600 font-bold text-lg mb-6">76 観光スポット</div>
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">詳細を見る</div>
                      </div>
                    </Link>

                    {/* 奈良カード */}
                    <Link href="/spots/nara?category=sights" className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">🦌</div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">奈良</h4>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <div className="flex text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} className="text-gray-300" />
                          </div>
                          <span className="text-yellow-600 text-sm font-semibold ml-1">4.7</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">鹿たちと遊び、大仏と寺院を巡る古都。</p>
                        <div className="text-blue-600 font-bold text-lg mb-6">54 観光スポット</div>
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">詳細を見る</div>
                      </div>
                    </Link>

                    {/* 神戸カード */}
                    <Link href="/spots/kobe?category=sights" className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">⛵</div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">神戸</h4>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          <div className="flex text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} className="text-gray-300" />
                          </div>
                          <span className="text-yellow-600 text-sm font-semibold ml-1">4.4</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">神戸牛と夢の大橋が語る美しい港街。</p>
                        <div className="text-blue-600 font-bold text-lg mb-6">62 観光スポット</div>
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">詳細を見る</div>
                      </div>
                    </Link>
                  </div>

                  {/* AI Features - コンパクトに配置 */}
                  <div className="mt-16">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-white/20">
                      <h4 className="text-white text-lg font-bold mb-6 text-center">🤖 エリアを選んだ後はAIが自動で最適化</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                            <Zap className="text-white" size={20} />
                          </div>
                          <div className="font-bold text-white text-sm mb-1">最適ルート</div>
                          <div className="text-white/80 text-xs">移動時間を最小化</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                            <Clock className="text-white" size={20} />
                          </div>
                          <div className="font-bold text-white text-sm mb-1">時間配分</div>
                          <div className="text-white/80 text-xs">混雑に応じて調整</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                            <Cherry className="text-white" size={20} />
                          </div>
                          <div className="font-bold text-white text-sm mb-1">季節考慮</div>
                          <div className="text-white/80 text-xs">桜・紅葉も反映</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Help text */}
                  <p className="text-white/70 mt-12 text-sm bg-black/10 backdrop-blur-sm rounded-full px-6 py-3 inline-block">💡 各エリアを選んで、お気に入りスポットをAIプランに追加してください</p>
                </div>
              )}
            </div>
          </section>

          {/* AI Features Section (hide when empty state already shows above) */}
          {(selectedSpots?.length || 0) > 0 && (
          <section className="mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">最適ルート生成</h3>
                <p className="text-slate-600 text-sm">移動時間・交通手段を考慮して効率的なルートを自動生成</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">時間配分最適化</h3>
                <p className="text-slate-600 text-sm">各スポットでの滞在時間を混雑状況に応じて調整</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Cherry className="text-white" size={24} />
                </div>
              <h3 className="font-bold text-slate-800 mb-2">季節を考慮</h3>
              <p className="text-slate-600 text-sm">桜の開花時期や紅葉シーズンなど季節要素を反映</p>
              </div>
            </div>
          </section>
          )}

        </div>
      </div>
    </div>
  );
}
