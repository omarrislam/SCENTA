import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { Product } from "../../src/models/Product";
import { setupTestDb } from "../test-utils";
import { createUser } from "../helpers";

setupTestDb();

const app = createApp();

describe("Checkout", () => {
  it("validates checkout", async () => {
    const product = await Product.create({
      slug: "golden-oud",
      title: "Golden Oud",
      status: "published",
      variants: [{ key: "50ml", sizeMl: 50, price: 1800, stock: 10 }]
    });
    const { token } = await createUser();

    const res = await request(app)
      .post("/api/checkout/validate")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{ productId: product.id, variantKey: "50ml", qty: 1 }],
        shippingAddress: {
          fullName: "Test",
          phone: "000",
          city: "Cairo",
          area: "Zamalek",
          street: "Test",
          building: "1"
        }
      });

    expect(res.status).toBe(200);
    expect(res.body.data.grandTotal).toBeGreaterThan(0);
  });
});
