'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface FavoriteButtonProps {
  spotId: string;
  className?: string;
  showText?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  spotId, 
  className = '', 
  showText = false 
}) => {
  const { user } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites, loading } = useFavorites();
  const { t } = useTranslation('common');
  
  const isFav = isFavorite(spotId);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // TODO: Show login modal
      alert('ログインが必要です');
      return;
    }

    if (isFav) {
      await removeFromFavorites(spotId);
    } else {
      await addToFavorites(spotId);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        flex items-center space-x-2 transition-all duration-200
        ${isFav 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isFav ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <Heart 
        className={`w-6 h-6 transition-all duration-200 ${
          isFav ? 'fill-current' : ''
        }`}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isFav ? 'お気に入り済み' : t('actions.add_to_favorites')}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;