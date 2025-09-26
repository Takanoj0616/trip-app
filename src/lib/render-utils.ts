import { headers } from 'next/headers';

export async function shouldUseSSR(): Promise<boolean> {
  const headersList = await headers();
  const isBot = headersList.get('x-is-bot') === 'true';
  const isSEOBot = headersList.get('x-is-seo-bot') === 'true';

  // Bot（特にSEOBot）の場合はSSRを使用
  return isBot || isSEOBot;
}

export async function getBotInfo() {
  const headersList = await headers();
  return {
    isBot: headersList.get('x-is-bot') === 'true',
    isSEOBot: headersList.get('x-is-seo-bot') === 'true'
  };
}