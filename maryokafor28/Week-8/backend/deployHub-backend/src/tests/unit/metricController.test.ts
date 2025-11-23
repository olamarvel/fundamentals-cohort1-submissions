import { Request, Response } from "express";

// Mock dependencies BEFORE importing the controller
jest.mock("../../services/metricsService", () => ({
  metricsService: {
    getRawMetrics: jest.fn(),
    getContentType: jest.fn(),
    getSummary: jest.fn(),
  },
}));

jest.mock("../../config/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Import controller AFTER mocks
import {
  getMetrics,
  getMetricsSummary,
} from "../../controller/metricsController";
import { metricsService } from "../../services/metricsService";
import { logger } from "../../config/logger";

describe("metricsController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      setHeader: jest.fn(),
      end: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getMetrics()", () => {
    it("should return metrics text", async () => {
      (metricsService.getRawMetrics as jest.Mock).mockResolvedValue(
        "mocked_metrics"
      );
      (metricsService.getContentType as jest.Mock).mockReturnValue(
        "text/plain; version=0.0.4"
      );

      await getMetrics(mockReq as Request, mockRes as Response);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "text/plain; version=0.0.4"
      );
      expect(mockRes.end).toHaveBeenCalledWith("mocked_metrics");
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should handle error in getMetrics()", async () => {
      const mockError = new Error("fail");
      (metricsService.getRawMetrics as jest.Mock).mockRejectedValue(mockError);
      (metricsService.getContentType as jest.Mock).mockReturnValue(
        "text/plain"
      );

      await getMetrics(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith(
        `Error fetching metrics: ${mockError}`
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Failed to fetch metrics",
      });
    });
  });

  describe("getMetricsSummary()", () => {
    it("should return metrics summary JSON", async () => {
      const summary = {
        totalRequests: 10,
        totalErrors: 1,
        avgResponseTime: 0.5,
        uptime: 20,
        rawMetrics: "...",
      };
      (metricsService.getSummary as jest.Mock).mockResolvedValue(summary);

      await getMetricsSummary(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Metrics summary retrieved",
        data: summary,
      });
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("should handle error in getMetricsSummary()", async () => {
      const mockError = new Error("boom");
      (metricsService.getSummary as jest.Mock).mockRejectedValue(mockError);

      await getMetricsSummary(mockReq as Request, mockRes as Response);

      expect(logger.error).toHaveBeenCalledWith(
        `Error summarizing metrics: ${mockError}`
      );
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Error summarizing metrics",
      });
    });
  });
});
