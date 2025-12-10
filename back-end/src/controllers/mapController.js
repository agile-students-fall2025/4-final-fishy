// back-end/src/controllers/mapController.js
import Joi from "joi";
import {
  listLocations,
  getLocation,
  createLocation,
  updateLocation,
  removeLocation,
  addPhotos,
} from "../data/mapStore.js";

// Validation schemas
const locCreateSchema = Joi.object({
  title: Joi.string().allow("", null),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  note: Joi.string().allow("", null),
  photos: Joi.array().items(Joi.string()).default([]),
});

const locUpdateSchema = Joi.object({
  title: Joi.string().allow("", null),
  lat: Joi.number(),
  lng: Joi.number(),
  note: Joi.string().allow("", null),
  photos: Joi.array().items(Joi.string()),
}).min(1);

// GET /api/map/locations
export async function listAll(req, res) {
  try {
    const userId = req.user.id;
    const docs = await listLocations(userId);
    return res.json(docs);
  } catch (err) {
    console.error("listAll error:", err);
    return res.status(500).json({ error: "Failed to list locations" });
  }
}

// GET /api/map/locations/:id
export async function getOne(req, res) {
  try {
    // Validate ID parameter
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    const userId = req.user.id;
    const doc = await getLocation(req.params.id, userId);
    if (!doc) return res.status(404).json({ error: "Location not found" });
    return res.json(doc);
  } catch (err) {
    console.error("getOne error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid location ID format' });
    }
    return res.status(500).json({ error: "Failed to fetch location" });
  }
}

// POST /api/map/locations
export async function createOne(req, res) {
  try {
    const { value, error } = locCreateSchema.validate(req.body || {}, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = req.user.id;
    const doc = await createLocation(value, userId);
    return res.status(201).json(doc);
  } catch (err) {
    console.error("createOne error:", err);
    return res.status(500).json({ error: "Failed to create location" });
  }
}

// PUT /api/map/locations/:id
export async function updateOne(req, res) {
  try {
    // Validate ID parameter
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    
    const { value, error } = locUpdateSchema.validate(req.body || {}, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((d) => d.message),
      });
    }

    const userId = req.user.id;
    const doc = await updateLocation(req.params.id, value, userId);
    if (!doc) return res.status(404).json({ error: "Location not found" });

    return res.json(doc);
  } catch (err) {
    console.error("updateOne error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid location ID format' });
    }
    return res.status(500).json({ error: "Failed to update location" });
  }
}

// DELETE /api/map/locations/:id
export async function removeOne(req, res) {
  try {
    // Validate ID parameter
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    const userId = req.user.id;
    const ok = await removeLocation(req.params.id, userId);
    if (!ok) return res.status(404).json({ error: "Location not found" });

    return res.json({ message: "Location deleted" });
  } catch (err) {
    console.error("removeOne error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid location ID format' });
    }
    return res.status(500).json({ error: "Failed to delete location" });
  }
}

// POST /api/map/locations/:id/photos
export async function addPhotosOne(req, res) {
  try {
    // Validate ID parameter
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ error: 'Invalid location ID' });
    }
    
    const { photos } = req.body;
    if (!Array.isArray(photos)) {
      return res.status(400).json({ error: "Photos must be array" });
    }

    const userId = req.user.id;
    const out = await addPhotos(req.params.id, photos, userId);
    if (!out) return res.status(404).json({ error: "Location not found" });

    return res.json({ photos: out });
  } catch (err) {
    console.error("addPhotosOne error:", err);
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid location ID format' });
    }
    return res.status(500).json({ error: "Failed to add photos" });
  }
}
