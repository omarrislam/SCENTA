import { fetchApi, resolveApiAssetUrl } from "./api";
import { listProducts as listMockProducts, getProduct as getMockProduct, listCollections as listMockCollections } from "./mockApi";
import { Collection, Product } from "./types";
import { BackendProduct, mapProduct } from "./productAdapter";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
const hasApi = Boolean(baseUrl);

const resolveImageUrl = (value?: string) => resolveApiAssetUrl(value);
const isUploadPath = (value?: string) => Boolean(value && /\/uploads\//.test(value));
const fallbackCollectionImage = (slug: string) => {
  const fallbackBySlug: Record<string, string> = {
    "amber-signature": "/images/silk-amber.png",
    "floral-veil": "/images/rose-veil.png"
  };
  return fallbackBySlug[slug] ?? "/images/amber-1.svg";
};

const resolveCollectionImage = (slug: string, image?: string) => {
  const resolved = resolveImageUrl(image);
  if (!resolved || isUploadPath(resolved) || isUploadPath(image)) {
    return resolveImageUrl(fallbackCollectionImage(slug)) ?? fallbackCollectionImage(slug);
  }
  return resolved;
};

interface BackendCollection {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  productIds?: string[];
  image?: string;
}

interface CatalogResponse {
  items: BackendProduct[];
  total: number;
  page: number;
  limit: number;
}

export const listProducts = async (params?: {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Product[]; total: number; page: number; limit: number }> => {
  if (!hasApi) {
    const items = await listMockProducts({ search: params?.search, sort: params?.sort });
    return { items, total: items.length, page: 1, limit: items.length };
  }
  const query = new URLSearchParams();
  if (params?.search) query.set("q", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const data = await fetchApi<CatalogResponse>(`/products?${query.toString()}`);
  return {
    items: data.items.map(mapProduct),
    total: data.total,
    page: data.page,
    limit: data.limit
  };
};

export const getProduct = async (slug: string): Promise<Product> => {
  if (!hasApi) {
    return getMockProduct(slug);
  }
  const product = await fetchApi<BackendProduct>(`/products/${slug}`);
  return mapProduct(product);
};

export const listCollections = async (): Promise<Collection[]> => {
  if (!hasApi) {
    return listMockCollections();
  }
  const data = await fetchApi<BackendCollection[]>("/collections");
  return data.map((collection) => ({
    id: collection._id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description ?? "",
    productIds: collection.productIds?.map((id) => String(id)) ?? [],
    image: resolveCollectionImage(collection.slug, collection.image)
  }));
};

export const getCollection = async (slug: string): Promise<Collection | null> => {
  if (!hasApi) {
    const collections = await listMockCollections();
    return collections.find((collection) => collection.slug === slug) ?? null;
  }
  const collection = await fetchApi<BackendCollection>(`/collections/${slug}`);
  return {
    id: collection._id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description ?? "",
    productIds: collection.productIds?.map((id) => String(id)) ?? [],
    image: resolveCollectionImage(collection.slug, collection.image)
  };
};

export const listProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (!ids.length) return [];
  if (!hasApi) {
    const items = await listMockProducts();
    return items.filter((item) => ids.includes(item.id));
  }
  const query = new URLSearchParams({ ids: ids.join(",") });
  const data = await fetchApi<BackendProduct[]>(`/products/ids?${query.toString()}`);
  return data.map(mapProduct);
};

