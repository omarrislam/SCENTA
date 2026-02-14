"use strict";
process.env.MONGO_URI = "mongodb://localhost:27017/scenta-test";
process.env.JWT_SECRET = "test-secret";
process.env.JWT_EXPIRES_IN = "15m";
process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_dummy";
process.env.EMAIL_PROVIDER = "console";
process.env.FRONTEND_URL = "http://localhost:3000";
