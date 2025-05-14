import React, { useEffect, useState } from "react";
import DishCard from "../components/DishCard";
import { useDishSearch } from "../context/DishSearchContext";
import { useAuth } from "../context/AuthContext";
import { useRecommended } from "../context/RecommendedContext";

const RecommendedDishList = () => {
  const { dishes } = useDishSearch();
  const dishesArr = dishes?.data || [];
  const [recommended, setRecommended] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { setRecommendedIds } = useRecommended();


  useEffect(() => {
   const fetchRecommendations = async () => {
  if (!isAuthenticated || !user || dishesArr.length === 0) return;

  const userId = user.sub.includes("|") ? user.sub.split("|")[1] : user.sub;

  const nearbyDishes = dishesArr.map((dish) => ({
    DishID: dish.DishID,
    DishName: dish.DishName,
    MealCourse: dish.MealCourse,
    DietaryCategory: dish.DietaryCategory,
    Description: dish.Description,
  }));

  try {
    const response = await fetch( `${process.env.REACT_APP_RECOMMENDATION_SERVICE}/recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        nearby_dishes: nearbyDishes,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const top5 = data.recommendations.slice(0, 4);
    const topIds = new Set(top5.map((r) => r.dish_id));
    const topDishes = dishesArr.filter((dish) => topIds.has(dish.DishID));

    setRecommended(topDishes);
    setRecommendedIds(topIds);
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
  }
};

    console.log(dishesArr)
    fetchRecommendations();

  }, [dishesArr, isAuthenticated, user]);

  if (!isAuthenticated || recommended.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="fw-bold">Recommended Dishes</h4>
      <div className="d-flex flex-wrap gap-3">
        {recommended.map((dish) => (
          <DishCard key={dish.DishID} {...dish} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedDishList;
