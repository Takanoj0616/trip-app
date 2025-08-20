'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Star, Clock, Users, Search, Filter } from 'lucide-react';

export default function LocaleHomePage() {
  const t = useTranslations('common');
  const locale = useLocale();

  const areas = [
    {
      id: 'tokyo',
      name: t('areas.tokyo.name'),
      title: t('areas.tokyo.title'),
      description: t('areas.tokyo.description'),
      icon: '🏢',
      spots: 150,
      rating: 4.8
    },
    {
      id: 'yokohama',
      name: t('areas.yokohama.name'),
      title: t('areas.yokohama.title'),
      description: t('areas.yokohama.description'),
      icon: '🌊',
      spots: 80,
      rating: 4.6
    },
    {
      id: 'saitama',
      name: t('areas.saitama.name'),
      title: t('areas.saitama.title'),
      description: t('areas.saitama.description'),
      icon: '⛩️',
      spots: 60,
      rating: 4.4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Japan Travel Guide | Tokyo, Yokohama, Saitama & Chiba Tourism
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Discover the best tourist attractions, restaurants, and hotels in Japan's most popular travel destinations. Complete travel guide with AI-powered recommendations for your perfect Japan trip.
            </p>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Areas Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {areas.map((area) => (
            <Link
              key={area.id}
              href={`/${locale}/areas/${area.id}`}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-white/20"
            >
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <div className="text-6xl">{area.icon}</div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {area.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{area.spots} spots</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span>{area.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {t('features.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('features.ai_planning.title')}
              </h3>
              <p className="text-gray-600">
                {t('features.ai_planning.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('features.comprehensive_guide.title')}
              </h3>
              <p className="text-gray-600">
                {t('features.comprehensive_guide.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('features.real_time.title')}
              </h3>
              <p className="text-gray-600">
                {t('features.real_time.description')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('features.multilingual.title')}
              </h3>
              <p className="text-gray-600">
                {t('features.multilingual.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}