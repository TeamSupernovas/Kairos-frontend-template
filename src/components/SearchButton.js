import React, { useState } from "react";
import { useDishSearch } from "../context/DishSearchContext";

const SearchButton = ({ location, radius }) => {
  const { setDishes } = useDishSearch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    console.log(location, radius);
    if (!location) {
      alert("Please enter a location");
      return;
    }
    if (!radius) {
      alert("Please enter a radius");
      return;
    }

    const radiusInMeters = radius * 1609.34;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_GEO_DISH_MANAGEMENT_SERVICE}/dishes/search?latitude=${location.lat}&longitude=${location.lng}&radius=${radiusInMeters}&pageSize=1000`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dishes");
      }

      const data = await response.json();
      setDishes(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="btn btn-success px-4 py-2 rounded-pill"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};

export default SearchButton;
