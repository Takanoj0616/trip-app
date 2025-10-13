import AISpotsPage from '@/app/ai-spots/page';
import { Metadata } from 'next';

import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Recommandations IA | Créez votre plan de voyage parfait',
  description: 'Recommandations alimentées par IA pour votre expérience de voyage parfaite au Japon. Obtenez des recommandations personnalisées basées sur vos intérêts, budget et durée.',
  keywords: 'planificateur voyage IA,spots touristiques,voyage Japon,itinéraire personnalisé,recommandations voyage',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/fr/ai-spots`,
    languages: {
      'x-default': `${baseUrl}/ai-spots`,
      'ja-JP': `${baseUrl}/ai-spots`,
      'en-GB': `${baseUrl}/en/ai-spots`,
      'en-US': `${baseUrl}/en/ai-spots`,
      'fr-FR': `${baseUrl}/fr/ai-spots`,
      'ko-KR': `${baseUrl}/ko/ai-spots`,
      'ar-SA': `${baseUrl}/ar/ai-spots`,
    }
  },
  openGraph: {
    title: 'Recommandations IA | Créez votre plan de voyage parfait',
    description: 'Recommandations alimentées par IA pour votre expérience de voyage parfaite au Japon. Obtenez des recommandations personnalisées basées sur vos intérêts, budget et durée.',
    url: `${baseUrl}/fr/ai-spots`,
    siteName: 'Trip App',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recommandations IA | Créez votre plan de voyage parfait',
    description: 'Recommandations alimentées par IA pour votre expérience de voyage parfaite au Japon. Obtenez des recommandations personnalisées basées sur vos intérêts, budget et durée.',
  }
};

export default AISpotsPage;
