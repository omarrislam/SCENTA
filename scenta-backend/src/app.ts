import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimit";
import { requestId } from "./middleware/requestId";
import { httpLogger } from "./middleware/httpLogger";
import authRoutes from "./routes/auth";
import catalogRoutes from "./routes/catalog";
import orderRoutes from "./routes/orders";
import reviewRoutes from "./routes/reviews";
import wishlistRoutes from "./routes/wishlist";
import backInStockRoutes from "./routes/backInStock";
import couponRoutes from "./routes/coupons";
import contentRoutes from "./routes/content";
import adminProductRoutes from "./routes/admin/products";
import adminInventoryRoutes from "./routes/admin/inventory";
import adminOrderRoutes from "./routes/admin/orders";
import adminCustomerRoutes from "./routes/admin/customers";
import adminContentRoutes from "./routes/admin/content";
import adminThemeRoutes from "./routes/admin/theme";
import themeRoutes from "./routes/theme";
import adminCouponRoutes from "./routes/admin/coupons";
import adminCollectionRoutes from "./routes/admin/collections";
import adminReportsRoutes from "./routes/admin/reports";
import quizRoutes from "./routes/quiz";
import adminQuizRoutes from "./routes/admin/quiz";
import adminUploadRoutes from "./routes/admin/uploads";
import healthRoutes from "./routes/health";

export const createApp = () => {
  const app = express();
  const uploadStaticDir = env.NODE_ENV === "production" && process.env.VERCEL
    ? path.join("/tmp", "uploads")
    : path.join(process.cwd(), "uploads");
  const allowedOrigins = env.FRONTEND_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const corsOptions: cors.CorsOptions = {
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
  app.set("trust proxy", env.NODE_ENV === "production" ? 1 : 0);
  app.use(requestId);
  app.use(cors(corsOptions));
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(compression());
  app.use("/api/payments/stripe/webhook", express.raw({ type: "application/json" }));
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));
  app.use(httpLogger);
  app.use("/api", apiLimiter);

  app.use("/api/auth", authRoutes);
  app.use("/api", healthRoutes);
  app.use("/api", catalogRoutes);
  app.use("/api", reviewRoutes);
  app.use("/api", wishlistRoutes);
  app.use("/api", backInStockRoutes);
  app.use("/api", couponRoutes);
  app.use("/api", contentRoutes);
  app.use("/api", quizRoutes);
  app.use("/api", themeRoutes);
  app.use("/api", orderRoutes);

  app.use("/api/admin/products", adminProductRoutes);
  app.use("/api/admin/inventory", adminInventoryRoutes);
  app.use("/api/admin/orders", adminOrderRoutes);
  app.use("/api/admin/customers", adminCustomerRoutes);
  app.use("/api/admin/coupons", adminCouponRoutes);
  app.use("/api/admin/collections", adminCollectionRoutes);
  app.use("/api/admin", adminContentRoutes);
  app.use("/api/admin/theme", adminThemeRoutes);
  app.use("/api/admin/quiz", adminQuizRoutes);
  app.use("/api/admin/reports", adminReportsRoutes);
  app.use("/api/admin/uploads", adminUploadRoutes);

  app.use("/uploads", express.static(uploadStaticDir));

  app.use(errorHandler);

  return app;
};
