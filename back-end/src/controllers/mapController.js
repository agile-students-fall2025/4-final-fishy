// back-end/src/controllers/mapController.js
import Joi from 'joi';
import {
  listLocations, getLocation, createLocation, updateLocation, removeLocation,
  addTask, updateTask, removeTask, addPhotos
} from '../data/mapStore.js';

const locSchema = Joi.object({
  title: Joi.string().allow('', null),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  note: Joi.string().allow('', null),
  photos: Joi.array().items(Joi.string()).default([]),
  tasks: Joi.array().items(
    Joi.object({
      id: Joi.string().optional(),
      text: Joi.string().required(),
      done: Joi.boolean().default(false),
    })
  ).default([]),
});

const locPatch = locSchema.fork(['lat', 'lng'], (s) => s.optional());

const taskSchema = Joi.object({
  text: Joi.string().min(1).max(300).required(),
});

const taskPatch = Joi.object({
  text: Joi.string().min(1).max(300).optional(),
  done: Joi.boolean().optional(),
});

const photosSchema = Joi.object({
  photos: Joi.array().items(Joi.string().pattern(/^data:image\/[a-zA-Z]+;base64,/)).min(1).required(),
});

export async function listAll(_req, res) {
  try {
    const rows = await listLocations();
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Failed to list locations', details: e.message });
  }
}

export async function getOne(req, res) {
  const doc = await getLocation(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Location not found' });
  res.json(doc);
}

export async function createOne(req, res) {
  const { value, error } = locSchema.validate(req.body || {}, { stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });
  try {
    const doc = await createLocation(value);
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create location', details: e.message });
  }
}

export async function updateOne(req, res) {
  const { value, error } = locPatch.validate(req.body || {}, { stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });
  const doc = await updateLocation(req.params.id, value);
  if (!doc) return res.status(404).json({ error: 'Location not found' });
  res.json(doc);
}

export async function removeOne(req, res) {
  const ok = await removeLocation(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Location not found' });
  res.json({ ok: true });
}

// ---- tasks ----
export async function createTask(req, res) {
  const { value, error } = taskSchema.validate(req.body || {}, { stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });
  const task = await addTask(req.params.id, value.text);
  if (!task) return res.status(404).json({ error: 'Location not found' });
  res.status(201).json(task);
}

export async function updateTaskOne(req, res) {
  const { value, error } = taskPatch.validate(req.body || {}, { stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });
  const t = await updateTask(req.params.id, req.params.taskId, value);
  if (!t) return res.status(404).json({ error: 'Task or location not found' });
  res.json(t);
}

export async function removeTaskOne(req, res) {
  const ok = await removeTask(req.params.id, req.params.taskId);
  if (!ok) return res.status(404).json({ error: 'Task or location not found' });
  res.json({ ok: true });
}

// ---- photos ----
export async function addPhotosOne(req, res) {
  const { value, error } = photosSchema.validate(req.body || {}, { stripUnknown: true });
  if (error) return res.status(400).json({ error: error.message });
  const photos = await addPhotos(req.params.id, value.photos);
  if (!photos) return res.status(404).json({ error: 'Location not found' });
  res.json({ photos });
}
