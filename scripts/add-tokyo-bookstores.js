const fs = require('fs');
const path = require('path');

// Parse operating hours from the tokyo.txt format
function parseOpeningHours(hoursText) {
  const hours = {};
  const lines = hoursText.split('\n').map(line => line.trim());
  
  lines.forEach(line => {
    if (line.includes('Monday:')) {
      hours.monday = line.replace('Monday:', '').trim();
    } else if (line.includes('Tuesday:')) {
      hours.tuesday = line.replace('Tuesday:', '').trim();
    } else if (line.includes('Wednesday:')) {
      hours.wednesday = line.replace('Wednesday:', '').trim();
    } else if (line.includes('Thursday:')) {
      hours.thursday = line.replace('Thursday:', '').trim();
    } else if (line.includes('Friday:')) {
      hours.friday = line.replace('Friday:', '').trim();
    } else if (line.includes('Saturday:')) {
      hours.saturday = line.replace('Saturday:', '').trim();
    } else if (line.includes('Sunday:')) {
      hours.sunday = line.replace('Sunday:', '').trim();
    }
  });
  
  return hours;
}

// Transform category from Japanese to English
function transformCategory(types) {
  if (types.includes('book_store')) return 'shopping';
  if (types.includes('movie_rental')) return 'entertainment';
  if (types.includes('store')) return 'shopping';
  if (types.includes('cafe')) return 'restaurants';
  if (types.includes('food')) return 'restaurants';
  if (types.includes('restaurant')) return 'restaurants';
  if (types.includes('lodging')) return 'hotels';
  if (types.includes('tourist_attraction')) return 'sightseeing';
  if (types.includes('establishment')) return 'sightseeing';
  return 'shopping';
}

// Transform price range based on rating
function getPriceRange(rating) {
  if (rating >= 4.5) return 'expensive';
  if (rating >= 4.0) return 'moderate';
  if (rating >= 3.5) return 'budget';
  return 'budget';
}

