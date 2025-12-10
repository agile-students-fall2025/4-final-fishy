import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { getAuthHeader } from './auth-helper.js';

const authHeader = getAuthHeader();

describe('Trip routes (Mocha)', () => {
  afterEach(async () => {
    const res = await request(app).get('/api/trips').set('Authorization', authHeader);
    if (res.body && Array.isArray(res.body)) {
      for (const trip of res.body) {
        await request(app).delete(`/api/trips/${trip.id}`).set('Authorization', authHeader);
      }
    }
  });

  it('GET /api/trips -> 200 array', async () => {
    const res = await request(app).get('/api/trips').set('Authorization', authHeader);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('POST /api/trips -> 201 created with normalized payload', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader)
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
      .set('Authorization', authHeader)
      .send({
        destination: 'Tokyo',
        startDate: '',
        endDate: '',
        days: [{ date: '', activities: ['Skytree'] }]
      });

    const id = create.body.id;
    const res = await request(app)
      .put(`/api/trips/${id}`)
      .set('Authorization', authHeader)
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
      .set('Authorization', authHeader)
      .send({ destination: 'Lisbon' });

    const id = create.body.id;
    const del = await request(app).delete(`/api/trips/${id}`).set('Authorization', authHeader);
    expect(del.status).to.equal(200);
    expect(del.body).to.deep.equal({ ok: true });

    const getAfter = await request(app).get(`/api/trips/${id}`).set('Authorization', authHeader);
    expect(getAfter.status).to.equal(404);
  });

  it('POST invalid payload -> 400 validation error', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader)
      .send({ days: 'nope' });

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('GET /api/trips/:id -> 200 returns specific trip', async () => {
    const create = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader)
      .send({ destination: 'Barcelona', startDate: '2026-07-01', endDate: '2026-07-05' });

    const id = create.body.id;
    const res = await request(app).get(`/api/trips/${id}`).set('Authorization', authHeader);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('id', id);
    expect(res.body.destination).to.equal('Barcelona');
    expect(res.body).to.have.property('startDate', '2026-07-01');
    expect(res.body).to.have.property('endDate', '2026-07-05');
  });

  it('GET /api/trips/:id -> 404 for non-existent trip', async () => {
    const res = await request(app).get('/api/trips/non-existent-id').set('Authorization', authHeader);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error', 'Not found');
  });

  it('PUT /api/trips/:id -> 404 for non-existent trip', async () => {
    const res = await request(app)
      .put('/api/trips/non-existent-id')
      .set('Authorization', authHeader)
      .send({ destination: 'Paris' });

    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error', 'Not found');
  });

  it('DELETE /api/trips/:id -> 404 for non-existent trip', async () => {
    const res = await request(app).delete('/api/trips/non-existent-id').set('Authorization', authHeader);
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error', 'Not found');
  });

  it('POST /api/trips -> creates trip with empty days array', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader)
      .send({
        destination: 'London',
        startDate: '2026-08-01',
        endDate: '2026-08-07',
        days: []
      });

    expect(res.status).to.equal(201);
    expect(res.body.destination).to.equal('London');
    expect(res.body.days).to.be.an('array').that.is.empty;
  });

  it('POST /api/trips -> creates trip with multiple days and activities', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader)
      .send({
        destination: 'Rome',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        days: [
          { date: '2026-09-01', activities: ['Colosseum', 'Roman Forum'] },
          { date: '2026-09-02', activities: ['Vatican', 'Sistine Chapel'] },
          { date: '2026-09-03', activities: ['Trevi Fountain'] }
        ]
      });

    expect(res.status).to.equal(201);
    expect(res.body.destination).to.equal('Rome');
    expect(res.body.days).to.have.lengthOf(3);
    expect(res.body.days[0].activities).to.deep.equal(['Colosseum', 'Roman Forum']);
    expect(res.body.days[1].activities).to.deep.equal(['Vatican', 'Sistine Chapel']);
    expect(res.body.days[2].activities).to.deep.equal(['Trevi Fountain']);
  });

  it('PUT /api/trips/:id -> partial update preserves existing fields', async () => {
    const create = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader)
      .send({
        destination: 'Amsterdam',
        startDate: '2026-10-01',
        endDate: '2026-10-05',
        days: [{ date: '2026-10-01', activities: ['Anne Frank House'] }]
      });

    expect(create.status).to.equal(201);
    expect(create.body.days).to.have.lengthOf(1); // Verify days were created

    const id = create.body.id;
    const res = await request(app)
      .put(`/api/trips/${id}`)
      .set('Authorization', authHeader)
      .send({
        destination: 'Rotterdam'
      });

    expect(res.status).to.equal(200);
    expect(res.body.destination).to.equal('Rotterdam');
    expect(res.body.startDate).to.equal('2026-10-01'); // Preserved
    expect(res.body.endDate).to.equal('2026-10-05'); // Preserved
    expect(res.body.days).to.be.an('array');
    expect(res.body.days).to.have.lengthOf(1); // Preserved
    expect(res.body.days[0].activities).to.include('Anne Frank House'); // Verify activities preserved
  });

  it('POST /api/trips -> handles missing destination (defaults to "Untitled trip")', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader)
      .send({
        startDate: '2026-11-01',
        endDate: '2026-11-05'
      });

    expect(res.status).to.equal(201);
    expect(res.body.destination).to.equal('Untitled trip');
  });

  it('POST /api/trips -> handles null destination (defaults to "Untitled trip")', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', authHeader)
      .send({
        destination: null,
        startDate: '2026-12-01'
      });

    expect(res.status).to.equal(201);
    expect(res.body.destination).to.equal('Untitled trip');
  });
});

