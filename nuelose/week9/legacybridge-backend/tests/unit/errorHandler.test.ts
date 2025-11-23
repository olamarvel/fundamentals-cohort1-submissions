import express, { Application } from "express";
import request from "supertest";
import { errorHandler } from "../../src/middleware/errorHandler.middleware";

describe("Error Handler", () => {
  let testApp: Application;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    testApp = express();
    testApp.use(express.json());
  });

  it("should return 503 when legacy is unavailable", async () => {
    testApp.get("/force-503", (req, res, next) => {
      next(new Error("Legacy payment system unavailable"));
    });

    testApp.use(errorHandler);

    const res = await request(testApp).get("/force-503");

    expect(res.status).toBe(503);
    expect(res.body.error).toBe("Legacy system temporarily unavailable");
    expect(res.body.retryAfter).toBe(30);
  });

  it("should return 500 for other errors", async () => {
    testApp.get("/force-500", (req, res, next) => {
      next(new Error("Random explosion"));
    });

    testApp.use(errorHandler);

    const res = await request(testApp).get("/force-500");

    expect(res.status).toBe(500);
  });
});
