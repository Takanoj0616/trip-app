import AISpotsPage from '@/app/ai-spots/page';
import { Metadata } from 'next';
import { BASE_URL as baseUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'توصيات الذكاء الاصطناعي | إنشاء خطة السفر المثالية',
  description: 'توصيات مدعومة بالذكاء الاصطناعي لتجربة السفر المثالية في اليابان. احصل على توصيات شخصية بناءً على اهتماماتك وميزانيتك ومدة السفر.',
  keywords: 'مخطط سفر بالذكاء الاصطناعي,الأماكن السياحية,السفر لليابان,برنامج شخصي,توصيات السفر',
  robots: 'index, follow',
  alternates: {
    canonical: `${baseUrl}/ar/ai-spots`,
    languages: {
      'ja': `${baseUrl}/ai-spots`,
      'en': `${baseUrl}/en/ai-spots`,
      'fr': `${baseUrl}/fr/ai-spots`,
      'ko': `${baseUrl}/ko/ai-spots`,
      'ar': `${baseUrl}/ar/ai-spots`,
    }
  },
  openGraph: {
    title: 'توصيات الذكاء الاصطناعي | إنشاء خطة السفر المثالية',
    description: 'توصيات مدعومة بالذكاء الاصطناعي لتجربة السفر المثالية في اليابان. احصل على توصيات شخصية بناءً على اهتماماتك وميزانيتك ومدة السفر.',
    url: `${baseUrl}/ar/ai-spots`,
    siteName: 'Trip App',
    locale: 'ar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'توصيات الذكاء الاصطناعي | إنشاء خطة السفر المثالية',
    description: 'توصيات مدعومة بالذكاء الاصطناعي لتجربة السفر المثالية في اليابان. احصل على توصيات شخصية بناءً على اهتماماتك وميزانيتك ومدة السفر.',
  }
};

export default AISpotsPage;
