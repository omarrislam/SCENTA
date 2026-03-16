import { fetchApi, resolveApiAssetUrl } from "./api";
import { Collection, Product } from "./types";
import { BackendProduct, mapProduct } from "./productAdapter";

const resolveImageUrl = (value?: string) => resolveApiAssetUrl(value);

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
  const product = await fetchApi<BackendProduct>(`/products/${slug}`);
  return mapProduct(product);
};

export const listCollections = async (): Promise<Collection[]> => {
  const data = await fetchApi<BackendCollection[]>("/collections");
  return data.map((collection) => ({
    id: collection._id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description ?? "",
    productIds: collection.productIds?.map((id) => String(id)) ?? [],
    image: resolveImageUrl(collection.image) ?? ""
  }));
};

export const getCollection = async (slug: string): Promise<Collection | null> => {
  const collection = await fetchApi<BackendCollection>(`/collections/${slug}`);
  return {
    id: collection._id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description ?? "",
    productIds: collection.productIds?.map((id) => String(id)) ?? [],
    image: resolveImageUrl(collection.image) ?? ""
  };
};

export const listProductsByIds = async (ids: string[]): Promise<Product[]> => {
  if (!ids.length) return [];
  const query = new URLSearchParams({ ids: ids.join(",") });
  const data = await fetchApi<BackendProduct[]>(`/products/ids?${query.toString()}`);
  return data.map(mapProduct);
};
