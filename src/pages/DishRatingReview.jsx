import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import ReviewList from "./components/ReviewList";

const DishRatingReviews = ({ dishId, dishName, chefId, chefName }) => {
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const { user } = useAuth();

  const [newRating, setNewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.sub) {
      const extractedId = user.sub.split("|")[1];
      setUserId(extractedId);
    }
  }, [user]);

  useEffect(() => {
    async function fetchRatings() {
      try {
        const [avgRes, reviewRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_RATING_SERVICE}/ratings/dish/${dishId}/average`),
          fetch(`${process.env.REACT_APP_RATING_SERVICE}/dishes/${dishId}/ratings`)
        ]);
        const avgData = await avgRes.json();
        const reviewData = await reviewRes.json();
        setAverageRating(avgData.averageRating || 0);
        setReviews(reviewData || []);
         console.log(reviews)
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    }

    if (dishId) fetchRatings();
  }, [dishId]);

  async function handleSubmitReview(e) {
    e.preventDefault();
    if (!userId || !user?.name) {
      return alert("Login required to submit a review.");
    }

    setSubmitting(true);

    const payload = {
      dishId,
      dishName,
      chefId,
      chefName,
      userId,
      userName: user.name,
      rating: newRating,
      reviewText
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_RATING_SERVICE}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.log(res)
        throw new Error("Failed to submit review");}

      const newReview = await res.json();
      setReviews((prev) => [newReview, ...(Array.isArray(prev) ? prev : [])]);
      setReviewText("");
      setNewRating(5);
    } catch (err) {
      alert("Error submitting review.");
    } finally {
      setSubmitting(false);
    }
  }

  const renderStars = (count) =>
    Array.from({ length: 5 }, (_, i) =>
      i < count ? <AiFillStar key={i} className="text-warning" /> : <AiOutlineStar key={i} className="text-muted" />
    );

  if (loading) return <p className="text-muted">Loading ratings and reviews...</p>;

  return (
    <div className="mt-5">
      {/* Average rating summary */}
      <div className="glass-card p-4 rounded shadow mb-4">
        <h4 className="fw-semibold mb-2">Dish Ratings & Reviews</h4>
        <div className="d-flex align-items-center">
          <div className="fs-4 fw-bold text-warning me-2">{averageRating.toFixed(1)}</div>
          <div className="d-flex">{renderStars(Math.round(averageRating))}</div>
        </div>
        <div className="text-muted">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
      </div>

      {/* Submit form */}
      <form onSubmit={handleSubmitReview} className="glass-card p-4 rounded shadow mb-4">
        <h5 className="fw-semibold mb-3">Leave a Review</h5>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <select
            className="form-select w-auto"
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Star{r > 1 && "s"}</option>
            ))}
          </select>
        </div>
        <textarea
          className="form-control mb-3"
          placeholder="Write your review..."
          rows={3}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <button type="submit" className="btn btn-dark" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {/* Reusable review list */}
      <ReviewList reviews={reviews} userDetails={true} />

      {/* Glass style */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
};

export default DishRatingReviews;
