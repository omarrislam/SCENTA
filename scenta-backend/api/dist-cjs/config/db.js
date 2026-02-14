"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const globalWithMongoose = globalThis;
const cached = globalWithMongoose.__mongoose ?? { conn: null, promise: null };
globalWithMongoose.__mongoose = cached;
const connectDatabase = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        mongoose_1.default.set("strictQuery", true);
        cached.promise = mongoose_1.default.connect(env_1.env.MONGO_URI);
    }
    cached.conn = await cached.promise;
    return cached.conn;
};
exports.connectDatabase = connectDatabase;
