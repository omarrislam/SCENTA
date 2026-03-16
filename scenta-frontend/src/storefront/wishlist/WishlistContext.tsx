import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Product } from "../../services/types";
import { listProductsByIds } from "../../services/catalogService";
import { getWishlist, toggleWishlist } from "../../services/wishlistService";
import { useAuth } from "../../app/auth/AuthContext";

interface WishlistItem {
  product: Product;
  variantKey?: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (product: Product, variantKey?: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistState | undefined>(undefined);

const normalizeWishlistItems = (
  wishlist: Array<{ productId: string; variantKey: string }>,
  products: Product[]
): WishlistItem[] =>
  wishlist.reduce<WishlistItem[]>((acc, entry) => {
    const product = products.find((item) => item.id === entry.productId);
    if (product) acc.push({ product, variantKey: entry.variantKey });
    return acc;
  }, []);

export const WishlistProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist from API when user is authenticated (cookie auth is automatic)
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    const hydrate = async () => {
      try {
        const wishlist = await getWishlist();
        const ids = Array.from(new Set(wishlist.map((entry) => entry.productId)));
        const products = await listProductsByIds(ids);
        setItems(normalizeWishlistItems(wishlist, products));
      } catch {
        setItems([]);
      }
    };
    void hydrate();
  }, [user]);

  const toggle = async (product: Product, variantKey?: string) => {
    if (!user) return;
    const resolvedVariantKey = variantKey ?? product.variants[0]?.id ?? "default";
    try {
      const wishlist = await toggleWishlist(product.id, resolvedVariantKey);
      const ids = Array.from(new Set(wishlist.map((entry) => entry.productId)));
      const products = await listProductsByIds(ids);
      setItems(normalizeWishlistItems(wishlist, products));
    } catch {
      // Optimistic local update on failure
      setItems((prev) => {
        const exists = prev.some((item) => item.product.id === product.id);
        return exists
          ? prev.filter((item) => item.product.id !== product.id)
          : [...prev, { product, variantKey: resolvedVariantKey }];
      });
    }
  };

  return <WishlistContext.Provider value={{ items, toggle }}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
