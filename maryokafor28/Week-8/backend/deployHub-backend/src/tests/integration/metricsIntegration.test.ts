import request from "supertest";
import express from "express";
import {
  getMetrics,
  getMetricsSummary,
} from "../../controller/metricsController";
import { metricsService } from "../../services/metricsService";

const app = express();
app.get("/api/metrics", getMetrics);
app.get("/api/metrics/summary", getMetricsSummary);

describe(" Metrics Controller Integration Tests", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET /api/metrics", () => {
    it("should return raw metrics successfully", async () => {
      const mockMetrics =
        "# HELP http_requests_total The total number of HTTP requests.\n";
      jest
        .spyOn(metricsService, "getRawMetrics")
        .mockResolvedValueOnce(mockMetrics);
      jest
        .spyOn(metricsService, "getContentType")
        .mockReturnValueOnce("text/plain");

      const response = await request(app).get("/api/metrics");

      expect(response.status).toBe(200);
      expect(response.text).toContain("http_requests_total");
    });

    it("should handle errors gracefully", async () => {
      jest
        .spyOn(metricsService, "getRawMetrics")
        .mockRejectedValueOnce(new Error("Metrics fetch failed"));

      const response = await request(app).get("/api/metrics");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toBe("Failed to fetch metrics");
    });
  });

  describe("GET /api/metrics/summary", () => {
    it("should return a summary of metrics successfully", async () => {
      const mockSummary = {
        totalRequests: 100,
        totalErrors: 5,
        avgResponseTime: 0.12,
        uptime: 300,
        rawMetrics: "mock_raw_data",
      };

      jest
        .spyOn(metricsService, "getSummary")
        .mockResolvedValueOnce(mockSummary);

      const response = await request(app).get("/api/metrics/summary");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalRequests).toBe(100);
    });

    it("should handle errors in metrics summary gracefully", async () => {
      jest
        .spyOn(metricsService, "getSummary")
        .mockRejectedValueOnce(new Error("Metrics summary error"));

      const response = await request(app).get("/api/metrics/summary");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toBe("Error summarizing metrics");
    });
  });
});
