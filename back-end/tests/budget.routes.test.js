import { expect } from 'chai';
import { describe, it, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import request from 'supertest';
import Trip from '../src/models/Trip.js';

// Mock auth middleware to bypass authentication in tests
vi.mock('../src/utils/auth.js', () => {
  return {
    authMiddleware: (req, res, next) => {
      // Set a mock user for testing
      req.user = { id: 'test-user-id', email: 'test@example.com' };
      next();
    }
  };
});

// import the app AFTER the mock, so it wires the mocked auth
import app from '../src/app.js';

describe('Budget routes', () => {
  let testTripId = null;

  beforeEach(async () => {
    // Create a test trip that the budget can reference (needed for each test since afterEach clears DB)
    const testTrip = await Trip.create({
      userId: 'test-user-id',
      destination: 'Test Destination',
      startDate: '2026-01-01',
      endDate: '2026-01-07',
      days: []
    });
    testTripId = testTrip._id.toString();
  });

  it('POST /api/budgets creates a budget', async () => {
    const res = await request(app).post('/api/budgets').send({ 
      name: 'NYC Trip', 
      limit: 1500, 
      currency: 'USD',
      tripId: testTripId
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ name: 'NYC Trip', currency: 'USD' });
    expect(res.body).to.have.property('id');
  });

  it('GET /api/budgets returns list', async () => {
    // Create a budget first
    const createRes = await request(app).post('/api/budgets').send({ 
      name: 'Test Budget', 
      limit: 1000, 
      currency: 'USD',
      tripId: testTripId
    });
    expect(createRes.status).to.equal(201);
    
    const res = await request(app).get('/api/budgets');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
  });

  it('PATCH /api/budgets/:id updates budget', async () => {
    // Create a budget first
    const createRes = await request(app).post('/api/budgets').send({ 
      name: 'Test Budget', 
      limit: 1500, 
      currency: 'USD',
      tripId: testTripId
    });
    expect(createRes.status).to.equal(201);
    const budgetId = createRes.body.id;
    
    const res = await request(app).patch(`/api/budgets/${budgetId}`).send({ limit: 1600 });
    expect(res.status).to.equal(200);
    expect(res.body.limit).to.equal(1600);
  });

  it('POST /api/budgets/:id/expenses adds expense', async () => {
    // Create a budget first
    const createRes = await request(app).post('/api/budgets').send({ 
      name: 'Test Budget', 
      limit: 1500, 
      currency: 'USD',
      tripId: testTripId
    });
    expect(createRes.status).to.equal(201);
    const budgetId = createRes.body.id;
    
    const res = await request(app).post(`/api/budgets/${budgetId}/expenses`).send({ amount: 100, category:'Food' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  it('PATCH /api/budgets/:id/expenses/:expenseId updates expense', async () => {
    // Create a budget first
    const createRes = await request(app).post('/api/budgets').send({ 
      name: 'Test Budget', 
      limit: 1500, 
      currency: 'USD',
      tripId: testTripId
    });
    expect(createRes.status).to.equal(201);
    const budgetId = createRes.body.id;
    
    // Add an expense
    const expenseRes = await request(app).post(`/api/budgets/${budgetId}/expenses`).send({ amount: 100, category:'Food' });
    expect(expenseRes.status).to.equal(201);
    const expenseId = expenseRes.body.id;
    
    // Update the expense
    const res = await request(app).patch(`/api/budgets/${budgetId}/expenses/${expenseId}`).send({ note:'Bagel' });
    expect(res.status).to.equal(200);
    expect(res.body.note).to.equal('Bagel');
  });

  it('DELETE /api/budgets/:id/expenses/:expenseId removes expense', async () => {
    // Create a budget first
    const createRes = await request(app).post('/api/budgets').send({ 
      name: 'Test Budget', 
      limit: 1500, 
      currency: 'USD',
      tripId: testTripId
    });
    expect(createRes.status).to.equal(201);
    const budgetId = createRes.body.id;
    
    // Add an expense
    const expenseRes = await request(app).post(`/api/budgets/${budgetId}/expenses`).send({ amount: 100, category:'Food' });
    expect(expenseRes.status).to.equal(201);
    const expenseId = expenseRes.body.id;
    
    // Delete the expense
    const res = await request(app).delete(`/api/budgets/${budgetId}/expenses/${expenseId}`);
    expect(res.status).to.equal(204);
  });

  it('DELETE /api/budgets/:id removes budget', async () => {
    // Create a budget first
    const createRes = await request(app).post('/api/budgets').send({ 
      name: 'Test Budget', 
      limit: 1500, 
      currency: 'USD',
      tripId: testTripId
    });
    expect(createRes.status).to.equal(201);
    const budgetId = createRes.body.id;
    
    // Delete the budget
    const res = await request(app).delete(`/api/budgets/${budgetId}`);
    expect(res.status).to.equal(204);
  });
});
