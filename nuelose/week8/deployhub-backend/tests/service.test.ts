import request from "supertest";
import app from "../src/app";
import { Service } from "../src/models/Services";

describe("Service API", () => {
  it("GET /api/health should return status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.uptime).toBeDefined();
  });

  it("POST /api/services should create a new service", async () => {
    const res = await request(app).post("/api/services").send({
      name: "Test Service",
      url: "http://localhost:3000",
      version: "1.0.0",
    });

    expect(res.status).toBe(201);
    expect(res.body.service.name).toBe("Test Service");
    const services = await Service.find();
    expect(services.length).toBe(1);
  });

  it("GET /api/services should return all services", async () => {
    await Service.create({ name: "S1", url: "http://s1", version: "1.0.0" });
    const res = await request(app).get("/api/services");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("PUT /api/services/:name should update service", async () => {
    await Service.create({ name: "S1", url: "http://s1", version: "1.0.0" });
    const res = await request(app)
      .put("/api/services/S1")
      .send({ version: "1.1.0" });
    expect(res.status).toBe(200);
    expect(res.body.service.version).toBe("1.1.0");
  });

  it("DELETE /api/services/:name should delete service", async () => {
    await Service.create({ name: "S1", url: "http://s1", version: "1.0.0" });
    const res = await request(app).delete("/api/services/S1");
    expect(res.status).toBe(200);
    const services = await Service.find();
    expect(services.length).toBe(0);
  });
});