// Tokyo bookstore spots data from the txt file
const tokyoBookstoreSpots = [
  {
    name: 'Animate Akihabara',
    placeId: 'ChIJAVf7lh2MGGARJylRnQ_3dpI',
    address: '4-chōme-3-2 Sotokanda, Chiyoda City, Tokyo 101-0021, Japan',
    phone: '+81 3-5209-3330',
    rating: 4.2,
    reviewCount: 11739,
    lat: 35.7004944,
    lng: 139.7717427,
    types: ['movie_rental', 'book_store', 'store', 'point_of_interest', 'establishment'],
    photos: 10,
    openingHours: `Monday: 10:00 AM – 9:00 PM
Tuesday: 10:00 AM – 9:00 PM
Wednesday: 10:00 AM – 9:00 PM
Thursday: 10:00 AM – 9:00 PM
Friday: 10:00 AM – 9:00 PM
Saturday: 10:00 AM – 9:00 PM
Sunday: 10:00 AM – 9:00 PM`
  },
  {
    name: 'MARUZEN Marunouchi',
    placeId: 'ChIJ2TZSCfmLGGAR26O97vWyYcE',
    address: 'Japan, 〒100-8203 Tokyo, Chiyoda City, Marunouchi, 1-chōme−6−４ 丸の内オアゾ 1階～4階',
    phone: '+81 3-5288-8881',
    rating: 4.4,
    reviewCount: 7765,
    lat: 35.6835155,
    lng: 139.7666676,
    types: ['book_store', 'cafe', 'point_of_interest', 'food', 'store', 'establishment'],
    photos: 10,
    openingHours: `Monday: 9:00 AM – 9:00 PM
Tuesday: 9:00 AM – 9:00 PM
Wednesday: 9:00 AM – 9:00 PM
Thursday: 9:00 AM – 9:00 PM
Friday: 9:00 AM – 9:00 PM
Saturday: 9:00 AM – 9:00 PM
Sunday: 9:00 AM – 9:00 PM`
  },
  {
    name: 'BOOKOFF Akihabara Ekimae Store',
    placeId: 'ChIJ3_cRBqiOGGARoybcgAdwGgc',
    address: '1-chōme-6-4 Kanda Sakumachō, Chiyoda City, Tokyo 101-0025, Japan',
    phone: '+81 3-5207-6206',
    rating: 3.8,
    reviewCount: 2084,
    lat: 35.6977342,
    lng: 139.7734748,
    types: ['book_store', 'movie_rental', 'discount_store', 'home_goods_store', 'point_of_interest', 'store', 'establishment'],
    photos: 10,
    openingHours: `Monday: 10:00 AM – 10:00 PM
Tuesday: 10:00 AM – 10:00 PM
Wednesday: 10:00 AM – 10:00 PM
Thursday: 10:00 AM – 10:00 PM
Friday: 10:00 AM – 10:00 PM
Saturday: 10:00 AM – 10:00 PM
Sunday: 10:00 AM – 10:00 PM`
  },
  {
    name: 'Mandarake Complex',
    placeId: 'ChIJm3WItR2MGGAR05t5cpt7U4w',
    address: '3-chōme-11-12 Sotokanda, Chiyoda City, Tokyo 101-0021, Japan',
    phone: '+81 3-3252-7007',
    rating: 4.2,
    reviewCount: 5215,
    lat: 35.700373299999995,
    lng: 139.77050309999998,
    types: ['movie_rental', 'book_store', 'home_goods_store', 'point_of_interest', 'store', 'establishment'],
    photos: 10,
    openingHours: `Monday: 12:00 – 8:00 PM
Tuesday: 12:00 – 8:00 PM
Wednesday: 12:00 – 8:00 PM
Thursday: 12:00 – 8:00 PM
Friday: 12:00 – 8:00 PM
Saturday: 12:00 – 8:00 PM
Sunday: 12:00 – 8:00 PM`
  },
  {
    name: 'GINZA TSUTAYA BOOKS',
    placeId: 'ChIJH6YwSOaLGGAR_LGfsNivcXE',
    address: 'Japan, 〒104-0061 Tokyo, Chuo City, Ginza, 6-chōme−10−１ ＳＩＸ６階',
    phone: '+81 3-3575-7755',
    rating: 4.3,
    reviewCount: 7442,
    lat: 35.6694161,
    lng: 139.7642674,
    types: ['book_store', 'art_gallery', 'home_goods_store', 'point_of_interest', 'store', 'establishment'],
    photos: 10,
    openingHours: `Monday: 10:30 AM – 9:00 PM
Tuesday: 10:30 AM – 9:00 PM
Wednesday: 10:30 AM – 9:00 PM
Thursday: 10:30 AM – 9:00 PM
Friday: 10:30 AM – 9:00 PM
Saturday: 10:30 AM – 9:00 PM
Sunday: 10:30 AM – 9:00 PM`
  },
  {
    name: 'Roppongi Tsutaya Books',
    placeId: 'ChIJ-VRm_52LGGARQQy2OZs3mpk',
    address: 'Japan, 〒106-0032 Tokyo, Minato City, Roppongi, 6-chōme−11−１ 六本木ヒルズ 六本木 けやき坂通り',
    phone: '+81 3-5775-1515',
    rating: 4.2,
    reviewCount: 2010,
    lat: 35.6586837,
    lng: 139.7319453,
    types: ['cafe', 'book_store', 'art_gallery', 'bar', 'store', 'food', 'point_of_interest', 'establishment'],
    photos: 10,
    openingHours: `Monday: 9:00 AM – 11:00 PM
Tuesday: 9:00 AM – 11:00 PM
Wednesday: 9:00 AM – 11:00 PM
Thursday: 9:00 AM – 11:00 PM
Friday: 9:00 AM – 11:00 PM
Saturday: 9:00 AM – 11:00 PM
Sunday: 9:00 AM – 11:00 PM`
  },
  {
    name: 'SURUGA-YA Akihabara Main Building',
    placeId: 'ChIJhTzCxUiNGGARfWRafi-eBys',
    address: '3-chōme-11-3 Sotokanda, Chiyoda City, Tokyo 101-0021, Japan',
    phone: '+81 3-6634-0989',
    rating: 2.9,
    reviewCount: 313,
    lat: 35.70064,
    lng: 139.7705493,
    types: ['discount_store', 'food_store', 'book_store', 'store', 'food', 'point_of_interest', 'establishment'],
    photos: 10,
    openingHours: `Monday: 11:00 AM – 9:00 PM
Tuesday: 11:00 AM – 9:00 PM
Wednesday: 11:00 AM – 9:00 PM
Thursday: 11:00 AM – 9:00 PM
Friday: 11:00 AM – 9:00 PM
Saturday: 10:00 AM – 9:00 PM
Sunday: 10:00 AM – 9:00 PM`
  },
  {
    name: 'MARUZEN Nihombashi',
    placeId: 'ChIJH1Vbe_2LGGARGM_uSaiLVVY',
    address: '2-chōme-3-10 Nihonbashi, Chuo City, Tokyo 103-8245, Japan',
    phone: '+81 3-6214-2001',
    rating: 4.2,
    reviewCount: 531,
    lat: 35.680952999999995,
    lng: 139.7724752,
    types: ['book_store', 'cafe', 'store', 'health', 'food', 'point_of_interest', 'establishment'],
    photos: 10,
    openingHours: `Monday: 9:30 AM – 8:30 PM
Tuesday: 9:30 AM – 8:30 PM
Wednesday: 9:30 AM – 8:30 PM
Thursday: 9:30 AM – 8:30 PM
Friday: 9:30 AM – 8:30 PM
Saturday: 9:30 AM – 8:30 PM
Sunday: 9:30 AM – 8:30 PM`
  },
  {
    name: 'Akihabara Gamers',
    placeId: 'ChIJS6eXQB2MGGAR9W0Xk2Q7B3Y',
    address: 'Japan, 〒101-0021 Tokyo, Chiyoda City, Sotokanda, 1-chōme−14−７ 宝田中央通りビル',
    phone: '+81 3-5298-8720',
    rating: 4.2,
    reviewCount: 2293,
    lat: 35.6983011,
    lng: 139.7716604,
    types: ['book_store', 'store', 'point_of_interest', 'establishment'],
    photos: 10,
    openingHours: `Monday: 10:00 AM – 9:00 PM
Tuesday: 10:00 AM – 9:00 PM
Wednesday: 10:00 AM – 9:00 PM
Thursday: 10:00 AM – 9:00 PM
Friday: 10:00 AM – 9:00 PM
Saturday: 10:00 AM – 9:00 PM
Sunday: 10:00 AM – 9:00 PM`
  },
  {
    name: 'BOOKOFF PLUS Ueno Hirokoji Store',
    placeId: 'ChIJE-oj5p-OGGARdqME8zCJdg8',
    address: '4-chōme-4-4 Ueno, Taito City, Tokyo 110-0005, Japan',
    phone: '+81 3-5817-3817',
    rating: 3.7,
    reviewCount: 1856,
    lat: 35.7082659,
    lng: 139.7734783,
    types: ['movie_rental', 'clothing_store', 'home_goods_store', 'book_store', 'store', 'point_of_interest', 'establishment'],
    photos: 10,
    openingHours: `Monday: 10:00 AM – 10:00 PM
Tuesday: 10:00 AM – 10:00 PM
Wednesday: 10:00 AM – 10:00 PM
Thursday: 10:00 AM – 10:00 PM
Friday: 10:00 AM – 10:00 PM
Saturday: 10:00 AM – 10:00 PM
Sunday: 10:00 AM – 10:00 PM`
  }
];

