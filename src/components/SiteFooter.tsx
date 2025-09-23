export default function SiteFooter() {
  return (
    <footer
      style={{ background: 'linear-gradient(135deg, #0f172a, #111827)', color: '#e5e7eb' }}
      className="mt-16"
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">運営情報</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              本サイトは日本旅行に特化した観光ガイド＆AIプランニングサービスです。編集部による実地取材情報とユーザーの口コミを組み合わせ、信頼性の高い最新情報を提供します。
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">編集方針</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>・営業時間・料金・アクセス等は一次情報を優先</li>
              <li>・誤りや変更点は迅速に更新</li>
              <li>・体験レビューはステマ禁止・実体験を明記</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">運営者</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>運営名: TravelGuideJapan</li>
              <li>所在地: 東京都内（リモート運営）</li>
              <li>お問い合わせ: <a href="mailto:contact@travelguidejapan.example" className="underline">contact@travelguidejapan.example</a></li>
              <li>このサイトについて: <a href="/about" className="underline">/about</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} TravelGuideJapan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

