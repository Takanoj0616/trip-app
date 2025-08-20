const fs = require('fs');

// Read the hotel.txt file
const filePath = '/Users/j.takano/Desktop/app/hotel.txt';
const content = fs.readFileSync(filePath, 'utf-8');

// Split by separator lines to get individual hotels
const hotels = content.split('------------------------------------------------------------').filter(hotel => hotel.trim());

const parsedHotels = [];

hotels.forEach((hotelText, index) => {
  const lines = hotelText.split('\n').map(line => line.trim()).filter(line => line);
  
  let hotel = {
    id: `hotel_${index + 2001}`, // Start from 2001 to avoid conflicts
    name: '',
    description: '',
    category: 'hotels',
    area: 'tokyo',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    rating: 0,
    images: [],
    openingHours: {},
    priceRange: 'expensive', // Hotels are typically expensive
    tags: ['宿泊', 'ホテル'],
    reviews: []
  };

  let currentReview = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('🏨 ホテル名: ')) {
      hotel.name = line.replace('🏨 ホテル名: ', '');
    } else if (line.startsWith('📍 住所: ')) {
      hotel.location.address = line.replace('📍 住所: ', '');
    } else if (line.startsWith('⭐ 評価: ')) {
      hotel.rating = parseFloat(line.replace('⭐ 評価: ', ''));
    } else if (line.startsWith('📝 概要: ')) {
      hotel.description = line.replace('📝 概要: ', '');
    } else if (line.startsWith('💾 写真保存: ')) {
      // Extract the photo filename
      const photoPath = line.replace('💾 写真保存: ', '');
      const filename = photoPath.split('/').pop();
      hotel.images = [`/images/hotel_photos/${filename}`];
    } else if (line.includes('⭐') && line.includes('/5') && line.includes('months ago') || line.includes('year ago') || line.includes('month ago')) {
      // This is a review line
      const reviewMatch = line.match(/(\d+)\.\s*(.+?)\s*⭐(\d+)\/5/);
      if (reviewMatch) {
        currentReview = {
          author: reviewMatch[2],
          rating: parseInt(reviewMatch[3]),
          comment: ''
        };
      }
    } else if (line.startsWith('「') && line.endsWith('」') && currentReview) {
      // This is a review comment
      currentReview.comment = line.substring(1, line.length - 1);
      hotel.reviews.push(currentReview);
      currentReview = null;
      
      // Use the first review as description if no description exists
      if (!hotel.description && hotel.reviews.length === 1) {
        hotel.description = hotel.reviews[0].comment.substring(0, 150) + (hotel.reviews[0].comment.length > 150 ? '...' : '');
      }
    }
  }

  // Set default description if none found
  if (!hotel.description) {
    hotel.description = `${hotel.name}は東京の快適なホテルです。`;
  }

  // Extract coordinates from address if possible (simplified)
  // For now, set default Tokyo coordinates
  hotel.location.lat = 35.6762 + (Math.random() - 0.5) * 0.1;
  hotel.location.lng = 139.6503 + (Math.random() - 0.5) * 0.1;

  // Add default image if no specific image found
  if (hotel.images.length === 0) {
    hotel.images = ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'];
  }

  // Set operating hours (hotels are usually 24/7)
  hotel.openingHours = {
    monday: '24時間営業',
    tuesday: '24時間営業',
    wednesday: '24時間営業',
    thursday: '24時間営業',
    friday: '24時間営業',
    saturday: '24時間営業',
    sunday: '24時間営業'
  };

  // Only add if we have valid data
  if (hotel.name && hotel.location.address) {
    parsedHotels.push(hotel);
  }
});

console.log(`Parsed ${parsedHotels.length} hotels from the file`);

// Generate the TypeScript code for the hotels
const hotelsCode = `import { TouristSpot } from '@/types';

export const hotelSpots: TouristSpot[] = ${JSON.stringify(parsedHotels, null, 2)};
`;

// Write to a new file
const outputPath = '/Users/j.takano/Desktop/trip-app/src/data/hotel-spots.ts';
fs.writeFileSync(outputPath, hotelsCode);

console.log(`Generated hotels data file at: ${outputPath}`);
console.log(`Added ${parsedHotels.length} hotels to the data`);

// Show sample of rating distribution
const ratingDistribution = {};
parsedHotels.forEach(hotel => {
  const rating = Math.floor(hotel.rating);
  ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
});

console.log('\nRating distribution:');
console.log(ratingDistribution);

// Show sample hotel names
console.log('\nSample hotels:');
parsedHotels.slice(0, 5).forEach(hotel => {
  console.log(`- ${hotel.name} (${hotel.rating}⭐)`);
});