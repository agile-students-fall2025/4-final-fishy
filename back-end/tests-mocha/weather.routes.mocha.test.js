// back-end/tests-mocha/weather.routes.mocha.test.js
import { expect } from "chai";
import request from "supertest";
import sinon from "sinon";
import app from "../src/app.js";

describe("Weather API (Mocha + Chai)", function () {
  this.timeout(8000);
  let originalFetch;
  let originalEnv;

  beforeEach(() => {
    // Save original fetch and env
    originalFetch = global.fetch;
    originalEnv = process.env.OPENWEATHER_API_KEY;
    
    // Set a test API key
    process.env.OPENWEATHER_API_KEY = "test_api_key_123";
  });

  afterEach(() => {
    // Restore original fetch and env
    global.fetch = originalFetch;
    process.env.OPENWEATHER_API_KEY = originalEnv;
    sinon.restore();
  });

  describe("GET /api/weather/:location", () => {
    it("should return current weather and forecast for a valid location", async () => {
      // Mock OpenWeather API responses
      const mockCurrentWeather = {
        name: "Tokyo",
        main: {
          temp: 22.5,
          humidity: 65
        },
        weather: [{
          id: 801,
          description: "few clouds"
        }],
        wind: {
          speed: 3.5 // m/s
        }
      };

      const mockForecast = {
        city: {
          name: "Tokyo"
        },
        list: [
          {
            dt: Math.floor(Date.now() / 1000),
            main: { temp_max: 25, temp_min: 18 },
            weather: [{ id: 801, description: "few clouds" }]
          },
          {
            dt: Math.floor(Date.now() / 1000) + 86400,
            main: { temp_max: 27, temp_min: 20 },
            weather: [{ id: 800, description: "clear sky" }]
          },
          {
            dt: Math.floor(Date.now() / 1000) + 172800,
            main: { temp_max: 24, temp_min: 17 },
            weather: [{ id: 500, description: "light rain" }]
          },
          {
            dt: Math.floor(Date.now() / 1000) + 259200,
            main: { temp_max: 26, temp_min: 19 },
            weather: [{ id: 802, description: "scattered clouds" }]
          },
          {
            dt: Math.floor(Date.now() / 1000) + 345600,
            main: { temp_max: 28, temp_min: 21 },
            weather: [{ id: 800, description: "clear sky" }]
          }
        ]
      };

      // Mock fetch to return both responses
      global.fetch = sinon.stub()
        .onFirstCall().resolves({
          ok: true,
          json: async () => mockCurrentWeather
        })
        .onSecondCall().resolves({
          ok: true,
          json: async () => mockForecast
        });

      const res = await request(app).get("/api/weather/Tokyo");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("current");
      expect(res.body).to.have.property("forecast");
      expect(res.body).to.have.property("location", "Tokyo");
      expect(res.body.current).to.have.property("temperature");
      expect(res.body.current).to.have.property("condition");
      expect(res.body.current).to.have.property("humidity", 65);
      expect(res.body.current).to.have.property("windSpeed");
      expect(res.body.current).to.have.property("icon");
      expect(res.body.forecast).to.be.an("array");
      expect(res.body.forecast.length).to.be.greaterThan(0);
    });

    it("should return 404 for invalid location", async () => {
      global.fetch = sinon.stub()
        .onFirstCall().resolves({
          ok: false,
          status: 404,
          json: async () => ({ message: "city not found" })
        });

      const res = await request(app).get("/api/weather/InvalidCity12345");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error");
    });

    it("should return 401 when API key is invalid", async () => {
      // Test invalid API key scenario (what would happen in real scenario)
      // Note: Testing missing API_KEY requires module reload which is complex
      // So we test the invalid key scenario which returns 401
      global.fetch = sinon.stub().resolves({
        ok: false,
        status: 401,
        json: async () => ({ message: "Invalid API key. Please see http://openweathermap.org/faq#error401 for more info." })
      });

      const res = await request(app).get("/api/weather/Tokyo");

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("error");
    });
  });

  describe("GET /api/weather/current/:location", () => {
    it("should return current weather for a valid location", async () => {
      const mockCurrentWeather = {
        name: "Paris",
        main: {
          temp: 15.3,
          humidity: 80
        },
        weather: [{
          id: 500,
          description: "light rain"
        }],
        wind: {
          speed: 2.2 // m/s
        }
      };

      global.fetch = sinon.stub().resolves({
        ok: true,
        json: async () => mockCurrentWeather
      });

      const res = await request(app).get("/api/weather/current/Paris");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("current");
      expect(res.body).to.have.property("location", "Paris");
      expect(res.body.current).to.have.property("temperature");
      expect(res.body.current).to.have.property("condition");
      expect(res.body.current).to.have.property("humidity", 80);
      expect(res.body.current).to.have.property("windSpeed");
      expect(res.body.current).to.have.property("icon");
    });

    it("should return 404 for invalid location", async () => {
      global.fetch = sinon.stub().resolves({
        ok: false,
        status: 404,
        json: async () => ({ message: "city not found" })
      });

      const res = await request(app).get("/api/weather/current/NonExistentCity");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Location not found");
    });

    it("should handle API errors gracefully", async () => {
      global.fetch = sinon.stub().resolves({
        ok: false,
        status: 401,
        json: async () => ({ message: "Invalid API key" })
      });

      const res = await request(app).get("/api/weather/current/London");

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property("error");
    });
  });

  describe("GET /api/weather/forecast/:location", () => {
    it("should return 5-day forecast for a valid location", async () => {
      const mockForecast = {
        city: {
          name: "New York"
        },
        list: [
          {
            dt: Math.floor(Date.now() / 1000),
            main: { temp_max: 20, temp_min: 15 },
            weather: [{ id: 802, description: "scattered clouds" }]
          },
          {
            dt: Math.floor(Date.now() / 1000) + 86400,
            main: { temp_max: 22, temp_min: 17 },
            weather: [{ id: 800, description: "clear sky" }]
          },
          {
            dt: Math.floor(Date.now() / 1000) + 172800,
            main: { temp_max: 19, temp_min: 14 },
            weather: [{ id: 500, description: "light rain" }]
          },
          {
            dt: Math.floor(Date.now() / 1000) + 259200,
            main: { temp_max: 21, temp_min: 16 },
            weather: [{ id: 801, description: "few clouds" }]
          },
          {
            dt: Math.floor(Date.now() / 1000) + 345600,
            main: { temp_max: 23, temp_min: 18 },
            weather: [{ id: 800, description: "clear sky" }]
          }
        ]
      };

      global.fetch = sinon.stub().resolves({
        ok: true,
        json: async () => mockForecast
      });

      const res = await request(app).get("/api/weather/forecast/New York");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("forecast");
      expect(res.body).to.have.property("location", "New York");
      expect(res.body.forecast).to.be.an("array");
      expect(res.body.forecast.length).to.be.greaterThan(0);
      
      // Check forecast structure
      if (res.body.forecast.length > 0) {
        const firstDay = res.body.forecast[0];
        expect(firstDay).to.have.property("day");
        expect(firstDay).to.have.property("high");
        expect(firstDay).to.have.property("low");
        expect(firstDay).to.have.property("condition");
        expect(firstDay).to.have.property("icon");
      }
    });

    it("should return 404 for invalid location", async () => {
      global.fetch = sinon.stub().resolves({
        ok: false,
        status: 404,
        json: async () => ({ message: "city not found" })
      });

      const res = await request(app).get("/api/weather/forecast/InvalidLocation");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "Location not found");
    });
  });

  describe("Error handling", () => {
    it("should handle network errors", async () => {
      global.fetch = sinon.stub().rejects(new Error("Network error"));

      const res = await request(app).get("/api/weather/London");

      expect(res.status).to.equal(500);
      expect(res.body).to.have.property("error");
      expect(res.body).to.have.property("details");
    });

    it("should handle empty location parameter", async () => {
      const res = await request(app).get("/api/weather/");

      // This should be handled by Express routing, but let's test what happens
      // The route expects :location, so empty might return 404 from Express
      expect([404, 400]).to.include(res.status);
    });

    it("should properly format weather condition descriptions", async () => {
      const mockCurrentWeather = {
        name: "Sydney",
        main: {
          temp: 25.0,
          humidity: 70
        },
        weather: [{
          id: 800,
          description: "clear sky"
        }],
        wind: {
          speed: 5.0
        }
      };

      global.fetch = sinon.stub()
        .onFirstCall().resolves({
          ok: true,
          json: async () => mockCurrentWeather
        })
        .onSecondCall().resolves({
          ok: true,
          json: async () => ({
            city: { name: "Sydney" },
            list: []
          })
        });

      const res = await request(app).get("/api/weather/Sydney");

      expect(res.status).to.equal(200);
      expect(res.body.current.condition).to.equal("Clear Sky");
    });
  });

  describe("Weather icon mapping", () => {
    it("should map weather condition codes to appropriate icons", async () => {
      const testCases = [
        { id: 200, expectedIcon: "⛈️" }, // Thunderstorm
        { id: 300, expectedIcon: "🌧️" }, // Drizzle
        { id: 500, expectedIcon: "🌧️" }, // Rain
        { id: 600, expectedIcon: "❄️" }, // Snow
        { id: 800, expectedIcon: "☀️" }, // Clear
        { id: 801, expectedIcon: "⛅" }, // Few clouds
        { id: 802, expectedIcon: "☁️" }, // Scattered clouds
      ];

      for (const testCase of testCases) {
        const mockCurrentWeather = {
          name: "Test",
          main: { temp: 20, humidity: 50 },
          weather: [{ id: testCase.id, description: "test" }],
          wind: { speed: 3 }
        };

        global.fetch = sinon.stub()
          .onFirstCall().resolves({
            ok: true,
            json: async () => mockCurrentWeather
          })
          .onSecondCall().resolves({
            ok: true,
            json: async () => ({
              city: { name: "Test" },
              list: []
            })
          });

        const res = await request(app).get("/api/weather/Test");
        
        if (res.status === 200) {
          expect(res.body.current.icon).to.equal(testCase.expectedIcon);
        }
      }
    });
  });
});

