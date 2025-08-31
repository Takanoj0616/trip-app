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

export default function AIPlanPage() {
  const router = useRouter();
  const { selectedSpots } = useRoute();
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
      const encoded = encodeURIComponent(JSON.stringify(json.route));
      router.push(`/route/result?data=${encoded}`);
    } catch (e: unknown) {
      setError((e as Error)?.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-plan-scope min-h-screen" style={{
      background: "linear-gradient(135deg, #1e3a8a 0%, #312e81 25%, #1e1b4b 50%, #0f172a 75%, #020617 100%)"
    }}>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <div className="ai-hero-slide">
            <Image
              src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="桜と富士山"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="ai-hero-slide">
            <Image
              src="https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=2076&q=80"
              alt="日本の寺院"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="ai-hero-slide">
            <Image
              src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="富士山"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-8 pt-20 md:pt-24 lg:pt-28">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/90 to-blue-500/90 px-6 py-3 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles size={20} />
            <span className="font-semibold">AI Powered Travel Planning</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            AI旅行プラン
            <br />
            <span className="text-3xl md:text-4xl opacity-90">あなただけの特別な旅を</span>
          </h1>
          
          <p className="text-xl md:text-2xl opacity-95 mb-12 max-w-2xl mx-auto text-shadow">
            選択したスポットから最適なルート・移動方法・時間配分まで、AIが日本の伝統文化を感じる完璧な旅程を提案します
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 text-white backdrop-blur-sm border-0 no-global-border">
              <Mountain size={20} className="text-blue-300" />
              <span>富士山エリア対応</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 text-white backdrop-blur-sm border-0 no-global-border">
              <Cherry size={20} className="text-pink-300" />
              <span>桜の季節を考慮</span>
            </div>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 text-white backdrop-blur-sm border-0 no-global-border">
              <span className="text-xl">⛩️</span>
              <span>寺社仏閣ルート</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🌸</div>
        <div className="absolute top-40 right-20 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>⛩️</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-bounce" style={{ animationDelay: '2s' }}>🗻</div>
      </section>

      {/* Background Animation Styles */}
      <style jsx>{``}</style>

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
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="text-slate-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">スポットがまだありません</h3>
                  <p className="text-slate-500 mb-6">各スポット詳細ページの「AI旅行プランに入れる」ボタンから追加してください</p>
                  <Link 
                    href="/spots/tokyo?category=sights"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <MapPin size={20} />
                    スポットを探す
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* AI Features Section */}
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

          {/* Generate Button Section */}
          <section className="text-center">
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='2' fill='white'/%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px'
                }} />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full mb-6 backdrop-blur-sm">
                  <Bot size={24} />
                  <span className="font-semibold">AI Travel Planner</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  最適な旅程を生成しますか？
                </h2>
                
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
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
                      className="text-blue-300 hover:text-blue-200 underline underline-offset-4 font-medium"
                    >
                      → おすすめスポットを探す
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
