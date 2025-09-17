import { Metadata } from 'next';
import Home from '@/app/page';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: 'Guide de Voyage au Japon | Découvrez le Japon',
  description: 'Découvrez les meilleurs endroits à visiter au Japon avec notre guide complet. Planification IA, recommandations personnalisées et expériences authentiques.',
  keywords: 'guide voyage Japon,tourisme Japon,recommandations voyage,planificateur IA,culture japonaise',
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
    title: 'Guide de Voyage au Japon | Découvrez le Japon',
    description: 'Découvrez les meilleurs endroits à visiter au Japon avec notre guide complet. Planification IA, recommandations personnalisées et expériences authentiques.',
    url: `${baseUrl}/fr`,
    siteName: 'Trip App',
    locale: 'fr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guide de Voyage au Japon | Découvrez le Japon',
    description: 'Découvrez les meilleurs endroits à visiter au Japon avec notre guide complet. Planification IA, recommandations personnalisées et expériences authentiques.',
  }
};

export default Home;