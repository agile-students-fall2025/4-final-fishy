const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
const TRIPS = `${API}/api/trips`;

export async function fetchTrips() {
  const r = await fetch(TRIPS);
  if (!r.ok) throw new Error("Failed to load trips");
  return r.json();
}
export async function saveTrip(trip) {
  // Use POST for new trips (no id), PUT for updates (has id)
  const method = trip?.id ? "PUT" : "POST";
  const url = trip?.id ? `${TRIPS}/${trip.id}` : TRIPS;
  const r = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip),
  });
  if (!r.ok) {
    const errorData = await r.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to save trip: ${r.status} ${r.statusText}`);
  }
  return r.json();
}
export async function updateTripById(id, patch) {
  const r = await fetch(`${TRIPS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) {
    const errorData = await r.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update trip: ${r.status} ${r.statusText}`);
  }
  return r.json();
}
export async function deleteTripById(id) {
  const r = await fetch(`${TRIPS}/${id}`, { method: "DELETE" });
  if (!r.ok) throw new Error("Failed to delete trip");
  return r.json();
}

export async function fetchBudgets() {
  const r = await fetch(`${API}/api/budgets`);
  if (!r.ok) throw new Error('Failed to load budgets');
  return r.json();
}
export async function createBudgetAPI(payload) {
  const r = await fetch(`${API}/api/budgets`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('Create budget failed');
  return r.json();
}
export async function updateBudgetAPI(id, patch) {
  const r = await fetch(`${API}/api/budgets/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(patch) });
  if (!r.ok) throw new Error('Update budget failed');
  return r.json();
}
export async function deleteBudgetAPI(id) {
  const r = await fetch(`${API}/api/budgets/${id}`, { method:'DELETE' });
  if (!r.ok && r.status !== 204) throw new Error('Delete budget failed');
}

export async function addExpenseAPI(budgetId, payload) {
  const r = await fetch(`${API}/api/budgets/${budgetId}/expenses`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('Add expense failed');
  return r.json();
}
export async function updateExpenseAPI(budgetId, expenseId, patch) {
  const r = await fetch(`${API}/api/budgets/${budgetId}/expenses/${expenseId}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(patch) });
  if (!r.ok) throw new Error('Update expense failed');
  return r.json();
}
export async function deleteExpenseAPI(budgetId, expenseId) {
  const r = await fetch(`${API}/api/budgets/${budgetId}/expenses/${expenseId}`, { method:'DELETE' });
  if (!r.ok && r.status !== 204) throw new Error('Delete expense failed');
}

// Weather API functions
export async function fetchWeather(location) {
  const r = await fetch(`${API}/api/weather/${encodeURIComponent(location)}`);
  if (!r.ok) {
    const errorData = await r.json().catch(() => ({}));
    if (r.status === 404) throw new Error('Location not found');
    if (r.status === 401) throw new Error('Invalid API key. Please check your OpenWeather API key configuration.');
    throw new Error(errorData.error || 'Failed to fetch weather data');
  }
  return r.json();
}

export async function fetchCurrentWeather(location) {
  const r = await fetch(`${API}/api/weather/current/${encodeURIComponent(location)}`);
  if (!r.ok) {
    const errorData = await r.json().catch(() => ({}));
    if (r.status === 404) throw new Error('Location not found');
    if (r.status === 401) throw new Error('Invalid API key. Please check your OpenWeather API key configuration.');
    throw new Error(errorData.error || 'Failed to fetch current weather');
  }
  return r.json();
}

export async function fetchForecast(location) {
  const r = await fetch(`${API}/api/weather/forecast/${encodeURIComponent(location)}`);
  if (!r.ok) {
    const errorData = await r.json().catch(() => ({}));
    if (r.status === 404) throw new Error('Location not found');
    if (r.status === 401) throw new Error('Invalid API key. Please check your OpenWeather API key configuration.');
    throw new Error(errorData.error || 'Failed to fetch forecast');
  }
  return r.json();
}

// Unsplash API functions
const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

/**
 * Search for photos on Unsplash based on a query (destination name)
 * @param {string} query - The search query (e.g., "Tokyo", "Paris")
 * @param {number} width - Desired image width (default: 800)
 * @param {number} height - Desired image height (default: 600)
 * @returns {Promise<string>} The URL of the best matching photo
 */
// Activity Recommendations API
export async function fetchRecommendedActivities(destination) {
  if (!destination || destination.trim() === '') {
    return [];
  }
  
  const r = await fetch(`${API}/api/activities/recommendations?destination=${encodeURIComponent(destination)}`);
  if (!r.ok) {
    const errorData = await r.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch recommendations');
  }
  return r.json();
}

export async function searchUnsplashPhoto(query, width = 800, height = 600) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not found. Please set REACT_APP_UNSPLASH_ACCESS_KEY in your .env file');
    // Return a fallback image
    return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
  }

  if (!query) {
    return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
  }

  try {
    // Extract city name (everything before the first comma)
    const cityName = query.split(',')[0].trim();
    
    // Search for photos related to the destination
    // Add "travel" and "city" to improve relevance
    const searchQuery = `${cityName} travel city tourism`;
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Get the first (most relevant) photo
      const photo = data.results[0];
      // Return the regular URL with our desired dimensions
      return `${photo.urls.regular}?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
    } else {
      // No results found, return fallback
      return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
    }
  } catch (error) {
    console.error('Error fetching Unsplash photo:', error);
    // Return fallback image on error
    return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=${width}&h=${height}&fit=crop&q=80&auto=format`;
  }
}