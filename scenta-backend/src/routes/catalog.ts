import { Router } from "express";
import { listCatalog, getProduct, listCollections, getCollection, getProductsByIds } from "../controllers/catalogController";
import { validate } from "../middleware/validate";
import { productFilterSchema } from "../validators/catalog";

const router = Router();

router.get("/products", validate(productFilterSchema), listCatalog);
router.get("/products/ids", getProductsByIds);
router.get("/products/:slug", getProduct);
router.get("/collections", listCollections);
router.get("/collections/:slug", getCollection);

export default router;
