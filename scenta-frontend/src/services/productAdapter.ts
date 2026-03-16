import { Product, ProductVariant } from "./types";
import { resolveApiAssetUrl } from "./api";

export interface BackendVariant {
  key: string;
  sizeMl?: number;
  price?: number;
  stock?: number;
}

export interface BackendProduct {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  fragranceAttrs?: {
    notes?: { top?: string[]; middle?: string[]; base?: string[] };
    gender?: string;
    concentration?: string;
  };
  // Legacy top-level notes still supported during migration
  notes?: { top?: string[]; middle?: string[]; base?: string[] };
  flags?: { isNew?: boolean; isBestSeller?: boolean; isFeatured?: boolean };
  images?: { url: string }[];
  variants: BackendVariant[];
  status?: string;
}

const resolveNotes = (product: BackendProduct) => {
  const notesSource = product.fragranceAttrs?.notes ?? product.notes;
  const top = notesSource?.top ?? [];
  const middle = notesSource?.middle ?? [];
  const base = notesSource?.base ?? [];
  return [...top, ...middle, ...base].filter(Boolean);
};

const buildVariants = (variants: BackendVariant[]): ProductVariant[] =>
  variants.map((variant) => ({
    id: variant.key,
    size: variant.sizeMl ? `${variant.sizeMl}ml` : variant.key,
    price: variant.price ?? 0,
    stock: variant.stock ?? 0
  }));

export const mapProduct = (product: BackendProduct): Product => {
  const notes = resolveNotes(product);
  const tags = Array.from(new Set(notes.map((n) => n.toLowerCase()))).slice(0, 8);
  return {
    id: product._id,
    slug: product.slug,
    name: product.title,
    description: product.description ?? "",
    notes,
    flags: {
      new: product.flags?.isNew,
      featured: product.flags?.isFeatured,
      bestSeller: product.flags?.isBestSeller
    },
    rating: 4.7,
    tags,
    variants: buildVariants(product.variants ?? []),
    images: (product.images ?? [])
      .filter((image) => image.url && !image.url.startsWith("data:"))
      .map((image) => resolveApiAssetUrl(image.url) ?? image.url)
  };
};
