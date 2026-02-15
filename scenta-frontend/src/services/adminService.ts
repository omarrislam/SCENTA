import { fetchApi, resolveApiAssetUrl } from "./api";
import { listOrders as listMockOrders, listCustomers as listMockCustomers } from "./mockApi";
import { blogPosts, collections, products, staticPages } from "./mockData";
import { BackendProduct } from "./productAdapter";
import { BackendOrder, mapOrder } from "./orderService";
import { BlogPost, Collection, Customer, Order, StaticPage } from "./types";

const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);

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

const mapAdminProduct = (product: AdminProduct) => product;

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
  image: resolveApiAssetUrl(collection.image)
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

export const listAdminProducts = async (): Promise<AdminProduct[]> => {
  if (!hasApi) {
    return products.map((product) => ({
      _id: product.id,
      slug: product.slug,
      title: product.name,
      description: product.description,
      notes: { top: product.notes },
      flags: {
        isNew: product.flags.new,
        isBestSeller: product.flags.bestSeller,
        isFeatured: product.flags.featured
      },
      images: product.images.map((url) => ({ url })),
      variants: product.variants.map((variant) => ({
        key: variant.id,
        sizeMl: Number(variant.size.replace("ml", "")),
        price: variant.price,
        stock: variant.stock
      })),
      status: "published"
    }));
  }
  const items = await fetchApi<AdminProduct[]>("/admin/products");
  return items.map(mapAdminProduct);
};

export const getAdminProduct = async (id: string): Promise<AdminProduct | null> => {
  if (!hasApi) {
    const items = await listAdminProducts();
    return items.find((item) => item._id === id) ?? null;
  }
  return fetchApi<AdminProduct>(`/admin/products/${id}`);
};

export const createAdminProduct = async (payload: Partial<AdminProduct>) => {
  if (!hasApi) {
    return { ...payload, _id: `prod-${Date.now()}` } as AdminProduct;
  }
  return fetchApi<AdminProduct>("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateAdminProduct = async (id: string, payload: Partial<AdminProduct>) => {
  if (!hasApi) {
    return { ...payload, _id: id } as AdminProduct;
  }
  return fetchApi<AdminProduct>(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
};

export const deleteAdminProduct = async (id: string) => {
  if (!hasApi) {
    return { status: "deleted" };
  }
  return fetchApi<{ status: string }>(`/admin/products/${id}`, { method: "DELETE" });
};

export const listAdminOrders = async (): Promise<Order[]> => {
  if (!hasApi) {
    return listMockOrders();
  }
  const orders = await fetchApi<BackendOrder[]>("/admin/orders");
  return orders.map(mapOrder);
};

export const getAdminOrder = async (id: string): Promise<BackendOrder | null> => {
  if (!hasApi) {
    const orders = await listMockOrders();
    const order = orders.find((item) => item.id === id);
    return order
      ? {
          _id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          totals: { grandTotal: order.total },
          createdAt: order.createdAt
        }
      : null;
  }
  return fetchApi<BackendOrder>(`/admin/orders/${id}`);
};

export const updateAdminOrderStatus = async (id: string, status: string) => {
  if (!hasApi) {
    return {
      _id: id,
      orderNumber: `SCN-${id}`,
      status,
      totals: { grandTotal: 0 }
    } as BackendOrder;
  }
  return fetchApi<BackendOrder>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
};

export const listAdminCustomers = async (): Promise<Customer[]> => {
  if (!hasApi) {
    return listMockCustomers();
  }
  const customers = await fetchApi<BackendCustomer[]>("/admin/customers");
  return customers.map(mapCustomer);
};

export const listAdminCollections = async (): Promise<Collection[]> => {
  if (!hasApi) {
    const stored = localStorage.getItem("scenta-admin-collections");
    if (stored) {
      try {
        return JSON.parse(stored) as Collection[];
      } catch {
        return collections;
      }
    }
    return collections;
  }
  const backendCollections = await fetchApi<BackendCollection[]>("/admin/collections");
  return backendCollections.map(mapCollection);
};

export const createAdminCollection = async (payload: Partial<Collection>) => {
  if (!hasApi) {
    const stored = localStorage.getItem("scenta-admin-collections");
    const items = stored ? (JSON.parse(stored) as Collection[]) : [...collections];
    const created = { ...payload, id: `col-${Date.now()}` } as Collection;
    localStorage.setItem("scenta-admin-collections", JSON.stringify([...items, created]));
    return created;
  }
  return fetchApi<BackendCollection>("/admin/collections", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateAdminCollection = async (id: string, payload: Partial<Collection>) => {
  if (!hasApi) {
    const stored = localStorage.getItem("scenta-admin-collections");
    const items = stored ? (JSON.parse(stored) as Collection[]) : [...collections];
    const next = items.map((item) => (item.id === id ? { ...item, ...payload } : item));
    localStorage.setItem("scenta-admin-collections", JSON.stringify(next));
    return next.find((item) => item.id === id) as Collection;
  }
  return fetchApi<BackendCollection>(`/admin/collections/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
};

export const deleteAdminCollection = async (id: string) => {
  if (!hasApi) {
    const stored = localStorage.getItem("scenta-admin-collections");
    const items = stored ? (JSON.parse(stored) as Collection[]) : [...collections];
    const next = items.filter((item) => item.id !== id);
    localStorage.setItem("scenta-admin-collections", JSON.stringify(next));
    return { status: "deleted" };
  }
  return fetchApi<{ status: string }>(`/admin/collections/${id}`, { method: "DELETE" });
};

export const listAdminBlogPosts = async (): Promise<BlogPost[]> => {
  if (!hasApi) {
    return blogPosts;
  }
  try {
    const items = await fetchApi<BackendContentItem[]>("/admin/blog");
    if (!items.length) {
      return blogPosts;
    }
    return items.map(mapBlogPost);
  } catch {
    return blogPosts;
  }
};

export const createAdminBlogPost = async (payload: Partial<BlogPost>) => {
  if (!hasApi) {
    return { ...payload, id: `blog-${Date.now()}` } as BlogPost;
  }
  return fetchApi<BackendContentItem>("/admin/blog", {
    method: "POST",
    body: JSON.stringify(payload)
  });
};

export const updateAdminBlogPost = async (id: string, payload: Partial<BlogPost>) => {
  if (!hasApi) {
    return { ...payload, id } as BlogPost;
  }
  return fetchApi<BackendContentItem>(`/admin/blog/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
};

export const deleteAdminBlogPost = async (id: string) => {
  if (!hasApi) {
    return { status: "deleted" };
  }
  return fetchApi<{ status: string }>(`/admin/blog/${id}`, { method: "DELETE" });
};

export const listAdminPages = async (): Promise<StaticPage[]> => {
  if (!hasApi) {
    return staticPages;
  }
  try {
    const items = await fetchApi<BackendContentItem[]>("/admin/pages");
    if (!items.length) {
      return staticPages;
    }
    return items.map(mapPage);
  } catch {
    return staticPages;
  }
};

export const adjustInventory = async (payload: {
  productId: string;
  variantKey: string;
  stock: number;
}) => {
  if (!hasApi) {
    return { status: "ok" };
  }
  return fetchApi("/admin/inventory/adjust", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
};

