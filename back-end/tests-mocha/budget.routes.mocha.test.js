import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Budget routes (Mocha)', () => {
  let createdId;

  it('GET /api/budgets -> 200 array', async () => {
    const res = await request(app).get('/api/budgets');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/budgets -> 201 created', async () => {
    const body = { name: 'MochaTrip', currency: 'USD', limit: 500 };
    const res = await request(app).post('/api/budgets').send(body);
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ name: 'MochaTrip', currency: 'USD' });
    expect(res.body).to.have.property('id');
    createdId = res.body.id;
  });

  it('PATCH /api/budgets/:id -> 200 updated', async () => {
    const res = await request(app)
      .patch(`/api/budgets/${createdId}`)
      .send({ limit: 900 });
    expect(res.status).to.equal(200);
    expect(res.body.limit).to.equal(900);
  });

  it('POST /api/budgets/:id/expenses -> 201 expense created', async () => {
    const res = await request(app)
      .post(`/api/budgets/${createdId}/expenses`)
      .send({ amount: 12, category: 'Food', note: 'Snack' });
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ category: 'Food' });
  });

  it('DELETE /api/budgets/:id -> 204', async () => {
    const res = await request(app).delete(`/api/budgets/${createdId}`);
    expect(res.status).to.equal(204);
  });
});
