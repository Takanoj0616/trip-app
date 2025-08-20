import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

export const locales = ['en', 'ja', 'ko'] as const;

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale) {
    locale = 'en'; // Default to English if no locale is provided
  }
  
  if (!locales.includes(locale as typeof locales[number])) {
    console.error('Invalid locale:', locale);
    notFound();
  }

  try {
    // Use dynamic import from src directory
    const messages = await import(`./locales/${locale}/common.json`);
    return {
      locale: locale,
      messages: messages.default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
});