'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchParamsHandlerProps {
  locale?: string;
  language?: string;
  onLanguageChange: (lang: string) => void;
}

export default function SearchParamsHandler({
  locale,
  language,
  onLanguageChange
}: SearchParamsHandlerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { currentLanguage: ctxLang, setCurrentLanguage } = useLanguage();

  const langParam = searchParams?.get('lang');
  const lang = (locale || langParam || language || (ctxLang as string) || 'ja') as string;

  const didInitLangSync = useRef(false);

  useEffect(() => {
    // 言語が決定されたらコールバック実行
    onLanguageChange(lang);
  }, [lang, onLanguageChange]);

  useEffect(() => {
    const urlLang = searchParams?.get('lang');
    // 1) 初回だけ: URLにlangがあればコンテキストへ反映
    if (!didInitLangSync.current) {
      didInitLangSync.current = true;
      if (urlLang && urlLang !== ctxLang) {
        setCurrentLanguage(urlLang);
      } else if (!urlLang && ctxLang) {
        // URLに無ければ現在の言語をURLへ反映
        const sp = new URLSearchParams(searchParams?.toString());
        sp.set('lang', ctxLang as string);
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
      }
      return;
    }
    // 2) 以降: ヘッダーの切替（ctxLang）が発生したらURLを更新
    if (ctxLang && urlLang !== ctxLang) {
      const sp = new URLSearchParams(searchParams?.toString());
      sp.set('lang', ctxLang as string);
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    }
  }, [ctxLang, langParam, searchParams, pathname, router, setCurrentLanguage]);

  return null;
}