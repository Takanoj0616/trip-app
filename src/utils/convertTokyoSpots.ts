import { TouristSpot } from '@/types';
import { tokyoSpotsDetailed, TokyoSpot } from '@/data/tokyo-spots-detailed';

export function convertTokyoSpotsToTouristSpots(locale: string = 'ja'): TouristSpot[] {
  return tokyoSpotsDetailed.map((spot: TokyoSpot): TouristSpot => {
    // 多言語名の取得（フォールバック付き）
    const getName = (spot: TokyoSpot, locale: string): string => {
      if (typeof spot.name === 'string') return spot.name;
      // アラビア語の場合は英語にフォールバック、それでも無ければ日本語
      if (locale === 'ar') {
        return spot.name?.en || spot.name?.ja || Object.values(spot.name || {})[0] || 'Tourist Spot';
      }
      return spot.name?.[locale] || spot.name?.ja || spot.name?.en || Object.values(spot.name || {})[0] || 'スポット';
    };

    // 多言語説明の取得
    const getDescription = (spot: TokyoSpot, locale: string): string => {
      const descKey = `description_${locale}` as keyof TokyoSpot;
      let description = (spot[descKey] as string) || spot.description;

      // アラビア語の場合は英語説明にフォールバック
      if (!description && locale === 'ar') {
        const enDescKey = 'description_en' as keyof TokyoSpot;
        description = (spot[enDescKey] as string) || spot.description;
      }

      return description || (locale === 'ar' ? 'Popular tourist attraction.' : '人気の観光スポットです。');
    };

    return {
      id: spot.id,
      name: getName(spot, locale),
      description: getDescription(spot, locale),
      category: 'sightseeing' as const,
      area: 'tokyo' as const,
      location: {
        lat: spot.location?.lat || 35.676,
        lng: spot.location?.lng || 139.65,
        address: spot.location?.address || '東京都内'
      },
      rating: spot.rating,
      images: spot.images?.length ? spot.images : (spot.image ? [spot.image] : []),
      openingHours: spot.info?.openHours ? {
        monday: spot.info.openHours,
        tuesday: spot.info.openHours,
        wednesday: spot.info.openHours,
        thursday: spot.info.openHours,
        friday: spot.info.openHours,
        saturday: spot.info.openHours,
        sunday: spot.info.openHours
      } : undefined,
      contact: {},
      priceRange: spot.info?.price ?
        (spot.info.price.includes('3000') || spot.info.price.includes('¥3') ? 'expensive' :
         spot.info.price.includes('1000') || spot.info.price.includes('¥1') ? 'moderate' : 'budget')
        : undefined,
      tags: spot.tags || [],
      googlePlaceId: undefined,
      reviewCount: spot.reviewCount,
      crowdLevel: spot.info?.crowdLevel as any,
      averageStayMinutes: spot.info?.duration ? parseInt(spot.info.duration) * 60 : undefined,
      stayRange: spot.info?.duration
    };
  });
}

export const convertedTokyoSpots = convertTokyoSpotsToTouristSpots();