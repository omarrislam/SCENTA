"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimit_1 = require("./middleware/rateLimit");
const requestId_1 = require("./middleware/requestId");
const httpLogger_1 = require("./middleware/httpLogger");
const auth_1 = __importDefault(require("./routes/auth"));
const catalog_1 = __importDefault(require("./routes/catalog"));
const orders_1 = __importDefault(require("./routes/orders"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const backInStock_1 = __importDefault(require("./routes/backInStock"));
const coupons_1 = __importDefault(require("./routes/coupons"));
const content_1 = __importDefault(require("./routes/content"));
const products_1 = __importDefault(require("./routes/admin/products"));
const inventory_1 = __importDefault(require("./routes/admin/inventory"));
const orders_2 = __importDefault(require("./routes/admin/orders"));
const customers_1 = __importDefault(require("./routes/admin/customers"));
const content_2 = __importDefault(require("./routes/admin/content"));
const theme_1 = __importDefault(require("./routes/admin/theme"));
const theme_2 = __importDefault(require("./routes/theme"));
const coupons_2 = __importDefault(require("./routes/admin/coupons"));
const collections_1 = __importDefault(require("./routes/admin/collections"));
const reports_1 = __importDefault(require("./routes/admin/reports"));
const quiz_1 = __importDefault(require("./routes/quiz"));
const quiz_2 = __importDefault(require("./routes/admin/quiz"));
const uploads_1 = __importDefault(require("./routes/admin/uploads"));
const health_1 = __importDefault(require("./routes/health"));
const createApp = () => {
    const app = (0, express_1.default)();
    const uploadStaticDir = env_1.env.NODE_ENV === "production" && process.env.VERCEL
        ? path_1.default.join("/tmp", "uploads")
        : path_1.default.join(process.cwd(), "uploads");
    const allowedOrigins = env_1.env.FRONTEND_URL.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    const corsOptions = {
        origin: (origin, cb) => {
            if (!origin) {
                cb(null, true);
                return;
            }
            if (allowedOrigins.includes(origin)) {
                cb(null, true);
                return;
            }
            cb(new Error("Origin not allowed by CORS"));
        }
    };
    app.disable("x-powered-by");
    app.set("trust proxy", env_1.env.NODE_ENV === "production" ? 1 : 0);
    app.use(requestId_1.requestId);
    app.use((0, cors_1.default)(corsOptions));
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
    app.use((0, compression_1.default)());
    app.use("/api/payments/stripe/webhook", express_1.default.raw({ type: "application/json" }));
    app.use(express_1.default.json({ limit: "20mb" }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "20mb" }));
    app.use(httpLogger_1.httpLogger);
    app.use("/api", rateLimit_1.apiLimiter);
    app.use("/api/auth", auth_1.default);
    app.use("/api", health_1.default);
    app.use("/api", catalog_1.default);
    app.use("/api", reviews_1.default);
    app.use("/api", wishlist_1.default);
    app.use("/api", backInStock_1.default);
    app.use("/api", coupons_1.default);
    app.use("/api", content_1.default);
    app.use("/api", quiz_1.default);
    app.use("/api", theme_2.default);
    app.use("/api", orders_1.default);
    app.use("/api/admin/products", products_1.default);
    app.use("/api/admin/inventory", inventory_1.default);
    app.use("/api/admin/orders", orders_2.default);
    app.use("/api/admin/customers", customers_1.default);
    app.use("/api/admin/coupons", coupons_2.default);
    app.use("/api/admin/collections", collections_1.default);
    app.use("/api/admin", content_2.default);
    app.use("/api/admin/theme", theme_1.default);
    app.use("/api/admin/quiz", quiz_2.default);
    app.use("/api/admin/reports", reports_1.default);
    app.use("/api/admin/uploads", uploads_1.default);
    app.use("/uploads", express_1.default.static(uploadStaticDir, {
        maxAge: "30d",
        immutable: true,
        setHeaders: (res) => {
            res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
        }
    }));
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
