import { fetchApi } from "./api";
import { Order } from "./types";

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
): Promise<CheckoutTotals> =>
  fetchApi<CheckoutTotals>("/checkout/validate", {
    method: "POST",
    body: JSON.stringify({ items, shippingAddress, couponCode })
  });

export const createCodOrder = async (
  items: CheckoutItemPayload[],
  shippingAddress: ShippingAddressPayload,
  couponCode?: string
): Promise<BackendOrder> =>
  fetchApi<BackendOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({ items, shippingAddress, couponCode })
  });

export const createStripeIntent = async (
  items: CheckoutItemPayload[],
  shippingAddress: ShippingAddressPayload,
  couponCode?: string
) =>
  fetchApi<{ clientSecret: string | null; orderId: string }>(
    "/payments/stripe/create-intent",
    {
      method: "POST",
      body: JSON.stringify({ items, shippingAddress, couponCode })
    }
  );

export const listMyOrders = async (): Promise<Order[]> => {
  const orders = await fetchApi<BackendOrder[]>("/orders/me");
  return orders.map(mapOrder);
};

export const getMyOrder = async (orderId: string): Promise<Order | null> => {
  const order = await fetchApi<BackendOrder>(`/orders/me/${orderId}`);
  return mapOrder(order);
};
