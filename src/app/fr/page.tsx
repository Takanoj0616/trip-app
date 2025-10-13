import { Metadata } from 'next';
import Home from '@/app/page';

import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Guide de voyage au Japon | Découvrez le Japon',
  description: "Découvrez les meilleurs endroits à visiter au Japon avec notre guide complet. Planification IA, recommandations personnalisées et expériences authentiques.",
  keywords: 'guide voyage japon,tourisme japon,planificateur IA,itineraires,Tokyo',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/fr`,
    languages: {
      'x-default': `${baseUrl}`,
      'ja-JP': `${baseUrl}/`,
      'en-GB': `${baseUrl}/en`,
      'en-US': `${baseUrl}/en`,
      'fr-FR': `${baseUrl}/fr`,
      'ko-KR': `${baseUrl}/ko`,
      'ar-SA': `${baseUrl}/ar`,
    }
  },
  openGraph: {
    title: 'Guide de voyage au Japon | Découvrez le Japon',
    description: "Découvrez les meilleurs endroits à visiter au Japon avec notre guide complet. Planification IA, recommandations personnalisées et expériences authentiques.",
    url: `${baseUrl}/fr`,
    siteName: 'Trip App',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide de voyage au Japon | Découvrez le Japon',
    description: "Découvrez les meilleurs endroits à visiter au Japon avec notre guide complet.",
  }
};

export default Home;
