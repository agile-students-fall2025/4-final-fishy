// back-end/src/controllers/mapController.js
import Joi from "joi";
import {
  listLocations,
  getLocation,
  createLocation,
  updateLocation,
  removeLocation,
  addPhotos
} from "../data/mapStore.js";

// ----------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------

const locCreateSchema = Joi.object({
  title: Joi.string().allow("", null),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  note: Joi.string().allow("", null),
  photos: Joi.array().items(Joi.string()).default([]),
}).unknown(true);

const locUpdateSchema = Joi.object({
  title: Joi.string().allow("", null),
  lat: Joi.number().optional(),
  lng: Joi.number().optional(),
  note: Joi.string().allow("", null),
  photos: Joi.array().items(Joi.string()).optional(),
}).unknown(true);

// ----------------------------------------------------------------------
// ROUTES
// ----------------------------------------------------------------------

export async function listAll(req, res) {
  try {
    const docs = await listLocations();
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: "Failed to list locations" });
  }
}

export async function getOne(req, res) {
  try {
    const doc = await getLocation(req.params.id);
    if (!doc) return res.status(404).json({ error: "Location not found" });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch location" });
  }
}

export async function createOne(req, res) {
  try {
    const { value, error } = locCreateSchema.validate(req.body || {}, {
      abortEarly: false
    });

    if (error) return res.status(400).json({ error: error.message });

    const doc = await createLocation(value);
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create location" });
  }
}

export async function updateOne(req, res) {
  try {
    const { value, error } = locUpdateSchema.validate(req.body || {}, {
      abortEarly: false
    });

    if (error) return res.status(400).json({ error: error.message });

    const doc = await updateLocation(req.params.id, value);
    if (!doc) return res.status(404).json({ error: "Location not found" });

    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ error: "Failed to update location" });
  }
}

export async function removeOne(req, res) {
  try {
    const ok = await removeLocation(req.params.id);
    if (!ok) return res.status(404).json({ error: "Location not found" });

    return res.json({ message: "Location deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete location" });
  }
}

// ----------------------------------------------------------------------
// PHOTOS ONLY
// ----------------------------------------------------------------------

export async function addPhotosOne(req, res) {
  try {
    const { photos } = req.body;
    if (!Array.isArray(photos))
      return res.status(400).json({ error: "Photos must be array" });

    const out = await addPhotos(req.params.id, photos);
    if (!out) return res.status(404).json({ error: "Location not found" });

    return res.json({ photos: out });
  } catch (err) {
    return res.status(500).json({ error: "Failed to add photos" });
  }
}
