import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { auditLog } from "../../middleware/auditLog";
import { createCollection, listCollections, updateCollection } from "../../controllers/admin/collectionController";

const router = Router();

router.use(requireAuth, requireRole("admin"), auditLog);
router.get("/", listCollections);
router.post("/", createCollection);
router.patch("/:id", updateCollection);

export default router;
