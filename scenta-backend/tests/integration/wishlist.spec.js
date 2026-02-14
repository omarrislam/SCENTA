import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { Product } from "../../src/models/Product";
import { setupTestDb } from "../test-utils";
import { createUser } from "../helpers";
setupTestDb();
const app = createApp();
describe("Wishlist", () => {
    it("toggles wishlist", async () => {
        const product = await Product.create({
            slug: "wish",
            title: "Wish",
            status: "published",
            variants: [{ key: "50ml", sizeMl: 50, price: 1200, stock: 2 }]
        });
        const { token } = await createUser();
        const res = await request(app)
            .post("/api/wishlist/toggle")
            .set("Authorization", `Bearer ${token}`)
            .send({ productId: product.id, variantKey: "50ml" });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
    });
});
