import { healthService } from "../../services/healthService";
import { metricsService } from "../../services/metricsService";
import { logger } from "../../config/logger";

// Mock dependencies
jest.mock("../../services/metricsService");
jest.mock("../../config/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));
jest.mock("../../config/env", () => ({
  env: {
    app: {
      version: "1.0.0",
    },
    nodeEnv: "test",
  },
}));

describe("healthService", () => {
  const mockGetSummary = metricsService.getSummary as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("check()", () => {
    it("should return healthy status when error rate <= 10%", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 100,
        totalErrors: 5,
        avgResponseTime: 0.245,
      });

      const result = await healthService.check();

      expect(result.status).toBe("healthy");
      expect(result.metrics?.errorRate).toBe("5.00%");
      expect(result.version).toBe("1.0.0");
      expect(result.environment).toBe("test");
      expect(result.metrics?.avgResponseTime).toContain("s");
      expect(result.timestamp).toBeDefined();
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });

    it("should return healthy status when error rate is exactly 10%", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 100,
        totalErrors: 10,
        avgResponseTime: 0.3,
      });

      const result = await healthService.check();

      expect(result.status).toBe("healthy");
      expect(result.metrics?.errorRate).toBe("10.00%");
    });

    it("should return degraded status when error rate > 10% and <= 20%", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 100,
        totalErrors: 15,
        avgResponseTime: 0.355,
      });

      const result = await healthService.check();
      expect(result.status).toBe("degraded");
      expect(result.metrics?.errorRate).toBe("15.00%");
    });

    it("should return degraded status when error rate is exactly 20%", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 100,
        totalErrors: 20,
        avgResponseTime: 0.4,
      });

      const result = await healthService.check();

      expect(result.status).toBe("degraded");
      expect(result.metrics?.errorRate).toBe("20.00%");
    });

    it("should return unhealthy status when error rate > 20%", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 100,
        totalErrors: 30,
        avgResponseTime: 0.5,
      });

      const result = await healthService.check();
      expect(result.status).toBe("unhealthy");
      expect(result.metrics?.errorRate).toBe("30.00%");
    });

    it("should handle zero requests (0% error rate)", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 0,
        totalErrors: 0,
        avgResponseTime: 0,
      });

      const result = await healthService.check();

      expect(result.status).toBe("healthy");
      expect(result.metrics?.errorRate).toBe("0.00%");
      expect(result.metrics?.totalRequests).toBe(0);
    });

    it("should handle zero requests with errors (edge case)", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 0,
        totalErrors: 5,
        avgResponseTime: 0,
      });

      const result = await healthService.check();

      expect(result.status).toBe("healthy");
      expect(result.metrics?.errorRate).toBe("0.00%");
    });

    it("should handle errors from metricsService gracefully", async () => {
      mockGetSummary.mockRejectedValue(new Error("Metrics fetch failed"));

      const result = await healthService.check();

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to fetch metrics in health check")
      );
      expect(result.status).toBe("healthy");
      expect(result.metrics).toBeUndefined();
      expect(result.version).toBe("1.0.0");
      expect(result.environment).toBe("test");
      expect(result.timestamp).toBeDefined();
    });

    it("should format avgResponseTime with 3 decimal places", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 50,
        totalErrors: 2,
        avgResponseTime: 0.123456789,
      });

      const result = await healthService.check();

      expect(result.metrics?.avgResponseTime).toBe("0.123s");
    });

    it("should format errorRate with 2 decimal places", async () => {
      mockGetSummary.mockResolvedValue({
        totalRequests: 333,
        totalErrors: 17,
        avgResponseTime: 0.2,
      });

      const result = await healthService.check();

      expect(result.metrics?.errorRate).toBe("5.11%");
    });
  });

  describe("isAlive()", () => {
    it("should return true when process uptime is positive", () => {
      expect(healthService.isAlive()).toBe(true);
    });
  });

  describe("isReady()", () => {
    it("should return true", async () => {
      const result = await healthService.isReady();
      expect(result).toBe(true);
    });
  });
});
