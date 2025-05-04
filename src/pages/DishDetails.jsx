import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import Cart Context
import ProfileHeader from "../components/ProfileHeader"; // Import Profile Header
import DishRatingReviews from "./DishRatingReview";

const DishDetails = () => {
  const { id } = useParams(); // Get the dish ID from URL
  const [dishData, setDishData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); // Use Cart Context

  useEffect(() => {
    async function fetchDishDetails() {
      if (!id) {
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_DISH_MANAGEMENT_SERVICE}/dishes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dish details for " + id);
      }
      const data = await response.json();
      setDishData(data.dish);
      console.log("details set for ", id, ":", data);
    }
    fetchDishDetails();
  }, [id]);

  const handleAddToCart = () => {
    console.log(dishData)
    if (!dishData.dish_id || !dishData.chef_id) {
      alert("Invalid dish data");
      return;
    }

    const dishToAdd = {
      id: dishData.dish_id,
      dish_name: dishData.dish_name,
      chef_id: dishData.chef_id,
      available_portions: dishData.available_portions,
      price: dishData.price,
      quantity: quantity, // Set quantity based on user selection
    };

    addToCart(dishToAdd, quantity);
    alert("Dish added to cart!");
  };

  return (
    <>
    <ProfileHeader></ProfileHeader>
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div className="position-relative">
            <img
              src={dishData.images && dishData.images[0]?.image_url}
              alt={dishData.dish_name}
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold">{dishData.dish_name}</h2>
          <p className="text-muted">By {dishData.chef_id}</p>
          <h4 className="fw-bold text-success">
            ${dishData.price && dishData.price.toFixed(2)}
          </h4>
          <p className="text-muted">
            {dishData.available_portions} portions • until{" "}
            {dishData.available_until}
          </p>
          <div className="mb-3">
            {dishData.dietary_category}
            <span className="badge bg-secondary ms-2">{dishData.meal_course}</span>
          </div>
          <h5 className="fw-bold">Description</h5>
          <p className="p-3 bg-light rounded">{dishData.description}</p>
          <h5 className="fw-bold">Ingredients</h5>
          <div className="d-flex flex-wrap">
            {dishData.ingredients &&
              dishData.ingredients.map((ingredient, index) => (
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
            {[...Array(dishData.available_portions || 1).keys()].map((num) => (
              <option key={num + 1} value={num + 1}>
                {num + 1}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddToCart}
            className="btn btn-success w-100 mt-3 py-2 fw-bold"
          >
            Add to Cart
          </button>
        </div>
        {dishData.dish_id && <DishRatingReviews dishId={dishData.dish_id} chefId={dishData.chef_id} />}
      </div>
    </div>
    </>
  );
};

export default DishDetails;
