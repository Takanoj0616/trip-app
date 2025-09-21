import { NextRequest, NextResponse } from 'next/server';

// A/B test settings for TOP page background
const AB_COOKIE = 'ab_top_bg';
const AB_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function isTopPage(pathname: string) {
  const locales = ['ja', 'en', 'fr', 'ko', 'ar'];
  if (pathname === '/' || pathname === '') return true;
  // Handle "/en" and "/en/" style roots
  return locales.some((loc) => pathname === `/${loc}` || pathname === `/${loc}/`);
}

function ensureAbCookieOn(response: NextResponse, request: NextRequest, targetPathname?: string) {
  try {
    const pathToCheck = targetPathname ?? request.nextUrl.pathname;
    if (!isTopPage(pathToCheck)) return response;

    const existing = request.cookies.get(AB_COOKIE)?.value;
    if (existing === 'A' || existing === 'B') return response;

    // 50/50 split — use crypto when available in Edge runtime
    let variant: 'A' | 'B' = 'A';
    try {
      const x = new Uint32Array(1);
      crypto.getRandomValues(x);
      variant = (x[0] % 2 === 0) ? 'A' : 'B';
    } catch {
      variant = Math.random() < 0.5 ? 'A' : 'B';
    }

    response.cookies.set(AB_COOKIE, variant, {
      path: '/',
      maxAge: AB_MAX_AGE,
      sameSite: 'lax',
    });
  } catch {}
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const locales = ['ja', 'en', 'fr', 'ko', 'ar'];

  // Dev-only override: allow ?ab=A|B to force variant on TOP page
  if (process.env.NODE_ENV === 'development') {
    const abParam = searchParams.get('ab');
    if ((abParam === 'A' || abParam === 'B') && isTopPage(pathname)) {
      const newUrl = new URL(request.url);
      newUrl.searchParams.delete('ab');
      const res = NextResponse.redirect(newUrl);
      res.cookies.set(AB_COOKIE, abParam, {
        path: '/',
        maxAge: AB_MAX_AGE,
        sameSite: 'lax',
      });
      return res;
    }
  }

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
      return ensureAbCookieOn(res, request, newUrl.pathname);
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
      return ensureAbCookieOn(res, request, newUrl.pathname);
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
      return ensureAbCookieOn(res, request);
    }

    // Redirect to locale-prefixed URL for other languages
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    const res = NextResponse.redirect(newUrl);
    return ensureAbCookieOn(res, request, newUrl.pathname);
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

  // Ensure A/B cookie exists for TOP page requests with explicit locale prefix
  return ensureAbCookieOn(response, request);
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
