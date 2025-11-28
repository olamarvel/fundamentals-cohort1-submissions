import { connectTestDB, closeTestDB, clearTestDB } from "./setupTestDB";
import Post from "../model/Post";
import request from "supertest";
import app from "../app";


beforeAll(async () => await connectTestDB());
afterEach(async () => await clearTestDB());
afterAll(async () => await closeTestDB());

describe("Fetch all posts", () => {
    it("should fetch all posts", async () => {
        const res = await request(app)
            .get("/api/v1/posts")
            .expect(200)
        expect(res.body.message).toBe("successful")
    });

    it("should create a new post", async () => {
        const res = await request(app)
            .post("/api/v1/posts")
            .send({
                title: "new post",
                description: "new post description",
                authorName: "John Doe"
            })
            .expect(201)
        expect(res.body.message).toBe("successful")
    });
})