// back-end/tests/trips.routes.test.js
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// --- Module mock for ../src/data/tripStore.js ---
let DB = [];

vi.mock('../src/data/tripStore.js', () => {
  return {
    getAll: async () => DB,
    getById: async (id) => DB.find(t => t.id === id) || null,
    create: async (doc) => {
      const id = doc.id || `trip_${Math.random().toString(36).slice(2, 9)}`;
      const created = { id, ...doc, createdAt: doc.createdAt || new Date().toISOString() };
      DB.unshift(created);
      return created;
    },
    update: async (id, patch) => {
      const i = DB.findIndex(t => t.id === id);
      if (i === -1) return null;
      DB[i] = { ...DB[i], ...patch };
      return DB[i];
    },
    remove: async (id) => {
      const len = DB.length;
      DB = DB.filter(t => t.id !== id);
      return DB.length !== len;
    }
  };
});

// import the app AFTER the mock, so it wires the mocked store
import app from '../src/app.js';

describe('Trips API', () => {
  beforeEach(() => {
    DB = []; // reset between tests
  });

  it('GET /api/trips -> [] when empty', async () => {
    const res = await request(app).get('/api/trips').expect(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/trips -> creates a trip (lenient payload)', async () => {
    const payload = {
      destination: 'Paris',
      startDate: '2026-03-03',
      endDate: '2026-03-17',
      days: [{ date: '2026-03-03', activities: ['Louvre'] }]
    };
    const res = await request(app).post('/api/trips').send(payload).expect(201);
    expect(res.body).toMatchObject({
      destination: 'Paris',
      startDate: '2026-03-03',
      endDate: '2026-03-17'
    });
    expect(res.body).toHaveProperty('id');
  });

  it('GET /api/trips/:id -> 404 for unknown id', async () => {
    await request(app).get('/api/trips/nope').expect(404);
  });

  it('roundtrip: create -> get -> update -> delete', async () => {
    // create
    const createRes = await request(app).post('/api/trips').send({
      destination: 'Tokyo',
      startDate: '',
      endDate: '',
      days: [{ date: '', activities: ['Sushi', 'Skytree'] }]
    }).expect(201);

    const id = createRes.body.id;

    // get
    const getRes = await request(app).get(`/api/trips/${id}`).expect(200);
    expect(getRes.body.destination).toBe('Tokyo');

    // update (wipe activities except one)
    const updRes = await request(app).put(`/api/trips/${id}`).send({
      days: [{ date: '', activities: ['Ramen'] }]
    }).expect(200);
    expect(updRes.body.days[0].activities).toEqual(['Ramen']);

    // delete
    await request(app).delete(`/api/trips/${id}`).expect(200);
    await request(app).get(`/api/trips/${id}`).expect(404);
  });

  it('POST validation still strips junk fields', async () => {
    const res = await request(app).post('/api/trips').send({
      destination: '   ',            // becomes "Untitled trip"
      days: [{ date: null, activities: ['  ', 'Valid'] }],
      foo: 'bar',                    // should be stripped
    }).expect(201);

    expect(res.body.destination).toBe('Untitled trip');
    expect(res.body).not.toHaveProperty('foo');
    expect(res.body.days[0].activities).toEqual(['Valid']);
  });
});
