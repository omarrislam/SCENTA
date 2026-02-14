import {
  blogPosts,
  collections,
  coupons,
  customers,
  orders,
  products,
  quizQuestions,
  reviews,
  staticPages,
  themeSections
} from "./mockData";
import { Product } from "./types";

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

export const listProducts = async (params?: {
  search?: string;
  tag?: string;
  sort?: string;
}): Promise<Product[]> => {
  await delay();
  let filtered = [...products];
  if (params?.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter((item) => {
      const name = item.name.toLowerCase();
      const nameAr = item.nameAr?.toLowerCase() ?? "";
      return name.includes(query) || nameAr.includes(query);
    });
  }
  if (params?.tag) {
    filtered = filtered.filter((item) => item.tags.includes(params.tag ?? ""));
  }
  if (params?.sort === "price-asc") {
    filtered.sort((a, b) => a.variants[0].price - b.variants[0].price);
  }
  if (params?.sort === "price-desc") {
    filtered.sort((a, b) => b.variants[0].price - a.variants[0].price);
  }
  return filtered;
};

export const getProduct = async (slug: string) => {
  await delay();
  return products.find((item) => item.slug === slug) || products[0];
};

export const listCollections = async () => {
  await delay();
  return collections;
};

export const listReviews = async (productId: string) => {
  await delay();
  return reviews.filter((review) => review.productId === productId && !review.isHidden);
};

export const listBlogPosts = async () => {
  await delay();
  return blogPosts;
};

export const getBlogPost = async (slug: string) => {
  await delay();
  return blogPosts.find((post) => post.slug === slug) || blogPosts[0];
};

export const getStaticPage = async (slug: string) => {
  await delay();
  return staticPages.find((page) => page.slug === slug) || staticPages[0];
};

export const listOrders = async () => {
  await delay();
  return orders;
};

export const listCustomers = async () => {
  await delay();
  return customers;
};

export const listCoupons = async () => {
  await delay();
  return coupons;
};

export const listThemeSections = async () => {
  await delay();
  return themeSections;
};

export const listQuizQuestions = async () => {
  await delay();
  return quizQuestions;
};
