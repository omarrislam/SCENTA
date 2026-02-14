import { Product, ProductVariant } from "./types";

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
  notes?: { top?: string[]; middle?: string[]; base?: string[] };
  flags?: { isNew?: boolean; isBestSeller?: boolean; isFeatured?: boolean };
  images?: { url: string }[];
  variants: BackendVariant[];
  status?: string;
}

const buildNotes = (notes?: BackendProduct["notes"]) => {
  const top = notes?.top ?? [];
  const middle = notes?.middle ?? [];
  const base = notes?.base ?? [];
  return [...top, ...middle, ...base].filter(Boolean);
};

const buildTags = (notes: string[]) =>
  Array.from(new Set(notes.map((note) => note.toLowerCase()))).slice(0, 8);

const buildVariants = (variants: BackendVariant[]): ProductVariant[] =>
  variants.map((variant) => ({
    id: variant.key,
    size: variant.sizeMl ? `${variant.sizeMl}ml` : variant.key,
    price: variant.price ?? 0,
    stock: variant.stock ?? 0
  }));

export const mapProduct = (product: BackendProduct): Product => {
  const notes = buildNotes(product.notes);
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
    tags: buildTags(notes),
    variants: buildVariants(product.variants ?? []),
    images: (product.images ?? []).map((image) => image.url)
  };
};
