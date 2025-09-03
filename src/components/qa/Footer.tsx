'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { currentLanguage } = useLanguage();
  const i18n = {
    ja: { terms: '利用規約', privacy: 'プライバシーポリシー', help: 'ヘルプ', copyright: '© 2024 Japan Travel Guide. All rights reserved.' },
    en: { terms: 'Terms', privacy: 'Privacy Policy', help: 'Help', copyright: '© 2024 Japan Travel Guide. All rights reserved.' },
    ko: { terms: '이용약관', privacy: '개인정보 처리방침', help: '도움말', copyright: '© 2024 Japan Travel Guide. All rights reserved.' },
    fr: { terms: 'Conditions', privacy: 'Politique de confidentialité', help: 'Aide', copyright: '© 2024 Japan Travel Guide. Tous droits réservés.' },
  } as const;
  const tr = (i18n as any)[currentLanguage] || (i18n as any).ja;
  return (
    <footer 
      className="mt-20 py-8"
      style={{
        background: 'rgba(11, 27, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-300">{tr.copyright}</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <button 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => console.log('Navigate to terms')}
            >
              {tr.terms}
            </button>
            <button 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => console.log('Navigate to privacy')}
            >
              {tr.privacy}
            </button>
            <button 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => console.log('Navigate to help')}
            >
              {tr.help}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
