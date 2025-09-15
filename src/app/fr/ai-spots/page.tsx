import AISpotsPage from '@/app/ai-spots/page';
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export const metadata: Metadata = {
  title: 'Recommandations IA | Créez votre plan de voyage parfait',
  description: 'Recommandations alimentées par IA pour votre expérience de voyage parfaite au Japon. Obtenez des recommandations personnalisées basées sur vos intérêts, budget et durée.',
  keywords: 'planificateur voyage IA,spots touristiques,voyage Japon,itinéraire personnalisé,recommandations voyage',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/fr/ai-spots`,
    languages: {
      'ja': `${baseUrl}/ai-spots`,
      'en': `${baseUrl}/en/ai-spots`,
      'fr': `${baseUrl}/fr/ai-spots`,
      'ko': `${baseUrl}/ko/ai-spots`,
      'ar': `${baseUrl}/ar/ai-spots`,
    }
  },
  openGraph: {
    title: 'Recommandations IA | Créez votre plan de voyage parfait',
    description: 'Recommandations alimentées par IA pour votre expérience de voyage parfaite au Japon. Obtenez des recommandations personnalisées basées sur vos intérêts, budget et durée.',
    url: `${baseUrl}/fr/ai-spots`,
    siteName: 'Trip App',
    locale: 'fr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recommandations IA | Créez votre plan de voyage parfait',
    description: 'Recommandations alimentées par IA pour votre expérience de voyage parfaite au Japon. Obtenez des recommandations personnalisées basées sur vos intérêts, budget et durée.',
  }
};

export default AISpotsPage;