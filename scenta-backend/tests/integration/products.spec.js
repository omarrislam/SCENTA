import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { Product } from "../../src/models/Product";
import { setupTestDb } from "../test-utils";
setupTestDb();
const app = createApp();
describe("Catalog", () => {
    it("filters products by query", async () => {
        await Product.create({
            slug: "rose-veil",
            title: "Rose Veil",
            status: "published",
            variants: [{ key: "50ml", sizeMl: 50, price: 1200, stock: 5 }]
        });
        const res = await request(app).get("/api/products?q=rose");
        expect(res.status).toBe(200);
        expect(res.body.data.items).toHaveLength(1);
    });
});
