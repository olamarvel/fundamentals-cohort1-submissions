import request from "supertest";
import axios from "axios";
import { app } from "../../src/server";
import { cache } from "../../src/utils/cache.utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.create = jest.fn(() => mockedAxios);

describe("GET /api/v2/payments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cache.flush();
  });
  it("should return transformed payments with real amounts and correct refund logic", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          userId: 1,
          id: 1,
          title: "Payment for order #12400",
          body: "Received",
          amount: 500.75,
        },
        {
          userId: 2,
          id: 2,
          title: "Refund for order #12345",
          body: "Processed",
          amount: 200.5,
        },
      ],
    });

    const res = await request(app).get("/api/v2/payments");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0]).toMatchObject({
      amount: 500.75,
      status: "completed",
      currency: "NGN",
    });
    expect(res.body.data[1]).toMatchObject({
      amount: -200.5,
      status: "refunded",
    });
  });

  it("should fallback to cache when legacy fails", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ userId: 1, id: 1, title: "Test", body: "ok", amount: 100 }],
    });
    await request(app).get("/api/v2/payments");

    mockedAxios.get.mockRejectedValueOnce(new Error("timeout"));

    const res = await request(app).get("/api/v2/payments");
    expect(res.status).toBe(200);
    expect(res.body.data[0].amount).toBe(100);
  });
});
