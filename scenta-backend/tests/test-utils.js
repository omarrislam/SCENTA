import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { beforeAll, afterAll, beforeEach } from "vitest";
let mongo = null;
export const setupTestDb = () => {
    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        await mongoose.connect(uri);
    });
    beforeEach(async () => {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    });
    afterAll(async () => {
        await mongoose.disconnect();
        if (mongo) {
            await mongo.stop();
        }
    });
};
