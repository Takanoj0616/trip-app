'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageDirection() {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const isArabic = currentLanguage === 'ar';
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      document.documentElement.lang = isArabic ? 'ar' : currentLanguage || 'en';
    }
  }, [currentLanguage]);

  return null;
}

