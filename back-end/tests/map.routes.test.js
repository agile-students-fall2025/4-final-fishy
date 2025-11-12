// back-end/tests-mocha/map.routes.mocha.test.js
import chai from "chai";
import request from "supertest";
import sinon from "sinon";
import * as mapStore from "../src/data/mapStore.js";
import app from "../src/app.js";

const { expect } = chai;

describe("Map API (Mocha + Chai)", function () {
  this.timeout(8000);
  let state;

  beforeEach(() => {
    state = { locations: [] };

    sinon.stub(mapStore, "listLocations").callsFake(async () => state.locations);
    sinon.stub(mapStore, "getLocation").callsFake(async (id) => state.locations.find((l) => l.id === id) || null);
    sinon.stub(mapStore, "createLocation").callsFake(async (doc) => {
      const created = { id: `loc_${Date.now()}`, ...doc, tasks: [], photos: [], createdAt: Date.now() };
      state.locations.push(created);
      return created;
    });
    sinon.stub(mapStore, "updateLocation").callsFake(async (id, patch) => {
      const loc = state.locations.find((l) => l.id === id);
      if (!loc) return null;
      Object.assign(loc, patch);
      return loc;
    });
    sinon.stub(mapStore, "removeLocation").callsFake(async (id) => {
      const before = state.locations.length;
      state.locations = state.locations.filter((l) => l.id !== id);
      return before !== state.locations.length;
    });
    sinon.stub(mapStore, "addTask").callsFake(async (id, text) => {
      const loc = state.locations.find((l) => l.id === id);
      if (!loc) return null;
      const t = { id: `task_${Date.now()}`, text, done: false };
      loc.tasks.push(t);
      return t;
    });
    sinon.stub(mapStore, "updateTask").callsFake(async (locId, taskId, patch) => {
      const loc = state.locations.find((l) => l.id === locId);
      if (!loc) return null;
      const t = loc.tasks.find((t) => t.id === taskId);
      if (!t) return null;
      Object.assign(t, patch);
      return t;
    });
    sinon.stub(mapStore, "removeTask").callsFake(async (locId, taskId) => {
      const loc = state.locations.find((l) => l.id === locId);
      if (!loc) return null;
      const before = loc.tasks.length;
      loc.tasks = loc.tasks.filter((t) => t.id !== taskId);
      return before !== loc.tasks.length;
    });
    sinon.stub(mapStore, "addPhotos").callsFake(async (locId, photos) => {
      const loc = state.locations.find((l) => l.id === locId);
      if (!loc) return null;
      loc.photos.push(...photos);
      return loc.photos;
    });
  });

  afterEach(() => sinon.restore());

  it("GET /api/map/locations -> empty array", async () => {
    const res = await request(app).get("/api/map/locations");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array").that.is.empty;
  });

  it("POST /api/map/locations -> creates a location", async () => {
    const res = await request(app)
      .post("/api/map/locations")
      .send({ title: "Museum", lat: 25.2, lng: 55.3 });
    expect(res.status).to.equal(201);
    expect(res.body).to.include({ title: "Museum" });
    expect(res.body).to.have.property("id");
  });

  it("PUT /api/map/locations/:id -> updates location", async () => {
    const created = await mapStore.createLocation({ title: "Beach", lat: 1, lng: 2 });
    const res = await request(app)
      .put(`/api/map/locations/${created.id}`)
      .send({ note: "Visit early morning" });
    expect(res.status).to.equal(200);
    expect(res.body.note).to.equal("Visit early morning");
  });

  it("DELETE /api/map/locations/:id -> deletes location", async () => {
    const created = await mapStore.createLocation({ title: "Park", lat: 1, lng: 2 });
    const res = await request(app).delete(`/api/map/locations/${created.id}`);
    expect(res.status).to.equal(200);
  });

  it("POST /api/map/locations/:id/tasks -> adds task", async () => {
    const created = await mapStore.createLocation({ title: "Desert", lat: 1, lng: 2 });
    const res = await request(app)
      .post(`/api/map/locations/${created.id}/tasks`)
      .send({ text: "Bring water" });
    expect(res.status).to.equal(201);
    expect(res.body.text).to.equal("Bring water");
  });

  it("PUT /api/map/locations/:id/tasks/:taskId -> updates task", async () => {
    const loc = await mapStore.createLocation({ title: "Mountain", lat: 1, lng: 2 });
    const t = await mapStore.addTask(loc.id, "Hike trail");
    const res = await request(app)
      .put(`/api/map/locations/${loc.id}/tasks/${t.id}`)
      .send({ done: true });
    expect(res.status).to.equal(200);
    expect(res.body.done).to.be.true;
  });

  it("DELETE /api/map/locations/:id/tasks/:taskId -> deletes task", async () => {
    const loc = await mapStore.createLocation({ title: "City Walk", lat: 1, lng: 2 });
    const t = await mapStore.addTask(loc.id, "Take photos");
    const res = await request(app).delete(`/api/map/locations/${loc.id}/tasks/${t.id}`);
    expect(res.status).to.equal(200);
  });

  it("POST /api/map/locations/:id/photos -> adds photos", async () => {
    const loc = await mapStore.createLocation({ title: "Forest", lat: 1, lng: 2 });
    const res = await request(app)
      .post(`/api/map/locations/${loc.id}/photos`)
      .send({ photos: ["data:image/png;base64,AAAA"] });
    expect(res.status).to.equal(200);
    expect(res.body.photos).to.be.an("array");
  });
});
