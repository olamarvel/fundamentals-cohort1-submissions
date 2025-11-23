import { LegacyService } from "../../src/services/legacy.services";
import { cache } from "../../src/utils/cache.utils";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create = jest.fn(() => mockedAxios);

jest.mock("../../src/services/legacy.services", () => {
  return jest.requireActual("../../src/services/legacy.services");
});

describe("LegacyService - Unit Tests", () => {

    it("should delete from cache", () => {
      cache.set("test", "value");
      expect(cache.get("test")).toBe("value");
      cache.del("test");
      expect(cache.get("test")).toBeUndefined();
    });
    
  beforeEach(() => {
    jest.clearAllMocks();
    cache.flush();
  });

  it("should correctly transform legacy payment to modern format with refund logic", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          userId: 1,
          id: 5,
          title: "Refund for order 1999",
          body: "Customer requested refund",
          amount: 1500.0,
        },
      ],
    });

    const payments = await LegacyService.getPayments();

    expect(payments).toEqual([
      {
        id: 5,
        customerId: 1,
        title: "Refund for order 1999",
        description: "Customer requested refund",
        amount: -1500.0,
        currency: "NGN",
        status: "refunded",
        processedAt: expect.any(String),
      },
    ]);
  });

  it("should cache customers and return from cache", async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "John Doe",
          username: "john",
          email: "john@doe.com",
          company: { name: "Doe Inc" },
        },
      ],
    });

    const first = await LegacyService.getCustomers();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    const second = await LegacyService.getCustomers();
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    expect(first).toEqual(second);
  });

  it("should fallback to cache when API fails", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 7,
          name: "Alice Wonder",
          username: "alice",
          email: "a@w.com",
          company: { name: "Wonder Co" },
        },
      ],
    });

    await LegacyService.getCustomers();

    mockedAxios.get.mockRejectedValueOnce(new Error("Legacy down"));

    const result = await LegacyService.getCustomers();
    expect(result[0]!.fullName).toBe("Alice Wonder");
  });
});
