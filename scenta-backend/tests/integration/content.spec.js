import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { setupTestDb } from "../test-utils";
import { createUser } from "../helpers";
setupTestDb();
const app = createApp();
describe("Content", () => {
    it("creates blog post", async () => {
        const { token } = await createUser("admin");
        const res = await request(app)
            .post("/api/admin/blog")
            .set("Authorization", `Bearer ${token}`)
            .send({ slug: "story", title: "Story", content: "Body" });
        expect(res.status).toBe(201);
        expect(res.body.data.slug).toBe("story");
    });
});
