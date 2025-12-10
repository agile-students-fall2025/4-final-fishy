// back-end/tests-mocha/map.routes.mocha.test.js
import * as chai from "chai";
import request from "supertest";
import app from "../src/app.js";
import { getAuthHeader } from "./auth-helper.js";

const { expect } = chai;

const authHeader = getAuthHeader();

describe("Map API (Mocha + Chai)", function () {
  this.timeout(8000);

  let createdId;

  it("GET /api/map/locations -> empty array", async () => {
    const res = await request(app).get("/api/map/locations").set("Authorization", authHeader);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("POST /api/map/locations -> creates a location", async () => {
    const res = await request(app)
      .post("/api/map/locations")
      .set("Authorization", authHeader)
      .send({ title: "Test Place", lat: 25.2, lng: 55.3 });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("id");
    createdId = res.body.id;
  });

  it("PUT /api/map/locations/:id -> updates location", async () => {
    // Create a fresh location for this test since afterEach clears the DB
    const createRes = await request(app)
      .post("/api/map/locations")
      .set("Authorization", authHeader)
      .send({ title: "Test Update", lat: 25.2, lng: 55.3 });
    expect(createRes.status).to.equal(201);
    const updateId = createRes.body.id;
    
    const res = await request(app)
      .put(`/api/map/locations/${updateId}`)
      .set("Authorization", authHeader)
      .send({ note: "Updated note" });
    expect(res.status).to.equal(200);
    expect(res.body.note).to.equal("Updated note");
  });

  it("POST /api/map/locations/:id/photos -> adds photos", async () => {
    // Create a fresh location for this test since afterEach clears the DB
    const createRes = await request(app)
      .post("/api/map/locations")
      .set("Authorization", authHeader)
      .send({ title: "Test Photos", lat: 25.2, lng: 55.3 });
    expect(createRes.status).to.equal(201);
    const photoId = createRes.body.id;
    
    const fakeImg = "data:image/png;base64,AAAA";
    const res = await request(app)
      .post(`/api/map/locations/${photoId}/photos`)
      .set("Authorization", authHeader)
      .send({ photos: [fakeImg] });
    expect(res.status).to.equal(200);
    expect(res.body.photos).to.be.an("array");
  });


  it("DELETE /api/map/locations/:id -> deletes location", async () => {
    // Create a fresh location for this test since afterEach clears the DB
    const createRes = await request(app)
      .post("/api/map/locations")
      .set("Authorization", authHeader)
      .send({ title: "Test Delete", lat: 25.2, lng: 55.3 });
    expect(createRes.status).to.equal(201);
    const deleteId = createRes.body.id;
    
    const res = await request(app)
      .delete(`/api/map/locations/${deleteId}`)
      .set("Authorization", authHeader);
    expect(res.status).to.equal(200);
  });
});
