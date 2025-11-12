// back-end/src/data/mapStore.js
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const MAP_DATA_FILE = process.env.MAP_DATA_FILE; // if falsy => memory-only
let state = {
  locations: [] // each: { id, title, lat, lng, note, photos: [base64], tasks: [{ id, text, done }] }
};

async function load() {
  if (!MAP_DATA_FILE) return;
  try {
    const p = path.resolve(MAP_DATA_FILE);
    const txt = await fs.readFile(p, 'utf-8');
    state = JSON.parse(txt || '{"locations": []}');
  } catch (e) {
    if (e.code === 'ENOENT') await save();
    else console.warn('mapStore load error:', e.message);
  }
}

async function save(data = state) {
  if (!MAP_DATA_FILE) return;
  const p = path.resolve(MAP_DATA_FILE);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(data, null, 2));
}

await load();

// ---- CRUD for locations ----
export async function listLocations() {
  return state.locations.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function getLocation(id) {
  return state.locations.find(l => l.id === id) || null;
}

export async function createLocation(payload) {
  const loc = {
    id: payload.id || `loc_${crypto.randomUUID()}`,
    title: String(payload.title || '').trim() || 'Untitled',
    lat: Number(payload.lat),
    lng: Number(payload.lng),
    note: String(payload.note || ''),
    photos: Array.isArray(payload.photos) ? payload.photos : [],
    tasks: Array.isArray(payload.tasks) ? payload.tasks : [],
    createdAt: Date.now()
  };
  state.locations.unshift(loc);
  await save();
  return loc;
}

export async function updateLocation(id, patch) {
  const i = state.locations.findIndex(l => l.id === id);
  if (i < 0) return null;
  const current = state.locations[i];
  state.locations[i] = {
    ...current,
    ...(patch.title !== undefined && { title: String(patch.title || '').trim() || 'Untitled' }),
    ...(patch.lat !== undefined && { lat: Number(patch.lat) }),
    ...(patch.lng !== undefined && { lng: Number(patch.lng) }),
    ...(patch.note !== undefined && { note: String(patch.note || '') }),
    ...(patch.photos !== undefined && { photos: Array.isArray(patch.photos) ? patch.photos : current.photos }),
  };
  await save();
  return state.locations[i];
}

export async function removeLocation(id) {
  const before = state.locations.length;
  state.locations = state.locations.filter(l => l.id !== id);
  if (state.locations.length !== before) await save();
  return before !== state.locations.length;
}

// ---- Tasks (nested) ----
export async function addTask(locationId, text) {
  const loc = await getLocation(locationId);
  if (!loc) return null;
  const task = { id: `task_${crypto.randomUUID()}`, text: String(text || '').trim(), done: false };
  loc.tasks.push(task);
  await save();
  return task;
}

export async function updateTask(locationId, taskId, patch) {
  const loc = await getLocation(locationId);
  if (!loc) return null;
  const i = loc.tasks.findIndex(t => t.id === taskId);
  if (i < 0) return null;
  loc.tasks[i] = {
    ...loc.tasks[i],
    ...(patch.text !== undefined && { text: String(patch.text || '').trim() }),
    ...(patch.done !== undefined && { done: !!patch.done }),
  };
  await save();
  return loc.tasks[i];
}

export async function removeTask(locationId, taskId) {
  const loc = await getLocation(locationId);
  if (!loc) return null;
  const before = loc.tasks.length;
  loc.tasks = loc.tasks.filter(t => t.id !== taskId);
  if (loc.tasks.length !== before) await save();
  return before !== loc.tasks.length;
}

export async function addPhotos(locationId, base64List) {
  const loc = await getLocation(locationId);
  if (!loc) return null;
  const list = Array.isArray(base64List) ? base64List : [];
  loc.photos.push(...list.filter(x => typeof x === 'string' && x.startsWith('data:image/')));
  await save();
  return loc.photos;
}
