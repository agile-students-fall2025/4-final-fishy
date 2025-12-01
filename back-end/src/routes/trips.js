import { Router } from 'express';
import { z } from 'zod';
import Trip from '../models/Trip.js';
import { httpError } from '../utils/httpError.js';

const router = Router();

// Zod validation
const Day = z.object({
  date: z.string().optional().default(''),
  activities: z.array(z.string().min(1).max(200)).optional().default([])
});

const TripCreate = z.object({
  destination: z.string().min(1).max(200),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  days: z.array(Day).optional().default([])
});

const TripUpdate = TripCreate.partial();

// Normalize Mongo _id → id for the client
const normalize = (doc) => {
  const obj = doc.toObject({ versionKey: false });
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
};

// GET /api/trips
router.get('/', async (req, res, next) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips.map(normalize));
  } catch (e) { next(e); }
});

// GET /api/trips/:id
router.get('/:id', async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return next(httpError(404, 'Trip not found'));
    res.json(normalize(trip));
  } catch (e) { next(e); }
});

// POST /api/trips
router.post('/', async (req, res, next) => {
  try {
    const payload = TripCreate.parse(req.body);
    const created = await Trip.create(payload);
    res.status(201).json(normalize(created));
  } catch (e) {
    if (e.name === 'ZodError') return next(httpError(400, 'Invalid input'));
    next(e);
  }
});

// PUT /api/trips/:id
router.put('/:id', async (req, res, next) => {
  try {
    const payload = TripUpdate.parse(req.body);
    const updated = await Trip.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true });
    if (!updated) return next(httpError(404, 'Trip not found'));
    res.json(normalize(updated));
  } catch (e) {
    if (e.name === 'ZodError') return next(httpError(400, 'Invalid input'));
    next(e);
  }
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const out = await Trip.findByIdAndDelete(req.params.id);
    if (!out) return next(httpError(404, 'Trip not found'));
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
