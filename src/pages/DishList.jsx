import { useDishSearch } from "../context/DishSearchContext";
import { useRecommended } from "../context/RecommendedContext";
import DishCard from "../components/DishCard";

const DishList = () => {
  const { dishes } = useDishSearch();
  const { recommendedIds } = useRecommended();
  const dishesArr = dishes?.data || [];

  const filteredDishes = dishesArr.filter(dish => !recommendedIds.has(dish.DishID));

  return (
    <div className="container mt-3">
      <h4 className="fw-bold">Available Dishes</h4>
      {filteredDishes.length === 0 ? (
        <p className="text-muted">No dishes found. Try another search.</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.DishID} {...dish} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DishList;
