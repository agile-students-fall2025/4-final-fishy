// back-end/src/data/mapStore.js
import MapLocation from "../models/MapLocation.js";

// read

export async function listLocations() {
  return MapLocation.find().sort({ createdAt: -1 });
}

export async function getLocation(id) {
  return MapLocation.findById(id);
}

// create

export async function createLocation(payload) {
  const data = {
    title: payload.title,
    lat: payload.lat,
    lng: payload.lng,
    note: payload.note || "",
    photos: payload.photos || [],
  };

  const doc = new MapLocation(data);
  return doc.save();
}

// update

export async function updateLocation(id, patch) {
  const update = {};

  if (patch.title !== undefined) update.title = patch.title;
  if (patch.lat !== undefined) update.lat = patch.lat;
  if (patch.lng !== undefined) update.lng = patch.lng;
  if (patch.note !== undefined) update.note = patch.note;
  if (patch.photos !== undefined) update.photos = patch.photos;

  return MapLocation.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
}

// delete

export async function removeLocation(id) {
  const doc = await MapLocation.findByIdAndDelete(id);
  return !!doc;
}

// photoes

export async function addPhotos(locationId, photos) {
  const loc = await MapLocation.findById(locationId);
  if (!loc) return null;

  const valid = photos.filter((x) => typeof x === "string");
  loc.photos.push(...valid);
  await loc.save();

  return loc.photos;
}
