import { Metadata } from 'next';
import Home from '@/app/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Guide de voyage au Japon | Découvrez le Japon',
  description: "Découvrez les meilleurs endroits à visiter au Japon avec notre guide complet. Planification IA, recommandations personnalisées et expériences authentiques.",
  keywords: 'guide voyage japon,tourisme japon,planificateur IA,itineraires,Tokyo',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/fr`,
    languages: {
      'ja': `${baseUrl}/`,
      'en': `${baseUrl}/en`,
      'fr': `${baseUrl}/fr`,
      'ko': `${baseUrl}/ko`,
      'ar': `${baseUrl}/ar`,
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

