import { TouristSpot } from '@/types';

interface SimpleSpotCardProps {
  spot: TouristSpot;
}

export default function SimpleSpotCard({ spot }: SimpleSpotCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      sightseeing: 'bg-blue-500',
      restaurants: 'bg-red-500',
      hotels: 'bg-green-500',
      transportation: 'bg-purple-500',
      entertainment: 'bg-orange-500',
      shopping: 'bg-pink-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getPriceDisplay = (priceRange?: string) => {
    const prices: Record<string, string> = {
      budget: '¥',
      moderate: '¥¥',
      expensive: '¥¥¥',
      luxury: '¥¥¥¥'
    };
    return prices[priceRange || 'budget'] || '¥';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={spot.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=300&fit=crop'}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        
        {/* Category Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(spot.category)}`}>
          {spot.category.charAt(0).toUpperCase() + spot.category.slice(1)}
        </div>

        {/* Heart Icon */}
        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{spot.name}</h3>
          {spot.rating && (
            <div className="flex items-center gap-1 text-sm text-gray-600 shrink-0 ml-2">
              <span className="text-yellow-400">★</span>
              <span>{spot.rating}</span>
              <span className="text-gray-400">(0 reviews)</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{spot.description}</p>

        {/* Location & Price */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {spot.location.address.split('東京都')[1] || spot.location.address}
          </span>
          <span className="font-semibold">Price: {getPriceDisplay(spot.priceRange)}</span>
        </div>

        {/* Visit Time */}
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>24 時間営業</span>
        </div>

        {/* View Details Button */}
        <button className="w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}