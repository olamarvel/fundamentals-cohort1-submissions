import { Request, Response, NextFunction } from "express";
import { healthController } from "../../controller/healthController";
import { healthService } from "../../services/healthService";
import { logger } from "../../config/logger";

// Mock dependencies
jest.mock("../../services/healthService");
jest.mock("../../config/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("healthController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("getHealth()", () => {
    it("should return 200 with healthy status", async () => {
      const mockHealthCheck = {
        status: "healthy" as const,
        uptime: 100,
        version: "1.0.0",
        environment: "test",
        metrics: {
          totalRequests: 100,
          totalErrors: 5,
          errorRate: "5.00%",
          avgResponseTime: "0.245s",
        },
        timestamp: "2024-01-01T00:00:00.000Z",
      };

      (healthService.check as jest.Mock).mockResolvedValue(mockHealthCheck);

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(healthService.check).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHealthCheck);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 200 with degraded status", async () => {
      const mockHealthCheck = {
        status: "degraded" as const,
        uptime: 100,
        version: "1.0.0",
        environment: "test",
        metrics: {
          totalRequests: 100,
          totalErrors: 15,
          errorRate: "15.00%",
          avgResponseTime: "0.355s",
        },
        timestamp: "2024-01-01T00:00:00.000Z",
      };

      (healthService.check as jest.Mock).mockResolvedValue(mockHealthCheck);

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHealthCheck);
    });

    it("should return 503 with unhealthy status", async () => {
      const mockHealthCheck = {
        status: "unhealthy" as const,
        uptime: 100,
        version: "1.0.0",
        environment: "test",
        metrics: {
          totalRequests: 100,
          totalErrors: 30,
          errorRate: "30.00%",
          avgResponseTime: "0.500s",
        },
        timestamp: "2024-01-01T00:00:00.000Z",
      };

      (healthService.check as jest.Mock).mockResolvedValue(mockHealthCheck);

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(503);
      expect(mockResponse.json).toHaveBeenCalledWith(mockHealthCheck);
    });

    it("should handle errors and call next middleware", async () => {
      const mockError = new Error("Health check failed");
      (healthService.check as jest.Mock).mockRejectedValue(mockError);

      await healthController.getHealth(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Health check failed:")
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe("getLiveness()", () => {
    it("should return 200 when service is alive", () => {
      (healthService.isAlive as jest.Mock).mockReturnValue(true);

      healthController.getLiveness(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(healthService.isAlive).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "alive",
        timestamp: expect.any(String),
      });
    });

    it("should return 503 when service is not alive", () => {
      (healthService.isAlive as jest.Mock).mockReturnValue(false);

      healthController.getLiveness(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(healthService.isAlive).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(503);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "dead",
        timestamp: expect.any(String),
      });
    });

    it("should return valid ISO timestamp", () => {
      (healthService.isAlive as jest.Mock).mockReturnValue(true);

      healthController.getLiveness(
        mockRequest as Request,
        mockResponse as Response
      );

      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const timestamp = new Date(jsonCall.timestamp);
      expect(timestamp.toISOString()).toBe(jsonCall.timestamp);
    });
  });

  describe("getReadiness()", () => {
    it("should return 200 when service is ready", async () => {
      (healthService.isReady as jest.Mock).mockResolvedValue(true);

      await healthController.getReadiness(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(healthService.isReady).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "ready",
        timestamp: expect.any(String),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 503 when service is not ready", async () => {
      (healthService.isReady as jest.Mock).mockResolvedValue(false);

      await healthController.getReadiness(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(503);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "not ready",
        timestamp: expect.any(String),
      });
    });

    it("should handle errors and call next middleware", async () => {
      const mockError = new Error("Readiness check failed");
      (healthService.isReady as jest.Mock).mockRejectedValue(mockError);

      await healthController.getReadiness(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Readiness check failed:")
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should return valid ISO timestamp when ready", async () => {
      (healthService.isReady as jest.Mock).mockResolvedValue(true);

      await healthController.getReadiness(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const timestamp = new Date(jsonCall.timestamp);
      expect(timestamp.toISOString()).toBe(jsonCall.timestamp);
    });

    it("should return valid ISO timestamp when not ready", async () => {
      (healthService.isReady as jest.Mock).mockResolvedValue(false);

      await healthController.getReadiness(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
      const timestamp = new Date(jsonCall.timestamp);
      expect(timestamp.toISOString()).toBe(jsonCall.timestamp);
    });
  });
});
