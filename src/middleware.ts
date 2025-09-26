import { NextRequest, NextResponse } from 'next/server';
import { isBot, isSEOBot } from './lib/bot-utils';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const locales = ['ja', 'en', 'fr', 'ko', 'ar'];

  // Bot判定
  const userAgent = request.headers.get('user-agent');
  const isBotRequest = isBot(userAgent);
  const isSEOBotRequest = isSEOBot(userAgent);

  // langクエリパラメータがある場合の優先処理
  const langParam = searchParams.get('lang');

  if (langParam && locales.includes(langParam)) {
    // /spots/[id]?lang=en を /en/spots/[id] にリダイレクト
    if (pathname.startsWith('/spots/') && langParam !== 'ja') {
      const newUrl = new URL(`/${langParam}${pathname}`, request.url);

      // 他のクエリパラメータがあれば保持（langを除く）
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('lang');

      if (newSearchParams.toString()) {
        newUrl.search = newSearchParams.toString();
      }

      const res = NextResponse.redirect(newUrl);
      return res;
    }

    // 他のパスでもlangパラメータがある場合の処理
    if (langParam !== 'ja' && !pathname.startsWith(`/${langParam}`)) {
      const newUrl = new URL(`/${langParam}${pathname}`, request.url);

      // 他のクエリパラメータがあれば保持（langを除く）
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('lang');

      if (newSearchParams.toString()) {
        newUrl.search = newSearchParams.toString();
      }

      const res = NextResponse.redirect(newUrl);
      return res;
    }
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Special handling for default locale (ja) - no prefix needed
    if (locale === 'ja') {
      const res = NextResponse.next();
      // Propagate locale and direction for SSR html attributes
      res.headers.set('x-locale', 'ja-JP');
      res.headers.set('x-dir', 'ltr');
      // Bot情報を伝達
      res.headers.set('x-is-bot', isBotRequest.toString());
      res.headers.set('x-is-seo-bot', isSEOBotRequest.toString());
      return res;
    }

    // Redirect to locale-prefixed URL for other languages
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    const res = NextResponse.redirect(newUrl);
    return res;
  }

  // Add dir attribute for RTL languages
  const locale = pathname.split('/')[1];
  const response = NextResponse.next();

  // Map to full BCP 47/SEO-friendly language tags
  const localeTag =
    locale === 'ja' ? 'ja-JP' :
    locale === 'en' ? 'en-GB' :
    locale === 'fr' ? 'fr-FR' :
    locale === 'ko' ? 'ko-KR' :
    locale === 'ar' ? 'ar-SA' : locale;

  // Propagate direction and locale for SSR html attributes
  if (locale === 'ar') {
    response.headers.set('x-dir', 'rtl');
  } else {
    response.headers.set('x-dir', 'ltr');
  }
  response.headers.set('x-locale', localeTag);

  // Bot情報を伝達
  response.headers.set('x-is-bot', isBotRequest.toString());
  response.headers.set('x-is-seo-bot', isSEOBotRequest.toString());

  return response;
}

function getLocale(request: NextRequest) {
  // Check URL parameters first
  const urlLocale = request.nextUrl.searchParams.get('lang');
  if (urlLocale && ['ja', 'en', 'fr', 'ko', 'ar'].includes(urlLocale)) {
    return urlLocale;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    if (acceptLanguage.includes('ja')) return 'ja';
    if (acceptLanguage.includes('en')) return 'en';
    if (acceptLanguage.includes('fr')) return 'fr';
    if (acceptLanguage.includes('ko')) return 'ko';
    if (acceptLanguage.includes('ar')) return 'ar';
  }

  return 'ja'; // Default locale
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
