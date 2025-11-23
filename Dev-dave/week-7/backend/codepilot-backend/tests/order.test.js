import request from "supertest";
import express from "express";
import orderRoutes from "../routes/order.js";

const app = express();
app.use(express.json());
app.use("/api/orders", orderRoutes);

describe("Orders API", () => {
  it("should get orders", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.statusCode).toBe(200);
  });

  it("should create an order", async () => {
    const res = await request(app).post("/api/orders").send({ total: 3000 });
    expect(res.statusCode).toBe(201);
  });
});
