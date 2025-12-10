import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { getAuthHeader } from './auth-helper.js';
import Trip from '../src/models/Trip.js';

const authHeader = getAuthHeader();

describe('Budget routes (Mocha)', () => {
  let createdId;
  let testTripId;

  before(async () => {
    // Create a test trip that the budget can reference
    const testTrip = await Trip.create({
      userId: 'test-user-id',
      destination: 'Test Destination',
      startDate: '2026-01-01',
      endDate: '2026-01-07',
      days: []
    });
    testTripId = testTrip._id.toString();
  });

  it('GET /api/budgets -> 200 array', async () => {
    const res = await request(app).get('/api/budgets').set('Authorization', authHeader);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/budgets -> 201 created', async () => {
    const body = { name: 'MochaTrip', currency: 'USD', limit: 500, tripId: testTripId };
    const res = await request(app).post('/api/budgets').set('Authorization', authHeader).send(body);
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ name: 'MochaTrip', currency: 'USD' });
    expect(res.body).to.have.property('id');
    createdId = res.body.id;
  });

  it('PATCH /api/budgets/:id -> 200 updated', async () => {
    const res = await request(app)
      .patch(`/api/budgets/${createdId}`)
      .set('Authorization', authHeader)
      .send({ limit: 900 });
    expect(res.status).to.equal(200);
    expect(res.body.limit).to.equal(900);
  });

  it('POST /api/budgets/:id/expenses -> 201 expense created', async () => {
    const res = await request(app)
      .post(`/api/budgets/${createdId}/expenses`)
      .set('Authorization', authHeader)
      .send({ amount: 12, category: 'Food', note: 'Snack' });
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ category: 'Food' });
  });

  it('DELETE /api/budgets/:id -> 204', async () => {
    const res = await request(app).delete(`/api/budgets/${createdId}`).set('Authorization', authHeader);
    expect(res.status).to.equal(204);
  });
});
