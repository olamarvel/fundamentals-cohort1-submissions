import request from "supertest";
import { app } from "../../src/server";

describe("Server Basics", () => {
  it("should have health endpoint", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/non-existing-route");
    expect(res.status).toBe(404);
  });
});
