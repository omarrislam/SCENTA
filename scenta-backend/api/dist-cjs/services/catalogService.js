"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductBySlug = exports.listProducts = void 0;
const Product_1 = require("../models/Product");
const catalogFilters_1 = require("../domain/fragrance/catalogFilters");
const listProducts = async (query) => {
    const filter = { status: "published", deletedAt: null };
    if (query.q) {
        filter.$or = [
            { title: { $regex: String(query.q), $options: "i" } },
            { description: { $regex: String(query.q), $options: "i" } }
        ];
    }
    if (query.isNew)
        filter["flags.isNew"] = query.isNew === "true";
    if (query.isBestSeller)
        filter["flags.isBestSeller"] = query.isBestSeller === "true";
    if (query.inStock === "true")
        filter["variants.stock"] = { $gt: 0 };
    (0, catalogFilters_1.applyFragranceFilters)(filter, query);
    const page = Number(query.page ?? 1);
    const limit = Math.min(Number(query.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Product_1.Product.find(filter).skip(skip).limit(limit).lean(),
        Product_1.Product.countDocuments(filter)
    ]);
    return { items, total, page, limit };
};
exports.listProducts = listProducts;
const getProductBySlug = async (slug) => Product_1.Product.findOne({ slug, status: "published", deletedAt: null }).lean();
exports.getProductBySlug = getProductBySlug;
