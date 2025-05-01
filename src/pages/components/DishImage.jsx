import React, { useEffect, useState } from "react";

const fallbackImage = "https://img.icons8.com/color/96/meal.png";

const DishImage = ({ dishId, alt = "Dish", width = 60, height = 60, className = "" }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`http://localhost:8080/images/dish/${dishId}`);
        const data = await res.json();
        const url = data?.[0]?.image_url;
        setImageUrl(url || fallbackImage);
      } catch (err) {
        setError(true);
        setImageUrl(fallbackImage);
      }
    };

    if (dishId) fetchImage();
  }, [dishId]);

  return (
    <img
      src={error ? fallbackImage : imageUrl}
      alt={alt}
      onError={() => {
        setError(true);
        setImageUrl(fallbackImage);
      }}
      className={`rounded ${className}`}
      style={{ width, height, objectFit: "cover" }}
    />
  );
};

export default DishImage;
