import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('Trip routes (Mocha)', () => {
  afterEach(async () => {
    const res = await request(app).get('/api/trips');
    for (const trip of res.body || []) {
      await request(app).delete(`/api/trips/${trip.id}`);
    }
  });

  it('GET /api/trips -> 200 array', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/trips -> 201 created with normalized payload', async () => {
    const res = await request(app)
      .post('/api/trips')
      .send({
        destination: '   ',
        startDate: '2026-05-01',
        endDate: '2026-05-05',
        days: [
          { date: '2026-05-01', activities: [' Louvre  ', ''] },
          { date: null, activities: ['  ', 'Seine Cruise'] }
        ],
        extraneous: 'value'
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.destination).to.equal('Untitled trip');
    expect(res.body.days[0].activities).to.deep.equal([' Louvre  ']);
    expect(res.body.days[1].activities).to.deep.equal(['Seine Cruise']);
    expect(res.body).to.not.have.property('extraneous');
  });

  it('PUT /api/trips/:id -> 200 updated', async () => {
    const create = await request(app)
      .post('/api/trips')
      .send({
        destination: 'Tokyo',
        startDate: '',
        endDate: '',
        days: [{ date: '', activities: ['Skytree'] }]
      });

    const id = create.body.id;
    const res = await request(app)
      .put(`/api/trips/${id}`)
      .send({
        destination: 'Kyoto ',
        days: [{ date: '2026-06-02', activities: ['Fushimi Inari', '  '] }]
      });

    expect(res.status).to.equal(200);
    expect(res.body.destination).to.equal('Kyoto');
    expect(res.body.days[0]).to.include({ date: '2026-06-02' });
    expect(res.body.days[0].activities).to.deep.equal(['Fushimi Inari']);
  });

  it('DELETE /api/trips/:id -> removes trip', async () => {
    const create = await request(app)
      .post('/api/trips')
      .send({ destination: 'Lisbon' });

    const id = create.body.id;
    const del = await request(app).delete(`/api/trips/${id}`);
    expect(del.status).to.equal(200);
    expect(del.body).to.deep.equal({ ok: true });

    const getAfter = await request(app).get(`/api/trips/${id}`);
    expect(getAfter.status).to.equal(404);
  });

  it('POST invalid payload -> 400 validation error', async () => {
    const res = await request(app)
      .post('/api/trips')
      .send({ days: 'nope' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });
});

