import request from "supertest";
import express, { Application } from "express";
import { healthController } from "../../controller/healthController";
import { healthService } from "../../services/healthService";

// Create a temporary express app for integration testing
let app: Application;

beforeAll(() => {
  app = express();

  // Define health routes using the real controller
  app.get("/api/health", healthController.getHealth);
  app.get("/api/health/live", healthController.getLiveness);
  app.get("/api/health/ready", healthController.getReadiness);
});

describe(" Health Controller Integration Tests", () => {
  describe("GET /api/health", () => {
    it("should return a valid health status with metrics", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("uptime");
      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("environment");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body.metrics).toHaveProperty("totalRequests");
      expect(response.body.metrics).toHaveProperty("errorRate");
    });

    it("should handle unhealthy/degraded metrics gracefully", async () => {
      // mock the healthService to simulate degraded metrics
      jest.spyOn(healthService, "check").mockResolvedValueOnce({
        status: "degraded",
        uptime: 120,
        version: "1.0.0",
        environment: "test",
        metrics: {
          totalRequests: 100,
          totalErrors: 15,
          errorRate: "15.00%",
          avgResponseTime: "0.300s",
        },
        timestamp: new Date().toISOString(),
      });

      const response = await request(app).get("/api/health");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("degraded");
    });
  });

  describe("GET /api/health/live", () => {
    it("should return alive status", async () => {
      const response = await request(app).get("/api/health/live");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("alive");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/health/ready", () => {
    it("should return ready when service is ready", async () => {
      jest.spyOn(healthService, "isReady").mockResolvedValueOnce(true);
      const response = await request(app).get("/api/health/ready");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("ready");
    });

    it("should return not ready when service is not ready", async () => {
      jest.spyOn(healthService, "isReady").mockResolvedValueOnce(false);
      const response = await request(app).get("/api/health/ready");
      expect(response.status).toBe(503);
      expect(response.body.status).toBe("not ready");
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});
