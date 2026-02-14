"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const themeController_1 = require("../controllers/admin/themeController");
const router = (0, express_1.Router)();
router.get("/theme", themeController_1.getTheme);
exports.default = router;
