"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.string().default("4000"),
    MONGO_URI: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(1),
    JWT_EXPIRES_IN: zod_1.z.string().default("7d"),
    STRIPE_SECRET_KEY: zod_1.z.string().min(1),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().min(1),
    EMAIL_PROVIDER: zod_1.z.string().default("console"),
    SENDGRID_API_KEY: zod_1.z.string().optional(),
    SENDGRID_FROM: zod_1.z.string().optional(),
    FRONTEND_URL: zod_1.z.string().min(1).default("http://localhost:5173,http://localhost:3000")
}).superRefine((value, ctx) => {
    const origins = value.FRONTEND_URL.split(",").map((origin) => origin.trim()).filter(Boolean);
    if (!origins.length) {
        ctx.addIssue({ code: "custom", message: "FRONTEND_URL must contain at least one origin" });
    }
    if (value.NODE_ENV === "production" && origins.some((origin) => origin.includes("localhost"))) {
        ctx.addIssue({ code: "custom", message: "FRONTEND_URL cannot include localhost in production" });
    }
    if (value.NODE_ENV === "production" && value.JWT_SECRET.length < 32) {
        ctx.addIssue({ code: "custom", message: "JWT_SECRET must be at least 32 chars in production" });
    }
    if (value.EMAIL_PROVIDER === "sendgrid") {
        if (!value.SENDGRID_API_KEY) {
            ctx.addIssue({ code: "custom", message: "SENDGRID_API_KEY required" });
        }
        if (!value.SENDGRID_FROM) {
            ctx.addIssue({ code: "custom", message: "SENDGRID_FROM required" });
        }
    }
});
exports.env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_FROM: process.env.SENDGRID_FROM,
    FRONTEND_URL: process.env.FRONTEND_URL
});
