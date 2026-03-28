import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { listReviews, createReview } from "../../services/reviewService";
import { useAuth } from "../../app/auth/AuthContext";
import { Link } from "react-router-dom";

// ── Star SVG ─────────────────────────────────────────────────────────────────

const StarIcon = ({ filled, half = false }: { filled: boolean; half?: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    width="16"
    height="16"
    fill={filled || half ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.4"
    className={`review-star${filled || half ? " review-star--filled" : ""}`}
  >
    {half ? (
      <>
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon
          points="10,2 12.4,7.8 18.5,8.3 14,12.2 15.5,18.2 10,15 4.5,18.2 6,12.2 1.5,8.3 7.6,7.8"
          fill="url(#half-grad)"
          stroke="currentColor"
        />
      </>
    ) : (
      <polygon points="10,2 12.4,7.8 18.5,8.3 14,12.2 15.5,18.2 10,15 4.5,18.2 6,12.2 1.5,8.3 7.6,7.8" />
    )}
  </svg>
);

const Stars = ({ rating, size = 16 }: { rating: number; size?: number }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  return (
    <span className="review-stars" aria-label={`${rating.toFixed(1)} out of 5 stars`} style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} filled={n <= full} half={!filled(n, full) && hasHalf && n === full + 1} />
      ))}
    </span>
  );
};

const filled = (n: number, full: number) => n <= full;

// ── Interactive star picker ───────────────────────────────────────────────────

const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <span className="review-star-picker" aria-label="Select rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`review-star-btn${display >= n ? " review-star-btn--on" : ""}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <svg viewBox="0 0 20 20" width="28" height="28" fill={display >= n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
            <polygon points="10,2 12.4,7.8 18.5,8.3 14,12.2 15.5,18.2 10,15 4.5,18.2 6,12.2 1.5,8.3 7.6,7.8" />
          </svg>
        </button>
      ))}
    </span>
  );
};

// ── Rating summary bar ────────────────────────────────────────────────────────

const RatingSummary = ({ reviews }: { reviews: { rating: number }[] }) => {
  const total = reviews.length;
  if (!total) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / total;
  const breakdown = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length
  }));
  return (
    <div className="review-summary">
      <div className="review-summary__avg">
        <span className="review-summary__number">{avg.toFixed(1)}</span>
        <Stars rating={avg} size={18} />
        <span className="review-summary__count">{total} review{total !== 1 ? "s" : ""}</span>
      </div>
      <div className="review-summary__bars">
        {breakdown.map(({ n, count }) => (
          <div key={n} className="review-summary__bar-row">
            <span className="review-summary__bar-label">{n}★</span>
            <div className="review-summary__bar-track">
              <div
                className="review-summary__bar-fill"
                style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
              />
            </div>
            <span className="review-summary__bar-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Review form ───────────────────────────────────────────────────────────────

const ReviewForm = ({
  productId,
  onSuccess
}: {
  productId: string;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () => createReview(productId, { rating, title: title || undefined, body }),
    onSuccess: (newReview) => {
      qc.setQueryData<typeof newReview[]>(["reviews", productId], (old = []) => [newReview, ...old]);
      setRating(0);
      setTitle("");
      setBody("");
      setError("");
      onSuccess();
    },
    onError: (err: Error) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError("Please select a star rating."); return; }
    if (!body.trim()) { setError("Please write a comment."); return; }
    setError("");
    mutation.mutate();
  };

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <h3 className="review-form__title">{t("reviews.write")}</h3>

      <label className="input-label">
        {t("reviews.rating")}
        <StarPicker value={rating} onChange={setRating} />
      </label>

      <label className="input-label">
        {t("reviews.titleLabel")}
        <input
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          placeholder={t("reviews.titlePlaceholder")}
        />
      </label>

      <label className="input-label">
        {t("reviews.comment")}
        <textarea
          className="input review-form__textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          maxLength={1000}
          placeholder={t("reviews.commentPlaceholder")}
        />
      </label>

      {error && <p className="review-form__error">{error}</p>}

      <button
        type="submit"
        className="button button--primary"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? t("reviews.submitting") : t("reviews.submit")}
      </button>
    </form>
  );
};

// ── Single review card ────────────────────────────────────────────────────────

const ReviewCard = ({ review }: { review: { id: string; rating: number; author: string; title?: string; body: string; createdAt?: string; isVerifiedPurchase?: boolean } }) => {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "";
  return (
    <article className="review-card">
      <div className="review-card__header">
        <Stars rating={review.rating} />
        {review.isVerifiedPurchase && (
          <span className="review-card__verified">Verified Purchase</span>
        )}
        <span className="review-card__date">{date}</span>
      </div>
      {review.title && <p className="review-card__title">{review.title}</p>}
      <p className="review-card__body">{review.body}</p>
      <p className="review-card__author">— {review.author}</p>
    </article>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const ReviewsList = ({ productId }: { productId: string }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => listReviews(productId),
    staleTime: 1000 * 60
  });

  const alreadyReviewed = user
    ? reviews.some((r) => r.author === user.name)
    : false;

  if (isLoading) {
    return <div className="review-loading">{t("reviews.loading")}</div>;
  }

  return (
    <div className="reviews-section">
      <RatingSummary reviews={reviews} />

      <div className="reviews-section__cta">
        {!user && (
          <p className="review-prompt">
            <Link to="/auth" className="review-prompt__link">
              {t("reviews.signInPrompt")}
            </Link>
          </p>
        )}
        {user && !alreadyReviewed && !showForm && (
          <button
            type="button"
            className="button"
            onClick={() => setShowForm(true)}
          >
            {t("reviews.write")}
          </button>
        )}
      </div>

      {showForm && user && (
        <ReviewForm
          productId={productId}
          onSuccess={() => setShowForm(false)}
        />
      )}

      {reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="review-empty">{t("reviews.empty")}</p>
      )}
    </div>
  );
};

export default ReviewsList;
