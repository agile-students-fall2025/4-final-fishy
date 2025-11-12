import { expect } from 'chai';
import { describe, it, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Budget routes', () => {
  let createdId = null, expenseId = null;

  it('POST /api/budgets creates a budget', async () => {
    const res = await request(app).post('/api/budgets').send({ name: 'NYC Trip', limit: 1500, currency:'USD' });
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ name: 'NYC Trip', currency: 'USD' });
    createdId = res.body.id;
  });

  it('GET /api/budgets returns list', async () => {
    const res = await request(app).get('/api/budgets');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('PATCH /api/budgets/:id updates budget', async () => {
    const res = await request(app).patch(`/api/budgets/${createdId}`).send({ limit: 1600 });
    expect(res.status).to.equal(200);
    expect(res.body.limit).to.equal(1600);
  });

  it('POST /api/budgets/:id/expenses adds expense', async () => {
    const res = await request(app).post(`/api/budgets/${createdId}/expenses`).send({ amount: 100, category:'Food' });
    expect(res.status).to.equal(201);
    expenseId = res.body.id;
  });

  it('PATCH /api/budgets/:id/expenses/:expenseId updates expense', async () => {
    const res = await request(app).patch(`/api/budgets/${createdId}/expenses/${expenseId}`).send({ note:'Bagel' });
    expect(res.status).to.equal(200);
    expect(res.body.note).to.equal('Bagel');
  });

  it('DELETE /api/budgets/:id/expenses/:expenseId removes expense', async () => {
    const res = await request(app).delete(`/api/budgets/${createdId}/expenses/${expenseId}`);
    expect(res.status).to.equal(204);
  });

  it('DELETE /api/budgets/:id removes budget', async () => {
    const res = await request(app).delete(`/api/budgets/${createdId}`);
    expect(res.status).to.equal(204);
  });
});
