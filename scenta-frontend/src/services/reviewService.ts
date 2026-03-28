import { fetchApi } from "./api";
import { Review } from "./types";

interface BackendReview {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt?: string;
  isVerifiedPurchase?: boolean;
}

const mapReview = (r: BackendReview): Review => ({
  id: r._id,
  productId: r.productId,
  rating: r.rating ?? 0,
  author: r.userName ?? "Customer",
  body: r.body ?? "",
  title: r.title,
  createdAt: r.createdAt,
  isVerifiedPurchase: r.isVerifiedPurchase
});

export const listReviews = async (productId: string): Promise<Review[]> => {
  const reviews = await fetchApi<BackendReview[]>(`/products/${productId}/reviews`);
  return reviews.map(mapReview);
};

export const createReview = async (
  productId: string,
  payload: { rating: number; title?: string; body: string }
): Promise<Review> => {
  const review = await fetchApi<BackendReview>(`/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return mapReview(review);
};
