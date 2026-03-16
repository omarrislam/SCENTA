export type Locale = "ar" | "en";

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  notes: string[];
  flags: { new?: boolean; featured?: boolean; bestSeller?: boolean };
  rating: number;
  tags: string[];
  variants: ProductVariant[];
  images: string[];
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  productIds?: string[];
  image?: string;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  author: string;
  body: string;
  title?: string;
  createdAt?: string;
  isHidden?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  body: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "placed" | "paid" | "processing" | "fulfilled" | "completed" | "cancelled";
  total: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
}

export interface Coupon {
  id?: string;
  _id?: string;
  code: string;
  type: "percent" | "bxgy";
  value: number;
  status: "active" | "expired" | "draft";
  usageLimit?: number;
  startsAt?: string;
  endsAt?: string;
}

export interface ThemeSection {
  id: string;
  label: string;
  isVisible: boolean;
}

// Quiz types keep promptAr/labelAr for the admin editor UI only.
// The public quiz endpoint returns locale-resolved prompts/labels.
export interface QuizQuestion {
  id: string;
  prompt: string;
  promptAr?: string;
  options: { label: string; labelAr?: string; score: number; note: string }[];
}
