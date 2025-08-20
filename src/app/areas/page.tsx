import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Clock } from 'lucide-react';

export default function AreasPage() {
  const areas = [
    {
      id: 'tokyo',
      name: 'Tokyo',
      title: 'Tokyo Travel Guide',
      description: "Japan's vibrant capital city where cutting-edge technology meets ancient traditions. Explore Shibuya, Asakusa, Ginza, Tokyo Skytree, and countless temples, museums, and world-class restaurants.",
      icon: '🏢',
      spots: 150,
      rating: 4.8
    },
    {
      id: 'yokohama',
      name: 'Yokohama',
      title: 'Yokohama Tourism',
      description: 'International port city famous for Chinatown, Red Brick Warehouse, Minato Mirai skyline, and coastal attractions. Perfect for day trips from Tokyo.',
      icon: '🌊',
      spots: 80,
      rating: 4.6
    },
    {
      id: 'saitama',
      name: 'Saitama',
      title: 'Saitama Attractions',
      description: "Experience traditional Japan in Kawagoe's historic Edo-period streets and enjoy natural beauty in Chichibu. Great for cultural tourism and hiking.",
      icon: '⛩️',
      spots: 60,
      rating: 4.4
    },
    {
      id: 'chiba',
      name: 'Chiba',
      title: 'Chiba Travel',
      description: 'Home to Narita Airport, Tokyo Disneyland, and beautiful Boso Peninsula beaches. Combines theme parks, nature, and traditional Japanese culture.',
      icon: '🎡',
      spots: 75,
      rating: 4.5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Explore Japan's Best Destinations
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing places across Tokyo metropolitan area and beyond
            </p>
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {areas.map((area) => (
            <div key={area.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{area.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{area.name}</h2>
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-gray-600">{area.rating}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {area.description}
                </p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center text-gray-500">
                    <MapPin size={16} className="mr-1" />
                    <span>{area.spots} spots</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>1-3 days</span>
                  </div>
                </div>
                
                <Link
                  href={`/areas/${area.id}`}
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Explore {area.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}