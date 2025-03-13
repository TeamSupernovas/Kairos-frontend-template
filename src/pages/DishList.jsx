import DishCard from "../components/DishCard";
import { useDishSearch } from "../context/DishSearchContext";

/*const dishes = [
  {
    id: "1",
    imageUrl: "../../public/momos.jpeg",
    name: "Momos",
    chef: "Priya Sharma",
    portions: 5,
    distance: "0.4 mi",
    availableUntil: "6:15 PM",
  },
  {
    id: "2",
    imageUrl: "../../public/biryani.jpg",
    name: "Chicken Biryani",
    chef: "Arif Khan",
    portions: 2,
    distance: "1.2 mi",
    availableUntil: "6:50 PM",
  },
  {
    id: "3",
    imageUrl: "../../public/samosa.jpg",
    name: "Samosa",
    chef: "Ananya Gupta",
    portions: 8,
    distance: "0.9 mi",
    availableUntil: "5:45 PM",
  },
  {
    id: "4",
    imageUrl: "../../public/sushi.jpg",
    name: "Sushi",
    chef: "Kenji Tanaka",
    portions: 2,
    distance: "2.0 mi",
    availableUntil: "8:30 PM",
  },
];
*/
const DishList = () => {
  const { dishes } = useDishSearch();
  console.log(dishes);
  const dishesArr = dishes ? dishes.data : [];
  console.log("dishesArr", dishesArr);
  return (
    <div className="container mt-3">
      <h4 className="fw-bold">Available Dishes</h4>
      {dishes.length === 0 ? (
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
