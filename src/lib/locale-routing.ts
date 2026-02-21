export const SUPPORTED_LOCALES = ['ja', 'en', 'fr', 'ko', 'ar'] as const;
export const NON_DEFAULT_LOCALES = ['en', 'fr', 'ko', 'ar'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const LOCALIZED_PATH_PATTERNS: RegExp[] = [
  /^\/$/,
  /^\/areas$/,
  /^\/ai-plan$/,
  /^\/ai-spots$/,
  /^\/spots\/tokyo$/,
  /^\/spots\/[^/]+$/,
];

const DUMMY_BASE = 'https://example.com';

export function toSupportedLocale(locale: string | undefined | null): SupportedLocale {
  if (!locale) return 'ja';
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale) ? (locale as SupportedLocale) : 'ja';
}

export function getLocaleFromPathname(pathname: string): SupportedLocale {
  const first = pathname.split('/').filter(Boolean)[0];
  return toSupportedLocale(first);
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return '/';
  if ((NON_DEFAULT_LOCALES as readonly string[]).includes(segments[0])) {
    const stripped = `/${segments.slice(1).join('/')}`;
    return stripped === '/' ? '/' : stripped.replace(/\/+$/, '');
  }
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

function parsePath(path: string): URL {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, DUMMY_BASE);
}

export function isLocalizedPathSupported(path: string): boolean {
  const url = parsePath(path);
  const pathname = stripLocalePrefix(url.pathname);
  return LOCALIZED_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

export function withLocale(path: string, locale: SupportedLocale, fallbackPath = '/'): string {
  const url = parsePath(path);
  const basePath = stripLocalePrefix(url.pathname);

  if (locale === 'ja') {
    return `${basePath}${url.search}${url.hash}`;
  }

  if (!isLocalizedPathSupported(basePath)) {
    const fallback = stripLocalePrefix(parsePath(fallbackPath).pathname);
    const prefixedFallback = fallback === '/' ? `/${locale}` : `/${locale}${fallback}`;
    return `${prefixedFallback}${url.hash}`;
  }

  const prefixed = basePath === '/' ? `/${locale}` : `/${locale}${basePath}`;
  return `${prefixed}${url.search}${url.hash}`;
}

export function withLocaleOrJaFallback(path: string, locale: SupportedLocale): string {
  const url = parsePath(path);
  const basePath = stripLocalePrefix(url.pathname);

  if (locale === 'ja' || isLocalizedPathSupported(basePath)) {
    return withLocale(path, locale);
  }

  if (!url.searchParams.has('lang')) {
    url.searchParams.set('lang', 'ja');
  }
  return `${basePath}${url.search}${url.hash}`;
}

export function switchLocalePath(currentPath: string, targetLocale: SupportedLocale): string {
  const basePath = stripLocalePrefix(parsePath(currentPath).pathname);
  if (targetLocale === 'ja') return basePath;
  return withLocale(basePath, targetLocale, '/');
}
