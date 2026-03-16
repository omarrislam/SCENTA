import { fetchApi } from "./api";
import { Coupon } from "./types";

export const getCoupon = async (code: string): Promise<Coupon | null> => {
  try {
    return await fetchApi<Coupon>(`/coupons/${code}`);
  } catch {
    return null;
  }
};
