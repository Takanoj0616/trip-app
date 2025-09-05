import { Suspense } from 'react'
import TravelExperiencesContent from './TravelExperiencesContent'

export default function TravelExperiencesPage() {
  return (
    <div className="min-h-screen">
      {/* 背景画像（ローカル） */}
      <div className="fixed inset-0 -z-10">
        {/* ぼかし背景 */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2092&q=80')",
            filter: 'blur(2px)',
            transform: 'scale(1.02)'
          }}
        />
        {/* 暗めのオーバーレイで可読性確保 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
        {/* 和紙風テクスチャ */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 
              'url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\' opacity=\'0.2\'><defs><pattern id=\'washi\' patternUnits=\'userSpaceOnUse\' width=\'40\' height=\'40\'><circle cx=\'10\' cy=\'10\' r=\'2\' fill=\'%23ffffff\'/><circle cx=\'30\' cy=\'30\' r=\'1.5\' fill=\'%23ffffff\'/><circle cx=\'20\' cy=\'35\' r=\'1\' fill=\'%23ffffff\'/></pattern></defs><rect width=\'200\' height=\'200\' fill=\'url(%23washi)\'/></svg>") repeat'
          }}
        />
      </div>
      
      {/* コンテンツ */}
      <div className="relative z-10">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="glass-card p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          </div>
        }>
          <TravelExperiencesContent />
        </Suspense>
      </div>
    </div>
  )
}
