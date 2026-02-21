'use client';

import { useEffect, useMemo, useState } from 'react';
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
  Cherry,
  Zap
} from 'lucide-react';

import './override.css';
import SakuraBackground from '@/components/SakuraBackground';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AIPlanPage() {
  const router = useRouter();
  const { selectedSpots } = useRoute();
  const { t, currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const localePrefix = ['en', 'ko', 'fr', 'ar'].includes(currentLanguage) ? `/${currentLanguage}` : '';
  const withLocale = (path: string) => `${localePrefix}${path}`;
  const uniqueSelectedSpots = useMemo(() => {
    if (!Array.isArray(selectedSpots)) return [];
    const seen = new Set<string>();
    return selectedSpots.filter((spot) => {
      const id = typeof spot?.id === 'string' ? spot.id.trim() : '';
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [selectedSpots]);

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem('ai-plan-added');
      if (flag) {
        setToastMsg(t('aiPlan.toast.added'));
        sessionStorage.removeItem('ai-plan-added');
        setTimeout(() => setToastMsg(null), 4000);
      }
    } catch {}
  }, [t]);

  const generate = async () => {
    setError(null);
    if (uniqueSelectedSpots.length < 2) {
      setError(t('aiPlan.errors.needTwo'));
      return;
    }
    setLoading(true);
    try {
      const area = uniqueSelectedSpots[0]?.area || 'tokyo';
      const resp = await fetch('/api/generate-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedSpots: uniqueSelectedSpots,
          area,
          preferences: {
            transportation: 'mixed',
            duration: 'full-day',
            interests: Array.from(new Set((uniqueSelectedSpots.flatMap(s => s.tags || []) as string[]).slice(0, 5)))
          }
        })
      });
      if (!resp.ok) throw new Error(t('aiPlan.errors.routeFailed'));
      const json = await resp.json();
      if (!json?.route) throw new Error(t('aiPlan.errors.invalidResponse'));
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
      setError((e as Error)?.message || t('aiPlan.errors.generic'));
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
              <Link href={withLocale('/spots/tokyo?category=sights')} className="cta cta--primary">{t('home.tryFree')}</Link>
              <Link href="#areas" className="cta cta--secondary">{t('home.ctaSecondary')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Areas scroller/cards under hero */}
      <section id="areas" className="areasWrap mt-6 mb-10">
        <div className="areas" aria-label="areas list">
          {/* Tokyo */}
          <Link href={withLocale('/spots/tokyo')} className="areaCard" aria-label={t('areas.tokyo.title')}>
            <div className="areaCardThumb" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=70')" }} />
            <div className="areaCardBody">
              <div className="areaTitle">{t('areas.tokyo.title')}</div>
              <div className="areaStats">{'★★★★★'}<span>4.8</span><span>·</span><span>185 {t('area.spots') || 'spots'}</span></div>
              <div className="areaDesc">{t('areas.tokyo.description')}</div>
              <span className="areaCTA">{t('common.viewDetails')}</span>
            </div>
          </Link>
          {/* Yokohama */}
          <Link href={withLocale('/areas')} className="areaCard" aria-label={t('areas.yokohama.title')}>
            <div className="areaCardThumb" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557579113-5f0a738bb863?auto=format&fit=crop&w=1200&q=70')" }} />
            <div className="areaCardBody">
              <div className="areaTitle">{t('areas.yokohama.title')}</div>
              <div className="areaStats">{'★★★★☆'}<span>4.5</span><span>·</span><span>124 {t('area.spots') || 'spots'}</span></div>
              <div className="areaDesc">{t('areas.yokohama.description')}</div>
              <span className="areaCTA">{t('common.viewDetails')}</span>
            </div>
          </Link>
          {/* Saitama */}
          <Link href={withLocale('/areas')} className="areaCard" aria-label={t('areas.saitama.title')}>
            <div className="areaCardThumb" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=70')" }} />
            <div className="areaCardBody">
              <div className="areaTitle">{t('areas.saitama.title')}</div>
              <div className="areaStats">{'★★★★☆'}<span>4.3</span><span>·</span><span>98 {t('area.spots') || 'spots'}</span></div>
              <div className="areaDesc">{t('areas.saitama.description')}</div>
              <span className="areaCTA">{t('common.viewDetails')}</span>
            </div>
          </Link>
          {/* Chiba */}
          <Link href={withLocale('/areas')} className="areaCard" aria-label={t('areas.chiba.title')}>
            <div className="areaCardThumb" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=70')" }} />
            <div className="areaCardBody">
              <div className="areaTitle">{t('areas.chiba.title')}</div>
              <div className="areaStats">{'★★★★☆'}<span>4.4</span><span>·</span><span>112 {t('area.spots') || 'spots'}</span></div>
              <div className="areaDesc">{t('areas.chiba.description')}</div>
              <span className="areaCTA">{t('common.viewDetails')}</span>
            </div>
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
                  <span className="font-semibold">{t('home.aiPlan.label')}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">{t('aiPlan.generate.title')}</h2>

                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">{t('aiPlan.generate.subtitle')}</p>

                <button
                  onClick={generate}
                  disabled={loading || uniqueSelectedSpots.length < 2}
                  className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xl font-bold rounded-2xl hover:from-emerald-600 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('aiPlan.generate.loading')}
                    </>
                  ) : uniqueSelectedSpots.length < 2 ? (
                    <>
                      <Plus size={24} />
                      {t('aiPlan.generate.needTwo')}
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      {t('aiPlan.generate.button')}
                    </>
                  )}
                </button>

                {uniqueSelectedSpots.length < 2 && (
                  <div className="mt-6">
                    <Link
                      href={withLocale('/spots/tokyo?category=sights')}
                      className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium"
                    >
                      → {t('aiPlan.findSpots')}
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
                  <h2 className="text-2xl font-bold text-slate-800">{t('aiPlan.selected.title')}</h2>
                  <p className="text-slate-600">{t('aiPlan.selected.count').replace('{count}', String(uniqueSelectedSpots.length))}</p>
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

              {uniqueSelectedSpots.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {uniqueSelectedSpots.map((spot, index) => {
                    const img = (spot.images && spot.images[0]) || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=70';
                    return (
                      <div key={spot.id} className="rounded-3xl overflow-hidden bg-white text-slate-900 shadow-xl border border-white/60">
                        <div className="relative h-52">
                          <Image src={img} alt={spot.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-500 text-white">{t('common.popular')}</span>
                            <span className="px-2 py-1 text-xs rounded-full bg-emerald-600 text-white">{t('common.openNow')}</span>
                          </div>
                          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-slate-700 flex items-center justify-center">♡</div>
                          <div className="absolute -bottom-4 left-6 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center font-bold">{index + 1}</div>
                        </div>
                        <div className="p-6 pt-8">
                          <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
                          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                            <MapPin size={14} />
                            <span>{spot.location?.address || spot.area || t('areas.tokyo.title')}</span>
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
                            <Link href={withLocale(`/spots/${spot.id}`)} className="block w-full text-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
                              {t('common.viewDetails')}
                            </Link>
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
                    <h3 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">{t('aiPlan.empty.pickAreaTitle')}</h3>
                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
                      <p className="text-white text-lg drop-shadow">{t('aiPlan.empty.pickAreaLead')}</p>
                    </div>
                  </div>

                  {/* エリアカードグリッド */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {/* 東京カード */}
                    <Link href={withLocale('/spots/tokyo?category=sights')} className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        {/* アイコン */}
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">🗼</div>
                        </div>

                        {/* タイトル */}
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">{t('areas.tokyo.title')}</h4>

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
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{t('areas.tokyo.description')}</p>

                        {/* スポット数 */}
                        <div className="text-blue-600 font-bold text-lg mb-6">185 {t('area.spots')}</div>

                        {/* CTA */}
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">{t('common.viewDetails')}</div>
                      </div>
                    </Link>

                    {/* 大阪カード */}
                    <Link href={withLocale('/areas')} className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">🏰</div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">{t('areas.osaka.title')}</h4>
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
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{t('areas.osaka.description')}</p>
                        <div className="text-blue-600 font-bold text-lg mb-6">142 {t('area.spots')}</div>
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">{t('common.viewDetails')}</div>
                      </div>
                    </Link>

                    {/* 京都カード */}
                    <Link href={withLocale('/areas')} className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">⛩️</div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">{t('areas.kyoto.title')}</h4>
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
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{t('areas.kyoto.description')}</p>
                        <div className="text-blue-600 font-bold text-lg mb-6">98 {t('area.spots')}</div>
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">{t('common.viewDetails')}</div>
                      </div>
                    </Link>

                    {/* 横浜カード */}
                    <Link href={withLocale('/areas')} className="group block">
                      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-white">
                        <div className="flex justify-center mb-6">
                          <div className="w-16 h-16 text-6xl flex items-center justify-center">🌆</div>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-4">{t('areas.yokohama.title')}</h4>
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
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{t('areas.yokohama.description')}</p>
                        <div className="text-blue-600 font-bold text-lg mb-6">76 {t('area.spots')}</div>
                        <div className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors group-hover:underline">{t('common.viewDetails')}</div>
                      </div>
                    </Link>
                  </div>

                  {/* AI Features - コンパクトに配置 */}
                  <div className="mt-16">
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-white/20">
                      <h4 className="text-white text-lg font-bold mb-6 text-center">🤖 {t('aiPlan.features.optimize')}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                            <Zap className="text-white" size={20} />
                          </div>
                          <div className="font-bold text-white text-sm mb-1">{t('aiPlan.features.route')}</div>
                          <div className="text-white/80 text-xs">{t('aiPlan.features.routeLead')}</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                            <Clock className="text-white" size={20} />
                          </div>
                          <div className="font-bold text-white text-sm mb-1">{t('aiPlan.features.time')}</div>
                          <div className="text-white/80 text-xs">{t('aiPlan.features.timeLead')}</div>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                            <Cherry className="text-white" size={20} />
                          </div>
                          <div className="font-bold text-white text-sm mb-1">{t('aiPlan.features.season')}</div>
                          <div className="text-white/80 text-xs">{t('aiPlan.features.seasonLead')}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Help text */}
                  <p className="text-white/70 mt-12 text-sm bg-black/10 backdrop-blur-sm rounded-full px-6 py-3 inline-block">💡 {t('aiPlan.help.pickArea')}</p>
                </div>
              )}
            </div>
          </section>

          {/* AI Features Section (hide when empty state already shows above) */}
          {uniqueSelectedSpots.length > 0 && (
          <section className="mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{t('aiPlan.features.route')}</h3>
                <p className="text-slate-600 text-sm">{t('aiPlan.features.routeLead')}</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="text-white" size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{t('aiPlan.features.time')}</h3>
                <p className="text-slate-600 text-sm">{t('aiPlan.features.timeLead')}</p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Cherry className="text-white" size={24} />
                </div>
              <h3 className="font-bold text-slate-800 mb-2">{t('aiPlan.features.season')}</h3>
              <p className="text-slate-600 text-sm">{t('aiPlan.features.seasonLead')}</p>
              </div>
            </div>
          </section>
          )}

        </div>
      </div>
    </div>
  );
}
