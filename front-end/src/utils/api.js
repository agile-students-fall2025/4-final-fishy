// API functions will go here

// These stubs persist to localStorage so the UI works without a backend.
const KEY = "tripmate.trips.v1";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}
function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export async function saveTrip(trip) {
  const list = read();
  // if trip with same id exists, replace; otherwise prepend
  const idx = list.findIndex((t) => t.id === trip.id);
  if (idx >= 0) list[idx] = trip;
  else list.unshift(trip);
  write(list);
  return Promise.resolve(trip);
}

export async function deleteTripById(id) {
  const list = read().filter((t) => t.id !== id);
  write(list);
  return Promise.resolve({ ok: true });
}
