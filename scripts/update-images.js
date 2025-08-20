const fs = require('fs');

// Read the current kankou spots data
const kanngouSpotsPath = '/Users/j.takano/Desktop/trip-app/src/data/kankou-spots.ts';
const content = fs.readFileSync(kanngouSpotsPath, 'utf-8');

// Get all available image filenames
const imagesDir = '/Users/j.takano/Desktop/trip-app/public/images/spots';
const imageFiles = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpg'));

console.log(`Found ${imageFiles.length} image files`);

// Create a mapping of spot names to image files
const imageMapping = {};

imageFiles.forEach(filename => {
  // Extract the spot name from the filename (everything before the date)
  const spotName = filename
    .replace(/_\d{8}_\d{6}\.jpg$/, '')  // Remove date and extension
    .replace(/_/g, ' ');  // Replace underscores with spaces
  
  if (!imageMapping[spotName]) {
    imageMapping[spotName] = [];
  }
  imageMapping[spotName].push(filename);
});

// Function to find matching images for a spot name
function findImageForSpot(spotName) {
  // Direct match
  if (imageMapping[spotName]) {
    return imageMapping[spotName][0];
  }
  
  // Partial match
  const keys = Object.keys(imageMapping);
  const match = keys.find(key => 
    key.includes(spotName) || 
    spotName.includes(key) ||
    key.replace(/[()（）]/g, '') === spotName.replace(/[()（）]/g, '')
  );
  
  if (match) {
    return imageMapping[match][0];
  }
  
  return null;
}

// Parse the current spots data
const spotsMatch = content.match(/export const kanngouSpots: TouristSpot\[\] = (\[[\s\S]*?\]);/);
if (!spotsMatch) {
  console.error('Could not parse spots data');
  process.exit(1);
}

const spotsData = JSON.parse(spotsMatch[1]);
let updatedCount = 0;

// Update each spot with appropriate images
spotsData.forEach(spot => {
  const imageName = findImageForSpot(spot.name);
  if (imageName) {
    spot.images = [`/images/spots/${imageName}`];
    updatedCount++;
    console.log(`Updated ${spot.name} with image: ${imageName}`);
  } else {
    // Keep the default image if no match found
    spot.images = ['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop'];
  }
});

console.log(`Updated ${updatedCount} spots with real images`);

// Generate the updated TypeScript code
const updatedContent = `import { TouristSpot } from '@/types';

export const kanngouSpots: TouristSpot[] = ${JSON.stringify(spotsData, null, 2)};
`;

// Write the updated file
fs.writeFileSync(kanngouSpotsPath, updatedContent);

console.log('Successfully updated kankou-spots.ts with real images');

// Show some statistics
const categorizedImages = {};
spotsData.forEach(spot => {
  if (!categorizedImages[spot.category]) {
    categorizedImages[spot.category] = 0;
  }
  if (spot.images[0].startsWith('/images/spots/')) {
    categorizedImages[spot.category]++;
  }
});

console.log('\nImage assignment by category:');
console.log(categorizedImages);