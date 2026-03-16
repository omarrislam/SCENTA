import { FilterQuery } from "mongoose";
import { Product } from "../models/Product";
import { applyFragranceFilters } from "../domain/fragrance/catalogFilters";

export const listProducts = async (query: Record<string, unknown>) => {
  const filter: FilterQuery<typeof Product> = { status: "published", deletedAt: null };

  if (query.q) {
    filter.$or = [
      { title: { $regex: String(query.q), $options: "i" } },
      { description: { $regex: String(query.q), $options: "i" } }
    ];
  }
  if (query.isNew) filter["flags.isNew"] = query.isNew === "true";
  if (query.isBestSeller) filter["flags.isBestSeller"] = query.isBestSeller === "true";
  if (query.inStock === "true") filter["variants.stock"] = { $gt: 0 };

  applyFragranceFilters(filter, query);

  const page = Number(query.page ?? 1);
  const limit = Math.min(Number(query.limit ?? 20), 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);

  return { items, total, page, limit };
};

export const getProductBySlug = async (slug: string) =>
  Product.findOne({ slug, status: "published", deletedAt: null }).lean();
