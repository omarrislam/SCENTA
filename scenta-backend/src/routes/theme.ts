import { Router } from "express";
import { getTheme } from "../controllers/admin/themeController";

const router = Router();

router.get("/theme", getTheme);

export default router;
