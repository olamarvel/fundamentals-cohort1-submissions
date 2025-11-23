import { metricsService } from "../../services/metricsService";
import {
  register,
  httpRequestErrors,
  httpRequestDuration,
  httpRequestTotal,
} from "../../config/metrics";

// Mock all metric dependencies
jest.mock("../../config/metrics.ts", () => ({
  register: {
    metrics: jest.fn(),
    contentType: "text/plain",
    resetMetrics: jest.fn(),
  },
  httpRequestTotal: { get: jest.fn() },
  httpRequestErrors: { get: jest.fn() },
  httpRequestDuration: { get: jest.fn() },
}));

describe("metricsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct metrics summary", async () => {
    // Mock Prometheus data
    (register.metrics as jest.Mock).mockResolvedValue("mocked_raw_metrics");
    (httpRequestTotal.get as jest.Mock).mockResolvedValue({
      values: [{ value: 5 }, { value: 10 }],
    });
    (httpRequestErrors.get as jest.Mock).mockResolvedValue({
      values: [{ value: 1 }, { value: 2 }],
    });
    (httpRequestDuration.get as jest.Mock).mockResolvedValue({
      values: [
        { metricName: "http_request_duration_seconds_sum", value: 30 },
        { metricName: "http_request_duration_seconds_count", value: 10 },
      ],
    });

    const result = await metricsService.getSummary();

    expect(result.totalRequests).toBe(15);
    expect(result.totalErrors).toBe(3);
    expect(result.avgResponseTime).toBe(3); // 30 / 10
    expect(result.rawMetrics).toBe("mocked_raw_metrics");
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });

  it("should handle missing duration metrics safely", async () => {
    (register.metrics as jest.Mock).mockResolvedValue("mocked_raw_metrics");
    (httpRequestTotal.get as jest.Mock).mockResolvedValue({ values: [] });
    (httpRequestErrors.get as jest.Mock).mockResolvedValue({ values: [] });
    (httpRequestDuration.get as jest.Mock).mockResolvedValue({
      values: [],
    });

    const result = await metricsService.getSummary();
    expect(result.avgResponseTime).toBe(0);
    expect(result.totalRequests).toBe(0);
    expect(result.totalErrors).toBe(0);
  });

  it("should return raw metrics text", async () => {
    (register.metrics as jest.Mock).mockResolvedValue("raw_metrics_data");
    const result = await metricsService.getRawMetrics();
    expect(result).toBe("raw_metrics_data");
  });

  it("should return correct content type", () => {
    expect(metricsService.getContentType()).toBe("text/plain");
  });

  it("should call resetMetrics on reset()", () => {
    metricsService.reset();
    expect(register.resetMetrics).toHaveBeenCalled();
  });

  it("should handle metric fetch errors gracefully", async () => {
    (register.metrics as jest.Mock).mockResolvedValue("mocked_raw_metrics");
    (httpRequestTotal.get as jest.Mock).mockRejectedValue(
      new Error("metric error")
    );

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = await metricsService.getSummary();

    expect(consoleSpy).toHaveBeenCalled();
    expect(result.totalRequests).toBe(0);
    expect(result.totalErrors).toBe(0);
    expect(result.avgResponseTime).toBe(0);
    consoleSpy.mockRestore();
  });
});
