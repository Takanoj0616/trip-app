const fs = require('fs');
const path = require('path');

// Read the kankou.txt file
const filePath = '/Users/j.takano/Desktop/app/kannkou.txt';
const content = fs.readFileSync(filePath, 'utf-8');

// Split by separator lines to get individual spots
const spots = content.split('------------------------------').filter(spot => spot.trim());

const parsedSpots = [];

spots.forEach((spotText, index) => {
  const lines = spotText.split('\n').map(line => line.trim()).filter(line => line);
  
  let spot = {
    id: `kankou_${index + 1001}`, // Start from 1001 to avoid conflicts
    name: '',
    description: '',
    category: 'sightseeing', // Default category
    area: 'tokyo',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    rating: 0,
    images: [],
    openingHours: {},
    priceRange: 'budget',
    tags: [],
    reviews: []
  };

  let currentSection = '';
  let reviewIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('名称: ')) {
      spot.name = line.replace('名称: ', '');
    } else if (line.startsWith('住所: ')) {
      spot.location.address = line.replace('住所: ', '');
    } else if (line.startsWith('評価: ')) {
      spot.rating = parseFloat(line.replace('評価: ', ''));
    } else if (line.startsWith('緯度経度: ')) {
      const coords = line.replace('緯度経度: ', '').split(', ');
      spot.location.lat = parseFloat(coords[0]);
      spot.location.lng = parseFloat(coords[1]);
    } else if (line.startsWith('施設カテゴリ: ')) {
      const categories = line.replace('施設カテゴリ: ', '').replace(/\[|\]|'/g, '').split(', ');
      // Map categories to our system
      if (categories.includes('restaurant') || categories.includes('food') || categories.includes('meal_takeaway')) {
        spot.category = 'restaurants';
      } else if (categories.includes('lodging')) {
        spot.category = 'hotels';
      } else if (categories.includes('shopping_mall') || categories.includes('store')) {
        spot.category = 'shopping';
      } else if (categories.includes('amusement_park') || categories.includes('movie_theater') || categories.includes('night_club')) {
        spot.category = 'entertainment';
      } else {
        spot.category = 'sightseeing';
      }
      
      // Add relevant tags
      if (categories.includes('park')) spot.tags.push('公園');
      if (categories.includes('museum')) spot.tags.push('博物館');
      if (categories.includes('temple')) spot.tags.push('寺院');
      if (categories.includes('shrine')) spot.tags.push('神社');
      if (categories.includes('tourist_attraction')) spot.tags.push('観光地');
    } else if (line.startsWith('完全住所: ')) {
      spot.location.address = line.replace('完全住所: ', '').replace('日本、', '');
    } else if (line.startsWith('営業時間:')) {
      currentSection = 'hours';
    } else if (currentSection === 'hours' && line.includes('曜日:')) {
      const parts = line.split(': ');
      if (parts.length === 2) {
        const day = parts[0].replace('曜日', '');
        const hours = parts[1];
        
        // Map Japanese days to English
        const dayMap = {
          '月': 'monday',
          '火': 'tuesday', 
          '水': 'wednesday',
          '木': 'thursday',
          '金': 'friday',
          '土': 'saturday',
          '日': 'sunday'
        };
        
        if (dayMap[day]) {
          spot.openingHours[dayMap[day]] = hours === '定休日' ? '休み' : hours;
        }
      }
    } else if (line.startsWith('レビュー') && line.includes(':')) {
      currentSection = 'reviews';
      reviewIndex++;
    } else if (currentSection === 'reviews' && line.startsWith('内容: ')) {
      const content = line.replace('内容: ', '');
      if (content && content.length > 10) {
        spot.description = content.substring(0, 200) + (content.length > 200 ? '...' : '');
        currentSection = ''; // Only take the first review content as description
      }
    }
  }

  // Set default description if none found
  if (!spot.description) {
    spot.description = `${spot.name}は東京の魅力的な観光スポットです。`;
  }

  // Set price range based on category
  if (spot.category === 'hotels') {
    spot.priceRange = 'expensive';
  } else if (spot.category === 'restaurants') {
    spot.priceRange = 'moderate';
  } else {
    spot.priceRange = 'budget';
  }

  // Add default image
  spot.images = ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop'];

  // Only add if we have valid data
  if (spot.name && spot.location.lat !== 0 && spot.location.lng !== 0) {
    parsedSpots.push(spot);
  }
});

console.log(`Parsed ${parsedSpots.length} spots from the file`);

// Generate the TypeScript code for the spots
const spotsCode = `import { TouristSpot } from '@/types';

export const kanngouSpots: TouristSpot[] = ${JSON.stringify(parsedSpots, null, 2)};
`;

// Write to a new file
const outputPath = '/Users/j.takano/Desktop/trip-app/src/data/kankou-spots.ts';
fs.writeFileSync(outputPath, spotsCode);

console.log(`Generated spots data file at: ${outputPath}`);
console.log(`Added ${parsedSpots.length} spots to the data`);

// Show sample of categories
const categories = {};
parsedSpots.forEach(spot => {
  categories[spot.category] = (categories[spot.category] || 0) + 1;
});

console.log('\nCategory breakdown:');
console.log(categories);