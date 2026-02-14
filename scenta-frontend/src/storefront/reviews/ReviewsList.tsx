import { useQuery } from "@tanstack/react-query";
import { listReviews } from "../../services/reviewService";

const ReviewsList = ({ productId }: { productId: string }) => {
  const { data = [] } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => listReviews(productId)
  });

  return (
    <div className="grid">
      {data.map((review) => (
        <div key={review.id} className="card">
          <strong>{review.author}</strong>
          <p>{"★".repeat(review.rating)}</p>
          <p>{review.body}</p>
        </div>
      ))}
      {!data.length && <div>No reviews yet.</div>}
    </div>
  );
};

export default ReviewsList;
