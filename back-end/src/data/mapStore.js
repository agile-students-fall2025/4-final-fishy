// back-end/src/data/mapStore.js
import MapLocation from '../models/MapLocation.js';

// ---- CRUD for locations ----
export async function listLocations() {
  // newest first, like original createdAt-based sort
  return MapLocation.find().sort({ createdAt: -1 });
}

export async function getLocation(id) {
  return MapLocation.findById(id);
}

export async function createLocation(payload) {
  // Ensure we only keep the fields we care about
  const tasks = Array.isArray(payload.tasks)
    ? payload.tasks.map((t) => ({
        text: t.text,
        done: t.done ?? false,
      }))
    : [];

  const doc = new MapLocation({
    title: payload.title,
    lat: payload.lat,
    lng: payload.lng,
    note: payload.note,
    photos: Array.isArray(payload.photos) ? payload.photos : [],
    tasks,
  });

  return doc.save();
}

export async function updateLocation(id, patch) {
  const update = { ...patch };

  if (Array.isArray(patch.tasks)) {
    update.tasks = patch.tasks.map((t) => ({
      text: t.text,
      done: t.done ?? false,
    }));
  }

  // runValidators ensures numeric lat/lng etc are valid
  return MapLocation.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
}

export async function removeLocation(id) {
  const doc = await MapLocation.findByIdAndDelete(id);
  return !!doc;
}

// ---- Tasks (nested) ----
export async function addTask(locationId, text) {
  const loc = await MapLocation.findById(locationId);
  if (!loc) return null;

  loc.tasks.push({ text: String(text || '').trim(), done: false });
  await loc.save();

  const task = loc.tasks[loc.tasks.length - 1];
  return {
    id: task._id.toString(),
    text: task.text,
    done: task.done,
  };
}

export async function updateTask(locationId, taskId, patch) {
  const loc = await MapLocation.findById(locationId);
  if (!loc) return null;

  const task = loc.tasks.id(taskId);
  if (!task) return null;

  if (patch.text !== undefined) task.text = String(patch.text || '').trim();
  if (patch.done !== undefined) task.done = !!patch.done;

  await loc.save();

  return {
    id: task._id.toString(),
    text: task.text,
    done: task.done,
  };
}

export async function removeTask(locationId, taskId) {
  const loc = await MapLocation.findById(locationId);
  if (!loc) return null;

  const task = loc.tasks.id(taskId);
  if (!task) return false;

  task.deleteOne(); // mark subdoc for removal
  await loc.save();
  return true;
}

export async function addPhotos(locationId, base64List) {
  const loc = await MapLocation.findById(locationId);
  if (!loc) return null;

  const list = Array.isArray(base64List) ? base64List : [];
  const validPhotos = list.filter(
    (x) => typeof x === 'string' && x.startsWith('data:image/')
  );

  loc.photos.push(...validPhotos);
  await loc.save();

  return loc.photos;
}
