import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

// Utility functions
const getInitials = (userId) => userId?.slice(0, 2).toUpperCase();
const getColor = (userId) => {
  const colors = ["#FF8A65", "#4DB6AC", "#9575CD", "#F06292", "#BA68C8", "#4FC3F7"];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const renderStars = (count) =>
  Array.from({ length: 5 }, (_, i) =>
    i < count ? <AiFillStar key={i} className="text-warning" /> : <AiOutlineStar key={i} className="text-muted" />
  );

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-muted">No reviews available.</p>;
  }

  return (
    <div className="mt-4">
      {reviews.map((review) => (
        <div key={review.id} className="glass-card p-3 rounded shadow-sm mb-3 d-flex">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold me-3"
            style={{
              backgroundColor: getColor(review.userId),
              width: 48,
              height: 48
            }}
          >
            {getInitials(review.userId)}
          </div>
          <div>
            <div className="d-flex align-items-center mb-1">
              {renderStars(review.rating)}
              <small className="ms-2 text-muted">({review.rating}/5)</small>
            </div>
            <p className="fst-italic mb-1">"{review.reviewText}"</p>
            <small className="text-muted">
              By <strong>{review.userId}</strong> on{" "}
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      ))}

      {/* Glassmorphism CSS */}
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

export default ReviewList;
