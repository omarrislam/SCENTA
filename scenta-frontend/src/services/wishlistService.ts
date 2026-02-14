import { fetchApi } from "./api";

export interface WishlistEntry {
  productId: string;
  variantKey: string;
}

export const getWishlist = async (): Promise<WishlistEntry[]> =>
  fetchApi<WishlistEntry[]>("/wishlist");

export const toggleWishlist = async (productId: string, variantKey: string): Promise<WishlistEntry[]> =>
  fetchApi<WishlistEntry[]>("/wishlist/toggle", {
    method: "POST",
    body: JSON.stringify({ productId, variantKey })
  });
