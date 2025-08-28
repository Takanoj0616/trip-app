const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBiS530u2Lu70xxRgEWDrUKQlqJAL-XSn4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "trip-app-10370.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "trip-app-10370",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "trip-app-10370.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "199746269613",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:199746269613:web:035a318880732ede767124",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HCMJV8R71J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  return 'sightseeing';
}

// Tokyo spots data from the txt file
const tokyoSpots = [
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

async function importTokyoSpots() {
  console.log('Starting Tokyo spots import...');

  try {
    for (const spot of tokyoSpots) {
      const touristSpot = {
        id: spot.placeId,
        name: spot.name,
        description: `${spot.name} is a popular spot in Tokyo with a ${spot.rating} star rating from ${spot.reviewCount} reviews.`,
        category: transformCategory(spot.types),
        area: 'tokyo',
        location: {
          lat: spot.lat,
          lng: spot.lng,
          address: spot.address
        },
        rating: spot.rating,
        openingHours: parseOpeningHours(spot.openingHours),
        contact: {
          phone: spot.phone
        },
        tags: spot.types,
        googlePlaceId: spot.placeId,
        images: Array.from({ length: spot.photos }, (_, i) => 
          `/images/photos/${spot.placeId}/photo_${i + 1}.jpg`
        )
      };

      // Use placeId as document ID for consistency
      await setDoc(doc(db, 'tourist_spots', spot.placeId), touristSpot);
      console.log(`✅ Imported: ${spot.name}`);
    }

    console.log('🎉 All Tokyo spots imported successfully!');
  } catch (error) {
    console.error('❌ Error importing Tokyo spots:', error);
  }
}

// Run the import
importTokyoSpots();