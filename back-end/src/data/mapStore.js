// back-end/src/data/mapStore.js
import MapLocation from "../models/MapLocation.js";

// read

export async function listLocations(userId) {
  return MapLocation.find({ userId }).sort({ createdAt: -1 });
}

export async function getLocation(id, userId) {
  return MapLocation.findOne({ _id: id, userId });
}

// create

export async function createLocation(payload, userId) {
  const data = {
    userId,                               
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

export async function updateLocation(id, patch, userId) {
  const update = {};

  if (patch.title !== undefined) update.title = patch.title;
  if (patch.lat !== undefined) update.lat = patch.lat;
  if (patch.lng !== undefined) update.lng = patch.lng;
  if (patch.note !== undefined) update.note = patch.note;
  if (patch.photos !== undefined) update.photos = patch.photos;

  return MapLocation.findOneAndUpdate(
    { _id: id, userId },                  // 👈 filter by user
    update,
    { new: true, runValidators: true }
  );
}

// delete

export async function removeLocation(id, userId) {
  const doc = await MapLocation.findOneAndDelete({ _id: id, userId });
  return !!doc;
}

// photos

export async function addPhotos(locationId, photos, userId) {
  const loc = await MapLocation.findOne({ _id: locationId, userId });
  if (!loc) return null;

  const valid = photos.filter((x) => typeof x === "string");
  loc.photos.push(...valid);
  await loc.save();

  return loc.photos;
}
