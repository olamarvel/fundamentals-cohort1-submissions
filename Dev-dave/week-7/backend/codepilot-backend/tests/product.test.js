import request from "supertest";
import express from "express";
import productRoutes from "../routes/product.js";

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);


describe("Products API", () => {
  it("should get products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a product", async () => {
    const res = await request(app).post("/api/products").send({ name: "Phone" });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Phone");
  });
});
