"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contentController_1 = require("../controllers/contentController");
const router = (0, express_1.Router)();
router.get("/content/blog", contentController_1.listBlogPosts);
router.get("/content/blog/:slug", contentController_1.getBlogPost);
router.get("/content/pages/:slug", contentController_1.getPage);
exports.default = router;
