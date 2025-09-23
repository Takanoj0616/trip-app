'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">このサイトについて</h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        本サイトは、海外旅行者および日本国内ユーザーの双方に役立つ「実用性の高い観光情報」を提供することを目的とした観光ガイド＆AIプランニングサービスです。
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">運営情報</h2>
        <ul className="text-gray-700 space-y-1">
          <li>運営名: TravelGuideJapan</li>
          <li>代表: Japan Travel Guide Team</li>
          <li>お問い合わせ: <a href="mailto:contact@travelguidejapan.example" className="underline">contact@travelguidejapan.example</a></li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">編集方針・掲載基準（E-E-A-T）</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>一次情報（公式サイト・施設発表）を優先的に参照し、最新性を保ちます。</li>
          <li>営業時間・料金・アクセス情報は定期的に点検し、変更時は迅速に更新します。</li>
          <li>レビュー・体験談はステマ禁止。編集部・ユーザーいずれも実体験・根拠を明記します。</li>
          <li>誤りの指摘・修正依頼は上記問い合わせ先より随時受け付けています。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">データ出典</h2>
        <p className="text-gray-700">
          観光スポット情報は編集部の実地調査のほか、ユーザー提供情報、オープンデータ等を活用しています。画像・動画・レビュー等のユーザー生成コンテンツは利用規約・ガイドラインに従い掲載されます。
        </p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 underline">トップに戻る</Link>
      </div>
    </div>
  );
}

