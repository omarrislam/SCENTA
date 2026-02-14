import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { Product } from "../../src/models/Product";
import { setupTestDb } from "../test-utils";
setupTestDb();
const app = createApp();
describe("Product detail", () => {
    it("returns product by slug", async () => {
        await Product.create({
            slug: "silk-amber",
            title: "Silk Amber",
            status: "published",
            variants: [{ key: "50ml", sizeMl: 50, price: 1500, stock: 3 }]
        });
        const res = await request(app).get("/api/products/silk-amber");
        expect(res.status).toBe(200);
        expect(res.body.data.slug).toBe("silk-amber");
    });
});
