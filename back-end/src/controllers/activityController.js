// back-end/src/controllers/activityController.js

// Curated activity recommendations by destination
// This is a simple implementation that can be extended with external APIs
const destinationActivities = {
  // Major cities
  'paris': ['Visit the Eiffel Tower', 'Explore the Louvre Museum', 'Walk along the Seine River', 'Visit Notre-Dame Cathedral', 'Stroll through Montmartre', 'Try French pastries at a local bakery', 'Visit the Arc de Triomphe', 'Explore the Palace of Versailles'],
  'tokyo': ['Visit Senso-ji Temple', 'Explore Shibuya Crossing', 'Visit the Tokyo Skytree', 'Experience a traditional tea ceremony', 'Visit the Imperial Palace', 'Explore Harajuku district', 'Try authentic sushi', 'Visit Meiji Shrine'],
  'new york': ['Visit Times Square', 'Walk across Brooklyn Bridge', 'Explore Central Park', 'Visit the Statue of Liberty', 'See a Broadway show', 'Visit the Metropolitan Museum of Art', 'Explore Greenwich Village', 'Visit the High Line'],
  'london': ['Visit the Tower of London', 'See Big Ben and Parliament', 'Explore the British Museum', 'Visit Buckingham Palace', 'Walk along the Thames', 'Visit the London Eye', 'Explore Covent Garden', 'Visit Westminster Abbey'],
  'dubai': ['Visit the Burj Khalifa', 'Explore the Dubai Mall', 'Visit the Palm Jumeirah', 'Experience desert safari', 'Visit the Dubai Marina', 'Explore the Gold Souk', 'Visit the Dubai Fountain', 'Relax at Jumeirah Beach'],
  'barcelona': ['Visit Sagrada Familia', 'Explore Park Güell', 'Walk along Las Ramblas', 'Visit the Gothic Quarter', 'Relax at Barceloneta Beach', 'Visit Camp Nou', 'Explore the Picasso Museum', 'Try tapas at local restaurants'],
  'rome': ['Visit the Colosseum', 'Explore the Vatican Museums', 'Throw a coin in Trevi Fountain', 'Visit the Pantheon', 'Explore the Roman Forum', 'Visit the Spanish Steps', 'Try authentic Italian gelato', 'Explore Trastevere neighborhood'],
  'sydney': ['Visit the Sydney Opera House', 'Walk across the Harbour Bridge', 'Relax at Bondi Beach', 'Visit the Royal Botanic Gardens', 'Explore The Rocks', 'Visit Taronga Zoo', 'Take a ferry to Manly', 'Visit the Sydney Tower'],
  'amsterdam': ['Take a canal cruise', 'Visit the Van Gogh Museum', 'Explore the Anne Frank House', 'Visit the Rijksmuseum', 'Rent a bike and explore', 'Visit the Red Light District', 'Try Dutch cheese', 'Visit the Flower Market'],
  'bangkok': ['Visit the Grand Palace', 'Explore Wat Pho Temple', 'Take a boat on the Chao Phraya River', 'Visit Chatuchak Weekend Market', 'Try street food', 'Visit Wat Arun', 'Experience a Thai massage', 'Explore Khao San Road'],
};

// Category-based activities that can be suggested for any destination
const categoryActivities = {
  cultural: ['Visit local museums', 'Explore historical sites', 'Attend cultural festivals', 'Visit art galleries', 'Learn about local history', 'Visit religious sites', 'Experience traditional performances'],
  outdoor: ['Go hiking', 'Visit parks and gardens', 'Take a walking tour', 'Go to the beach', 'Visit viewpoints', 'Explore nature reserves', 'Take a bike tour', 'Go on a boat tour'],
  food: ['Try local cuisine', 'Visit food markets', 'Take a cooking class', 'Try street food', 'Visit local restaurants', 'Experience fine dining', 'Try local desserts', 'Visit cafes'],
  shopping: ['Visit local markets', 'Explore shopping districts', 'Buy souvenirs', 'Visit malls', 'Shop for local crafts', 'Visit boutiques', 'Explore flea markets'],
  nightlife: ['Visit bars and pubs', 'Experience nightlife', 'Go to clubs', 'Watch live music', 'Visit rooftop bars', 'Experience local nightlife'],
  relaxation: ['Visit spas', 'Relax at beaches', 'Take a leisurely walk', 'Visit parks', 'Enjoy scenic views', 'Take a break at cafes'],
};

function normalizeDestination(destination) {
  if (!destination) return '';
  // Extract city name (everything before the first comma)
  const cityName = destination.split(',')[0].trim().toLowerCase();
  return cityName;
}

function getActivitiesForDestination(destination) {
  const normalized = normalizeDestination(destination);
  
  // Try exact match first
  if (destinationActivities[normalized]) {
    return destinationActivities[normalized];
  }
  
  // Try partial match
  for (const [key, activities] of Object.entries(destinationActivities)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return activities;
    }
  }
  
  // Return generic recommendations if no match
  return [
    ...categoryActivities.cultural.slice(0, 3),
    ...categoryActivities.outdoor.slice(0, 2),
    ...categoryActivities.food.slice(0, 2),
    ...categoryActivities.shopping.slice(0, 1),
  ];
}

export async function getRecommendedActivities(req, res) {
  try {
    const { destination } = req.query;
    
    if (!destination || destination.trim() === '') {
      return res.status(400).json({ error: 'Destination is required' });
    }

    const activities = getActivitiesForDestination(destination);
    
    // Return a random selection of 6-8 activities
    const shuffled = [...activities].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(8, shuffled.length));
    
    res.json(selected);
  } catch (e) {
    console.error('Error in getRecommendedActivities:', e);
    res.status(500).json({ error: 'Failed to fetch recommendations', details: e.message });
  }
}

