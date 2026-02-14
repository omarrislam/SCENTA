import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../../src/app";
import { Order } from "../../src/models/Order";
import { setupTestDb } from "../test-utils";
import { createUser } from "../helpers";

setupTestDb();

const app = createApp();

describe("Admin orders", () => {
  it("updates order status", async () => {
    const order = await Order.create({ orderNumber: "SCN-TEST", status: "pending" });
    const { token } = await createUser("admin");

    const res = await request(app)
      .patch(`/api/admin/orders/${order.id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "fulfilled" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("fulfilled");
  });
});
