import { useNavigate } from "react-router-dom";
import React from "react";

const DishCard = ({
  imageUrl,
  name,
  chef,
  portions,
  distance,
  availableUntil,
  id,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dish/${id}`);
  };

  return (
    <div
      className="card shadow-sm border rounded-4 overflow-hidden cursor-pointer"
      onClick={handleClick}
      style={{ width: "100%", maxWidth: "300px" }}
    >
      <div className="position-relative">
        <img
          src={imageUrl}
          className="card-img-top rounded-top"
          alt={name}
          style={{ height: "180px", objectFit: "cover" }}
        />
      </div>

      <div className="card-body bg-light">
        <h5 className="fw-bold">{name}</h5>
        <p className="text-muted small">By {chef}</p>
        <p className="mb-1">
          <span className="fw-semibold">{portions} portions</span> . {distance} . Available until {availableUntil}
        </p>
      </div>
    </div>
  );
};

export default DishCard;
