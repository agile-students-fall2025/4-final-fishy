// back-end/tests/map.routes.test.js
import request from 'supertest';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

// --- Module mock for ../src/data/mapStore.js ---
let state = { locations: [] };

vi.mock('../src/data/mapStore.js', () => {
  return {
    listLocations: vi.fn(async () => state.locations),
    getLocation: vi.fn(async (id) => state.locations.find((l) => l.id === id) || null),
    createLocation: vi.fn(async (doc) => {
      const created = { 
        id: `loc_${Date.now()}`, 
        title: doc.title || '',
        lat: doc.lat,
        lng: doc.lng,
        note: doc.note || '',
        photos: doc.photos || [],
        createdAt: new Date().toISOString()
      };
      state.locations.push(created);
      return created;
    }),
    updateLocation: vi.fn(async (id, patch) => {
      const loc = state.locations.find((l) => l.id === id);
      if (!loc) return null;
      Object.assign(loc, patch);
      return loc;
    }),
    removeLocation: vi.fn(async (id) => {
      const before = state.locations.length;
      state.locations = state.locations.filter((l) => l.id !== id);
      return before !== state.locations.length;
    }),
    addPhotos: vi.fn(async (locId, photos) => {
      const loc = state.locations.find((l) => l.id === locId);
      if (!loc) return null;
      loc.photos.push(...photos);
      return loc.photos;
    })
  };
});

// import the app AFTER the mock, so it wires the mocked store
import app from '../src/app.js';
import * as mapStore from '../src/data/mapStore.js';

describe('Map API', () => {
  beforeEach(() => {
    state.locations = []; // reset between tests
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/map/locations -> empty array', async () => {
    const res = await request(app).get('/api/map/locations');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/map/locations -> creates a location', async () => {
    const res = await request(app)
      .post('/api/map/locations')
      .send({ title: 'Museum', lat: 25.2, lng: 55.3 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Museum', lat: 25.2, lng: 55.3 });
    expect(res.body).toHaveProperty('id');
  });

  it('PUT /api/map/locations/:id -> updates location', async () => {
    const created = await mapStore.createLocation({ title: 'Beach', lat: 1, lng: 2 });
    const res = await request(app)
      .put(`/api/map/locations/${created.id}`)
      .send({ note: 'Visit early morning' });
    expect(res.status).toBe(200);
    expect(res.body.note).toBe('Visit early morning');
  });

  it('DELETE /api/map/locations/:id -> deletes location', async () => {
    const created = await mapStore.createLocation({ title: 'Park', lat: 1, lng: 2 });
    const res = await request(app).delete(`/api/map/locations/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /api/map/locations/:id/photos -> adds photos', async () => {
    const loc = await mapStore.createLocation({ title: 'Forest', lat: 1, lng: 2 });
    const res = await request(app)
      .post(`/api/map/locations/${loc.id}/photos`)
      .send({ photos: ['data:image/png;base64,AAAA'] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('photos');
    expect(Array.isArray(res.body.photos)).toBe(true);
  });
});
