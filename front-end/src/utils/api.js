const API = process.env.REACT_APP_API_URL || "http://localhost:4000";
const TRIPS = `${API}/api/trips`;

export async function fetchTrips() {
  const r = await fetch(TRIPS);
  if (!r.ok) throw new Error("Failed to load trips");
  return r.json();
}
export async function saveTrip(trip) {
  const r = await fetch(TRIPS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trip),
  });
  if (!r.ok) throw new Error("Failed to save trip");
  return r.json();
}
export async function updateTripById(id, patch) {
  const r = await fetch(`${TRIPS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("Failed to update trip");
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
    if (r.status === 404) throw new Error('Location not found');
    throw new Error('Failed to fetch weather data');
  }
  return r.json();
}

export async function fetchCurrentWeather(location) {
  const r = await fetch(`${API}/api/weather/current/${encodeURIComponent(location)}`);
  if (!r.ok) {
    if (r.status === 404) throw new Error('Location not found');
    throw new Error('Failed to fetch current weather');
  }
  return r.json();
}

export async function fetchForecast(location) {
  const r = await fetch(`${API}/api/weather/forecast/${encodeURIComponent(location)}`);
  if (!r.ok) {
    if (r.status === 404) throw new Error('Location not found');
    throw new Error('Failed to fetch forecast');
  }
  return r.json();
}