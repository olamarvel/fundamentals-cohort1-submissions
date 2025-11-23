import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.js";
import productRoutes from "../routes/product.js";
import orderRoutes from "../routes/order.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

describe("E2E TEST: Order workflow", () => {
  let token;
  let productId;

  test("Register user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "testuser", password: "123456" });
    expect(res.statusCode).toBe(201);
  });

  test("Login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "testuser", password: "123456" });
    expect(res.statusCode).toBe(200);
    token = res.body.token; // save token for auth
  });

  test("Create a product", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({ name: "Laptop" });
    expect(res.statusCode).toBe(201);
    productId = res.body.id;
  });

  test("Create an order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ total: 1500 });
    expect(res.statusCode).toBe(201);
  });

  test("Fetch user orders", async () => {
    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
