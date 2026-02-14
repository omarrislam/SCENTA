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
const STORAGE_KEY = "scenta-wishlist";
const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);
const TOKEN_KEY = "scenta-token";

const normalizeWishlistItems = (
  wishlist: Array<{ productId: string; variantKey: string }>,
  products: Product[]
): WishlistItem[] =>
  wishlist.reduce<WishlistItem[]>((acc, entry) => {
    const product = products.find((item) => item.id === entry.productId);
    if (product) {
      acc.push({ product, variantKey: entry.variantKey });
    }
    return acc;
  }, []);

export const WishlistProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (!hasApi || !user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (hasApi && user && token) {
        try {
          const wishlist = await getWishlist();
          const ids = Array.from(new Set(wishlist.map((entry) => entry.productId)));
          const products = await listProductsByIds(ids);
          setItems(normalizeWishlistItems(wishlist, products));
          return;
        } catch (error) {
          const message = error instanceof Error ? error.message : "";
          if (message.includes("Invalid token") || message.includes("Missing token")) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem("scenta-user");
          }
        }
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(stored) as Array<Product | { product: Product; variantKey?: string }>;
      const normalized = parsed.map((entry) => ("product" in entry ? entry : { product: entry }));
      setItems(normalized);
    };
    void hydrate();
  }, [user]);

  const toggle = async (product: Product, variantKey?: string) => {
    const resolvedVariantKey = variantKey ?? product.variants[0]?.id ?? "default";
    const token = localStorage.getItem(TOKEN_KEY);
    if (hasApi && user && token) {
      try {
        const wishlist = await toggleWishlist(product.id, resolvedVariantKey);
        const ids = Array.from(new Set(wishlist.map((entry) => entry.productId)));
        const products = await listProductsByIds(ids);
        setItems(normalizeWishlistItems(wishlist, products));
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message.includes("Invalid token") || message.includes("Missing token")) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem("scenta-user");
        }
      }
    }
    setItems((prev) => {
      const exists = prev.some((item) => item.product.id === product.id);
      if (exists) {
        return prev.filter((item) => item.product.id !== product.id);
      }
      return [...prev, { product, variantKey: resolvedVariantKey }];
    });
  };

  return <WishlistContext.Provider value={{ items, toggle }}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
