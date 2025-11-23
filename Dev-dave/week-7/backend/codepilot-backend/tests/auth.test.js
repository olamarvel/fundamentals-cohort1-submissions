import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.js";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/auth/register").send({ username: "test" });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Registration successful");
  });

  it("should login a user", async () => {
    const res = await request(app).post("/auth/login").send({ username: "test" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });
});



