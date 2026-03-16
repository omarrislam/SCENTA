import { fetchApi, resolveApiAssetUrl } from "./api";
import { BackendProduct } from "./productAdapter";
import { BackendOrder, mapOrder } from "./orderService";
import { BlogPost, Collection, Customer, Order, StaticPage } from "./types";

export interface AdminProduct extends BackendProduct {
  status?: string;
}

interface BackendCustomer {
  _id: string;
  name: string;
  email: string;
  orders?: number;
}

interface BackendCollection {
  _id: string;
  slug: string;
  title: string;
  description?: string;
  productIds?: string[];
  image?: string;
}

interface BackendContentItem {
  _id: string;
  slug: string;
  title: string;
  body?: string;
  excerpt?: string;
  cover?: string;
}

const mapCustomer = (customer: BackendCustomer): Customer => ({
  id: customer._id,
  name: customer.name,
  email: customer.email,
  orders: customer.orders ?? 0
});

const mapCollection = (collection: BackendCollection): Collection => ({
  id: collection._id,
  slug: collection.slug,
  title: collection.title,
  description: collection.description ?? "",
  productIds: collection.productIds?.map((id) => String(id)) ?? [],
  image: resolveApiAssetUrl(collection.image) ?? ""
});

const mapBlogPost = (post: BackendContentItem): BlogPost => ({
  id: post._id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt ?? "",
  body: post.body ?? "",
  cover: resolveApiAssetUrl(post.cover ?? "") ?? ""
});

const mapPage = (page: BackendContentItem): StaticPage => ({
  id: page._id,
  slug: page.slug,
  title: page.title,
  body: page.body ?? ""
});

export const listAdminProducts = async (): Promise<AdminProduct[]> =>
  fetchApi<AdminProduct[]>("/admin/products");

export const getAdminProduct = async (id: string): Promise<AdminProduct> =>
  fetchApi<AdminProduct>(`/admin/products/${id}`);

export const createAdminProduct = async (payload: Partial<AdminProduct>) =>
  fetchApi<AdminProduct>("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateAdminProduct = async (id: string, payload: Partial<AdminProduct>) =>
  fetchApi<AdminProduct>(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

export const deleteAdminProduct = async (id: string) =>
  fetchApi<{ status: string }>(`/admin/products/${id}`, { method: "DELETE" });

export const listAdminOrders = async (): Promise<Order[]> => {
  const orders = await fetchApi<BackendOrder[]>("/admin/orders");
  return orders.map(mapOrder);
};

export const getAdminOrder = async (id: string): Promise<BackendOrder> =>
  fetchApi<BackendOrder>(`/admin/orders/${id}`);

export const updateAdminOrderStatus = async (id: string, status: string) =>
  fetchApi<BackendOrder>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });

export const listAdminCustomers = async (): Promise<Customer[]> => {
  const customers = await fetchApi<BackendCustomer[]>("/admin/customers");
  return customers.map(mapCustomer);
};

export const listAdminCollections = async (): Promise<Collection[]> => {
  const items = await fetchApi<BackendCollection[]>("/admin/collections");
  return items.map(mapCollection);
};

export const createAdminCollection = async (payload: Partial<Collection>) =>
  fetchApi<BackendCollection>("/admin/collections", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateAdminCollection = async (id: string, payload: Partial<Collection>) =>
  fetchApi<BackendCollection>(`/admin/collections/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

export const deleteAdminCollection = async (id: string) =>
  fetchApi<{ status: string }>(`/admin/collections/${id}`, { method: "DELETE" });

export const listAdminBlogPosts = async (): Promise<BlogPost[]> => {
  const items = await fetchApi<BackendContentItem[]>("/admin/blog");
  return items.map(mapBlogPost);
};

export const createAdminBlogPost = async (payload: Partial<BlogPost>) =>
  fetchApi<BackendContentItem>("/admin/blog", {
    method: "POST",
    body: JSON.stringify(payload)
  });

export const updateAdminBlogPost = async (id: string, payload: Partial<BlogPost>) =>
  fetchApi<BackendContentItem>(`/admin/blog/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

export const deleteAdminBlogPost = async (id: string) =>
  fetchApi<{ status: string }>(`/admin/blog/${id}`, { method: "DELETE" });

export const listAdminPages = async (): Promise<StaticPage[]> => {
  const items = await fetchApi<BackendContentItem[]>("/admin/pages");
  return items.map(mapPage);
};

export const adjustInventory = async (payload: {
  productId: string;
  variantKey: string;
  stock: number;
}) =>
  fetchApi("/admin/inventory/adjust", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
