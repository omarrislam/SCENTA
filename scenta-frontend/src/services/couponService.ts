import { fetchApi } from "./api";
import { listCoupons as listMockCoupons } from "./mockApi";
import { Coupon } from "./types";

const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);

export const listPublicCoupons = async (): Promise<Coupon[]> => {
  if (!hasApi) {
    return listMockCoupons();
  }
  try {
    return await fetchApi<Coupon[]>("/coupons");
  } catch {
    return listMockCoupons();
  }
};
