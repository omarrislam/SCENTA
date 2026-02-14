"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const couponController_1 = require("../controllers/couponController");
const router = (0, express_1.Router)();
router.get("/coupons", couponController_1.listActiveCoupons);
exports.default = router;
