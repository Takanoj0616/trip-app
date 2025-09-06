import ClientOnly from '@/components/ClientOnly'
import TravelExperiencesContent from './TravelExperiencesContent'
import BodyClassHandler from './BodyClassHandler'

export default function TravelExperiencesPage() {
  return (
    <div id="travel-experiences-root" className="relative min-h-screen">
      {/* 日本らしい背景画像 */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Body class handler */}
      <BodyClassHandler />
      
      {/* コンテンツ */}
      <div className="relative z-10" suppressHydrationWarning>
        <ClientOnly fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="glass-card p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          </div>
        }>
          <TravelExperiencesContent />
        </ClientOnly>
      </div>
    </div>
  )
}
