import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { Product } from "../../src/models/Product";
import { setupTestDb } from "../test-utils";
import { createUser } from "../helpers";

setupTestDb();

const app = createApp();

describe("Reviews", () => {
  it("creates review", async () => {
    const product = await Product.create({
      slug: "review",
      title: "Review",
      status: "published",
      variants: [{ key: "50ml", sizeMl: 50, price: 1200, stock: 2 }]
    });
    const { token } = await createUser();

    const res = await request(app)
      .post(`/api/products/${product.id}/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5, body: "Great" });

    expect(res.status).toBe(201);
  });
});
