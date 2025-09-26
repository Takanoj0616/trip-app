// Bot判定ユーティリティ

const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp', // Yahoo
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegram',
  'skype',
  'applebot',
  'crawler',
  'spider',
  'bot',
  'scraper',
  'prerender',
  'phantom',
  'crawl',
  'headless',
  'preview'
];

export function isBot(userAgent?: string): boolean {
  if (!userAgent) return false;

  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

export function isSEOBot(userAgent?: string): boolean {
  if (!userAgent) return false;

  const ua = userAgent.toLowerCase();
  const seoAgents = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot'];
  return seoAgents.some(bot => ua.includes(bot));
}