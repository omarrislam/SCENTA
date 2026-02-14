import { FilterQuery } from "mongoose";
import { Product } from "../models/Product";

const parseList = (value?: string | string[]) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
};

export const listProducts = async (query: Record<string, unknown>) => {
  const filter: FilterQuery<typeof Product> = { status: "published" };

  if (query.q) {
    filter.$or = [
      { title: { $regex: String(query.q), $options: "i" } },
      { description: { $regex: String(query.q), $options: "i" } }
    ];
  }
  if (query.gender) filter.gender = String(query.gender);
  if (query.isNew) filter["flags.isNew"] = query.isNew === "true";
  if (query.isBestSeller) filter["flags.isBestSeller"] = query.isBestSeller === "true";
  if (query.inStock === "true") filter["variants.stock"] = { $gt: 0 };

  const notes = parseList(query.notes as string | string[] | undefined);
  if (notes?.length) {
    filter.$or = [
      { "notes.top": { $in: notes } },
      { "notes.middle": { $in: notes } },
      { "notes.base": { $in: notes } }
    ];
  }

  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  const skip = (page - 1) * limit;

  const items = await Product.find(filter).skip(skip).limit(limit);
  const total = await Product.countDocuments(filter);

  return { items, total, page, limit };
};

export const getProductBySlug = async (slug: string) => Product.findOne({ slug, status: "published" });
