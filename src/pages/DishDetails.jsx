import { useState } from "react";
import { useParams } from "react-router-dom";

const DishDetails = () => {
  const { id } = useParams(); // Get the dish ID from URL

  const [quantity, setQuantity] = useState(1);

  // Placeholder data (Replace with API call)
  const dishData = {
    id: id,
    imageUrl: "/public/biryani.jpg",
    name: "Chicken Biryani",
    chef: "Chef Arif Khan",
    price: 19.99,
    portions: 2,
    availableUntil: "6:50 PM",
    dietaryCategories: ["Vegetarian"],
    mealCourse: "Starter",
    description:
      "A rich, rice dish featuring tender, marinated chicken layered with fragrant basmati rice and a blend of traditional spices.",
    ingredients: [
      "Basmati Rice",
      "Chicken",
      "Onion",
      "Tomatoes",
      "Yogurt",
      "Ginger",
      "Garlic",
    ],
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="position-relative">
            <img
              src={dishData.imageUrl}
              alt={dishData.name}
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{dishData.name}</h2>
          <p className="text-muted">By {dishData.chef}</p>
          <h4 className="fw-bold text-success">${dishData.price.toFixed(2)}</h4>
          <p className="text-muted">
            {dishData.portions} portions • until {dishData.availableUntil}
          </p>
          <div className="mb-3">
            {dishData.dietaryCategories.map((category, index) => (
              <span key={index} className="badge bg-secondary me-2">
                {category}
              </span>
            ))}
            <span className="badge bg-secondary">{dishData.mealCourse}</span>
          </div>
          <h5 className="fw-bold">Description</h5>
          <p className="p-3 bg-light rounded">{dishData.description}</p>
          <h5 className="fw-bold">Ingredients</h5>
          <div className="d-flex flex-wrap">
            {dishData.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="badge bg-light text-dark border me-2 mb-2 p-2"
              >
                {ingredient}
              </span>
            ))}
          </div>
          <h5 className="fw-bold mt-3">Select Portions</h5>
          <select
            className="form-select w-50"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {[...Array(10).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
          <button className="btn btn-success w-100 mt-3 py-2 fw-bold">
            Order Now (${(dishData.price * quantity).toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishDetails;
