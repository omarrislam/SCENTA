import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { listBlogPosts, listPages, createBlogPost, updateBlogPost, createPage, updatePage, deleteBlogPost } from "../../controllers/admin/contentController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/blog", listBlogPosts);
router.post("/blog", createBlogPost);
router.patch("/blog/:id", updateBlogPost);
router.delete("/blog/:id", deleteBlogPost);
router.get("/pages", listPages);
router.post("/pages", createPage);
router.patch("/pages/:id", updatePage);

export default router;
