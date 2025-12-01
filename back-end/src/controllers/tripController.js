// back-end/src/controllers/tripController.js
import Joi from 'joi';
import { getAll, getById, create, update, remove } from '../data/tripStore.js';

// Payload schema (lenient so blank dates/activities don't break)
const tripSchema = Joi.object({
  id: Joi.string().optional(),
  destination: Joi.string().allow('', null),
  startDate: Joi.string().allow('', null),
  endDate: Joi.string().allow('', null),
  days: Joi.array()
    .items(
      Joi.object({
        date: Joi.string().allow('', null),
        activities: Joi.array()
          .items(Joi.string().allow('', null))
          .default([]),
      })
    )
    .default([]),
});

export async function listTrips(_req, res) {
  try {
    const trips = await getAll();
    res.json(trips);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch trips', details: e.message });
  }
}

export async function getTrip(req, res) {
  const doc = await getById(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
}

export async function createTrip(req, res) {
  try {
    // Validate but strip unknown fields so random props don't leak in
    const { value, error } = tripSchema.validate(req.body || {}, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.message });

    // Normalize to be forgiving with blanks
    const payload = {
      destination: String(value.destination || '').trim() || 'Untitled trip',
      startDate: value.startDate || '',
      endDate: value.endDate || '',
      days: (value.days || []).map((d) => ({
        date: d?.date || '',
        activities: Array.isArray(d?.activities)
          ? d.activities.filter((a) => typeof a === 'string' && a.trim() !== '')
          : [],
      })),
    };

    const doc = await create(payload);
    return res.status(201).json(doc);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to create trip', details: e.message });
  }
}

export async function updateTrip(req, res) {
  // Allow partial update: validate then normalize similarly
  const { value, error } = tripSchema.validate(req.body || {}, { stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });

  // Check original request body to determine which fields were actually provided
  // (Joi defaults might add fields that weren't in the request)
  const body = req.body || {};

  const patch = {
    ...(body.destination !== undefined && {
      destination: String(value.destination || '').trim() || 'Untitled trip',
    }),
    ...(body.startDate !== undefined && { startDate: value.startDate || '' }),
    ...(body.endDate !== undefined && { endDate: value.endDate || '' }),
    ...(body.days !== undefined && {
      days: (value.days || []).map((d) => ({
        date: d?.date || '',
        activities: Array.isArray(d?.activities)
          ? d.activities.filter((a) => typeof a === 'string' && a.trim() !== '')
          : [],
      })),
    }),
  };

  const doc = await update(req.params.id, patch);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
}

export async function deleteTrip(req, res) {
  const ok = await remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
}
