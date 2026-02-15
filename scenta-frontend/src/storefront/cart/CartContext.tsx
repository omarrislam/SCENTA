import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Product, ProductVariant } from "../../services/types";
import { getProduct, listProductsByIds } from "../../services/catalogService";

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartState | undefined>(undefined);

const STORAGE_KEY = "scenta-cart";
const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);

const isMongoId = (value: string) => /^[a-f0-9]{24}$/i.test(value);

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  });
  const lastSyncSignature = useRef("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!hasApi || items.length === 0) return;
    let isActive = true;

    const syncItems = async () => {
      const ids = items.map((item) => item.product.id).filter(isMongoId);
      const uniqueIds = Array.from(new Set(ids));
      const freshProducts = uniqueIds.length ? await listProductsByIds(uniqueIds) : [];
      const productById = new Map(freshProducts.map((product) => [product.id, product]));

      const updated = await Promise.all(
        items.map(async (item) => {
          let product = productById.get(item.product.id);
          if (!product && item.product.slug) {
            try {
              product = await getProduct(item.product.slug);
            } catch {
              product = undefined;
            }
          }
          if (!product) {
            return item;
          }
          const variant =
            product.variants.find((entry) => entry.id === item.variant.id) ?? product.variants[0];
          return {
            ...item,
            product,
            variant,
            quantity: Math.min(item.quantity, variant?.stock ?? item.quantity)
          };
        })
      );

      const signature = updated
        .map((item) => `${item.product.id}:${item.variant.id}:${item.quantity}:${item.variant.stock}`)
        .join("|");

      if (isActive && signature !== lastSyncSignature.current) {
        lastSyncSignature.current = signature;
        setItems(updated);
      }
    };

    void syncItems();
    const interval = window.setInterval(syncItems, 5000);
    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, [items]);

  const addItem = (product: Product, variant: ProductVariant) => {
    if ((variant?.stock ?? 0) <= 0) {
      return;
    }
    setItems((prev) => {
      const existing = prev.find((item) => item.variant.id === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variant.id === variant.id
            ? { ...item, quantity: Math.min(item.quantity + 1, variant.stock) }
            : item
        );
      }
      return [...prev, { id: `${product.id}-${variant.id}`, product, variant, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === itemId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
