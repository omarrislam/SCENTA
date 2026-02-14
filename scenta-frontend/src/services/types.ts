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
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  notes: string[];
  notesAr?: string[];
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
  titleAr?: string;
  description: string;
  descriptionAr?: string;
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
  titleAr?: string;
  excerpt: string;
  excerptAr?: string;
  body: string;
  bodyAr?: string;
  cover: string;
}

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  body: string;
  bodyAr?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "placed" | "paid" | "fulfilled" | "completed" | "cancelled";
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

export interface QuizQuestion {
  id: string;
  prompt: string;
  promptAr?: string;
  options: { label: string; labelAr?: string; score: number; note: string }[];
}
