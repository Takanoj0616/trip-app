const fs = require('fs');

// Read the current hotel spots data
const hotelSpotsPath = '/Users/j.takano/Desktop/trip-app/src/data/hotel-spots.ts';
const content = fs.readFileSync(hotelSpotsPath, 'utf-8');

// Get all available hotel image filenames
const imagesDir = '/Users/j.takano/Desktop/trip-app/public/images/hotel_photos';
const imageFiles = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpg'));

console.log(`Found ${imageFiles.length} hotel image files`);

// Create a mapping of hotel names to image files
const imageMapping = {};

imageFiles.forEach(filename => {
  // Extract the hotel name from the filename
  // Format: 001_Hotel Name.jpg
  const match = filename.match(/^\d+_(.+)\.jpg$/);
  if (match) {
    const hotelName = match[1];
    if (!imageMapping[hotelName]) {
      imageMapping[hotelName] = [];
    }
    imageMapping[hotelName].push(filename);
  }
});

// Function to find matching images for a hotel name
function findImageForHotel(hotelName) {
  // Direct match
  if (imageMapping[hotelName]) {
    return imageMapping[hotelName][0];
  }
  
  // Partial match - look for hotels that contain similar words
  const keys = Object.keys(imageMapping);
  const match = keys.find(key => {
    // Clean names for comparison
    const cleanKey = key.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    const cleanHotel = hotelName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    
    return cleanKey.includes(cleanHotel) || 
           cleanHotel.includes(cleanKey) ||
           key.includes(hotelName) ||
           hotelName.includes(key);
  });
  
  if (match) {
    return imageMapping[match][0];
  }
  
  return null;
}

// Parse the current hotel spots data
const spotsMatch = content.match(/export const hotelSpots: TouristSpot\[\] = (\[[\s\S]*?\]);/);
if (!spotsMatch) {
  console.error('Could not parse hotel spots data');
  process.exit(1);
}

const hotelData = JSON.parse(spotsMatch[1]);
let updatedCount = 0;

// Update each hotel with appropriate images
hotelData.forEach(hotel => {
  const imageName = findImageForHotel(hotel.name);
  if (imageName) {
    hotel.images = [`/images/hotel_photos/${imageName}`];
    updatedCount++;
    console.log(`Updated ${hotel.name} with image: ${imageName}`);
  } else {
    // Keep the default image if no match found
    hotel.images = ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'];
  }
});

console.log(`Updated ${updatedCount} hotels with real images`);

// Generate the updated TypeScript code
const updatedContent = `import { TouristSpot } from '@/types';

export const hotelSpots: TouristSpot[] = ${JSON.stringify(hotelData, null, 2)};
`;

// Write the updated file
fs.writeFileSync(hotelSpotsPath, updatedContent);

console.log('Successfully updated hotel-spots.ts with real images');

// Show statistics
console.log(`\nImage assignment statistics:`);
console.log(`- Hotels with real images: ${updatedCount}`);
console.log(`- Hotels with default images: ${hotelData.length - updatedCount}`);
console.log(`- Total available hotel photos: ${imageFiles.length}`);