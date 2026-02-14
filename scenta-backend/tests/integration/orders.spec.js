import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { Product } from "../../src/models/Product";
import { setupTestDb } from "../test-utils";
import { createUser } from "../helpers";
setupTestDb();
const app = createApp();
describe("Orders", () => {
    it("creates COD order", async () => {
        const product = await Product.create({
            slug: "amber",
            title: "Amber",
            status: "published",
            variants: [{ key: "50ml", sizeMl: 50, price: 1200, stock: 5 }]
        });
        const { token } = await createUser();
        const res = await request(app)
            .post("/api/orders")
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
        expect(res.status).toBe(201);
        expect(res.body.data.orderNumber).toContain("SCN-");
    });
});
