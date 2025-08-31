'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoute } from '@/contexts/RouteContext';
import type { TouristSpot } from '@/types';

export default function AIPlanPage() {
  const router = useRouter();
  // ルートプロバイダから直接購読（常に最新を反映）
  const { selectedSpots } = useRoute();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // show toast if came just after add
    try {
      const flag = sessionStorage.getItem('ai-plan-added');
      if (flag) {
        alert('スポットを追加しました。ここからAI旅行プランを作成できます。');
        sessionStorage.removeItem('ai-plan-added');
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
    } catch (e: any) {
      setError(e?.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-40 md:pt-44 lg:pt-48 pb-16">
      <h1 className="text-2xl font-semibold mb-4">AI旅行プラン</h1>
      <p className="text-slate-600 mb-6">追加したスポットから最適な移動方式を含むルートを作成します。</p>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="mb-6 p-6 rounded-2xl border shadow-sm bg-white/70 backdrop-blur">
        <h2 className="font-medium mb-4">選択中のスポット（{selectedSpots?.length || 0}）</h2>
        {selectedSpots?.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedSpots.map((s) => (
              <li key={s.id} className="p-3 rounded-xl border bg-white/60">
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-slate-500">{s.location?.address || s.area || ''}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-slate-600">まだスポットがありません。各スポット詳細の「AI旅行プランに入れる」から追加してください。</div>
        )}
      </div>
      <button onClick={generate} disabled={loading || (selectedSpots?.length || 0) < 2} className="px-6 py-3 rounded-lg bg-indigo-600 text-white disabled:opacity-50">
        {loading ? '作成中...' : (selectedSpots?.length || 0) < 2 ? '2スポット以上追加してください' : 'AI旅行プランを作る'}
      </button>
      {(selectedSpots?.length || 0) < 2 && (
        <a href="/spots/tokyo?category=sights" className="ml-4 text-indigo-700 underline">
          スポットを探す
        </a>
      )}
    </div>
  );
}
