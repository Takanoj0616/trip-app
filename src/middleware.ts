import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = ['ja', 'en', 'fr', 'ko', 'ar'].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Special handling for default locale (ja) - no prefix needed
    if (locale === 'ja') {
      return NextResponse.next();
    }

    // Redirect to locale-prefixed URL for other languages
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // Add dir attribute for RTL languages
  const locale = pathname.split('/')[1];
  const response = NextResponse.next();

  if (locale === 'ar') {
    response.headers.set('x-dir', 'rtl');
  } else {
    response.headers.set('x-dir', 'ltr');
  }

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