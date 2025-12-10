// back-end/tests-mocha/map.routes.mocha.test.js
import * as chai from "chai";
import request from "supertest";
import app from "../src/app.js";

const { expect } = chai;

describe("Map API (Mocha + Chai)", function () {
  this.timeout(8000);

  let createdId;
  let taskId;

  it("GET /api/map/locations -> empty array", async () => {
    const res = await request(app).get("/api/map/locations");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /api/map/locations -> creates a location", async () => {
    const res = await request(app)
      .post("/api/map/locations")
      .send({ title: "Test Place", lat: 25.2, lng: 55.3 });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    createdId = res.body.id;
  });

  it("PUT /api/map/locations/:id -> updates location", async () => {
    const res = await request(app)
      .put(`/api/map/locations/${createdId}`)
      .send({ note: "Updated note" });
    expect(res.status).to.equal(200);
    expect(res.body.note).to.equal("Updated note");
  });

  it("POST /api/map/locations/:id/tasks -> adds task", async () => {
    const res = await request(app)
      .post(`/api/map/locations/${createdId}/tasks`)
      .send({ text: "Buy tickets" });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    taskId = res.body.id;
  });

  it("PUT /api/map/locations/:id/tasks/:taskId -> updates task", async () => {
    const res = await request(app)
      .put(`/api/map/locations/${createdId}/tasks/${taskId}`)
      .send({ done: true });
    expect(res.status).to.equal(200);
    expect(res.body.done).to.be.true;
  });

  it("POST /api/map/locations/:id/photos -> adds photos", async () => {
    const fakeImg = "data:image/png;base64,AAAA";
    const res = await request(app)
      .post(`/api/map/locations/${createdId}/photos`)
      .send({ photos: [fakeImg] });
    expect(res.status).to.equal(200);
    expect(res.body.photos).to.be.an("array");
  });

  it("DELETE /api/map/locations/:id/tasks/:taskId -> deletes task", async () => {
    // Create a fresh location and task for this test since afterEach clears the DB
    const createLocRes = await request(app)
      .post("/api/map/locations")
      .send({ title: "Test Task Delete", lat: 25.2, lng: 55.3 });
    expect(createLocRes.status).to.equal(201);
    const locId = createLocRes.body.id;
    
    const createTaskRes = await request(app)
      .post(`/api/map/locations/${locId}/tasks`)
      .send({ text: "Test task" });
    expect(createTaskRes.status).to.equal(201);
    const testTaskId = createTaskRes.body.id;
    
    const res = await request(app).delete(
      `/api/map/locations/${locId}/tasks/${testTaskId}`
    );
    expect(res.status).to.equal(200);
  });

  it("DELETE /api/map/locations/:id -> deletes location", async () => {
    // Create a fresh location for this test since afterEach clears the DB
    const createRes = await request(app)
      .post("/api/map/locations")
      .send({ title: "Test Delete", lat: 25.2, lng: 55.3 });
    expect(createRes.status).to.equal(201);
    const deleteId = createRes.body.id;
    
    const res = await request(app).delete(`/api/map/locations/${deleteId}`);
    expect(res.status).to.equal(200);
  });
});
