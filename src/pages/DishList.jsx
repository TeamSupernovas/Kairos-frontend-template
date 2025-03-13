import DishCard from "../components/DishCard";
import { useDishSearch } from "../context/DishSearchContext";

const DishList = () => {
  const { dishes } = useDishSearch();
  const dishesArr = dishes && dishes.data ? dishes.data : [];

  return (
    <div className="container mt-3">
      <h4 className="fw-bold">Available Dishes</h4>

      {dishesArr.length === 0 ? (
        <p className="text-muted">No dishes found. Try another search.</p>
      ) : (
        <div className="d-flex flex-wrap gap-3">
          {dishesArr.map((dish) => (
            <DishCard key={dish.DishID} {...dish} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DishList;
