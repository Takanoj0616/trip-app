import type { TouristSpot } from '@/types';
import restaurantsJson from './tokyo-restaurant-spots.json';

const restaurantSpots = restaurantsJson as unknown as TouristSpot[];

export const allRestaurantSpots = restaurantSpots;

