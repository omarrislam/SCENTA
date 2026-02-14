import { Router } from "express";
import { listBlogPosts, getBlogPost, getPage } from "../controllers/contentController";

const router = Router();

router.get("/content/blog", listBlogPosts);
router.get("/content/blog/:slug", getBlogPost);
router.get("/content/pages/:slug", getPage);

export default router;
