import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { setupTestDb } from "../test-utils";
import { createUser } from "../helpers";

setupTestDb();

const app = createApp();

describe("Admin products", () => {
  it("creates product", async () => {
    const { token } = await createUser("admin");
    const res = await request(app)
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ slug: "new", title: "New", status: "draft" });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe("new");
  });
});
