import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_FILE = process.env.DATA_FILE; // if falsy -> memory-only
let memory = [];

async function loadFromFile() {
  if (!DATA_FILE) return;                 // memory-only
  try {
    const p = path.resolve(DATA_FILE);
    const txt = await fs.readFile(p, 'utf-8');
    memory = JSON.parse(txt || '[]');
  } catch (e) {
    if (e.code === 'ENOENT') {
      await saveToFile([]);
    } else {
      console.warn('store load error:', e.message);
    }
  }
}

async function saveToFile(data = memory) {
  if (!DATA_FILE) return;                 // memory-only
  const p = path.resolve(DATA_FILE);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(data, null, 2));
}

await loadFromFile(); // initialize on import

export async function getAll() {
  return memory.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function getById(id) {
  return memory.find(t => t.id === id) || null;
}

export async function create(trip) {
  const now = Date.now();
  const doc = {
    id: trip.id || `trip_${crypto.randomUUID()}`,
    destination: trip.destination?.trim() || 'Untitled trip',
    startDate: trip.startDate || '',
    endDate: trip.endDate || '',
    days: Array.isArray(trip.days) ? trip.days : [],
    createdAt: now
  };
  memory.unshift(doc);
  await saveToFile();
  return doc;
}

export async function update(id, patch) {
  const i = memory.findIndex(t => t.id === id);
  if (i < 0) return null;
  memory[i] = { ...memory[i], ...patch, id };
  await saveToFile();
  return memory[i];
}

export async function remove(id) {
  const before = memory.length;
  memory = memory.filter(t => t.id !== id);
  if (memory.length !== before) await saveToFile();
  return before !== memory.length;
}
