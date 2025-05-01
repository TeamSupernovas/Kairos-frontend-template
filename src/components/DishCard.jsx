import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const DishCard = ({ DishName, ChefID, AvailablePortions, DishID }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dish/${DishID}`);
  };

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    async function fetchImageUrl() {
      if (!DishID) {
        return;
      }
      const response = await fetch(
        `${process.env.REACT_APP_DISH_MANAGEMENT_SERVICE}/images/dish/${DishID}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch image url");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        setImageUrl(data[0].image_url);
      }
      console.log("imageurl set for ", DishID, ":", data);
    }
    fetchImageUrl();
  }, [DishID]);

  return (
    <div
      className="card shadow-sm border rounded-4 overflow-hidden cursor-pointer"
      onClick={handleClick}
      style={{ width: "100%", maxWidth: "300px" }}
    >
      <div className="position-relative">
        {(imageUrl && (
          <img
            src={imageUrl}
            className="card-img-top rounded-top"
            alt={DishName}
            style={{ height: "180px", objectFit: "cover" }}
          />
        )) || (
          <img
            className="card-img-top rounded-top"
            alt={DishName}
            style={{ height: "180px", objectFit: "cover" }}
          />
        )}
      </div>

      <div className="card-body bg-light">
        <h5 className="fw-bold">{DishName}</h5>
        <p className="text-muted small">By {ChefID}</p>
        <p className="mb-1">
          <span className="fw-semibold">{AvailablePortions} portions</span>.{" "}
          {/* {distance} . Available until {availableUntil}*/}
        </p>
      </div>
    </div>
  );
};

export default DishCard;