function generateNewSpots() {
  return tokyoBookstoreSpots.map(spot => {
    return {
      id: spot.placeId,
      name: spot.name,
      description: `${spot.name} is a popular bookstore and entertainment spot in Tokyo with a ${spot.rating} star rating from ${spot.reviewCount.toLocaleString()} reviews. Located in the heart of Tokyo, it offers a great selection of books, manga, and entertainment items.`,
      category: transformCategory(spot.types),
      area: 'tokyo',
      location: {
        lat: spot.lat,
        lng: spot.lng,
        address: spot.address
      },
      rating: spot.rating,
      images: Array.from({ length: spot.photos }, (_, i) => 
        `/images/photos/${spot.placeId}/photo_${i + 1}.jpg`
      ),
      openingHours: parseOpeningHours(spot.openingHours),
      contact: {
        phone: spot.phone
      },
      priceRange: getPriceRange(spot.rating),
      tags: ['book_store', 'shopping', 'entertainment', ...spot.types],
      googlePlaceId: spot.placeId,
      reviews: []
    };
  });
}

// Generate the new spots data
const newSpots = generateNewSpots();

// Create the additions content
const additionsContent = `
// New Tokyo Bookstore Spots - Added from Google Maps data
const newTokyoBookstoreSpots: TouristSpot[] = ${JSON.stringify(newSpots, null, 2)};

// Add to the existing export
export const allBookstoreSpots = newTokyoBookstoreSpots;
`;

// Write to a new file that can be imported
const outputPath = path.join(__dirname, '../src/data/tokyo-bookstore-spots.ts');
const fullContent = `import { TouristSpot } from '@/types';

${additionsContent}`;

fs.writeFileSync(outputPath, fullContent, 'utf8');
console.log('✅ Created new Tokyo bookstore spots file:', outputPath);
console.log('📚 Added', newSpots.length, 'bookstore spots with photos');

// Also create a JSON file for easy import
const jsonPath = path.join(__dirname, '../src/data/tokyo-bookstore-spots.json');
fs.writeFileSync(jsonPath, JSON.stringify(newSpots, null, 2), 'utf8');
console.log('✅ Created JSON file:', jsonPath);

console.log('🎉 All files created successfully!');
console.log('');
console.log('📋 Summary of added spots:');
newSpots.forEach((spot, i) => {
  console.log(`${i + 1}. ${spot.name} (${spot.rating}⭐, ${spot.location.address})`);
});