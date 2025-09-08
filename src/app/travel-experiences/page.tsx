import ClientOnly from '@/components/ClientOnly'
import TravelExperiencesContent from './TravelExperiencesContent'
import BodyClassHandler from './BodyClassHandler'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Experiences & Stories | Japan Travel Guide',
  description:
    'Browse authentic Japan travel experiences and stories. Discover itineraries, tips, and hidden spots in Tokyo, Yokohama, Saitama and Chiba.',
  openGraph: {
    title: 'Travel Experiences & Stories | Japan Travel Guide',
    description:
      'Authentic Japan travel experiences, itineraries and tips across major destinations.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Experiences & Stories | Japan Travel Guide',
    description:
      'Real traveler stories and itineraries for Japan trips.',
  },
  alternates: {
    languages: {
      'x-default': '/travel-experiences',
      'en-US': '/travel-experiences?lang=en',
      'en-GB': '/travel-experiences?lang=en',
      'fr-FR': '/travel-experiences?lang=fr',
      'ja-JP': '/travel-experiences?lang=ja',
      'ko-KR': '/travel-experiences?lang=ko',
      'ar-SA': '/travel-experiences?lang=ar',
    },
  },
}

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
