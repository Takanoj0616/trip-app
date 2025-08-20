import { NavigationItem, FeatureItem, AreaItem, FooterColumn } from '../types';

export const navigationItems: NavigationItem[] = [
  { href: '#areas', label: 'Areas' },
  { href: '#model-courses', label: 'Model Courses' },
  { href: '#ai-recommendation', label: 'AI Recommendation' },
  { href: '#coordination', label: 'Coordination' },
  { href: '#qa', label: 'Q&A' },
  { href: '#realtime', label: 'nav.realtime' },
  { href: '#stores', label: 'nav.stores' },
  { href: '#favorites', label: 'Favorites' },
];

export const heroFeatures: FeatureItem[] = [
  { icon: '🤖', title: 'AI-Powered Recommendations', description: '' },
  { icon: '⚡', title: 'Plan in 1 Minute', description: '' },
  { icon: '📍', title: 'Authentic Local Spots', description: '' },
];

export const mainFeatures: FeatureItem[] = [
  {
    icon: '🌍',
    title: 'Multilingual Support',
    description: 'Full support for Japanese, English, and Korean languages. Navigate and plan your trip in your preferred language with complete localization.',
  },
  {
    icon: '📍',
    title: 'Area & Category Guide',
    description: 'Comprehensive guides for Tokyo, Yokohama, Saitama, Chiba, and more. Discover local attractions, restaurants, and hidden gems in each region.',
  },
  {
    icon: '⭐',
    title: 'Enhanced User Experience',
    description: 'Save favorites, write reviews, create travel journals, and share your experiences. Build your personalized Japan travel community.',
  },
  {
    icon: '🤖',
    title: 'AI Recommendation System',
    description: 'Get personalized travel plans based on your preferences, budget, and interests. Our AI analyzes your needs for optimal itineraries.',
  },
  {
    icon: '📱',
    title: 'Real-time Information',
    description: 'Access live data on crowd levels, weather conditions, transportation schedules, and venue availability for better planning.',
  },
  {
    icon: '💬',
    title: 'Community Features',
    description: 'Join Q&A discussions, share travel experiences, get tips from locals and fellow travelers in our vibrant community platform.',
  },
];

export const areas: AreaItem[] = [
  {
    emoji: '🏙️',
    title: 'Tokyo',
    description: 'Modern metropolis with cutting-edge technology, vibrant nightlife, and world-class shopping districts.',
  },
  {
    emoji: '🗾',
    title: 'Mt. Fuji Area',
    description: 'Iconic sacred mountain with stunning views, hot springs, and traditional Japanese countryside experiences.',
  },
  {
    emoji: '🏯',
    title: 'Historic Kyoto',
    description: 'Ancient capital filled with temples, traditional architecture, geishas, and preserved cultural heritage sites.',
  },
  {
    emoji: '🍜',
    title: 'Osaka Food Capital',
    description: 'Japan\'s kitchen offering incredible street food, takoyaki, okonomiyaki, and the best culinary adventures.',
  },
];

export const footerColumns: FooterColumn[] = [
  {
    title: 'Explore',
    links: [
      { href: '#', label: 'Area Guide' },
      { href: '#', label: 'Category Search' },
      { href: '#', label: 'Popular Spots' },
      { href: '#', label: 'What\'s New' },
    ],
  },
  {
    title: 'Features',
    links: [
      { href: '#', label: 'AI Travel Plan' },
      { href: '#', label: 'Favorites' },
      { href: '#', label: 'Reviews' },
      { href: '#', label: 'Offline Features' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '#', label: 'Help Center' },
      { href: '#', label: 'Contact Us' },
      { href: '#', label: 'Emergency Guide' },
      { href: '#', label: 'Feedback' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '#', label: 'Login' },
      { href: '#', label: 'Sign Up' },
      { href: '#', label: 'Premium' },
      { href: '#', label: 'Settings' },
    ],
  },
];