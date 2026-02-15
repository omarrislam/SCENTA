import { fetchApi } from "./api";
import { listOrders as listMockOrders } from "./mockApi";
import { Order } from "./types";

const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);

export interface CheckoutItemPayload {
  productId: string;
  productSlug?: string;
  variantKey: string;
  qty: number;
}

export interface ShippingAddressPayload {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  building: string;
  notes?: string;
}

export interface CheckoutTotals {
  subtotal: number;
  shippingFee: number;
  discountTotal?: number;
  grandTotal: number;
  coupon?: { code: string; type: string; value: number };
}

export interface BackendOrder {
  _id: string;
  orderNumber: string;
  status: string;
  totals?: { grandTotal?: number };
  createdAt?: string;
  items?: Array<{
    productTitleSnapshot?: string;
    productSlugSnapshot?: string;
    variantKey?: string;
    sizeMl?: number;
    unitPrice?: number;
    qty?: number;
  }>;
  shippingAddress?: ShippingAddressPayload;
}

export const mapOrder = (order: BackendOrder): Order => ({
  id: order._id,
  orderNumber: order.orderNumber ?? "",
  status: (order.status as Order["status"]) ?? "pending",
  total: order.totals?.grandTotal ?? 0,
  createdAt: order.createdAt ?? ""
});

export const validateCheckout = async (
  items: CheckoutItemPayload[],
  shippingAddress: ShippingAddressPayload,
  couponCode?: string
): Promise<CheckoutTotals> => {
  if (!hasApi) {
    const subtotal = items.reduce((sum, item) => sum + item.qty * 100, 0);
    const shippingFee = 60;
    return { subtotal, shippingFee, grandTotal: subtotal + shippingFee };
  }
  return fetchApi<CheckoutTotals>("/checkout/validate", {
    method: "POST",
    body: JSON.stringify({ items, shippingAddress, couponCode })
  });
};

export const createCodOrder = async (
  items: CheckoutItemPayload[],
  shippingAddress: ShippingAddressPayload,
  couponCode?: string
): Promise<BackendOrder> => {
  if (!hasApi) {
    const subtotal = items.reduce((sum, item) => sum + item.qty * 100, 0);
    const shippingFee = 60;
    const grandTotal = subtotal + shippingFee;
    return {
      _id: `local-${Date.now()}`,
      orderNumber: `SCN-LOCAL-${Date.now().toString().slice(-6)}`,
      status: "placed",
      totals: { grandTotal },
      createdAt: new Date().toISOString(),
      shippingAddress
    };
  }
  return fetchApi<BackendOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({ items, shippingAddress, couponCode })
  });
};

export const createStripeIntent = async (
  items: CheckoutItemPayload[],
  shippingAddress: ShippingAddressPayload,
  couponCode?: string
) => {
  if (!hasApi) {
    throw new Error("Card payment requires API configuration.");
  }
  return fetchApi<{ clientSecret: string | null; orderId: string }>(
    "/payments/stripe/create-intent",
    {
      method: "POST",
      body: JSON.stringify({ items, shippingAddress, couponCode })
    }
  );
};

export const listMyOrders = async (): Promise<Order[]> => {
  if (!hasApi) {
    return listMockOrders();
  }
  const orders = await fetchApi<BackendOrder[]>("/orders/me");
  return orders.map(mapOrder);
};

export const getMyOrder = async (orderId: string): Promise<Order | null> => {
  if (!hasApi) {
    const orders = await listMockOrders();
    return orders.find((order) => order.id === orderId) ?? null;
  }
  const order = await fetchApi<BackendOrder>(`/orders/me/${orderId}`);
  return mapOrder(order);
};
