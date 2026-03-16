import { fetchApi } from "./api";
import { Review } from "./types";

interface BackendReview {
  _id: string;
  productId: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt?: string;
}

const mapReview = (review: BackendReview): Review => ({
  id: review._id,
  productId: review.productId,
  rating: review.rating ?? 0,
  author: "Customer",
  body: review.body ?? "",
  title: review.title,
  createdAt: review.createdAt
});

export const listReviews = async (productId: string): Promise<Review[]> => {
  const reviews = await fetchApi<BackendReview[]>(`/products/${productId}/reviews`);
  return reviews.map(mapReview);
};

export const createReview = async (
  productId: string,
  payload: { rating: number; title?: string; body: string }
) =>
  fetchApi<BackendReview>(`/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
